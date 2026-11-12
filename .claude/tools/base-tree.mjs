// Main's version of the code under `.validation/base`: a detached worktree at the card's base, with the repo's installed
// dependencies linked in. app.mjs starts main's app there; verify.mjs re-runs there the tests that fail on the card, so a
// test that fails the same before the card is main's, not the card's.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { cardStart, currentCard, ownBase } from './card.mjs';
import { dropWorktree } from './worktrees.mjs';

export const baseDir = (root) => join(root, '.validation', 'base');
const LINKED = ['node_modules', '.venv', 'venv'];
const git = (root, ...args) => spawnSync('git', args, { cwd: root, encoding: 'utf8' });
const rev = (root, ref) => git(root, 'rev-parse', '--verify', '--quiet', `${ref}^{commit}`).stdout?.trim() ?? '';

// A worktree inside the repo is an embedded repository to `git add -A`: it is excluded locally (`info/exclude`), never
// through the repo's .gitignore.
const excludeBase = (root) => {
  const line = '/.validation/base/';
  const where = git(root, 'rev-parse', '--git-path', 'info/exclude').stdout?.trim();
  if (!where) return;
  const exclude = resolve(root, where);
  const text = existsSync(exclude) ? readFileSync(exclude, 'utf8') : '';
  if (text.split(/\r?\n/).includes(line)) return;
  mkdirSync(dirname(exclude), { recursive: true });
  writeFileSync(exclude, `${text}${text && !text.endsWith('\n') ? '\n' : ''}${line}\n`);
};

export const dropBaseTree = (root) => {
  const dir = baseDir(root);
  let why = null;
  if (existsSync(dir)) {
    const r = dropWorktree(root, dir);
    if (!r.ok) why = r.why;
  }
  spawnSync('git', ['worktree', 'prune'], { cwd: root, stdio: 'ignore' });
  return why;
};

// The card's base commit, or '' when there is no card or its base is HEAD itself (nothing tells main apart from the card).
export const baseSha = (root) => {
  const cardDir = currentCard(root);
  const sha = cardDir ? rev(root, ownBase(root, cardStart(root, cardDir))) : '';
  return sha && sha !== rev(root, 'HEAD') ? sha : '';
};

// `{ dir, sha }` with main's version checked out, reusing the worktree already at that commit; or `{ why }`.
export const baseTree = (root, { fresh = false } = {}) => {
  const sha = baseSha(root);
  if (!sha) return { why: 'no card base before HEAD: main\'s version cannot be told apart from the card\'s' };
  const dir = baseDir(root);
  if (!fresh && existsSync(join(dir, '.git')) && rev(dir, 'HEAD') === sha) return { dir, sha };
  const left = dropBaseTree(root);
  if (left) return { why: `main's worktree stays at ${dir}: ${left}` };
  mkdirSync(join(root, '.validation'), { recursive: true });
  excludeBase(root);
  const added = git(root, 'worktree', 'add', '--detach', dir, sha);
  if (added.status !== 0) return { why: `could not check out main's version ${sha.slice(0, 8)}: ${added.stderr.trim()}` };
  for (const d of LINKED) {
    if (existsSync(join(root, d)) && !existsSync(join(dir, d))) try { symlinkSync(join(root, d), join(dir, d), 'junction'); } catch { /* it runs without them */ }
  }
  return { dir, sha };
};
