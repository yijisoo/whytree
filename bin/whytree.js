#!/usr/bin/env node
// CLI API for the Why Tree — designed to be driven by Claude as a counselor
import chalk from 'chalk';
import { createTree, addSeed, whyUp, howDown, getAllNodes, getNode, getRoots, getLeaves, getChildren, getParents, findConvergencePoints, renameNode, unlinkNodes, relinkNode, removeNode, buildNumbering } from '../src/tree.js';
import { displayTree, displayConvergenceInsight, displayTreeStats, displayNodeContext, displayInsightsSynthesis } from '../src/display.js';
import { saveTree, listTrees, loadTreeByFile, loadTree } from '../src/store.js';
import { getConsent, setConsent, logEvent, getTelemetryInfo } from '../src/analytics.js';
import { submitFeedback, listFeedback } from '../src/feedback.js';

const [,, command, ...args] = process.argv;

function printHelp() {
  console.log(`
whytree - Purpose discovery tool (driven by Claude)

Commands:
  init <name>                    Create a new tree
  load <name>                    Load an existing tree
  list                           List all saved trees
  seed <label>                   Add a seed node
  why-up <nodeId> <purpose>      Add a purpose above a node
  how-down <nodeId> <means>      Add a means below a node
  show                           Display the tree (with node numbers)
  nodes                          List all nodes with IDs
  rename <nodeId> <new label>    Rename a node
  relink <nodeId> <newParentId>  Add a parent link to a node
  unlink <childId> <parentId>    Break a link between two nodes
  remove <nodeId>                Remove a node (children become roots)
  edit                           Interactive editor (arrow keys + Enter)
  insights                       Show convergence insights
  analytics-on                   Opt in to anonymous usage analytics
  analytics-off                  Opt out of usage analytics
  analytics-status               Check analytics consent and server status
  analytics-retry                Reset and retry remote telemetry
  feedback <message>             Send feedback to the developer
  feedback-list                  Show all submitted feedback
  context <nodeId>               Show context for a node
  stats                          Show tree statistics
`);
}

// We maintain a "current tree" by saving/loading the last-used tree name
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const CURRENT_FILE = join(homedir(), '.whytree', '.current');

function setCurrentTree(name) {
  const dir = join(homedir(), '.whytree');
  if (!existsSync(dir)) { import('fs').then(fs => fs.mkdirSync(dir, { recursive: true })); }
  writeFileSync(CURRENT_FILE, name, 'utf-8');
}

function getCurrentTree() {
  if (!existsSync(CURRENT_FILE)) return null;
  const name = readFileSync(CURRENT_FILE, 'utf-8').trim();
  return loadTree(name);
}

function requireTree() {
  const tree = getCurrentTree();
  if (!tree) {
    console.error('No tree loaded. Use: whytree init <name>');
    process.exit(1);
  }
  return tree;
}

// Resolve a node reference — supports hierarchical number (1.2.1) or partial UUID
function resolveNodeRef(tree, ref) {
  // Try hierarchical number first
  if (/^[\d.]+$/.test(ref)) {
    const numbering = buildNumbering(tree);
    const entry = Object.entries(numbering).find(([id, num]) => num === ref);
    if (entry) return entry[0];
  }
  // Fall back to partial UUID match
  return Object.keys(tree.nodes).find(id => id.startsWith(ref)) || null;
}

