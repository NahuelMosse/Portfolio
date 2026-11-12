#!/usr/bin/env node
// affected.mjs [--tests <regex>] <touched file…> — the tests a change can break, one path per line.
// A test is affected when it imports a touched file, through any chain of relative imports (`from`, `import()`,
// `require`, a folder's index, a `.js` specifier that is a `.ts` file; Python's `from`/`import`; Dart's `package:` and
// relative `import`/`export`/`part`), or when its text names a touched file by its
// path or its file name: a spec that reads `openapi.yaml` is not an importer of it. A touched test is listed.
// What counts as a test file is `IS_TEST` of card.mjs (`*.test.*`, `*.spec.*`, `test_*.py`, `*_test.go`, …); `--tests`
// gives a stack its own pattern. The list is what a bounded run of a group takes as its tests:
//   node --test $(node .claude/tools/affected.mjs src/a.mjs docs/openapi.yaml)
// Exits 0 (an empty list says why on stderr), 2 without files.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { IS_TEST } from './card.mjs';

const MODULE = /\.(?:[cm]?[jt]sx?)$/;
const EXTENSIONS = ['.mjs', '.js', '.cjs', '.ts', '.tsx', '.jsx', '.mts', '.cts'];
const SPECIFIER = /(?:\bfrom\s*|\bimport\s*\(\s*|\brequire\s*\(\s*|\bimport\s+)(["'])(\.{1,2}\/[^"'\n]*|\.{1,2})\1/g;
const ANY_SPECIFIER = /(?:\bfrom\s*|\bimport\s*\(\s*|\brequire\s*\(\s*|\bimport\s+)(["'])([^"'\n]+)\1/g;
const PY_IMPORT = /^[ \t]*(?:from[ \t]+([\w.]+)[ \t]+import[ \t]+([\w, \t]+)|import[ \t]+([\w.]+))/gm;
const DART_IMPORT = /^[ \t]*(?:import|export|part)[ \t]+(["'])([^"'\n]+)\1/gm;
const MAX_BYTES = 2_000_000;

const norm = (p) => p.replace(/\\/g, '/').replace(/^\.\//, '');
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const affected = (root, touched, isTest = IS_TEST) => {
  const listing = spawnSync('git', ['ls-files', '-co', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 28 });
  const repo = (listing.status === 0 ? listing.stdout.split('\0') : []).filter((f) => f && !/(^|\/)node_modules\//.test(f));
  const inRepo = new Set(repo);
  const text = (f) => {
    try { return statSync(join(root, f)).size <= MAX_BYTES ? readFileSync(join(root, f), 'utf8') : ''; } catch { return ''; }
  };
  // The file a relative specifier names, as the repo has it: the exact path, with an extension, a `.js` that is a
  // `.ts`, or the index of a folder.
  const resolveSpecifier = (from, spec) => {
    const base = posix.normalize(posix.join(posix.dirname(from), spec));
    const bare = base.replace(/\.[cm]?jsx?$/, '');
    for (const c of [base, ...EXTENSIONS.map((e) => base + e), ...EXTENSIONS.map((e) => bare + e), ...EXTENSIONS.map((e) => `${base}/index${e}`)])
      if (inRepo.has(c) && MODULE.test(c)) return c;
    return null;
  };
  // Aliases: package.json `imports` (`#lib/*`) and tsconfig/jsconfig `paths` (relative to `baseUrl`).
  const json = (f) => {
    try { return JSON.parse(text(f).replace(/\/\*[^]*?\*\//g, '').replace(/(?<![:\w"'])\/\/.*$/gm, '').replace(/,(\s*[}\]])/g, '$1')); } catch { return null; }
  };
  const aliases = [];
  const addAlias = (key, targets, dir) => {
    const [prefix, suffix = ''] = key.split('*');
    for (const t of [targets].flat().filter((x) => typeof x === 'string')) {
      const [tp, ts = ''] = t.split('*');
      aliases.push({ prefix, suffix, wild: key.includes('*'), target: posix.join(dir, tp), tsuffix: ts });
    }
  };
  for (const f of repo.filter((x) => /(^|\/)package\.json$/.test(x))) {
    for (const [k, v] of Object.entries(json(f)?.imports ?? {})) addAlias(k, v !== null && typeof v === 'object' && !Array.isArray(v) ? Object.values(v).flat() : v, posix.dirname(f));
  }
  for (const f of repo.filter((x) => /(^|\/)[tj]sconfig\.json$/.test(x))) {
    const o = json(f)?.compilerOptions;
    const dir = posix.join(posix.dirname(f), o?.baseUrl ?? '.');
    for (const [k, v] of Object.entries(o?.paths ?? {})) addAlias(k, v, dir);
  }
  const resolveAlias = (spec) => {
    for (const a of aliases) {
      if (!spec.startsWith(a.prefix) || !spec.endsWith(a.suffix) || spec.length < a.prefix.length + a.suffix.length) continue;
      if (!a.wild && spec !== a.prefix) continue;
      const mid = a.wild ? spec.slice(a.prefix.length, spec.length - a.suffix.length) : '';
      const found = resolveSpecifier('x', posix.join(a.target, mid + a.tsuffix));
      if (found) return found;
    }
    return null;
  };
  // Python: `from pkg.mod import x` is pkg/mod.py or pkg/mod/__init__.py, from the repo root or from `src/`.
  const resolvePython = (dotted) => {
    const p = dotted.replace(/\./g, '/');
    return ['', 'src/'].flatMap((b) => [`${b}${p}.py`, `${b}${p}/__init__.py`]).find((c) => inRepo.has(c)) ?? null;
  };
  // Dart: `package:<name>/<path>` is `lib/<path>` beside the pubspec.yaml that names the package; any other specifier is
  // relative to the importing file. `part` and `export` link like an import.
  const packages = new Map(repo.filter((x) => /(^|\/)pubspec\.yaml$/.test(x)).map((f) => [text(f).match(/^name:\s*([\w]+)/m)?.[1], posix.dirname(f)]).filter(([n]) => n));
  const resolveDart = (from, spec) => {
    const pkg = spec.match(/^package:(\w+)\/(.+)$/);
    const target = pkg ? (packages.has(pkg[1]) ? posix.normalize(posix.join(packages.get(pkg[1]), 'lib', pkg[2])) : null)
      : /^[a-z]+:/.test(spec) ? null : posix.normalize(posix.join(posix.dirname(from), spec));
    return target && inRepo.has(target.replace(/^\.\//, '')) ? target.replace(/^\.\//, '') : null;
  };
  // Who imports whom: importedBy[file] = the files that import it.
  const importedBy = new Map();
  const sources = new Map();
  for (const f of repo.filter((x) => MODULE.test(x) || /\.(py|dart)$/.test(x) || isTest.test(x))) {
    const body = text(f);
    sources.set(f, body);
    const link = (target) => { if (target && target !== f) importedBy.set(target, [...(importedBy.get(target) ?? []), f]); };
    if (/\.dart$/.test(f)) {
      for (const m of body.matchAll(DART_IMPORT)) link(resolveDart(f, m[2]));
      continue;
    }
    if (/\.py$/.test(f)) {
      for (const m of body.matchAll(PY_IMPORT)) {
        const mod = m[1] ?? m[3];
        link(resolvePython(mod));
        for (const name of (m[2] ?? '').split(',').map((n) => n.trim().split(/\s/)[0]).filter(Boolean)) link(resolvePython(`${mod}.${name}`));
      }
      continue;
    }
    if (!MODULE.test(f)) continue;
    for (const m of body.matchAll(SPECIFIER)) link(resolveSpecifier(f, m[2]));
    for (const m of body.matchAll(ANY_SPECIFIER)) if (!m[2].startsWith('.')) link(resolveAlias(m[2]));
  }
  const touchedFiles = touched.map(norm);
  const reach = new Set(touchedFiles);
  const queue = [...touchedFiles];
  for (let f = queue.shift(); f !== undefined; f = queue.shift())
    for (const parent of importedBy.get(f) ?? []) if (!reach.has(parent)) { reach.add(parent); queue.push(parent); }
  const names = touchedFiles.map((f) => ({ path: f, name: posix.basename(f) })).filter((n) => n.name);
  const namesIt = (body) => names.some((n) => new RegExp(`(?<![\\w.-])${escapeRegex(n.name)}(?![\\w])`).test(body.replace(/\\/g, '/')) ||
    body.replace(/\\/g, '/').includes(n.path));
  return repo.filter((f) => isTest.test(f) && (reach.has(f) || namesIt(sources.get(f) ?? text(f)))).sort();
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  let isTest = IS_TEST;
  const at = args.indexOf('--tests');
  if (at >= 0) { isTest = new RegExp(args[at + 1] ?? '$^'); args.splice(at, 2); }
  if (!args.length) {
    console.error('affected.mjs: name the files that were touched: node .claude/tools/affected.mjs <file…>');
    process.exit(2);
  }
  const found = affected(process.cwd(), args, isTest);
  if (!found.length) console.error(`affected.mjs: no test imports or names ${args.join(', ')}`);
  for (const f of found) console.log(f);
}
