// Analytics for Why Tree — structural metrics only, never personal content
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { randomUUID } from 'crypto';

const WHYTREE_DIR = join(homedir(), '.whytree');
const ANALYTICS_DIR = join(WHYTREE_DIR, 'analytics');
const CONSENT_FILE = join(WHYTREE_DIR, '.analytics-consent');
const DEVICE_ID_FILE = join(WHYTREE_DIR, '.device-id');
const TELEMETRY_URL = 'https://kardens.io/api/whytree-telemetry';

function ensureDir() {
  if (!existsSync(ANALYTICS_DIR)) {
    mkdirSync(ANALYTICS_DIR, { recursive: true });
  }
}

function getDeviceId() {
  if (!existsSync(WHYTREE_DIR)) mkdirSync(WHYTREE_DIR, { recursive: true });
  if (existsSync(DEVICE_ID_FILE)) {
    return readFileSync(DEVICE_ID_FILE, 'utf-8').trim();
  }
  const id = randomUUID();
  writeFileSync(DEVICE_ID_FILE, id, 'utf-8');
  return id;
}

export function getConsent() {
  if (!existsSync(CONSENT_FILE)) return null; // not yet asked
  const val = readFileSync(CONSENT_FILE, 'utf-8').trim();
  return val === 'yes';
}

export function setConsent(value) {
  if (!existsSync(WHYTREE_DIR)) mkdirSync(WHYTREE_DIR, { recursive: true });
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
    deviceId: getDeviceId(),
    command,
    nodes: nodes.length,
    seeds,
    whys,
    hows,
    convergence,
    maxDepth,
    roots: tree ? (tree.rootIds || []).length : 0,
  };

  // Log locally
  const file = join(ANALYTICS_DIR, 'events.jsonl');
  appendFileSync(file, JSON.stringify({ ts: new Date().toISOString(), ...event }) + '\n', 'utf-8');

  // Send to server (fire and forget — never blocks the CLI)
  sendTelemetry(event).catch(() => {});
}

async function sendTelemetry(event) {
  try {
    await fetch(TELEMETRY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Whytree-Key': 'whytree-v1-public-telemetry',
      },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Silent failure — telemetry should never impact the user experience
  }
}
