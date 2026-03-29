// ASCII tree visualization for the Why Tree
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

function nodeLabel(node, highlightId, convergenceIds, number = '') {
  let label = node.label;
  const isHighlight = node.id === highlightId;
  const isConvergence = convergenceIds.has(node.id);

  let prefix = '';
  if (node.type === 'seed') prefix = '~ ';
  else if (node.type === 'why') prefix = '^ ';
  else if (node.type === 'how') prefix = 'v ';

  const numTag = number ? chalk.dim.white(`[${number}] `) : '';

  let styled;
  if (isHighlight) {
    styled = numTag + COLORS.highlight(`>>> ${prefix}${label} <<<`);
  } else if (isConvergence) {
    styled = numTag + COLORS.convergence(`* ${prefix}${label}`);
  } else {
    styled = numTag + COLORS[node.type](`${prefix}${label}`);
  }

  return styled;
}

// Render tree top-down from roots (purposes at top, means at bottom)
function renderSubtree(tree, nodeId, indent, isLast, visited, highlightId, convergenceIds, numbering, lines) {
  if (visited.has(nodeId)) {
    const node = tree.nodes[nodeId];
    const num = numbering[nodeId] || '';
    const connector = isLast ? '  +-- ' : '  |-- ';
    lines.push(indent + connector + COLORS.dim(`(-> [${num}] ${node?.label || '?'})`));
    return;
  }
  visited.add(nodeId);

  const node = tree.nodes[nodeId];
  if (!node) return;

  const connector = indent === '' ? '' : (isLast ? '  +-- ' : '  |-- ');
  const childIndent = indent === '' ? '' : indent + (isLast ? '      ' : '  |   ');
  const num = numbering[nodeId] || '';

  lines.push(indent + connector + nodeLabel(node, highlightId, convergenceIds, num));

  const children = getChildren(tree, nodeId);
  children.forEach((child, i) => {
    const last = i === children.length - 1;
    renderSubtree(tree, child.id, childIndent, last, visited, highlightId, convergenceIds, numbering, lines);
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

  console.log('');
  console.log(chalk.bold.white(`  === ${tree.name} ===`));
  console.log(chalk.dim('  (top = purpose/why, bottom = means/how)'));
  console.log('');

  const lines = [];
  const visited = new Set();
  // Use stable 6-char hash IDs as addresses — these never change as the tree grows
  const numbering = {};
  Object.keys(tree.nodes).forEach(id => { numbering[id] = id.slice(0, 6); });

  roots.forEach((root, i) => {
    renderSubtree(tree, root.id, '  ', i === roots.length - 1, visited, highlightId, convergenceIds, numbering, lines);
    if (i < roots.length - 1) lines.push('');
  });

  lines.forEach(l => console.log(l));

  console.log('');

  // Legend
  console.log(chalk.dim('  Legend: ') +
    COLORS.seed('~ seed') + '  ' +
    COLORS.why('^ why/purpose') + '  ' +
    COLORS.how('v how/means') + '  ' +
    COLORS.convergence('* convergence'));
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
  const numbering = buildNumbering(tree);

  // Reflection prompt anchored to top convergence node (shown first)
  const convergencePoints = findConvergencePoints(tree);
  const undeveloped = tree.seedIds
    .map(id => tree.nodes[id])
    .filter(n => n && n.parentIds.length === 0);

  if (convergencePoints.length > 0) {
    const top = convergencePoints.reduce((a, b) => b.childIds.length > a.childIds.length ? b : a);
    console.log(chalk.white('  --- Reflection ---'));
    console.log(chalk.dim(`  Your tree converges most strongly around:`));
    console.log(chalk.cyan(`  "${top.label}"`));
    console.log('');
    // Q2 first (actionable direction), then Q1, then Q3
    console.log(chalk.dim(`  What are you not yet doing that this purpose seems to be asking for?`));
    console.log(chalk.dim(`  (Not as a demand — just as a direction.)`));
    console.log('');
    console.log(chalk.dim(`  Which activities, roles, or paths in your life best express this?`));
    console.log(chalk.dim(`  Which ones work against it?`));
    // Partial convergence caveat when unexplored seeds exist
    if (undeveloped.length > 0) {
      console.log('');
      console.log(chalk.dim(`  (Based on what you've explored so far — your unexplored seeds may confirm or complicate this.)`));
    }
    console.log('');
  }

  // Divergence detection — multiple disconnected top-level purpose chains
  const purposeRoots = getRoots(tree).filter(n => n.type === 'why');
  if (purposeRoots.length > 1) {
    console.log(chalk.yellow('  --- Unresolved Threads ---'));
    console.log(chalk.dim(`  These ${purposeRoots.length} purpose threads haven't converged yet:`));
    purposeRoots.forEach(n => {
      console.log(chalk.dim(`  ^ ${n.label}`));
    });
    console.log('');
    console.log(chalk.dim(`  That tension might be the most important thing in this tree.`));
    console.log(chalk.dim(`  You don't have to resolve it today.`));
    console.log(chalk.dim(`  When you're ready, try asking "why?" about each:`));
    purposeRoots.forEach(n => {
      const num = numbering[n.id] || '?';
      console.log(chalk.dim(`    whytree why-up ${num} "<your reason>"`));
    });
    console.log('');
  }

  // Underdeveloped seeds — seeds whose entire why chain is shallow (depth < 2)
  const underdeveloped = tree.seedIds
    .map(id => tree.nodes[id])
    .filter(n => {
      if (!n || n.parentIds.length === 0) return false;
      // Only flag if the chain above is shallow (parent has no further parents)
      return n.parentIds.every(pid => {
        const parent = tree.nodes[pid];
        return parent && parent.parentIds.length === 0;
      });
    });

  if (underdeveloped.length > 0) {
    console.log(chalk.yellow('  --- Worth Going Deeper ---'));
    console.log(chalk.dim(`  These started to open up but haven't been fully explored:`));
    underdeveloped.forEach(n => {
      const num = numbering[n.id] || '?';
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
  const convergencePoints = findConvergencePoints(tree);
  const purposeRoots = getRoots(tree).filter(n => n.type === 'why');
  const allNodes = Object.values(tree.nodes);
  if (allNodes.length < 3) return;

  const top = convergencePoints.length > 0
    ? convergencePoints.reduce((a, b) => b.childIds.length > a.childIds.length ? b : a)
    : null;

  console.log(chalk.white('  --- What Your Tree Is Saying ---'));
  console.log('');

  if (top) {
    const children = top.childIds.map(id => tree.nodes[id]).filter(Boolean);
    console.log(chalk.dim(`  In your own words, the thing this tree is actually about is:`));
    console.log(chalk.cyan(`  "${top.label}"`));
    console.log('');
    if (children.length > 1) {
      console.log(chalk.dim(`  Most people don't act like that's what they're optimizing for.`));
      console.log(chalk.dim(`  Your tree suggests you might be.`));
    }
    console.log('');
    console.log(chalk.dim(`  The harder question:`));
    console.log(chalk.white(`  What in your life right now is working against "${top.label}"?`));
  } else if (purposeRoots.length > 0) {
    console.log(chalk.dim(`  Your tree hasn't converged yet.`));
    console.log(chalk.dim(`  That's not a problem — it means you're still in the middle of the question.`));
    console.log('');
    console.log(chalk.dim(`  The threads so far:`));
    purposeRoots.forEach(n => console.log(chalk.cyan(`  ^ "${n.label}"`)));
    console.log('');
    console.log(chalk.dim(`  What would it mean if these were all pointing at the same thing?`));
  }

  if (purposeRoots.length > 1 && top) {
    console.log('');
    console.log(chalk.dim(`  The unresolved threads may sharpen that answer — or complicate it.`));
  }

  console.log('');
}

export function displayTreeStats(tree) {
  const nodes = Object.values(tree.nodes);
  const seeds = nodes.filter(n => n.type === 'seed').length;
  const whys = nodes.filter(n => n.type === 'why').length;
  const hows = nodes.filter(n => n.type === 'how').length;
  const convergence = findConvergencePoints(tree).length;

  console.log(chalk.dim(`  Tree: ${nodes.length} nodes (${seeds} seeds, ${whys} purposes, ${hows} means) | ${convergence} convergence points`));
  console.log('');
}
