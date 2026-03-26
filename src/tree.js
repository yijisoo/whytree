// WhyTree data structure
// Nodes form a DAG (directed acyclic graph) — not strictly a tree,
// since a single mean can serve multiple ends.

import { randomUUID } from 'crypto';

export function createNode(label, type = 'seed') {
  return {
    id: randomUUID(),
    label,
    type,        // 'seed' | 'why' | 'how'
    parentIds: [],
    childIds: [],
    createdAt: new Date().toISOString(),
  };
}

export function createTree(name = 'My Why Tree') {
  return {
    name,
    nodes: {},       // id -> node
    rootIds: [],     // top-level purpose nodes (no parents)
    seedIds: [],     // original seed nodes
    currentNodeId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function addNode(tree, node) {
  tree.nodes[node.id] = node;
  tree.updatedAt = new Date().toISOString();
  return node;
}

export function addSeed(tree, label) {
  const node = createNode(label, 'seed');
  addNode(tree, node);
  tree.seedIds.push(node.id);
  tree.rootIds.push(node.id);
  return node;
}

// Why Up: add a parent (purpose) above an existing node
export function whyUp(tree, childId, purposeLabel) {
  const child = tree.nodes[childId];
  if (!child) throw new Error(`Node ${childId} not found`);

  // Check if a node with the same label already exists (convergence)
  const existing = Object.values(tree.nodes).find(
    n => n.label.toLowerCase() === purposeLabel.toLowerCase()
  );

  let parent;
  if (existing) {
    parent = existing;
    // Link child to existing parent if not already linked
    if (!child.parentIds.includes(parent.id)) {
      child.parentIds.push(parent.id);
      parent.childIds.push(child.id);
    }
  } else {
    parent = createNode(purposeLabel, 'why');
    parent.childIds.push(childId);
    addNode(tree, parent);
    child.parentIds.push(parent.id);
  }

  // Update rootIds: child is no longer a root if it has parents
  tree.rootIds = tree.rootIds.filter(id => id !== childId);
  // Parent becomes a root if it has no parents
  if (parent.parentIds.length === 0 && !tree.rootIds.includes(parent.id)) {
    tree.rootIds.push(parent.id);
  }

  tree.updatedAt = new Date().toISOString();
  return parent;
}

// How Down: add a child (means) below an existing node
export function howDown(tree, parentId, meansLabel) {
  const parent = tree.nodes[parentId];
  if (!parent) throw new Error(`Node ${parentId} not found`);

  const child = createNode(meansLabel, 'how');
  child.parentIds.push(parentId);
  addNode(tree, child);
  parent.childIds.push(child.id);

  tree.updatedAt = new Date().toISOString();
  return child;
}

export function getNode(tree, id) {
  return tree.nodes[id];
}

export function getChildren(tree, id) {
  const node = tree.nodes[id];
  if (!node) return [];
  return node.childIds.map(cid => tree.nodes[cid]).filter(Boolean);
}

export function getParents(tree, id) {
  const node = tree.nodes[id];
  if (!node) return [];
  return node.parentIds.map(pid => tree.nodes[pid]).filter(Boolean);
}

export function getLeaves(tree) {
  return Object.values(tree.nodes).filter(n => n.childIds.length === 0);
}

export function getRoots(tree) {
  return tree.rootIds.map(id => tree.nodes[id]).filter(Boolean);
}

export function getAllNodes(tree) {
  return Object.values(tree.nodes);
}

// Detect convergence: nodes that have multiple children pointing to them
export function findConvergencePoints(tree) {
  return Object.values(tree.nodes).filter(n => n.childIds.length > 1);
}

// Get depth of a node (longest path from any leaf to this node)
export function getDepth(tree, nodeId, visited = new Set()) {
  if (visited.has(nodeId)) return 0;
  visited.add(nodeId);
  const node = tree.nodes[nodeId];
  if (!node || node.childIds.length === 0) return 0;
  return 1 + Math.max(...node.childIds.map(cid => getDepth(tree, cid, visited)));
}

// Rename a node
export function renameNode(tree, nodeId, newLabel) {
  const node = tree.nodes[nodeId];
  if (!node) throw new Error(`Node ${nodeId} not found`);
  node.label = newLabel;
  tree.updatedAt = new Date().toISOString();
  return node;
}

// Unlink a child from a parent (break one connection)
export function unlinkNodes(tree, childId, parentId) {
  const child = tree.nodes[childId];
  const parent = tree.nodes[parentId];
  if (!child) throw new Error(`Child node ${childId} not found`);
  if (!parent) throw new Error(`Parent node ${parentId} not found`);

  child.parentIds = child.parentIds.filter(id => id !== parentId);
  parent.childIds = parent.childIds.filter(id => id !== childId);

  // If child has no more parents, it becomes a root
  if (child.parentIds.length === 0 && !tree.rootIds.includes(childId)) {
    tree.rootIds.push(childId);
  }

  tree.updatedAt = new Date().toISOString();
}

// Relink: move a node under a new parent
export function relinkNode(tree, nodeId, newParentId) {
  const node = tree.nodes[nodeId];
  const newParent = tree.nodes[newParentId];
  if (!node) throw new Error(`Node ${nodeId} not found`);
  if (!newParent) throw new Error(`Parent node ${newParentId} not found`);

  // Add new link
  if (!node.parentIds.includes(newParentId)) {
    node.parentIds.push(newParentId);
    newParent.childIds.push(nodeId);
  }

  // Remove from roots if it was one
  tree.rootIds = tree.rootIds.filter(id => id !== nodeId);

  tree.updatedAt = new Date().toISOString();
}

// Remove a node and clean up all references
export function removeNode(tree, nodeId) {
  const node = tree.nodes[nodeId];
  if (!node) throw new Error(`Node ${nodeId} not found`);

  // Remove from parents' childIds
  for (const pid of node.parentIds) {
    const parent = tree.nodes[pid];
    if (parent) {
      parent.childIds = parent.childIds.filter(id => id !== nodeId);
    }
  }

  // Orphaned children become roots
  for (const cid of node.childIds) {
    const child = tree.nodes[cid];
    if (child) {
      child.parentIds = child.parentIds.filter(id => id !== nodeId);
      if (child.parentIds.length === 0 && !tree.rootIds.includes(cid)) {
        tree.rootIds.push(cid);
      }
    }
  }

  // Remove from rootIds and seedIds
  tree.rootIds = tree.rootIds.filter(id => id !== nodeId);
  tree.seedIds = tree.seedIds.filter(id => id !== nodeId);

  delete tree.nodes[nodeId];
  tree.updatedAt = new Date().toISOString();
}

// Build hierarchical numbering map (1, 1.1, 1.2, 1.1.1, etc.)
export function buildNumbering(tree) {
  const numbering = {}; // nodeId -> "1.2.1"
  const visited = new Set();
  const roots = getRoots(tree);

  function walk(nodeId, prefix) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    numbering[nodeId] = prefix;
    const node = tree.nodes[nodeId];
    if (!node) return;
    const children = node.childIds.map(cid => tree.nodes[cid]).filter(Boolean);
    children.forEach((child, i) => {
      walk(child.id, `${prefix}.${i + 1}`);
    });
  }

  roots.forEach((root, i) => {
    walk(root.id, `${i + 1}`);
  });

  return numbering;
}
