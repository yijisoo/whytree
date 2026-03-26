// Analytics for Why Tree — structural metrics only, never personal content
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { randomUUID } from 'crypto';

const WHYTREE_DIR = join(homedir(), '.whytree');
const ANALYTICS_DIR = join(WHYTREE_DIR, 'analytics');
const CONSENT_FILE = join(WHYTREE_DIR, '.analytics-consent');
const DEVICE_ID_FILE = join(WHYTREE_DIR, '.device-id');
const TELEMETRY_STATUS_FILE = join(WHYTREE_DIR, '.telemetry-status');
const TELEMETRY_URL = 'https://kardens.io/api/whytree-telemetry';

// Track consecutive failures to avoid spamming warnings
const MAX_SILENT_FAILURES = 3;

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

function getTelemetryStatus() {
  if (!existsSync(TELEMETRY_STATUS_FILE)) return { failures: 0, lastError: null, disabled: false };
  try {
    return JSON.parse(readFileSync(TELEMETRY_STATUS_FILE, 'utf-8'));
  } catch {
    return { failures: 0, lastError: null, disabled: false };
  }
}

function setTelemetryStatus(status) {
  if (!existsSync(WHYTREE_DIR)) mkdirSync(WHYTREE_DIR, { recursive: true });
  writeFileSync(TELEMETRY_STATUS_FILE, JSON.stringify(status), 'utf-8');
}

export function getConsent() {
  if (!existsSync(CONSENT_FILE)) return null; // not yet asked
  const val = readFileSync(CONSENT_FILE, 'utf-8').trim();
  return val === 'yes';
}

export function setConsent(value) {
  if (!existsSync(WHYTREE_DIR)) mkdirSync(WHYTREE_DIR, { recursive: true });
  writeFileSync(CONSENT_FILE, value ? 'yes' : 'no', 'utf-8');
  // Reset telemetry status when consent changes
  if (value) {
    setTelemetryStatus({ failures: 0, lastError: null, disabled: false });
  }
}

export function getTelemetryInfo() {
  const consent = getConsent();
  const status = getTelemetryStatus();
  return { consent, ...status };
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

  // Log locally (always works)
  const file = join(ANALYTICS_DIR, 'events.jsonl');
  appendFileSync(file, JSON.stringify({ ts: new Date().toISOString(), ...event }) + '\n', 'utf-8');

  // Send to server — track failures and inform user
  const status = getTelemetryStatus();
  if (status.disabled) return; // stopped trying after too many failures

  sendTelemetry(event).then(() => {
    // Success — reset failure count
    if (status.failures > 0) {
      setTelemetryStatus({ failures: 0, lastError: null, disabled: false });
    }
  }).catch((err) => {
    const newFailures = status.failures + 1;
    const errorMsg = err.message || 'Unknown error';

    if (newFailures <= MAX_SILENT_FAILURES) {
      // Silent for first few failures (could be transient network issue)
      setTelemetryStatus({ failures: newFailures, lastError: errorMsg, disabled: false });
    } else if (newFailures === MAX_SILENT_FAILURES + 1) {
      // Warn user after persistent failures
      console.error(`\n  Note: Telemetry server unreachable (${errorMsg}).`);
      console.error('  Your data is still saved locally at ~/.whytree/analytics/');
      console.error('  Remote telemetry paused. Run "whytree analytics-status" for details.');
      console.error('  Run "whytree analytics-retry" to try again.\n');
      setTelemetryStatus({ failures: newFailures, lastError: errorMsg, disabled: true });
    }
  });
}

async function sendTelemetry(event) {
  const response = await fetch(TELEMETRY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Whytree-Key': 'whytree-v1-public-telemetry',
    },
    body: JSON.stringify(event),
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 401) throw new Error('Authentication failed — API key may be outdated. Update whytree.');
    if (status === 429) throw new Error('Rate limited — too many events sent.');
    throw new Error(`Server returned ${status}`);
  }
}
