// Bullet-list tree visualization for the Why Tree
import chalk from 'chalk';
import { getRoots, getChildren, findConvergencePoints, buildNumbering, getDepth } from './tree.js';

const COLORS = {
  seed: chalk.blue,
  why: chalk.green,
  how: chalk.magenta,
  highlight: chalk.yellow.bold,
  convergence: chalk.cyan.bold,
  dim: chalk.dim,
};

function alphaLabel(index) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (index < 26) return letters[index];
  return letters[Math.floor(index / 26) - 1] + letters[index % 26];
}

function nodeLabel(node, highlightId, convergenceIds, alpha) {
  const label = node.label;
  const isHighlight = node.id === highlightId;
  const isConvergence = convergenceIds.has(node.id);
  const alphaTag = chalk.dim(`${alpha}. `);

  if (isHighlight) {
    return alphaTag + COLORS.highlight(label);
  } else if (isConvergence) {
    return alphaTag + COLORS.convergence(label);
  } else {
    return alphaTag + COLORS[node.type](label);
  }
}

// prefix     — the connector string printed before this node's bullet
// childPrefix — the indent string prepended to each direct child's connector
function renderBulletTree(tree, nodeId, prefix, childPrefix, visited, highlightId, convergenceIds, alphaLabels, lines) {
  if (visited.has(nodeId)) {
    const node = tree.nodes[nodeId];
    const alpha = alphaLabels[nodeId] || '?';
    lines.push(prefix + chalk.dim(`→ ${alpha}. ${node?.label || '?'} (see above)`));
    return;
  }
  visited.add(nodeId);

  const node = tree.nodes[nodeId];
  if (!node) return;

  const alpha = alphaLabels[nodeId] || '?';
  lines.push(prefix + '• ' + nodeLabel(node, highlightId, convergenceIds, alpha));

  const children = getChildren(tree, nodeId);
  children.forEach(child => {
    renderBulletTree(
      tree, child.id,
      childPrefix + '+- ',   // child connector
      childPrefix + '|  ',   // grandchild indent
      visited, highlightId, convergenceIds, alphaLabels, lines
    );
  });
}

export function displayTree(tree, highlightId = null) {
  const roots = getRoots(tree);
  if (roots.length === 0) {
    console.log(chalk.dim('\n  (empty tree)\n'));
    return;
  }

  const convergencePoints = findConvergencePoints(tree);
  const convergenceIds = new Set(convergencePoints.map(n => n.id));

  // Assign sequential alpha labels in traversal order
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

  console.log('');
  console.log(chalk.bold.white(`  ${tree.name}`));
  console.log('');

  const lines = [];
  const visited = new Set();

  roots.forEach(root => {
    renderBulletTree(tree, root.id, '  ', '  ', visited, highlightId, convergenceIds, alphaLabels, lines);
  });

  lines.forEach(l => console.log(l));
  console.log('');
}

export function displayNodeContext(tree, nodeId) {
  const node = tree.nodes[nodeId];
  if (!node) return;

  const parents = node.parentIds.map(id => tree.nodes[id]).filter(Boolean);
  const children = node.childIds.map(id => tree.nodes[id]).filter(Boolean);

  console.log('');
  console.log(chalk.bold(`  Current node: ${COLORS[node.type](node.label)}`));

  if (parents.length > 0) {
    console.log(chalk.dim('  Serves purpose(s): ') +
      parents.map(p => COLORS.why(p.label)).join(', '));
  }
  if (children.length > 0) {
    console.log(chalk.dim('  Achieved through: ') +
      children.map(c => COLORS[c.type](c.label)).join(', '));
  }
  console.log('');
}