function outputJson(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

// Full node list — for the `nodes` command
function printNodeList(tree) {
  const nodes = getAllNodes(tree);
  const numbering = buildNumbering(tree);
  if (nodes.length === 0) return;
  const sorted = nodes
    .map(n => ({ ...n, num: numbering[n.id] || '?' }))
    .sort((a, b) => a.num.localeCompare(b.num, undefined, { numeric: true }));
  sorted.forEach(n => {
    const parents = getParents(tree, n.id);
    const children = getChildren(tree, n.id);
    const pStr = parents.length > 0 ? ` serves: [${parents.map(p => p.label).join(', ')}]` : '';
    const cStr = children.length > 0 ? ` through: [${children.map(c => c.label).join(', ')}]` : '';
    const typeIcon = n.type === 'seed' ? '~' : n.type === 'why' ? '^' : 'v';
    console.log(`  [${n.num}] [${n.id.slice(0,8)}] ${typeIcon} ${n.label}${pStr}${cStr}`);
  });
}

// Compact node list — for inline display after why-up/how-down
function printNodeListCompact(tree) {
  const nodes = getAllNodes(tree);
  const numbering = buildNumbering(tree);
  if (nodes.length === 0) return;
  const sorted = nodes
    .map(n => ({ ...n, num: numbering[n.id] || '?' }))
    .sort((a, b) => a.num.localeCompare(b.num, undefined, { numeric: true }));
  sorted.forEach(n => {
    const typeIcon = n.type === 'seed' ? '~' : n.type === 'why' ? '^' : 'v';
    console.log(chalk.dim(`  [${n.num}] ${typeIcon} ${n.label}`));
  });
}

switch (command) {
  case 'init': {
    const name = args.join(' ') || 'My Why Tree';
    const tree = createTree(name);
    saveTree(tree);
    setCurrentTree(name);
    logEvent('init', tree);
    console.log(`Created tree: "${name}"`);
    console.log(chalk.dim(`  Now plant your first seed — something you actually do or care about.`));
    console.log(chalk.dim(`  Try: whytree seed "<something you spend time on>"`));
    console.log(chalk.dim(`  If anything surfaces that feels heavier than expected, it's okay to pause.`));
    break;
  }

  case 'load': {
    const name = args.join(' ');
    const tree = loadTree(name);
    if (!tree) {
      console.error(`Tree "${name}" not found.`);
      process.exit(1);
    }
    setCurrentTree(name);
    console.log(`Loaded tree: "${name}"`);
    displayTree(tree);
    break;
  }

  case 'list': {
    const trees = listTrees();
    if (trees.length === 0) {
      console.log('No saved trees.');
    } else {
      trees.forEach(t => {
        console.log(`  "${t.name}" — ${t.nodeCount} nodes, updated ${new Date(t.updatedAt).toLocaleDateString()}`);
      });
    }
    break;
  }

  case 'seed': {
    const tree = requireTree();
    const label = args.join(' ');
    if (!label) { console.error('Usage: whytree seed <label>'); process.exit(1); }
    const node = addSeed(tree, label);
    saveTree(tree);
    logEvent('seed', tree);
    console.log(`Added seed: "${node.label}" [${node.id.slice(0,8)}]`);
    displayTree(tree, node.id);
    break;
  }

  case 'why-up': {
    const tree = requireTree();
    const nodeId = args[0];
    const purpose = args.slice(1).join(' ');
    if (!nodeId || !purpose) { console.error('Usage: whytree why-up <nodeId|number> <purpose>'); process.exit(1); }
    const fullId = resolveNodeRef(tree, nodeId);
    if (!fullId) { console.error(`Node "${nodeId}" not found.`); process.exit(1); }
    const childNode = tree.nodes[fullId];
    const isFirstWhy = childNode && childNode.type === 'seed' && childNode.parentIds.length === 0;
    const parent = whyUp(tree, fullId, purpose);
    saveTree(tree);
    logEvent('why-up', tree);
    const wasConvergence = parent.childIds.length > 1;
    // Emotional pacing: detect emotional markers and add a beat
    const emotionalMarkers = /\b(feel|love|afraid|scared|lonely|proud|guilty|grief|hope|fear|miss|hurt|angry|joy|loss|meaning|alive|connection|belong|matter)\b/i;
    const isEmotional = emotionalMarkers.test(purpose);
    console.log(`Why Up: "${getNode(tree, fullId).label}" -> "${parent.label}" [${parent.id.slice(0,8)}]`);
    if (isEmotional) {
      console.log(chalk.dim('  (That\'s worth noting.)'));
    }
    if (wasConvergence) {
      console.log(`\n*** CONVERGENCE: "${parent.label}" now connects ${parent.childIds.length} paths:`);
      parent.childIds.forEach(cid => {
        const child = getNode(tree, cid);
        if (child) console.log(`  - ${child.label}`);
      });
    }
    // Early divergence signal: warn after 3rd distinct purpose root
    const purposeRoots = getRoots(tree).filter(n => n.type === 'why');
    if (purposeRoots.length === 3) {
      console.log(chalk.yellow(`\n  (You now have 3 separate purpose threads. They may converge — or reveal a real tension.)`));
      console.log(chalk.dim(`  Try asking "why?" about each to see if they meet somewhere deeper.`));
    }
    displayTree(tree, parent.id);
    if (isFirstWhy) {
      if (isEmotional) {
        console.log(chalk.dim('  (That already sounds real — is there more underneath?)'));
      } else {
        console.log(chalk.dim('  (Is that the public answer — or the real one?)'));
      }
    }
    console.log(chalk.dim('  (Updated node numbers:)'));
    printNodeListCompact(tree);
    break;
  }

  case 'how-down': {
    const tree = requireTree();
    const nodeId = args[0];
    const means = args.slice(1).join(' ');
    if (!nodeId || !means) { console.error('Usage: whytree how-down <nodeId|number> <means>'); process.exit(1); }
    const fullId = resolveNodeRef(tree, nodeId);
    if (!fullId) { console.error(`Node "${nodeId}" not found.`); process.exit(1); }
    const child = howDown(tree, fullId, means);
    saveTree(tree);
    logEvent('how-down', tree);
    console.log(`How Down: "${getNode(tree, fullId).label}" -> "${child.label}" [${child.id.slice(0,8)}]`);
    displayTree(tree, child.id);
    console.log(chalk.dim('  Found a purpose worth acting on. What else could serve it?'));
    console.log(chalk.dim('  (Updated node numbers:)'));
    printNodeListCompact(tree);
    break;
  }

  case 'show': {
    const tree = requireTree();
    displayTree(tree);
    displayTreeStats(tree);
    break;
  }

  case 'nodes': {
    const tree = requireTree();
    if (getAllNodes(tree).length === 0) {
      console.log('No nodes yet.');
    } else {
      printNodeList(tree);
    }
    break;
  }

  case 'rename': {
    const tree = requireTree();
    const nodeRef = args[0];
    const newLabel = args.slice(1).join(' ');
    if (!nodeRef || !newLabel) { console.error('Usage: whytree rename <nodeId|number> <new label>'); process.exit(1); }
    const fullId = resolveNodeRef(tree, nodeRef);
    if (!fullId) { console.error(`Node "${nodeRef}" not found.`); process.exit(1); }
    const oldLabel = getNode(tree, fullId).label;
    renameNode(tree, fullId, newLabel);
    saveTree(tree);
    console.log(`Renamed: "${oldLabel}" -> "${newLabel}"`);
    displayTree(tree, fullId);
    break;
  }

  case 'relink': {
    const tree = requireTree();
    const nodeRef = args[0];
    const parentRef = args[1];
    if (!nodeRef || !parentRef) { console.error('Usage: whytree relink <nodeId|number> <newParentId|number>'); process.exit(1); }
    const fullId = resolveNodeRef(tree, nodeRef);
    const parentFullId = resolveNodeRef(tree, parentRef);
    if (!fullId) { console.error(`Node "${nodeRef}" not found.`); process.exit(1); }
    if (!parentFullId) { console.error(`Parent "${parentRef}" not found.`); process.exit(1); }
    relinkNode(tree, fullId, parentFullId);
    saveTree(tree);
    console.log(`Relinked: "${getNode(tree, fullId).label}" now under "${getNode(tree, parentFullId).label}"`);
    displayTree(tree);
    break;
  }

  case 'unlink': {
    const tree = requireTree();
    const childRef = args[0];
    const parentRef = args[1];
    if (!childRef || !parentRef) { console.error('Usage: whytree unlink <childId|number> <parentId|number>'); process.exit(1); }
    const childFullId = resolveNodeRef(tree, childRef);
    const parentFullId = resolveNodeRef(tree, parentRef);
    if (!childFullId) { console.error(`Child "${childRef}" not found.`); process.exit(1); }
    if (!parentFullId) { console.error(`Parent "${parentRef}" not found.`); process.exit(1); }
    unlinkNodes(tree, childFullId, parentFullId);
    saveTree(tree);
    console.log(`Unlinked: "${getNode(tree, childFullId).label}" from "${getNode(tree, parentFullId).label}"`);
    displayTree(tree);
    break;
  }

  case 'remove': {
    const tree = requireTree();
    const nodeRef = args[0];
    if (!nodeRef) { console.error('Usage: whytree remove <nodeId|number>'); process.exit(1); }
    const fullId = resolveNodeRef(tree, nodeRef);
    if (!fullId) { console.error(`Node "${nodeRef}" not found.`); process.exit(1); }
    const label = getNode(tree, fullId).label;
    removeNode(tree, fullId);
    saveTree(tree);
    console.log(`Removed: "${label}"`);
    displayTree(tree);
    break;
  }

  case 'insights': {
    const tree = requireTree();
    displayTree(tree);
    displayConvergenceInsight(tree);
    displayInsightsSynthesis(tree);
    displayTreeStats(tree);
    break;
  }

  case 'context': {
    const tree = requireTree();
    const nodeId = args[0];
    if (!nodeId) { console.error('Usage: whytree context <nodeId|number>'); process.exit(1); }
    const fullId = resolveNodeRef(tree, nodeId);
    if (!fullId) { console.error(`Node "${nodeId}" not found.`); process.exit(1); }
    displayNodeContext(tree, fullId);
    break;
  }

  case 'stats': {
    const tree = requireTree();
    displayTreeStats(tree);
    break;
  }

  case 'edit': {
    const tree = requireTree();
    const { interactiveEdit } = await import('../src/interactive.js');
    await interactiveEdit(tree);
    break;
  }

  case 'analytics-on': {
    setConsent(true);
    console.log('Analytics enabled. Only structural metrics (node counts, depth, convergence) are collected. Never personal content.');
    break;
  }

  case 'analytics-off': {
    setConsent(false);
    console.log('Analytics disabled.');
    break;
  }

  case 'analytics-status': {
    const info = getTelemetryInfo();
    if (info.consent === null) {
      console.log('Analytics: not yet configured. Run "whytree analytics-on" to opt in.');
    } else if (!info.consent) {
      console.log('Analytics: disabled');
    } else {
      console.log('Analytics: enabled (structural metrics only, no personal content)');
      console.log(`  Local log: ~/.whytree/analytics/events.jsonl`);
      console.log(`  Remote: https://kardens.io/api/whytree-telemetry`);
      if (info.disabled) {
        console.log(`  Status: PAUSED — server unreachable after ${info.failures} attempts`);
        console.log(`  Last error: ${info.lastError}`);
        console.log('  Run "whytree analytics-retry" to try again.');
      } else if (info.failures > 0) {
        console.log(`  Status: OK (${info.failures} recent transient failure(s))`);
      } else {
        console.log('  Status: OK');
      }
    }
    break;
  }

  case 'analytics-retry': {
    if (!getConsent()) {
      console.log('Analytics is not enabled. Run "whytree analytics-on" first.');
      break;
    }
    setConsent(true); // resets failure count and re-enables remote telemetry
    console.log('Telemetry reset. Will attempt to send on next command.');
    break;
  }

  case 'feedback': {
    const message = args.join(' ');
    if (!message) { console.error('Usage: whytree feedback <message>'); process.exit(1); }
    try {
      await submitFeedback(message);
      console.log('Feedback sent. Thank you!');
    } catch (err) {
      console.log('Feedback saved locally (server unreachable).');
    }
    break;
  }

  case 'feedback-list': {
    const entries = listFeedback();
    if (entries.length === 0) {
      console.log('No feedback submitted yet.');
    } else {
      entries.forEach(e => {
        console.log(`  [${new Date(e.ts).toLocaleDateString()}] ${e.message}`);
      });
    }
    break;
  }

  default:
    printHelp();
    break;
}
