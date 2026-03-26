// Main interactive flow for the Why Tree
import inquirer from 'inquirer';
import chalk from 'chalk';
import { createTree, addSeed, whyUp, howDown, getAllNodes, getNode, getRoots, getLeaves, getChildren, getParents } from './tree.js';
import { displayTree, displayWelcome, displayNodeContext, displayConvergenceInsight, displayTreeStats } from './display.js';
import { SEED_QUESTIONS, displaySeedQuestion, whyUpPromptText, howDownPromptText } from './prompts.js';
import { saveTree, listTrees, loadTreeByFile } from './store.js';

export async function main() {
  displayWelcome();

  // Check for existing trees
  const existingTrees = listTrees();
  let tree;

  if (existingTrees.length > 0) {
    const { action } = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: 'Start a new Why Tree', value: 'new' },
        ...existingTrees.map(t => ({
          name: `Continue "${t.name}" (${t.nodeCount} nodes, last updated ${new Date(t.updatedAt).toLocaleDateString()})`,
          value: t.fileName,
        })),
      ],
    }]);

    if (action === 'new') {
      tree = await startNewTree();
    } else {
      tree = loadTreeByFile(action);
      console.log(chalk.green(`\n  Loaded "${tree.name}"\n`));
      displayTree(tree);
      displayTreeStats(tree);
    }
  } else {
    tree = await startNewTree();
  }

  // Main interaction loop
  await interactionLoop(tree);
}

async function startNewTree() {
  const { name } = await inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: 'Give your Why Tree a name:',
    default: 'My Why Tree',
  }]);

  const tree = createTree(name);

  console.log(chalk.dim('\n  Let\'s start by gathering some seeds — concrete activities,'));
  console.log(chalk.dim('  interests, or experiences that matter to you.\n'));
  console.log(chalk.dim('  I\'ll ask you a few questions. Answer with whatever comes'));
  console.log(chalk.dim('  to mind naturally. You can skip any question.\n'));

  // Gather seeds through seed questions
  for (const sq of SEED_QUESTIONS) {
    displaySeedQuestion(sq);

    const { answer } = await inquirer.prompt([{
      type: 'input',
      name: 'answer',
      message: 'Your answer (or press Enter to skip):',
    }]);

    if (answer.trim()) {
      // Could be multiple seeds separated by commas
      const seeds = answer.split(/[,;]/).map(s => s.trim()).filter(Boolean);
      for (const seed of seeds) {
        addSeed(tree, seed);
        console.log(chalk.blue(`  + Added seed: "${seed}"`));
      }
    }

    // After 2 seeds, offer to move on
    const seedCount = tree.seedIds.length;
    if (seedCount >= 2 && sq !== SEED_QUESTIONS[SEED_QUESTIONS.length - 1]) {
      const { continueSeeds } = await inquirer.prompt([{
        type: 'confirm',
        name: 'continueSeeds',
        message: `You have ${seedCount} seed(s). Want to explore more seed questions?`,
        default: true,
      }]);
      if (!continueSeeds) break;
    }
  }

  if (tree.seedIds.length === 0) {
    console.log(chalk.yellow('\n  No seeds yet. Let\'s add at least one to get started.\n'));
    const { seed } = await inquirer.prompt([{
      type: 'input',
      name: 'seed',
      message: 'What\'s one activity or interest that matters to you?',
      validate: v => v.trim() ? true : 'Please enter at least one seed.',
    }]);
    addSeed(tree, seed.trim());
  }

  saveTree(tree);
  console.log(chalk.green('\n  Seeds planted! Let\'s start building your Why Tree.\n'));
  displayTree(tree);

  return tree;
}

