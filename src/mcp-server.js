#!/usr/bin/env node
// MCP server for Why Tree — exposes tree operations as tools for Claude Code
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

import {
  createTree, addSeed, whyUp, howDown,
  getAllNodes, getNode, getRoots, getLeaves, getChildren, getParents,
  findConvergencePoints, renameNode, unlinkNodes, relinkNode, removeNode,
  buildNumbering, getDepth
} from './tree.js';
import { saveTree, loadTree, listTrees } from './store.js';
import { logEvent } from './analytics.js';
import {
  renderTree, renderNodeList, renderNodeListCompact, renderNodeContext,
  renderConvergenceInsight, renderInsightsSynthesis, renderNarrativeSynthesis
} from './text-render.js';

// --- Current tree helpers (same pattern as CLI) ---

const WHYTREE_DIR = join(homedir(), '.whytree');
const CURRENT_FILE = join(WHYTREE_DIR, '.current');

function setCurrentTree(name) {
  if (!existsSync(WHYTREE_DIR)) mkdirSync(WHYTREE_DIR, { recursive: true });
  writeFileSync(CURRENT_FILE, name, 'utf-8');
}

function getCurrentTree() {
  if (!existsSync(CURRENT_FILE)) return null;
  const name = readFileSync(CURRENT_FILE, 'utf-8').trim();
  return loadTree(name);
}

function requireTree() {
  const tree = getCurrentTree();
  if (!tree) throw new Error('No tree loaded. Use the init tool first.');
  return tree;
}

function resolveNodeRef(tree, ref) {
  if (/^[\d.]+$/.test(ref)) {
    const numbering = buildNumbering(tree);
    const entry = Object.entries(numbering).find(([id, num]) => num === ref);
    if (entry) return entry[0];
  }
  return Object.keys(tree.nodes).find(id => id.startsWith(ref)) || null;
}

function requireNode(tree, ref) {
  const fullId = resolveNodeRef(tree, ref);
  if (!fullId) throw new Error(`Node "${ref}" not found.`);
  return fullId;
}

// --- Signal detection helpers (ported from CLI) ---

function detectWhyUpSignals(purpose, childNode, tree) {
  const emotionalMarkers = /\b(feel|love|afraid|scared|lonely|proud|guilty|grief|hope|fear|miss|hurt|angry|joy|loss|meaning|alive|connection|belong|matter)\b/i;
  const abstractTerms = /\b(integrity|virtue|meaning|certainty|authenticity|dignity|freedom|justice|truth|purpose|growth|fulfillment|excellence|principle|value|contribution|impact|legacy)\b/i;
  const hasPersonal = /\b(I|me|my|mine|myself|I'm|I've|I'd|I'll)\b/i;

  const isEmotional = emotionalMarkers.test(purpose);
  const isIntellectualized = abstractTerms.test(purpose) && !hasPersonal.test(purpose) && purpose.split(' ').length > 4;
  const isFirstWhy = childNode.type === 'seed' && childNode.parentIds.length === 1;

  const whyCount = Object.values(tree.nodes).filter(n => n.type === 'why').length;
  const purposeRoots = getRoots(tree).filter(n => n.type === 'why');

  return {
    emotional: isEmotional,
    intellectualized: isIntellectualized && !isFirstWhy,
    isFirstWhy,
    divergenceWarning: purposeRoots.length === 2 ? 'two_threads' : purposeRoots.length === 3 ? 'three_threads' : null,
    midSessionNudge: whyCount === 3 ? 'building_something' : null,
    strandedThreads: whyCount === 5 ? getRoots(tree).filter(n =>
      n.type === 'why' && !n.childIds.some(cid => { const c = tree.nodes[cid]; return c && c.type === 'how'; })
    ).map(n => ({ id: n.id.slice(0, 6), label: n.label })) : null,
  };
}

function detectHowDownSignals(means) {
  const abstractTerms = /^(be |become |get |have |find |make |do |work |help |try |use |learn |grow |build |create |develop |improve |achieve |pursue )/i;
  const wordCount = means.trim().split(/\s+/).length;
  return {
    abstract: wordCount <= 3 || abstractTerms.test(means.trim()),
  };
}

// --- Helpers for structured responses ---

function nodeInfo(node) {
  return { id: node.id.slice(0, 6), label: node.label, type: node.type };
}

function jsonText(obj) {
  return 'j:' + JSON.stringify(obj);
}

// --- MCP Server ---

const __dirname_root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(__dirname_root, 'package.json'), 'utf-8'));

const server = new McpServer({
  name: 'whytree',
  version: pkg.version,
});