export function displayWelcome() {
  console.log('');
  console.log(chalk.bold.green('  ╔══════════════════════════════════════════════════╗'));
  console.log(chalk.bold.green('  ║') + chalk.bold.white('          The Why Tree                            ') + chalk.bold.green('║'));
  console.log(chalk.bold.green('  ║') + chalk.dim('   Discover what truly matters to you              ') + chalk.bold.green('║'));
  console.log(chalk.bold.green('  ╚══════════════════════════════════════════════════╝'));
  console.log('');
  console.log(chalk.white('  "What is the purpose of my life?"'));
  console.log('');
  console.log(chalk.dim('  Few questions carry more weight, yet few prove harder'));
  console.log(chalk.dim('  to answer. The purposes that drive our choices often'));
  console.log(chalk.dim('  remain inarticulate — felt rather than understood.'));
  console.log('');
  console.log(chalk.dim('  The Why Tree is a structured technique to help you'));
  console.log(chalk.dim('  externalize and discover your personal purpose through'));
  console.log(chalk.dim('  two simple movements:'));
  console.log('');
  console.log(chalk.green('    "Why Up"  ') + chalk.dim('— ask "why?" to surface higher purposes'));
  console.log(chalk.magenta('    "How Down" ') + chalk.dim('— ask "how?" to discover alternative means'));
  console.log('');
  console.log(chalk.dim('  By cycling between these, you\'ll progressively'));
  console.log(chalk.dim('  externalize your inner model of what matters and why.'));
  console.log('');
}

export function displayConvergenceInsight(tree) {
  const convergencePoints = findConvergencePoints(tree);
  if (convergencePoints.length === 0) return;

  console.log(chalk.cyan.bold('  --- Convergence Points ---'));
  for (const node of convergencePoints) {
    const children = node.childIds.map(id => tree.nodes[id]).filter(Boolean);
    const childLabels = children.map(c => `"${c.label}"`).join(', ');
    console.log(chalk.cyan(`  * "${node.label}"`));
    console.log(chalk.dim(`    ← connects ${childLabels}`));
  }
  console.log('');
}

