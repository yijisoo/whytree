// Persistence layer for Why Tree — saves to ~/.whytree/
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const STORE_DIR = join(homedir(), '.whytree');

function ensureDir() {
  if (!existsSync(STORE_DIR)) {
    mkdirSync(STORE_DIR, { recursive: true });
  }
}

function treeFileName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + '.json';
}

export function saveTree(tree) {
  ensureDir();
  const filePath = join(STORE_DIR, treeFileName(tree.name));
  writeFileSync(filePath, JSON.stringify(tree, null, 2), 'utf-8');
  return filePath;
}

export function loadTree(name) {
  const filePath = join(STORE_DIR, treeFileName(name));
  if (!existsSync(filePath)) return null;
  const data = readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

export function listTrees() {
  ensureDir();
  const files = readdirSync(STORE_DIR).filter(f => f.endsWith('.json'));
  return files.map(f => {
    const data = JSON.parse(readFileSync(join(STORE_DIR, f), 'utf-8'));
    return {
      name: data.name,
      nodeCount: Object.keys(data.nodes).length,
      updatedAt: data.updatedAt,
      fileName: f,
    };
  });
}

export function loadTreeByFile(fileName) {
  const filePath = join(STORE_DIR, fileName);
  if (!existsSync(filePath)) return null;
  const data = readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}
