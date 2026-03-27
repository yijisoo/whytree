import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, rmSync, existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

// We need to test treeFileName directly, and the store functions with a temp directory.
// Since store.js uses homedir()/.whytree, we'll test treeFileName as an exported unit,
// and do integration tests via the CLI.

import { treeFileName } from '../src/store.js';

describe('treeFileName', () => {
  it('converts ASCII names to slugs', () => {
    assert.equal(treeFileName('My Why Tree'), 'my-why-tree.json');
  });

  it('handles single word', () => {
    assert.equal(treeFileName('purpose'), 'purpose.json');
  });

  it('strips special characters', () => {
    assert.equal(treeFileName('hello!@#world'), 'hello-world.json');
  });

  it('collapses multiple separators', () => {
    assert.equal(treeFileName('a   b   c'), 'a-b-c.json');
  });

  it('trims leading/trailing dashes', () => {
    assert.equal(treeFileName('---hello---'), 'hello.json');
  });

  // Korean support tests
  it('preserves Korean characters', () => {
    const result = treeFileName('나의 왜 나무');
    assert.equal(result, '나의-왜-나무.json');
  });

  it('handles pure Korean name', () => {
    const result = treeFileName('행복');
    assert.equal(result, '행복.json');
  });

  it('handles mixed Korean and English', () => {
    const result = treeFileName('My 나무 Tree');
    assert.equal(result, 'my-나무-tree.json');
  });

  it('produces unique filenames for different Korean names', () => {
    const a = treeFileName('행복');
    const b = treeFileName('성장');
    assert.notEqual(a, b);
  });

  it('does not produce empty filename for Korean input', () => {
    const result = treeFileName('한국어 테스트');
    assert.ok(result.length > '.json'.length, `Expected non-empty slug, got: ${result}`);
  });

  // Other Unicode scripts
  it('preserves Japanese characters', () => {
    const result = treeFileName('目的の木');
    assert.equal(result, '目的の木.json');
  });

  it('preserves accented Latin characters', () => {
    const result = treeFileName('café résumé');
    assert.equal(result, 'café-résumé.json');
  });

  it('preserves Cyrillic characters', () => {
    const result = treeFileName('дерево');
    assert.equal(result, 'дерево.json');
  });
});