export function displayInsightsSynthesis(tree) {
  // Use stable hash IDs for all example commands — consistent with tree display
  const numbering = {};
  Object.keys(tree.nodes).forEach(id => { numbering[id] = id.slice(0, 6); });

  const undeveloped = tree.seedIds
    .map(id => tree.nodes[id])
    .filter(n => n && n.parentIds.length === 0);

  const purposeRoots = getRoots(tree).filter(n => n.type === 'why');
  const convergenceIds = new Set(findConvergencePoints(tree).map(n => n.id));

  // Purpose Roots — separate convergence roots (already done work) from open roots
  if (purposeRoots.length > 1) {
    const convergenceRoots = purposeRoots.filter(n => convergenceIds.has(n.id));
    const openRoots = purposeRoots.filter(n => !convergenceIds.has(n.id));

    console.log(chalk.yellow('  --- Purpose Roots ---'));
    console.log(chalk.dim(`  Your tree currently has ${purposeRoots.length} separate tops.`));
    console.log('');

    if (convergenceRoots.length > 0) {
      console.log(chalk.dim(`  These have found convergence (* marks) but haven't been explored further:`));
      convergenceRoots.forEach(n => {
        const num = numbering[n.id] || '?';
        console.log(chalk.cyan(`    * "${n.label}"`));
        console.log(chalk.dim(`      → whytree why-up ${num} "<why does that matter?>"`));
      });
      console.log('');
    }

    if (openRoots.length > 0) {
      console.log(chalk.dim(`  These threads haven't connected to anything else yet:`));
      openRoots.forEach(n => {
        const num = numbering[n.id] || '?';
        console.log(chalk.dim(`    ^ "${n.label}"`));
        console.log(chalk.dim(`      → whytree why-up ${num} "<your reason>"`));
      });
      console.log('');
    }

    console.log(chalk.white('  One exercise worth trying:'));
    console.log(chalk.dim(`  Complete this sentence — then use it as your next why-up on each thread:`));
    console.log(chalk.white(`  "All of these trace back to _____."`));
    console.log('');
  }

  // Unreached threads — deep purpose roots with no how-down, no action attached
  const unreached = purposeRoots.filter(n => {
    const depth = getDepth(tree, n.id);
    const children = n.childIds.map(id => tree.nodes[id]).filter(Boolean);
    const hasHowDown = children.some(c => c.type === 'how');
    return depth >= 2 && !hasHowDown;
  });

  if (unreached.length > 0) {
    console.log(chalk.yellow('  --- Unreached Thread ---'));
    console.log(chalk.dim(`  This purpose was explored deeply but has no action attached yet.`));
    console.log(chalk.dim(`  That's often where the real work is:`));
    unreached.forEach(n => {
      const num = numbering[n.id] || '?';
      console.log(chalk.cyan(`  ^ "${n.label}"`));
      console.log(chalk.dim(`    → What would it look like to actually live this out?`));
      console.log(chalk.dim(`    → whytree how-down ${num} "<a concrete, specific action>"`));
    });
    console.log('');
  }

  // Underdeveloped seeds — seeds whose entire why chain is shallow (depth < 2)
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
    console.log(chalk.yellow('  --- Worth Going Deeper ---'));
    console.log(chalk.dim(`  These started to open up but haven't been fully explored:`));
    underdeveloped.forEach(n => {
      const parentNode = tree.nodes[n.parentIds[0]];
      const parentLabel = parentNode ? parentNode.label : '?';
      console.log(chalk.dim(`  ~ ${n.label} → ${parentLabel}`));
      console.log(chalk.dim(`    → whytree why-up ${numbering[n.parentIds[0]] || '?'} "<why does that matter?>"`));
    });
    console.log('');
  }

  // Unexplored seeds (shown last)
  if (undeveloped.length > 0) {
    console.log(chalk.yellow('  --- Unexplored Seeds ---'));
    console.log(chalk.dim(`  These seeds are still here when you're ready.`));
    undeveloped.forEach(n => {
      const num = numbering[n.id] || '?';
      console.log(chalk.dim(`  ~ ${n.label}`));
      console.log(chalk.dim(`    → whytree why-up ${num} "<your reason>"`));
    });
    console.log('');
  }
}

export function displayNarrativeSynthesis(tree) {
  const purposeRoots = getRoots(tree).filter(n => n.type === 'why');
  const allNodes = Object.values(tree.nodes);
  if (allNodes.length < 3) return;

  // Anchor = convergence node with highest (childIds.length + depth) score,
  // falling back to deepest purpose root if no convergence points exist
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

  console.log(chalk.white('  --- What Your Tree Is Saying ---'));
  console.log('');

  if (anchor) {
    console.log(chalk.dim(`  In your own words, the thing this tree is ultimately about is:`));
    console.log(chalk.cyan(`  "${anchor.label}"`));
    console.log('');
    console.log(chalk.dim(`  Most people don't act like that's what they're optimizing for.`));
    console.log(chalk.white(`  Your tree says you might be.`));
    console.log('');
    console.log(chalk.dim(`  The harder question:`));
    console.log(chalk.white(`  What in your life right now is working against "${anchor.label}"?`));
    console.log('');
    console.log(chalk.dim(`  What are you not yet doing that this seems to be asking for?`));
    console.log(chalk.dim(`  (Not as a demand — just as a direction.)`));
    if (purposeRoots.length > 1) {
      console.log('');
      console.log(chalk.dim(`  The other threads may sharpen that answer — or complicate it.`));
    }
  } else {
    console.log(chalk.dim(`  Your tree hasn't reached a single root yet.`));
    console.log(chalk.dim(`  That's not a problem — you're still in the middle of the question.`));
    console.log('');
    console.log(chalk.dim(`  What would it mean if all these threads were pointing at the same thing?`));
  }

  console.log('');
}

export function displayTreeStats(tree) {
  // Stats intentionally omitted — the tree speaks for itself.
}
