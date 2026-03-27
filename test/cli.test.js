import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join } from 'path';

const exec = promisify(execFile);
const whytreeBin = join(import.meta.dirname, '..', 'bin', 'whytree.js');

async function run(...args) {
  return exec('node', [whytreeBin, ...args]);
}

describe('CLI integration', () => {
  it('shows help with no command', async () => {
    const { stdout } = await run();
    assert.ok(stdout.includes('whytree - Purpose discovery tool'));
    assert.ok(stdout.includes('feedback'));
  });

  it('can init a tree with Korean name', async () => {
    const { stdout } = await run('init', '테스트나무');
    assert.ok(stdout.includes('Created tree: "테스트나무"'));
  });

  it('can add a Korean seed', async () => {
    const { stdout } = await run('seed', '요리하기');
    assert.ok(stdout.includes('요리하기'));
  });

  it('can show the tree', async () => {
    const { stdout } = await run('show');
    assert.ok(stdout.includes('요리하기'));
  });

  it('can list nodes', async () => {
    const { stdout } = await run('nodes');
    assert.ok(stdout.includes('요리하기'));
  });

  it('can init a tree with ASCII name', async () => {
    const { stdout } = await run('init', 'Test Tree');
    assert.ok(stdout.includes('Created tree: "Test Tree"'));
  });

  it('can list trees', async () => {
    const { stdout } = await run('list');
    // Should include at least one of our created trees
    assert.ok(stdout.includes('테스트나무') || stdout.includes('Test Tree'));
  });
});
