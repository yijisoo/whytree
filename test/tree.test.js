import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createTree, createNode, addSeed, whyUp, howDown,
  getNode, getChildren, getParents, getRoots, getLeaves, getAllNodes,
  findConvergencePoints, getDepth, renameNode, unlinkNodes, relinkNode,
  removeNode, buildNumbering
} from '../src/tree.js';

describe('createTree', () => {
  it('creates a tree with default name', () => {
    const tree = createTree();
    assert.equal(tree.name, 'My Why Tree');
    assert.deepEqual(tree.nodes, {});
    assert.deepEqual(tree.rootIds, []);
    assert.deepEqual(tree.seedIds, []);
  });

  it('creates a tree with custom name', () => {
    const tree = createTree('Purpose Discovery');
    assert.equal(tree.name, 'Purpose Discovery');
  });

  it('creates a tree with Korean name', () => {
    const tree = createTree('나의 왜 나무');
    assert.equal(tree.name, '나의 왜 나무');
  });
});

describe('addSeed', () => {
  it('adds a seed node to the tree', () => {
    const tree = createTree();
    const seed = addSeed(tree, 'cooking');
    assert.equal(seed.label, 'cooking');
    assert.equal(seed.type, 'seed');
    assert.ok(tree.seedIds.includes(seed.id));
    assert.ok(tree.rootIds.includes(seed.id));
  });

  it('adds a Korean-labeled seed', () => {
    const tree = createTree();
    const seed = addSeed(tree, '요리하기');
    assert.equal(seed.label, '요리하기');
    assert.equal(seed.type, 'seed');
  });
});

describe('whyUp', () => {
  it('adds a purpose above a seed', () => {
    const tree = createTree();
    const seed = addSeed(tree, 'cooking');
    const why = whyUp(tree, seed.id, 'nourishing others');
    assert.equal(why.label, 'nourishing others');
    assert.equal(why.type, 'why');
    assert.ok(why.childIds.includes(seed.id));
    assert.ok(seed.parentIds.includes(why.id));
  });

  it('detects convergence when labels match', () => {
    const tree = createTree();
    const s1 = addSeed(tree, 'cooking');
    const s2 = addSeed(tree, 'gardening');
    const why1 = whyUp(tree, s1.id, 'connection');
    const why2 = whyUp(tree, s2.id, 'connection');
    // Should be the same node (convergence)
    assert.equal(why1.id, why2.id);
    assert.equal(why1.childIds.length, 2);
  });

  it('convergence is case-insensitive', () => {
    const tree = createTree();
    const s1 = addSeed(tree, 'a');
    const s2 = addSeed(tree, 'b');
    const why1 = whyUp(tree, s1.id, 'Freedom');
    const why2 = whyUp(tree, s2.id, 'freedom');
    assert.equal(why1.id, why2.id);
  });

  it('moves child out of rootIds', () => {
    const tree = createTree();
    const seed = addSeed(tree, 'x');
    assert.ok(tree.rootIds.includes(seed.id));
    whyUp(tree, seed.id, 'y');
    assert.ok(!tree.rootIds.includes(seed.id));
  });
});

describe('howDown', () => {
  it('adds a means below a node', () => {
    const tree = createTree();
    const seed = addSeed(tree, 'creativity');
    const why = whyUp(tree, seed.id, 'self-expression');
    const how = howDown(tree, why.id, 'writing');
    assert.equal(how.label, 'writing');
    assert.equal(how.type, 'how');
    assert.ok(how.parentIds.includes(why.id));
    assert.ok(why.childIds.includes(how.id));
  });
});

describe('renameNode', () => {
  it('renames a node', () => {
    const tree = createTree();
    const seed = addSeed(tree, 'old name');
    renameNode(tree, seed.id, 'new name');
    assert.equal(getNode(tree, seed.id).label, 'new name');
  });

  it('renames to Korean', () => {
    const tree = createTree();
    const seed = addSeed(tree, 'cooking');
    renameNode(tree, seed.id, '요리하기');
    assert.equal(getNode(tree, seed.id).label, '요리하기');
  });
});

describe('unlinkNodes', () => {
  it('breaks a parent-child link', () => {
    const tree = createTree();
    const seed = addSeed(tree, 'x');
    const why = whyUp(tree, seed.id, 'y');
    unlinkNodes(tree, seed.id, why.id);
    assert.ok(!seed.parentIds.includes(why.id));
    assert.ok(!why.childIds.includes(seed.id));
    // Child becomes root again
    assert.ok(tree.rootIds.includes(seed.id));
  });
});

describe('removeNode', () => {
  it('removes a node and orphans its children', () => {
    const tree = createTree();
    const seed = addSeed(tree, 'x');
    const why = whyUp(tree, seed.id, 'y');
    removeNode(tree, why.id);
    assert.equal(getNode(tree, why.id), undefined);
    // Seed should be back as root
    assert.ok(tree.rootIds.includes(seed.id));
    assert.deepEqual(seed.parentIds, []);
  });
});

describe('buildNumbering', () => {
  it('assigns hierarchical numbers', () => {
    const tree = createTree();
    const s1 = addSeed(tree, 'a');
    const why = whyUp(tree, s1.id, 'purpose');
    const numbering = buildNumbering(tree);
    // why is root, s1 is its child
    assert.equal(numbering[why.id], '1');
    assert.equal(numbering[s1.id], '1.1');
  });

  it('numbers multiple roots', () => {
    const tree = createTree();
    const s1 = addSeed(tree, 'a');
    const s2 = addSeed(tree, 'b');
    const numbering = buildNumbering(tree);
    assert.equal(numbering[s1.id], '1');
    assert.equal(numbering[s2.id], '2');
  });
});

describe('query functions', () => {
  it('getAllNodes returns all nodes', () => {
    const tree = createTree();
    addSeed(tree, 'a');
    addSeed(tree, 'b');
    assert.equal(getAllNodes(tree).length, 2);
  });

  it('getRoots returns root nodes', () => {
    const tree = createTree();
    const s = addSeed(tree, 'a');
    const w = whyUp(tree, s.id, 'b');
    const roots = getRoots(tree);
    assert.equal(roots.length, 1);
    assert.equal(roots[0].id, w.id);
  });

  it('getLeaves returns leaf nodes', () => {
    const tree = createTree();
    const s = addSeed(tree, 'a');
    whyUp(tree, s.id, 'b');
    const leaves = getLeaves(tree);
    assert.equal(leaves.length, 1);
    assert.equal(leaves[0].id, s.id);
  });

  it('findConvergencePoints finds nodes with multiple children', () => {
    const tree = createTree();
    const s1 = addSeed(tree, 'a');
    const s2 = addSeed(tree, 'b');
    const why = whyUp(tree, s1.id, 'shared');
    whyUp(tree, s2.id, 'shared'); // converge
    const points = findConvergencePoints(tree);
    assert.equal(points.length, 1);
    assert.equal(points[0].id, why.id);
  });
});