// 0. status — preamble info (version, session gap, update check, changelog)
server.tool('status', {},
  async () => {
    const projectRoot = __dirname_root;

    // Version
    const version = pkg.version;

    // Session gap
    let sessionGap = 'NEW_USER';
    try {
      const dir = WHYTREE_DIR;
      const files = readdirSync(dir).filter(f => f.endsWith('.json'));
      if (files.length) {
        const newest = files
          .map(f => ({ f, t: statSync(join(dir, f)).mtimeMs }))
          .sort((a, b) => b.t - a.t)[0];
        const hours = (Date.now() - newest.t) / 3600000;
        if (hours < 12) sessionGap = 'SAME_DAY';
        else if (hours < 72) sessionGap = 'RECENT';
        else if (hours < 336) sessionGap = 'WEEK';
        else sessionGap = 'LONG_GAP';
      }
    } catch {}

    // Update check
    let update = null;
    try {
      const output = execSync(join(projectRoot, 'bin/whytree-update-check.sh'), {
        timeout: 8000,
        env: { ...process.env, WHYTREE_DIR: projectRoot },
        encoding: 'utf-8',
      }).trim();
      if (output.startsWith('UPDATE_AVAILABLE')) {
        const parts = output.split(' ');
        update = { available: true, local: parts[1], remote: parts[2], behind: parts[3] };
      }
    } catch {}

    // Changelog (latest entry)
    let changelog = null;
    try {
      const cl = readFileSync(join(projectRoot, 'CHANGELOG.md'), 'utf-8');
      const m = cl.match(/^## \[([^\]]+)\][^\n]*\n([\s\S]*?)(?=^## \[|$)/m);
      if (m) {
        const items = (m[2].match(/^- .+/gm) || []).slice(0, 4).map(l => l.replace(/^- /, ''));
        changelog = { version: m[1], items };
      }
    } catch {}

    return { content: [{ type: 'text', text: jsonText({
      version,
      sessionGap,
      update: update || { available: false },
      changelog,
    })}]};
  }
);

// 1. init
server.tool('init', { name: z.string().optional().default('My Why Tree') },
  async ({ name }) => {
    const tree = createTree(name);
    saveTree(tree);
    setCurrentTree(name);
    logEvent('init', tree);
    return { content: [{ type: 'text', text: jsonText({
      message: `Created tree: "${name}"`,
      tree: { name: tree.name, nodeCount: 0, createdAt: tree.createdAt },
    })}]};
  }
);

// 2. load
server.tool('load', { name: z.string() },
  async ({ name }) => {
    const tree = loadTree(name);
    if (!tree) throw new Error(`Tree "${name}" not found.`);
    setCurrentTree(name);
    return { content: [{ type: 'text', text: jsonText({
      message: `Loaded tree: "${name}"`,
      visualization: renderTree(tree),
      nodeList: renderNodeList(tree),
    })}]};
  }
);

// 3. list
server.tool('list', {},
  async () => {
    const trees = listTrees();
    return { content: [{ type: 'text', text: jsonText({
      trees: trees.map(t => ({ name: t.name, nodeCount: t.nodeCount, updatedAt: t.updatedAt })),
    })}]};
  }
);

// 4. seed
server.tool('seed', { label: z.string() },
  async ({ label }) => {
    const tree = requireTree();
    const node = addSeed(tree, label);
    saveTree(tree);
    logEvent('seed', tree);
    return { content: [{ type: 'text', text: jsonText({
      message: `Added seed: "${node.label}"`,
      node: nodeInfo(node),
      visualization: renderTree(tree, node.id),
      nodeList: renderNodeListCompact(tree),
    })}]};
  }
);

// 5. why_up
server.tool('why_up', { nodeRef: z.string(), purpose: z.string() },
  async ({ nodeRef, purpose }) => {
    const tree = requireTree();
    const fullId = requireNode(tree, nodeRef);
    const childNode = tree.nodes[fullId];
    const parent = whyUp(tree, fullId, purpose);
    tree.lastNodeId = parent.id;
    saveTree(tree);
    logEvent('why-up', tree);

    const wasConvergence = parent.childIds.length > 1;
    const signals = detectWhyUpSignals(purpose, childNode, tree);

    const result = {
      message: `Why Up: "${getNode(tree, fullId).label}" -> "${parent.label}"`,
      parent: nodeInfo(parent),
      child: nodeInfo(getNode(tree, fullId)),
      convergence: wasConvergence,
      visualization: renderTree(tree, parent.id),
      nodeList: renderNodeListCompact(tree),
      signals,
    };

    if (wasConvergence) {
      result.convergenceDetails = {
        label: parent.label,
        paths: parent.childIds.map(cid => {
          const c = getNode(tree, cid);
          return c ? c.label : '?';
        }),
      };
    }

    return { content: [{ type: 'text', text: jsonText(result) }] };
  }
);

// 6. how_down
server.tool('how_down', { nodeRef: z.string(), means: z.string() },
  async ({ nodeRef, means }) => {
    const tree = requireTree();
    const fullId = requireNode(tree, nodeRef);
    const child = howDown(tree, fullId, means);
    tree.lastNodeId = child.id;
    saveTree(tree);
    logEvent('how-down', tree);

    const signals = detectHowDownSignals(means);
    const howCount = Object.values(tree.nodes).filter(n => n.type === 'how').length;

    return { content: [{ type: 'text', text: jsonText({
      message: `How Down: "${getNode(tree, fullId).label}" -> "${child.label}"`,
      child: nodeInfo(child),
      parent: nodeInfo(getNode(tree, fullId)),
      howCount,
      visualization: renderTree(tree, child.id),
      nodeList: renderNodeListCompact(tree),
      signals,
    })}]};
  }
);

// 7. show
server.tool('show', { highlightNodeRef: z.string().optional() },
  async ({ highlightNodeRef }) => {
    const tree = requireTree();
    let highlightId = null;
    if (highlightNodeRef) {
      highlightId = resolveNodeRef(tree, highlightNodeRef);
    }
    return { content: [{ type: 'text', text: jsonText({
      visualization: renderTree(tree, highlightId),
      purpose: tree.purpose || null,
      nodeCount: Object.keys(tree.nodes).length,
    })}]};
  }
);

// 8. nodes
server.tool('nodes', {},
  async () => {
    const tree = requireTree();
    const nodes = getAllNodes(tree);
    return { content: [{ type: 'text', text: jsonText({
      nodeList: renderNodeList(tree),
      nodes: nodes.map(n => ({
        ...nodeInfo(n),
        parentIds: getParents(tree, n.id).map(p => p.id.slice(0, 6)),
        childIds: getChildren(tree, n.id).map(c => c.id.slice(0, 6)),
      })),
    })}]};
  }
);

// 9. rename
server.tool('rename', { nodeRef: z.string(), newLabel: z.string() },
  async ({ nodeRef, newLabel }) => {
    const tree = requireTree();
    const fullId = requireNode(tree, nodeRef);
    const oldLabel = getNode(tree, fullId).label;
    renameNode(tree, fullId, newLabel);
    saveTree(tree);
    return { content: [{ type: 'text', text: jsonText({
      message: `Renamed: "${oldLabel}" -> "${newLabel}"`,
      oldLabel,
      newLabel,
      visualization: renderTree(tree, fullId),
    })}]};
  }
);

// 10. relink
server.tool('relink', { nodeRef: z.string(), parentRef: z.string() },
  async ({ nodeRef, parentRef }) => {
    const tree = requireTree();
    const fullId = requireNode(tree, nodeRef);
    const parentFullId = requireNode(tree, parentRef);
    relinkNode(tree, fullId, parentFullId);
    saveTree(tree);
    return { content: [{ type: 'text', text: jsonText({
      message: `Relinked: "${getNode(tree, fullId).label}" now under "${getNode(tree, parentFullId).label}"`,
      visualization: renderTree(tree),
    })}]};
  }
);

// 11. unlink
server.tool('unlink', { childRef: z.string(), parentRef: z.string() },
  async ({ childRef, parentRef }) => {
    const tree = requireTree();
    const childFullId = requireNode(tree, childRef);
    const parentFullId = requireNode(tree, parentRef);
    unlinkNodes(tree, childFullId, parentFullId);
    saveTree(tree);
    return { content: [{ type: 'text', text: jsonText({
      message: `Unlinked: "${getNode(tree, childFullId).label}" from "${getNode(tree, parentFullId).label}"`,
      visualization: renderTree(tree),
    })}]};
  }
);

// 12. converge
server.tool('converge', { nodeRef1: z.string(), nodeRef2: z.string(), label: z.string() },
  async ({ nodeRef1, nodeRef2, label }) => {
    const tree = requireTree();
    const id1 = requireNode(tree, nodeRef1);
    const id2 = requireNode(tree, nodeRef2);
    const parent = whyUp(tree, id1, label);
    // Link second node to the same parent directly, avoiding label-match heuristic
    const child2 = tree.nodes[id2];
    if (!child2.parentIds.includes(parent.id)) {
      child2.parentIds.push(parent.id);
      parent.childIds.push(id2);
    }
    // Remove child2 from roots since it now has a parent
    tree.rootIds = tree.rootIds.filter(rid => rid !== id2);
    saveTree(tree);
    logEvent('converge', tree);

    const n1 = getNode(tree, id1);
    const n2 = getNode(tree, id2);
    const isConvergence = findConvergencePoints(tree).some(n => n.id === parent.id);

    return { content: [{ type: 'text', text: jsonText({
      message: `Converged: "${n1.label}" + "${n2.label}" → "${label}"`,
      parent: nodeInfo(parent),
      children: [nodeInfo(n1), nodeInfo(n2)],
      isConvergence,
      visualization: renderTree(tree, parent.id),
    })}]};
  }
);

// 13. remove
server.tool('remove', { nodeRef: z.string() },
  async ({ nodeRef }) => {
    const tree = requireTree();
    const fullId = requireNode(tree, nodeRef);
    const label = getNode(tree, fullId).label;
    removeNode(tree, fullId);
    saveTree(tree);
    return { content: [{ type: 'text', text: jsonText({
      message: `Removed: "${label}"`,
      removedLabel: label,
      visualization: renderTree(tree),
    })}]};
  }
);

// 14. insights
server.tool('insights', {},
  async () => {
    const tree = requireTree();
    return { content: [{ type: 'text', text: jsonText({
      narrative: renderNarrativeSynthesis(tree),
      convergence: renderConvergenceInsight(tree),
      synthesis: renderInsightsSynthesis(tree),
      purpose: tree.purpose || null,
    })}]};
  }
);

// 15. purpose
server.tool('purpose', { sentence: z.string() },
  async ({ sentence }) => {
    const tree = requireTree();
    const openRoots = getRoots(tree).filter(n => n.type === 'why');
    tree.purpose = sentence;
    tree.updatedAt = new Date().toISOString();
    saveTree(tree);
    return { content: [{ type: 'text', text: jsonText({
      message: `Purpose saved: "${sentence}"`,
      purpose: sentence,
      openThreads: openRoots.map(n => ({ label: n.label, shortId: n.id.slice(0, 6) })),
      visualization: renderTree(tree),
    })}]};
  }
);

// 16. summary — thematic overview for large trees
server.tool('summary', {},
  async () => {
    const tree = requireTree();
    const allNodes = getAllNodes(tree);
    const roots = getRoots(tree);
    const leaves = getLeaves(tree);
    const convergence = findConvergencePoints(tree);

    // Build branches: for each root, walk down and collect all descendant nodes
    const branches = roots.map(root => {
      const visited = new Set();
      const queue = [root.id];
      const branchNodes = [];
      while (queue.length > 0) {
        const id = queue.shift();
        if (visited.has(id)) continue;
        visited.add(id);
        const node = getNode(tree, id);
        if (!node) continue;
        branchNodes.push(node);
        for (const cid of node.childIds) queue.push(cid);
      }
      const howDowns = branchNodes.filter(n => n.type === 'how');
      const depth = getDepth(tree, root.id);
      return {
        root: { label: root.label, shortId: root.id.slice(0, 6), type: root.type },
        nodeCount: branchNodes.length,
        depth,
        howDownCount: howDowns.length,
        leafLabels: branchNodes.filter(n => n.childIds.length === 0).map(n => n.label),
      };
    });

    // Orphan detection: seeds with no parents and no children
    const orphans = allNodes.filter(n => n.parentIds.length === 0 && n.childIds.length === 0 && n.type === 'seed')
      .map(n => ({ label: n.label, shortId: n.id.slice(0, 6) }));

    return { content: [{ type: 'text', text: jsonText({
      totalNodes: allNodes.length,
      branches,
      convergencePoints: convergence.map(n => ({
        label: n.label,
        shortId: n.id.slice(0, 6),
        childCount: n.childIds.length,
      })),
      orphans,
      purpose: tree.purpose || null,
    })}]};
  }
);

// 17. context
server.tool('context', { nodeRef: z.string() },
  async ({ nodeRef }) => {
    const tree = requireTree();
    const fullId = requireNode(tree, nodeRef);
    const node = getNode(tree, fullId);
    return { content: [{ type: 'text', text: jsonText({
      context: renderNodeContext(tree, fullId),
      node: {
        ...nodeInfo(node),
        parentIds: getParents(tree, fullId).map(p => p.id.slice(0, 6)),
        childIds: getChildren(tree, fullId).map(c => c.id.slice(0, 6)),
      },
    })}]};
  }
);

// --- Start server ---

const transport = new StdioServerTransport();
await server.connect(transport);
