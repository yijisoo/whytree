// Plain-text tree renderer for MCP — returns strings, no chalk
import { getRoots, getChildren, getParents, findConvergencePoints, buildNumbering, getDepth, getAllNodes } from './tree.js';

function alphaLabel(index) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (index < 26) return letters[index];
  return letters[Math.floor(index / 26) - 1] + letters[index % 26];
}

function renderBulletTree(tree, nodeId, prefix, childPrefix, visited, highlightId, convergenceIds, alphaLabels, lines) {
  if (visited.has(nodeId)) {
    const node = tree.nodes[nodeId];
    const alpha = alphaLabels[nodeId] || '?';
    lines.push(prefix + `→ ${alpha}. ${node?.label || '?'} (see above)`);
    return;
  }
  visited.add(nodeId);

  const node = tree.nodes[nodeId];
  if (!node) return;

  const alpha = alphaLabels[nodeId] || '?';
  const marker = node.id === highlightId ? ' **' : (convergenceIds.has(node.id) ? ' *' : '');
  lines.push(prefix + `• ${alpha}. ${node.label}${marker}`);

  const children = getChildren(tree, nodeId);
  children.forEach(child => {
    renderBulletTree(
      tree, child.id,
      childPrefix + '+- ',
      childPrefix + '|  ',
      visited, highlightId, convergenceIds, alphaLabels, lines
    );
  });
}

export function renderTree(tree, highlightId = null) {
  const roots = getRoots(tree);
  if (roots.length === 0) return '  (empty tree)';

  const convergencePoints = findConvergencePoints(tree);
  const convergenceIds = new Set(convergencePoints.map(n => n.id));

  const alphaLabels = {};
  let counter = 0;
  const preVisited = new Set();

  function assignAlpha(nodeId) {
    if (preVisited.has(nodeId)) return;
    preVisited.add(nodeId);
    alphaLabels[nodeId] = alphaLabel(counter++);
    getChildren(tree, nodeId).forEach(child => assignAlpha(child.id));
  }
  roots.forEach(root => assignAlpha(root.id));

  const lines = [`  ${tree.name}`, ''];
  const visited = new Set();

  roots.forEach(root => {
    renderBulletTree(tree, root.id, '  ', '  ', visited, highlightId, convergenceIds, alphaLabels, lines);
  });

  return lines.join('\n');
}

export function renderNodeList(tree) {
  const nodes = getAllNodes(tree);
  if (nodes.length === 0) return '';
  const numbering = buildNumbering(tree);
  const sorted = nodes
    .map(n => ({ ...n, num: numbering[n.id] || '?' }))
    .sort((a, b) => a.num.localeCompare(b.num, undefined, { numeric: true }));
  return sorted.map(n => {
    const parents = getParents(tree, n.id);
    const children = getChildren(tree, n.id);
    const pStr = parents.length > 0 ? ` <[${parents.map(p => p.id.slice(0, 6)).join(',')}]` : '';
    const cStr = children.length > 0 ? ` >[${children.map(c => c.id.slice(0, 6)).join(',')}]` : '';
    const typeIcon = n.type === 'seed' ? '~' : n.type === 'why' ? '^' : 'v';
    return `  [${n.id.slice(0, 6)}] ${typeIcon} ${n.label}${pStr}${cStr}`;
  }).join('\n');
}

export function renderNodeListCompact(tree) {
  const nodes = getAllNodes(tree);
  if (nodes.length === 0) return '';
  return nodes.map(n => {
    const typeIcon = n.type === 'seed' ? '~' : n.type === 'why' ? '^' : 'v';
    return `  [${n.id.slice(0, 6)}] ${typeIcon} ${n.label}`;
  }).join('\n');
}

export function renderNodeContext(tree, nodeId) {
  const node = tree.nodes[nodeId];
  if (!node) return '';

  const parents = node.parentIds.map(id => tree.nodes[id]).filter(Boolean);
  const children = node.childIds.map(id => tree.nodes[id]).filter(Boolean);

  const lines = [`  Current node: ${node.label} [${node.type}]`];
  if (parents.length > 0) {
    lines.push(`  Serves purpose(s): ${parents.map(p => p.label).join(', ')}`);
  }
  if (children.length > 0) {
    lines.push(`  Achieved through: ${children.map(c => c.label).join(', ')}`);
  }
  return lines.join('\n');
}

export function renderConvergenceInsight(tree) {
  const convergencePoints = findConvergencePoints(tree);
  if (convergencePoints.length === 0) return '';

  const lines = ['  --- Convergence Points ---'];
  for (const node of convergencePoints) {
    const children = node.childIds.map(id => tree.nodes[id]).filter(Boolean);
    const childLabels = children.map(c => `"${c.label}"`).join(', ');
    lines.push(`  * "${node.label}"`);
    lines.push(`    ← connects ${childLabels}`);
  }
  return lines.join('\n');
}

