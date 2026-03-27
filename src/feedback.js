// Feedback collection for Why Tree — sends user feedback to the developer
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const WHYTREE_DIR = join(homedir(), '.whytree');
const FEEDBACK_DIR = join(WHYTREE_DIR, 'feedback');
const FEEDBACK_URL = 'https://kardens.io/api/whytree-feedback';

function ensureDir() {
  if (!existsSync(FEEDBACK_DIR)) {
    mkdirSync(FEEDBACK_DIR, { recursive: true });
  }
}

function getDeviceId() {
  const deviceIdFile = join(WHYTREE_DIR, '.device-id');
  if (existsSync(deviceIdFile)) {
    return readFileSync(deviceIdFile, 'utf-8').trim();
  }
  return 'anonymous';
}

export async function submitFeedback(message, category = 'general') {
  ensureDir();

  const entry = {
    deviceId: getDeviceId(),
    message,
    category,
    ts: new Date().toISOString(),
  };

  // Always save locally
  const file = join(FEEDBACK_DIR, 'feedback.jsonl');
  appendFileSync(file, JSON.stringify(entry) + '\n', 'utf-8');

  // Send to server
  await sendFeedback(entry);

  return entry;
}

async function sendFeedback(entry) {
  const response = await fetch(FEEDBACK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Whytree-Key': 'whytree-v1-public-telemetry',
    },
    body: JSON.stringify(entry),
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`Server returned ${response.status}`);
  }
}

export function listFeedback() {
  const file = join(FEEDBACK_DIR, 'feedback.jsonl');
  if (!existsSync(file)) return [];
  const lines = readFileSync(file, 'utf-8').trim().split('\n').filter(Boolean);
  return lines.map(line => JSON.parse(line));
}
