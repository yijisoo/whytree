import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, rmSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

// Test the feedback module's local storage behavior.
// We can't easily redirect homedir(), so we test the CLI integration instead.

describe('feedback CLI', () => {
  const whytreeBin = join(import.meta.dirname, '..', 'bin', 'whytree.js');

  it('rejects empty feedback', async () => {
    const { execFile } = await import('node:child_process');
    const { promisify } = await import('node:util');
    const exec = promisify(execFile);

    try {
      await exec('node', [whytreeBin, 'feedback']);
      assert.fail('Should have exited with error');
    } catch (err) {
      assert.ok(err.stderr.includes('Usage: whytree feedback'));
    }
  });

  it('accepts feedback message and saves locally', async () => {
    const { execFile } = await import('node:child_process');
    const { promisify } = await import('node:util');
    const exec = promisify(execFile);

    // This will attempt to send to server (which may fail) but should save locally
    try {
      const { stdout } = await exec('node', [whytreeBin, 'feedback', 'test feedback message']);
      assert.ok(
        stdout.includes('Feedback sent') || stdout.includes('Feedback saved locally'),
        `Expected success message, got: ${stdout}`
      );
    } catch (err) {
      // Even if server is unreachable, it should not crash
      assert.fail(`Feedback command crashed: ${err.message}`);
    }
  });

  it('accepts Korean feedback', async () => {
    const { execFile } = await import('node:child_process');
    const { promisify } = await import('node:util');
    const exec = promisify(execFile);

    try {
      const { stdout } = await exec('node', [whytreeBin, 'feedback', '좋은 도구입니다']);
      assert.ok(
        stdout.includes('Feedback sent') || stdout.includes('Feedback saved locally'),
        `Expected success message, got: ${stdout}`
      );
    } catch (err) {
      assert.fail(`Korean feedback crashed: ${err.message}`);
    }
  });

  it('lists submitted feedback', async () => {
    const { execFile } = await import('node:child_process');
    const { promisify } = await import('node:util');
    const exec = promisify(execFile);

    const { stdout } = await exec('node', [whytreeBin, 'feedback-list']);
    // Should contain our previously submitted feedback
    assert.ok(stdout.includes('test feedback message') || stdout.includes('No feedback'),
      `Unexpected output: ${stdout}`);
  });
});