async function interactionLoop(tree) {
  let running = true;

  while (running) {
    const allNodes = getAllNodes(tree);
    const roots = getRoots(tree);
    const leaves = getLeaves(tree);

    const choices = [
      { name: chalk.green('^ Why Up') + chalk.dim(' — ask "why?" about a node to find its purpose'), value: 'why_up' },
      { name: chalk.magenta('v How Down') + chalk.dim(' — ask "how?" about a node to find alternative means'), value: 'how_down' },
      new inquirer.Separator(),
      { name: 'Add a new seed', value: 'add_seed' },
      { name: 'View tree', value: 'view' },
      { name: 'View insights', value: 'insights' },
      new inquirer.Separator(),
      { name: 'Save & exit', value: 'exit' },
    ];

    const { action } = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices,
    }]);

    switch (action) {
      case 'why_up':
        await doWhyUp(tree);
        break;
      case 'how_down':
        await doHowDown(tree);
        break;
      case 'add_seed':
        await doAddSeed(tree);
        break;
      case 'view':
        displayTree(tree);
        displayTreeStats(tree);
        break;
      case 'insights':
        displayTree(tree);
        displayConvergenceInsight(tree);
        displayTreeStats(tree);
        break;
      case 'exit':
        running = false;
        break;
    }

    saveTree(tree);
  }

  console.log(chalk.green('\n  Your Why Tree has been saved. Come back anytime to continue exploring.\n'));
  displayTree(tree);
  displayTreeStats(tree);
}

async function selectNode(tree, message, filterFn = null) {
  let nodes = getAllNodes(tree);
  if (filterFn) nodes = nodes.filter(filterFn);

  if (nodes.length === 0) {
    console.log(chalk.yellow('  No nodes available for this action.'));
    return null;
  }

  const choices = nodes.map(n => {
    const parents = getParents(tree, n.id);
    const children = getChildren(tree, n.id);
    let context = '';
    if (parents.length > 0) context += ` (serves: ${parents.map(p => p.label).join(', ')})`;
    if (children.length > 0) context += ` (through: ${children.map(c => c.label).join(', ')})`;

    const color = n.type === 'seed' ? chalk.blue : n.type === 'why' ? chalk.green : chalk.magenta;
    return {
      name: color(n.label) + chalk.dim(context),
      value: n.id,
    };
  });

  choices.push({ name: chalk.dim('(cancel)'), value: null });

  const { nodeId } = await inquirer.prompt([{
    type: 'list',
    name: 'nodeId',
    message,
    choices,
    pageSize: 15,
  }]);

  return nodeId;
}

async function doWhyUp(tree) {
  console.log(chalk.green('\n  "Why Up" — let\'s discover the deeper purpose behind something.\n'));

  const nodeId = await selectNode(tree, 'Which node do you want to ask "why?" about?');
  if (!nodeId) return;

  const node = getNode(tree, nodeId);
  displayNodeContext(tree, nodeId);

  // Iterative why-up loop
  let currentId = nodeId;
  let keepGoing = true;

  while (keepGoing) {
    const current = getNode(tree, currentId);
    console.log(chalk.green(`\n  ${whyUpPromptText(current.label)}\n`));
    console.log(chalk.dim('  (Think deeply — push past the obvious. Why does this really matter to you?)'));

    const { purpose } = await inquirer.prompt([{
      type: 'input',
      name: 'purpose',
      message: 'Because...',
    }]);

    if (!purpose.trim()) break;

    const parentNode = whyUp(tree, currentId, purpose.trim());

    // Check for convergence
    if (parentNode.childIds.length > 1) {
      const siblings = parentNode.childIds.map(id => getNode(tree, id)).filter(Boolean);
      console.log(chalk.cyan.bold(`\n  Convergence discovered!`));
      console.log(chalk.cyan(`  "${parentNode.label}" connects multiple things you care about:`));
      siblings.forEach(s => console.log(chalk.cyan(`    - ${s.label}`)));
      console.log(chalk.dim('  This might be a core value or purpose for you.\n'));
    } else {
      console.log(chalk.green(`  + "${current.label}" serves -> "${parentNode.label}"`));
    }

    displayTree(tree, parentNode.id);

    const { continueUp } = await inquirer.prompt([{
      type: 'list',
      name: 'continueUp',
      message: 'What next?',
      choices: [
        { name: chalk.green('Keep going up') + chalk.dim(` — ask "why?" about "${parentNode.label}"`), value: 'up' },
        { name: chalk.magenta('Switch to How Down') + chalk.dim(` — explore means for "${parentNode.label}"`), value: 'how_down' },
        { name: 'Done with this branch', value: 'done' },
      ],
    }]);

    if (continueUp === 'up') {
      currentId = parentNode.id;
    } else if (continueUp === 'how_down') {
      await doHowDownFrom(tree, parentNode.id);
      keepGoing = false;
    } else {
      keepGoing = false;
    }
  }
}

