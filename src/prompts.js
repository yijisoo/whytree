// Seed questions and interactive prompts for the Why Tree
import chalk from 'chalk';

export const SEED_QUESTIONS = [
  {
    name: 'shower',
    title: 'The Shower Question',
    question: 'What do you find yourself thinking about when your mind is free — in the shower, on a walk, before sleep?',
    description: 'This captures involuntary attention — what your mind naturally gravitates toward.',
  },
  {
    name: 'flow',
    title: 'The Flow Question',
    question: 'When does time fly for you? What activities make you completely lose track of time?',
    description: 'Flow signals alignment between an activity and your deeper purposes.',
  },
  {
    name: 'persistence',
    title: 'The Persistence Question',
    question: 'What do you keep coming back to — ideas, projects, hobbies — even when no one asks you to?',
    description: 'Intrinsic motivation, not external rewards, points to authentic purpose.',
  },
  {
    name: 'constraint_free',
    title: 'The Constraint-Free Question',
    question: 'If you knew you could not fail — and had no constraints on time, money, or approval — what would you pursue?',
    description: 'This bypasses fear and practicality to surface hidden aspirations.',
  },
  {
    name: 'deathbed',
    title: 'The Deathbed Question',
    question: 'What would you most deeply regret never attempting?',
    description: 'Regret is a powerful filter for separating what genuinely matters from what merely seems appealing.',
  },
];

export function displaySeedQuestion(sq) {
  console.log('');
  console.log(chalk.bold.yellow(`  ${sq.title}`));
  console.log(chalk.dim(`  ${sq.description}`));
  console.log('');
  console.log(chalk.white(`  ${sq.question}`));
  console.log('');
}

export function whyUpPromptText(nodeLabel) {
  return `Why does "${nodeLabel}" matter to you? What deeper purpose does it serve?`;
}

export function howDownPromptText(nodeLabel) {
  return `What are other ways to achieve "${nodeLabel}"? What else could serve this purpose?`;
}