export function renderInsightsSynthesis(tree) {
  const numbering = {};
  Object.keys(tree.nodes).forEach(id => { numbering[id] = id.slice(0, 6); });

  const undeveloped = tree.seedIds
    .map(id => tree.nodes[id])
    .filter(n => n && n.parentIds.length === 0);

  const purposeRoots = getRoots(tree).filter(n => n.type === 'why');
  const convergenceIds = new Set(findConvergencePoints(tree).map(n => n.id));

  const lines = [];

  if (purposeRoots.length > 1) {
    const convergenceRoots = purposeRoots.filter(n => convergenceIds.has(n.id));
    const openRoots = purposeRoots.filter(n => !convergenceIds.has(n.id));

    lines.push('  --- Purpose Roots ---');
    lines.push(`  Your tree currently has ${purposeRoots.length} separate tops.`);
    lines.push('');

    if (convergenceRoots.length > 0) {
      lines.push(`  These have found convergence but haven't been explored further:`);
      convergenceRoots.forEach(n => {
        lines.push(`    * "${n.label}" [${numbering[n.id]}]`);
      });
      lines.push('');
    }

    if (openRoots.length > 0) {
      lines.push(`  These threads haven't connected to anything else yet:`);
      openRoots.forEach(n => {
        lines.push(`    ^ "${n.label}" [${numbering[n.id]}]`);
      });
      lines.push('');
    }
  }

  const unreached = purposeRoots.filter(n => {
    const depth = getDepth(tree, n.id);
    const children = n.childIds.map(id => tree.nodes[id]).filter(Boolean);
    const hasHowDown = children.some(c => c.type === 'how');
    return depth >= 2 && !hasHowDown;
  });

  if (unreached.length > 0) {
    lines.push('  --- Unreached Thread ---');
    lines.push('  This purpose was explored deeply but has no action attached yet.');
    unreached.forEach(n => {
      lines.push(`  ^ "${n.label}" [${numbering[n.id]}]`);
    });
    lines.push('');
  }

  const underdeveloped = tree.seedIds
    .map(id => tree.nodes[id])
    .filter(n => {
      if (!n || n.parentIds.length === 0) return false;
      return n.parentIds.every(pid => {
        const parent = tree.nodes[pid];
        return parent && parent.parentIds.length === 0;
      });
    });

  if (underdeveloped.length > 0) {
    lines.push('  --- Worth Going Deeper ---');
    underdeveloped.forEach(n => {
      const parentNode = tree.nodes[n.parentIds[0]];
      const parentLabel = parentNode ? parentNode.label : '?';
      lines.push(`  ~ ${n.label} → ${parentLabel}`);
    });
    lines.push('');
  }

  if (undeveloped.length > 0) {
    lines.push('  --- Unexplored Seeds ---');
    undeveloped.forEach(n => {
      lines.push(`  ~ ${n.label} [${numbering[n.id]}]`);
    });
    lines.push('');
  }

  return lines.join('\n');
}

export function renderNarrativeSynthesis(tree) {
  const purposeRoots = getRoots(tree).filter(n => n.type === 'why');
  const allNodes = Object.values(tree.nodes);
  if (allNodes.length < 3) return '';

  const convergencePoints = findConvergencePoints(tree);
  const anchor = convergencePoints.length > 0
    ? convergencePoints.reduce((best, n) => {
        const score = n.childIds.length + getDepth(tree, n.id);
        const bestScore = best.childIds.length + getDepth(tree, best.id);
        return score > bestScore ? n : best;
      })
    : (purposeRoots.length > 0
        ? purposeRoots.reduce((a, b) => getDepth(tree, b.id) > getDepth(tree, a.id) ? b : a)
        : null);

  const lines = ['  --- What Your Tree Is Saying ---', ''];

  if (anchor) {
    lines.push(`  In your own words, the thing this tree is ultimately about is:`);
    lines.push(`  "${anchor.label}"`);
    lines.push('');
    lines.push(`  Most people don't act like that's what they're optimizing for.`);
    lines.push(`  Your tree says you might be.`);
    lines.push('');
    lines.push(`  The harder question:`);
    lines.push(`  What in your life right now is working against "${anchor.label}"?`);
    lines.push('');
    lines.push(`  What are you not yet doing that this seems to be asking for?`);
    if (purposeRoots.length > 1) {
      lines.push('');
      lines.push(`  The other threads may sharpen that answer — or complicate it.`);
    }
  } else {
    lines.push(`  Your tree hasn't reached a single root yet.`);
    lines.push(`  That's not a problem — you're still in the middle of the question.`);
    lines.push('');
    lines.push(`  What would it mean if all these threads were pointing at the same thing?`);
  }

  return lines.join('\n');
}