async function doHowDown(tree) {
  console.log(chalk.magenta('\n  "How Down" — let\'s discover alternative ways to serve a purpose.\n'));

  // For how-down, prefer nodes that are purposes (why nodes or nodes with children)
  const nodeId = await selectNode(tree, 'Which purpose/node do you want to explore means for?');
  if (!nodeId) return;

  await doHowDownFrom(tree, nodeId);
}

async function doHowDownFrom(tree, nodeId) {
  const node = getNode(tree, nodeId);
  displayNodeContext(tree, nodeId);

  let keepGoing = true;
  while (keepGoing) {
    console.log(chalk.magenta(`\n  ${howDownPromptText(node.label)}\n`));
    console.log(chalk.dim('  (Think creatively — what other activities, roles, or paths could serve this purpose?)'));

    const { means } = await inquirer.prompt([{
      type: 'input',
      name: 'means',
      message: 'One way:',
    }]);

    if (!means.trim()) break;

    const childNode = howDown(tree, nodeId, means.trim());
    console.log(chalk.magenta(`  + "${node.label}" can be achieved through -> "${childNode.label}"`));

    displayTree(tree, childNode.id);

    const { next } = await inquirer.prompt([{
      type: 'list',
      name: 'next',
      message: 'What next?',
      choices: [
        { name: chalk.magenta('Add another means') + chalk.dim(` for "${node.label}"`), value: 'more' },
        { name: chalk.green('Why Up') + chalk.dim(` from "${childNode.label}" — explore why this new means matters`), value: 'why_up' },
        { name: 'Done with this branch', value: 'done' },
      ],
    }]);

    if (next === 'more') {
      continue;
    } else if (next === 'why_up') {
      // Recursive why-up from the new means
      let currentId = childNode.id;
      let goingUp = true;
      while (goingUp) {
        const current = getNode(tree, currentId);
        console.log(chalk.green(`\n  ${whyUpPromptText(current.label)}\n`));

        const { purpose } = await inquirer.prompt([{
          type: 'input',
          name: 'purpose',
          message: 'Because...',
        }]);

        if (!purpose.trim()) break;

        const parentNode = whyUp(tree, currentId, purpose.trim());

        if (parentNode.childIds.length > 1) {
          console.log(chalk.cyan.bold(`\n  Convergence discovered!`));
          console.log(chalk.cyan(`  "${parentNode.label}" connects:`));
          parentNode.childIds.map(id => getNode(tree, id)).filter(Boolean)
            .forEach(s => console.log(chalk.cyan(`    - ${s.label}`)));
          console.log('');
        }

        displayTree(tree, parentNode.id);

        const { continueUp } = await inquirer.prompt([{
          type: 'confirm',
          name: 'continueUp',
          message: `Keep asking "why?" about "${parentNode.label}"?`,
          default: false,
        }]);

        if (continueUp) {
          currentId = parentNode.id;
        } else {
          goingUp = false;
        }
      }
      keepGoing = false;
    } else {
      keepGoing = false;
    }
  }
}

async function doAddSeed(tree) {
  const { seed } = await inquirer.prompt([{
    type: 'input',
    name: 'seed',
    message: 'Add a new seed (activity, interest, or experience):',
  }]);

  if (seed.trim()) {
    const node = addSeed(tree, seed.trim());
    console.log(chalk.blue(`  + Added seed: "${node.label}"`));
    displayTree(tree, node.id);
  }
}
