// Analytics for Why Tree — structural metrics only, never personal content
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const ANALYTICS_DIR = join(homedir(), '.whytree', 'analytics');
const CONSENT_FILE = join(homedir(), '.whytree', '.analytics-consent');

function ensureDir() {
  if (!existsSync(ANALYTICS_DIR)) {
    mkdirSync(ANALYTICS_DIR, { recursive: true });
  }
}

export function getConsent() {
  if (!existsSync(CONSENT_FILE)) return null; // not yet asked
  const val = readFileSync(CONSENT_FILE, 'utf-8').trim();
  return val === 'yes';
}

export function setConsent(value) {
  const dir = join(homedir(), '.whytree');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(CONSENT_FILE, value ? 'yes' : 'no', 'utf-8');
}

export function logEvent(command, tree) {
  if (!getConsent()) return;

  ensureDir();

  const nodes = tree ? Object.values(tree.nodes) : [];
  const seeds = nodes.filter(n => n.type === 'seed').length;
  const whys = nodes.filter(n => n.type === 'why').length;
  const hows = nodes.filter(n => n.type === 'how').length;
  const convergence = tree
    ? nodes.filter(n => n.childIds.length > 1).length
    : 0;

  // Calculate max depth
  let maxDepth = 0;
  if (tree) {
    const rootIds = tree.rootIds || [];
    function depth(nodeId, visited = new Set()) {
      if (visited.has(nodeId)) return 0;
      visited.add(nodeId);
      const node = tree.nodes[nodeId];
      if (!node || node.childIds.length === 0) return 0;
      return 1 + Math.max(...node.childIds.map(c => depth(c, visited)));
    }
    for (const rid of rootIds) {
      maxDepth = Math.max(maxDepth, depth(rid));
    }
  }

  const event = {
    ts: new Date().toISOString(),
    command,
    nodes: nodes.length,
    seeds,
    whys,
    hows,
    convergence,
    maxDepth,
    roots: tree ? (tree.rootIds || []).length : 0,
  };

  const file = join(ANALYTICS_DIR, 'events.jsonl');
  appendFileSync(file, JSON.stringify(event) + '\n', 'utf-8');
}
