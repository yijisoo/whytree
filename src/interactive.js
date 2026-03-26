// Interactive tree editor — arrow keys to navigate, Enter to edit
import inquirer from 'inquirer';
import chalk from 'chalk';
import { getAllNodes, getNode, getChildren, getParents, getRoots, findConvergencePoints, buildNumbering, renameNode, whyUp, howDown, removeNode, addSeed } from './tree.js';
import { saveTree, loadTree } from './store.js';
import { displayTree, displayTreeStats } from './display.js';

export async function interactiveEdit(tree) {
  let running = true;

  while (running) {
    const numbering = buildNumbering(tree);
    const roots = getRoots(tree);

    // Build flat list in tree order for selection
    const flatNodes = [];
    const visited = new Set();

    function walk(nodeId, depth) {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      const node = tree.nodes[nodeId];
      if (!node) return;
      const num = numbering[nodeId] || '?';
      flatNodes.push({ id: nodeId, node, num, depth });
      for (const cid of node.childIds) {
        walk(cid, depth + 1);
      }
    }
    roots.forEach(r => walk(r.id, 0));

    const convergenceIds = new Set(findConvergencePoints(tree).map(n => n.id));

    const choices = flatNodes.map(({ id, node, num, depth }) => {
      const indent = '  '.repeat(depth);
      const typeIcon = node.type === 'seed' ? '~' : node.type === 'why' ? '^' : 'v';
      const color = node.type === 'seed' ? chalk.blue : node.type === 'why' ? chalk.green : chalk.magenta;
      const conv = convergenceIds.has(id) ? chalk.cyan('* ') : '  ';
      return {
        name: `${chalk.dim(`[${num}]`)} ${conv}${indent}${color(`${typeIcon} ${node.label}`)}`,
        value: id,
      };
    });

    choices.push(new inquirer.Separator());
    choices.push({ name: chalk.dim('  + Add a new seed'), value: '__add_seed__' });
    choices.push({ name: chalk.dim('  Exit editor'), value: '__exit__' });

    const { selected } = await inquirer.prompt([{
      type: 'list',
      name: 'selected',
      message: 'Navigate to a node (arrow keys) and press Enter:',
      choices,
      pageSize: 25,
      loop: false,
    }]);

    if (selected === '__exit__') {
      running = false;
      continue;
    }

    if (selected === '__add_seed__') {
      const { label } = await inquirer.prompt([{
        type: 'input',
        name: 'label',
        message: 'New seed:',
      }]);
      if (label.trim()) {
        addSeed(tree, label.trim());
        saveTree(tree);
        console.log(chalk.blue(`  + Added seed: "${label.trim()}"`));
      }
      continue;
    }

    // Node selected — show actions
    const node = getNode(tree, selected);
    const num = numbering[selected];
    const parents = getParents(tree, selected);
    const children = getChildren(tree, selected);

    console.log('');
    console.log(chalk.bold(`  [${num}] ${node.label}`));
    if (parents.length > 0) console.log(chalk.dim(`  Serves: ${parents.map(p => p.label).join(', ')}`));
    if (children.length > 0) console.log(chalk.dim(`  Through: ${children.map(c => c.label).join(', ')}`));
    console.log('');

    const actions = [
      { name: chalk.yellow('Rename') + chalk.dim(' — change this node\'s label'), value: 'rename' },
      { name: chalk.green('Why Up') + chalk.dim(' — add a purpose above this node'), value: 'why_up' },
      { name: chalk.magenta('How Down') + chalk.dim(' — add a means below this node'), value: 'how_down' },
      { name: chalk.red('Remove') + chalk.dim(' — delete this node'), value: 'remove' },
      { name: chalk.dim('Back'), value: 'back' },
    ];

    const { action } = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: `Action for [${num}]:`,
      choices: actions,
    }]);

    switch (action) {
      case 'rename': {
        const { newLabel } = await inquirer.prompt([{
          type: 'input',
          name: 'newLabel',
          message: 'New label:',
          default: node.label,
        }]);
        if (newLabel.trim() && newLabel.trim() !== node.label) {
          renameNode(tree, selected, newLabel.trim());
          saveTree(tree);
          console.log(chalk.yellow(`  Renamed to: "${newLabel.trim()}"`));
        }
        break;
      }
      case 'why_up': {
        const { purpose } = await inquirer.prompt([{
          type: 'input',
          name: 'purpose',
          message: `Why does "${node.label}" matter?`,
        }]);
        if (purpose.trim()) {
          const parent = whyUp(tree, selected, purpose.trim());
          saveTree(tree);
          if (parent.childIds.length > 1) {
            console.log(chalk.cyan.bold(`  Convergence: "${parent.label}" connects ${parent.childIds.length} paths`));
          } else {
            console.log(chalk.green(`  + "${node.label}" serves -> "${parent.label}"`));
          }
        }
        break;
      }
      case 'how_down': {
        const { means } = await inquirer.prompt([{
          type: 'input',
          name: 'means',
          message: `What's another way to achieve "${node.label}"?`,
        }]);
        if (means.trim()) {
          const child = howDown(tree, selected, means.trim());
          saveTree(tree);
          console.log(chalk.magenta(`  + "${node.label}" through -> "${child.label}"`));
        }
        break;
      }
      case 'remove': {
        const { confirm } = await inquirer.prompt([{
          type: 'confirm',
          name: 'confirm',
          message: `Remove "${node.label}"? Children will become roots.`,
          default: false,
        }]);
        if (confirm) {
          removeNode(tree, selected);
          saveTree(tree);
          console.log(chalk.red(`  Removed: "${node.label}"`));
        }
        break;
      }
    }

    // Show updated tree after action
    if (action !== 'back') {
      displayTree(tree);
    }
  }

  displayTree(tree);
  displayTreeStats(tree);
}
