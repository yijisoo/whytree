// ASCII tree visualization for the Why Tree
import chalk from 'chalk';
import { getRoots, getChildren, findConvergencePoints, buildNumbering } from './tree.js';

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
  const numbering = buildNumbering(tree);

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

  console.log(chalk.cyan.bold('  --- Convergence Insight ---'));
  for (const node of convergencePoints) {
    const children = node.childIds.map(id => tree.nodes[id]).filter(Boolean);
    console.log(chalk.cyan(`  "${node.label}" is served by ${children.length} different means:`));
    children.forEach(c => {
      console.log(chalk.dim(`    - ${c.label}`));
    });
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
