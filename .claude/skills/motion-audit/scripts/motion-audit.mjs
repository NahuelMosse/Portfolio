#!/usr/bin/env node
// motion-audit.mjs <url|file> [options]
//
// Audits the motion of a running page in a real browser — what actually moves, frame by frame, not
// what the CSS declares. For every interactive element (or only those under --only) it hovers, presses
// and focuses, and records the trajectory of the element and its children on every animation frame.
// Exits 0 when nothing fails, 1 with one line per finding, 2 when it could not run.
//
//   --only <selector>     audit only elements matching these selectors (repeatable)
//   --max <n>             audit at most n interactive elements (default 40)
//   --cpu <rate>          throttle the CPU (4 ≈ a mid-range phone) for the long-frame checks
//   --click <selector>    record everything that moves for 1.5 s after a real click on it
//   --interrupt           with --click: click again halfway and check nothing jumps
//   --frames <selector>   write a contact sheet (one frame every 40 ms) of its hover and press
//   --no-entrances        do not expect sections below the fold to animate in
//   --out <dir>           where report.json and contact sheets go (default .motion-audit)
//   --strict              warnings fail too
//   --json                print the findings as JSON
//
// Playwright is a peer dependency: resolved from the cwd, then PLAYWRIGHT_ROOT, then this folder.
// Pure helpers (`analyzeSeries`, `continuity`, `easingKind`, `judgeElement`) are exported for tests.
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const FRAME = 1000 / 60;
const LONG_FRAME_MS = 50;
const VISIBLE_PROPS = ['transform', 'translate', 'scale', 'rotate', 'opacity', 'background-color', 'background-image', 'color', 'box-shadow', 'border-color', 'outline-style', 'outline-width', 'outline-color', 'text-decoration-color', 'filter', 'width', 'height', 'padding-top', 'padding-left', 'margin-top', 'margin-left', 'top', 'left', 'letter-spacing', 'font-weight'];
const LAYOUT_PROPS = /^(width|height|top|left|right|bottom|inset|margin|padding|max-height|max-width|min-height|min-width|font-size|font-weight|letter-spacing|border-width|line-height|gap)/;
const INTERACTIVE = 'a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=tab], [role=switch], [role=menuitem], [role=checkbox], [role=link], [tabindex]:not([tabindex="-1"])';
const BANDS = { hover: [80, 300], press: [50, 200], focus: [0, 250] };

const round = (x, d = 1) => Math.round(x * 10 ** d) / 10 ** d;
const median = (a) => {
  const s = [...a].sort((x, y) => x - y);
  if (!s.length) return 0;
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};

// ---------- trajectory analysis (pure) ----------

const COLS = ['left', 'top', 'width', 'height', 'opacity', 'tx', 'ty', 'sx', 'sy', 'rot', 'ow', 'oh'];
const PROP_OF = { left: 'left', top: 'top', width: 'width', height: 'height', opacity: 'opacity', tx: 'translateX', ty: 'translateY', sx: 'scaleX', sy: 'scaleY', rot: 'rotate', ow: 'layoutWidth', oh: 'layoutHeight' };
const EPS = { left: 1, top: 1, width: 1, height: 1, translateX: 1, translateY: 1, scaleX: 0.01, scaleY: 0.01, rotate: 1, opacity: 0.02, layoutWidth: 1, layoutHeight: 1 };
const SHAPES = [
  ['linear', (u) => u],
  ['ease-out', (u) => 1 - (1 - u) ** 2], ['ease-out', (u) => 1 - (1 - u) ** 3], ['ease-out', (u) => 1 - (1 - u) ** 5],
  ['ease-in', (u) => u ** 2], ['ease-in', (u) => u ** 3],
  ['ease-in-out', (u) => (u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) ** 2)], ['ease-in-out', (u) => (u < 0.5 ? 4 * u ** 3 : 1 - 4 * (1 - u) ** 3)],
];

// One property over time (`t` ms, `v` values): duration, overshoot, curve shape and jumps. A jump is a
// frame whose velocity is over 3× the median, over 2× both neighbours and at least a tenth of the amplitude.
export const analyzeSeries = (t, v, eps) => {
  const n = v.length;
  if (n < 4) return null;
  const first = v[0];
  const final = v[n - 1];
  const range = Math.max(...v) - Math.min(...v);
  if (range < eps) return null;
  const returns = Math.abs(final - first) < eps;
  const amp = returns ? range : Math.abs(final - first);
  const dir = returns ? 1 : Math.sign(final - first);
  const tol = amp * 0.005;
  const start = v.findIndex((x) => Math.abs(x - first) > tol);
  if (start < 1) return null;
  const tail = v.slice(-4);
  const settled = tail.every((x, i) => i === 0 || Math.abs(x - tail[i - 1]) <= tol);
  let settle = n - 1;
  if (settled) while (settle > start && Math.abs(v[settle - 1] - final) <= tol) settle--;
  const t0 = t[start - 1];
  let over = 0;
  if (!returns && settled) for (let j = start; j < n; j++) over = Math.max(over, (v[j] - final) * dir);
  const overshootPct = round((over / amp) * 100);
  let shape;
  if (returns) shape = 'round-trip';
  else if (settle - start < 2) shape = 'step';
  else if (overshootPct > 3) shape = 'spring';
  else {
    const best = new Map();
    for (const [name, f] of SHAPES) {
      let err = 0;
      for (let j = start - 1; j <= settle; j++) err += ((v[j] - v[start - 1]) / (final - v[start - 1]) - f((t[j] - t0) / (t[settle] - t0))) ** 2;
      best.set(name, Math.min(best.get(name) ?? Infinity, err));
    }
    shape = [...best.entries()].sort((a, b) => a[1] - b[1])[0][0];
  }
  const vel = [];
  for (let k = start; k <= settle; k++) vel.push((Math.abs(v[k] - v[k - 1]) * FRAME) / Math.max(1, t[k] - t[k - 1]));
  const med = median(vel.filter((d) => d > tol / 4));
  const jumps = [];
  if (settle - start >= 4) {
    const easesOut = vel.every((d, k) => k === 0 || d <= vel[k - 1] * 1.05);
    vel.forEach((d, k) => {
      if (k === 0 && easesOut) return;
      if (d > 3 * med && d > 2 * Math.max(vel[k - 1] ?? 0, vel[k + 1] ?? 0) && d >= 0.1 * amp) jumps.push({ atMs: round(t[start + k] - t0, 0), size: round(d, 2) });
    });
  }
  return { from: round(v[start - 1], 2), to: round(final, 2), startT: t0, durationMs: round(t[settle] - t0, 0), overshootPct, shape, settled, jumps };
};

// Angles read from a matrix wrap at ±180°: unwrap so a spinning element is a smooth series.
const unwrap = (v) => v.reduce((out, x, i) => {
  if (!i) return [x];
  let y = x;
  while (y - out[i - 1] > 180) y -= 360;
  while (y - out[i - 1] < -180) y += 360;
  return [...out, y];
}, []);

const analyzeElement = (el) => {
  const moves = [];
  for (const c of COLS) {
    const r = analyzeSeries(el.t, c === 'rot' ? unwrap(el[c]) : el[c], EPS[PROP_OF[c]]);
    if (r) moves.push({ prop: PROP_OF[c], ...r });
  }
  return moves.length ? { label: el.label, root: el.root, moves } : null;
};
const analyzeRecording = (rec) => (rec?.elems ?? []).map(analyzeElement).filter(Boolean);

// After an interruption at `markT`, the motion must continue from where it was. Reversing an ease-out
// legitimately changes speed, so a jump is a position step right after the mark that is over twice the
// largest step before it and at least a fifth of the range: the value snapped instead of travelling.
export const continuity = (rec, markT) => {
  const jumps = [];
  for (const el of rec.elems) {
    for (const c of COLS) {
      const eps = EPS[PROP_OF[c]];
      const { t } = el;
      const v = c === 'rot' ? unwrap(el[c]) : el[c];
      const i = t.findIndex((x) => x >= markT);
      if (i < 4 || i >= v.length - 1) continue;
      const range = Math.max(...v) - Math.min(...v);
      if (range < eps) continue;
      const vel = (k) => (Math.abs(v[k] - v[k - 1]) * FRAME) / Math.max(1, t[k] - t[k - 1]);
      let before = 0;
      for (let k = 1; k < i - 1; k++) before = Math.max(before, vel(k));
      const after = Math.max(vel(i - 1), vel(i), vel(i + 1));
      if (after > Math.max(2 * before, 2 * eps) && after >= 0.2 * range) jumps.push({ label: el.label, prop: PROP_OF[c], size: round(after, 2) });
    }
  }
  return jumps;
};

// A control that toggles something was clicked again part-way through its motion (mark `markT`). The
// element must carry on from where it was. A reversal legitimately changes speed and direction, so the
// signal is a skip: in the frames right after the mark a box edge, size, translation, scale or opacity
// moves further in the direction it was already travelling, by at least 10 % of its range and three
// times its previous step. That is a restarted animation landing on its own start, not a reversal.
const JUMP_MIN = { left: 24, top: 24, width: 24, height: 24, tx: 24, ty: 24, opacity: 0.4, sx: 0.3, sy: 0.3 };
export const interruptionJumps = (rec, markT) => {
  const found = [];
  for (const el of rec.elems) {
    for (const [c, min] of Object.entries(JUMP_MIN)) {
      const { t } = el;
      const v = el[c];
      const i = t.findIndex((x) => x >= markT);
      if (i < 3 || i >= v.length - 1) continue;
      const range = Math.max(...v) - Math.min(...v);
      let worst = null;
      for (let k = i - 1; k <= Math.min(v.length - 1, i + 2); k++) {
        const d = Math.abs(v[k] - v[k - 1]);
        const trend = v[k - 1] - v[k - 3];
        const onward = Math.sign(v[k] - v[k - 1]) === Math.sign(trend);
        const last = Math.abs(v[k - 1] - v[k - 2]);
        if (onward && d >= min && d >= 0.1 * range && d >= 3 * Math.max(last, min / 4) && (!worst || d > worst.delta)) worst = { delta: d, from: v[k - 1], to: v[k], atMs: t[k] - markT };
      }
      if (worst) found.push({ label: el.label, prop: PROP_OF[c], delta: round(worst.delta, 2), from: round(worst.from, 2), to: round(worst.to, 2), atMs: round(worst.atMs, 0) });
    }
  }
  return found.sort((a, b) => b.delta - a.delta);
};

// 'ease-in' when the curve starts slower than it ends; 'linear'; otherwise 'ok'.
export const easingKind = (e) => {
  if (e === 'linear' || /^linear\(\s*0(?:\s+0%)?\s*,\s*1(?:\s+100%)?\s*\)$/.test(e)) return 'linear';
  if (e === 'ease-in') return 'ease-in';
  const m = e.match(/^cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)$/);
  if (!m) return 'ok';
  const [x1, y1, x2, y2] = m.slice(1).map(Number);
  if (x1 === y1 && x2 === y2) return 'linear';
  const startSlope = x1 > 0 ? y1 / x1 : Infinity;
  const endSlope = x2 < 1 ? (1 - y2) / (1 - x2) : Infinity;
  return startSlope < 0.5 && endSlope > 1 ? 'ease-in' : 'ok';
};

// The declared duration and easing of the transition that animates `prop`, or null if none does.
const transitionOf = (tr, prop) => {
  const longhand = (p) => p === prop || prop.startsWith(`${p}-`) || p === 'all';
  const i = tr.properties.findIndex(longhand);
  if (i < 0) return null;
  return { duration: tr.durations[i % tr.durations.length], easing: tr.easings[i % tr.easings.length] };
};

// Findings for one audited element: [{ level, kind, element, detail }].
export const judgeElement = (el) => {
  const out = [];
  const seen = new Set();
  // One finding per kind and property: the same declared transition is not reported once per gesture.
  const add = (level, kind, detail, key = detail) => {
    if (seen.has(`${kind}|${key}`)) return;
    seen.add(`${kind}|${key}`);
    out.push({ level, kind, element: el.label, detail });
  };
  const tr = el.transition;
  for (const [moment, d] of Object.entries(el.moments)) {
    if (!d) continue;
    const responds = d.changed.length > 0 || d.pixels;
    if (!responds) {
      if (moment === 'focus') add('error', 'no-focus-feedback', 'keyboard focus shows nothing');
      else if (!(moment === 'hover' && el.selected)) add('error', 'no-feedback', `${moment}: nothing visible changes`);
      continue;
    }
    const visual = d.changed.filter((p) => !/^outline/.test(p));
    const animated = visual.filter((p) => transitionOf(tr, p)?.duration > 0);
    if (moment !== 'focus' && visual.length && !animated.length && !d.motion.some((m) => m.moves.some((x) => x.durationMs > 2 * FRAME))) add('warning', 'snaps', `${moment}: ${visual.join(', ')} change with no transition`);
    for (const p of animated) {
      const { duration, easing } = transitionOf(tr, p);
      const [lo, hi] = BANDS[moment];
      if (duration < lo || duration > hi) add(duration > 2 * hi ? 'error' : 'warning', 'duration', `${moment}: ${p} ${duration} ms, outside ${lo}–${hi} ms`);
      const k = easingKind(easing);
      if (k === 'ease-in') add('error', 'ease-in', `${moment}: ${p} eases in (${easing}) — the response starts late`, p);
      if (k === 'linear' && /transform|scale|translate|opacity/.test(p)) add('warning', 'linear', `${moment}: ${p} moves linearly`, p);
    }
    const layout = d.changed.filter((p) => LAYOUT_PROPS.test(p));
    if (layout.length) add('error', 'layout-animated', `${moment}: changes layout (${layout.join(', ')}) — moves neighbours and costs layout every frame`);
    for (const e of d.motion) for (const m of e.moves) {
      if (m.shape === 'ease-in' && m.durationMs > 60) add('error', 'ease-in', `${moment}: ${e.label} ${m.prop} measured ease-in over ${m.durationMs} ms`, `${e.label} ${m.prop}`);
      for (const j of m.jumps) add('error', 'jump', `${moment}: ${e.label} ${m.prop} jumps ${j.size} at ${j.atMs} ms`);
    }
  }
  if (tr.properties.includes('all') && tr.durations.some((x) => x > 0)) add('warning', 'transition-all', '`transition: all` animates whatever changes, layout included');
  if (el.interrupt?.length) add('error', 'interrupt-jump', `hover left mid-way: ${el.interrupt.map((j) => `${j.label} ${j.prop}`).join(', ')} jump instead of reversing`);
  if (el.reduced?.moves) add('error', 'reduced-motion-moves', `with prefers-reduced-motion it still moves (${el.reduced.moves})`);
  if (el.reduced?.residue) add('error', 'reduced-motion-residue', `with prefers-reduced-motion a transform stays after release (${el.reduced.residue})`);
  return out;
};

// Same kind of control, same moment, different durations: the product has no single motion grammar.
export const inconsistencies = (elements) => {
  const groups = new Map();
  for (const el of elements) for (const [moment, d] of Object.entries(el.moments)) {
    if (!d || moment === 'focus') continue;
    const durs = d.changed.map((p) => transitionOf(el.transition, p)?.duration).filter((x) => x > 0);
    if (!durs.length) continue;
    const key = `${el.kind} ${moment}`;
    if (!groups.has(key)) groups.set(key, new Map());
    groups.get(key).set(Math.max(...durs), [...(groups.get(key).get(Math.max(...durs)) ?? []), el.label]);
  }
  const out = [];
  for (const [key, byDur] of groups) {
    const ds = [...byDur.keys()].sort((a, b) => a - b);
    if (ds.length < 2 || ds.at(-1) / ds[0] < 1.5 || ds.at(-1) - ds[0] < 60) continue;
    out.push({ level: 'warning', kind: 'inconsistent-duration', element: key, detail: ds.map((x) => `${x} ms (${byDur.get(x).slice(0, 2).join(', ')}${byDur.get(x).length > 2 ? ', …' : ''})`).join(' vs ') });
  }
  return out;
};

// ---------- in-page code ----------

// Installed before any script: samples rect, opacity and transform per animation frame, and collects
// long animation frames (Long Animation Frames API) with their start time.
const tracer = () => {
  if (window.__mt || window !== window.top) return;
  const COLS = ['left', 'top', 'width', 'height', 'opacity', 'tx', 'ty', 'sx', 'sy', 'rot', 'ow', 'oh'];
  const SKIP = new Set(['SCRIPT', 'STYLE', 'LINK', 'META', 'NOSCRIPT', 'BR', 'TEMPLATE']);
  const ids = new WeakMap();
  let next = 1;
  const idOf = (n) => { let i = ids.get(n); if (!i) { i = next++; ids.set(n, i); } return i; };
  const labelOf = (n) => `${n.tagName.toLowerCase()}${n.id ? `#${n.id}` : ''}${[...n.classList].slice(0, 2).map((c) => `.${c}`).join('')}`;
  const pose = (n) => {
    const r = n.getBoundingClientRect();
    const cs = getComputedStyle(n);
    let tx = 0, ty = 0, sx = 1, sy = 1, rot = 0;
    if (cs.transform !== 'none') { try { const m = new DOMMatrixReadOnly(cs.transform); tx = m.m41; ty = m.m42; sx = Math.hypot(m.a, m.b); sy = Math.hypot(m.c, m.d); rot = (Math.atan2(m.b, m.a) * 180) / Math.PI; } catch {} }
    if (cs.translate && cs.translate !== 'none') { const p = cs.translate.split(' ').map(parseFloat); tx += p[0] || 0; ty += p[1] || 0; }
    if (cs.scale && cs.scale !== 'none') { const p = cs.scale.split(' ').map(parseFloat); sx *= p[0]; sy *= p[1] ?? p[0]; }
    if (cs.rotate && cs.rotate !== 'none') rot += parseFloat(cs.rotate) || 0;
    return [r.left + scrollX, r.top + scrollY, r.width, r.height, parseFloat(cs.opacity), tx, ty, sx, sy, rot, n.offsetWidth ?? r.width, n.offsetHeight ?? r.height];
  };
  const loaf = [];
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) loaf.push([e.startTime, e.duration]); }).observe({ type: 'long-animation-frame', buffered: true }); } catch { loaf.supported = false; }
  const recs = new Map();
  let running = false;
  const frame = (ts) => {
    for (const rec of recs.values()) {
      if (!rec.active) continue;
      for (const n of rec.list) {
        const id = idOf(n);
        let e = rec.elems.get(id);
        if (!e) { e = { label: labelOf(n), root: n === rec.root, t: [] }; for (const c of COLS) e[c] = []; rec.elems.set(id, e); }
        const p = pose(n);
        e.t.push(ts);
        COLS.forEach((c, i) => e[c].push(p[i]));
      }
    }
    if ([...recs.values()].some((r) => r.active)) requestAnimationFrame(frame); else running = false;
  };
  document.addEventListener('click', (e) => { for (const r of recs.values()) if (r.active) r.marks.push(e.timeStamp); }, true);
  window.__mt = {
    loaf,
    now: () => performance.now(),
    begin(name, root, all) {
      const list = root ? [root, ...root.querySelectorAll('*')].filter((n) => !SKIP.has(n.tagName)).slice(0, 60)
        : [...document.body.querySelectorAll('*')].filter((n) => { if (SKIP.has(n.tagName)) return false; if (all) return true; const r = n.getBoundingClientRect(); return r.width >= 4 && r.height >= 4 && r.bottom > -innerHeight && r.top < 2 * innerHeight; }).slice(0, all ? 800 : 400);
      recs.set(name, { active: true, root, list, elems: new Map(), marks: [] });
      if (!running) { running = true; requestAnimationFrame(frame); }
    },
    mark(name) { recs.get(name)?.marks.push(performance.now()); },
    end(name) {
      const rec = recs.get(name);
      if (!rec) return null;
      rec.active = false;
      recs.delete(name);
      return { marks: rec.marks, elems: [...rec.elems.values()] };
    },
  };
};

// :hover rules that move things (transform, translate, scale, rotate) outside @media (hover: hover):
// on touch screens they stick after a tap.
const ungatedHoverMotion = () => {
  const found = [];
  let unreadable = 0;
  const walk = (rules, gated) => {
    for (const r of rules) {
      if (r.media && r.cssRules) walk(r.cssRules, gated || /hover:\s*hover/.test(r.media.mediaText));
      else if (r.cssRules && !r.selectorText) walk(r.cssRules, gated);
      if (r.selectorText && /:hover/.test(r.selectorText) && !gated) {
        const s = r.style;
        if ((s.transform && s.transform !== 'none') || s.translate || s.scale || s.rotate) found.push(r.selectorText);
      }
    }
  };
  for (const sheet of document.styleSheets) { try { walk(sheet.cssRules, false); } catch { unreadable++; } }
  return { found: [...new Set(found)].slice(0, 10), unreadable };
};

const hasReducedMotionRule = () => {
  const walk = (rules) => [...rules].some((r) => (r.media && /prefers-reduced-motion/.test(r.media.mediaText)) || (r.cssRules && walk(r.cssRules)));
  let unreadable = 0;
  for (const sheet of document.styleSheets) { try { if (walk(sheet.cssRules)) return { found: true, unreadable }; } catch { unreadable++; } }
  return { found: false, unreadable };
};

// ---------- browser run ----------

const here = dirname(fileURLToPath(import.meta.url));
const loadPlaywright = () => {
  for (const root of [process.cwd(), process.env.PLAYWRIGHT_ROOT, here].filter(Boolean)) {
    const req = createRequire(join(root, 'package.json'));
    for (const name of ['playwright', '@playwright/test']) { try { return req(name); } catch {} }
  }
  return null;
};

const snapshot = (h, props) => h.evaluate((n, props) => { const cs = getComputedStyle(n); return Object.fromEntries(props.map((p) => [p, cs.getPropertyValue(p)])); }, props);
const diff = (a, b) => Object.keys(a).filter((k) => a[k] !== b[k]);
const shot = async (page, box) => (await page.screenshot({ clip: { x: Math.max(0, box.x - 6), y: Math.max(0, box.y - 6), width: box.width + 12, height: box.height + 12 } })).toString('base64');
const ms = (list) => String(list).split(',').map((s) => s.trim()).map((s) => (s.endsWith('ms') ? parseFloat(s) : parseFloat(s) * 1000));

const traced = async (page, root, action) => {
  await root.evaluate((n) => window.__mt.begin('m', n));
  const from = await page.evaluate(() => window.__mt.now());
  await action();
  const rec = await page.evaluate(() => window.__mt.end('m'));
  const to = await page.evaluate(() => window.__mt.now());
  return { rec, motion: analyzeRecording(rec), long: (await page.evaluate(() => window.__mt.loaf)).filter(([s, d]) => s + d >= from && s <= to && d > LONG_FRAME_MS).map(([, d]) => Math.round(d)) };
};

const cssPath = (h) => h.evaluate((n) => {
  const parts = [];
  for (let e = n; e && e.nodeType === 1 && e !== document.documentElement; e = e.parentElement) {
    if (e.id) { parts.unshift(`#${CSS.escape(e.id)}`); break; }
    const same = [...(e.parentElement?.children ?? [])].filter((c) => c.tagName === e.tagName);
    parts.unshift(`${e.tagName.toLowerCase()}${same.length > 1 ? `:nth-of-type(${same.indexOf(e) + 1})` : ''}`);
  }
  return parts.join(' > ');
});

const auditElement = async (page, original, label) => {
  const proxy = (await original.evaluateHandle((n) => (n.matches('input') && getComputedStyle(n).opacity === '0' ? n.closest('label') ?? n : n))).asElement() ?? original;
  const box = await proxy.boundingBox();
  if (!box || box.width < 2 || box.height < 2) return null;
  const info = await proxy.evaluate((n) => {
    const cs = getComputedStyle(n);
    const role = n.getAttribute('role');
    let kind = role ?? n.tagName.toLowerCase();
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(n.tagName) && cs.opacity !== '0') kind = 'input';
    else if ((!role && !/^(A|BUTTON|SUMMARY|LABEL)$/.test(n.tagName)) || /^(region|group|table|figure|img|document|tabpanel|list|article)$/.test(role ?? '')) kind = 'focus-only';
    return { kind, properties: cs.transitionProperty.split(',').map((s) => s.trim()), durations: cs.transitionDuration, easings: cs.transitionTimingFunction.split(/,(?![^(]*\))/).map((s) => s.trim()) };
  });
  const selected = await original.evaluate((n) => n.getAttribute('aria-selected') === 'true' || n.getAttribute('aria-checked') === 'true' || n.getAttribute('aria-current') === 'page');
  const transition = { properties: info.properties, durations: ms(info.durations), easings: info.easings };
  const el = { label, kind: info.kind, selected, transition, moments: {}, long: [] };
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  const moment = (name, before, beforePx, after, afterPx, run) => {
    el.moments[name] = { changed: diff(before, after), pixels: afterPx !== beforePx, motion: run.motion };
    el.long.push(...run.long.map((d) => `${name} ${d} ms`));
  };
  if (info.kind !== 'focus-only') {
    const rest = await snapshot(proxy, VISIBLE_PROPS);
    const restPx = await shot(page, box);
    const hover = await traced(page, proxy, async () => { await page.mouse.move(cx, cy); await page.waitForTimeout(450); });
    const hovered = await snapshot(proxy, VISIBLE_PROPS);
    const hoverPx = await shot(page, box);
    moment('hover', rest, restPx, hovered, hoverPx, hover);
    if (info.kind !== 'input') {
      const press = await traced(page, proxy, async () => { await page.mouse.down(); await page.waitForTimeout(250); });
      moment('press', hovered, hoverPx, await snapshot(proxy, VISIBLE_PROPS), await shot(page, box), press);
      await page.mouse.move(1, 1);
      await page.mouse.up();
    } else await page.mouse.move(1, 1);
    // Back to rest before the next gesture, or a slow transition leaks into the focus snapshot.
    await page.waitForTimeout(Math.min(1200, Math.max(400, ...transition.durations) + 150));
    // Interrupt: enter, leave halfway through the hover motion; a reversing transition stays continuous.
    const hoverMs = Math.max(...hover.motion.flatMap((e) => e.moves.map((m) => m.durationMs)), 0);
    if (hoverMs >= 80) {
      await proxy.evaluate((n) => window.__mt.begin('i', n));
      await page.waitForTimeout(80);
      await page.mouse.move(cx, cy);
      await page.waitForTimeout(Math.max(70, hoverMs / 2));
      await page.evaluate(() => window.__mt.mark('i'));
      await page.mouse.move(1, 1);
      await page.waitForTimeout(400);
      const rec = await page.evaluate(() => window.__mt.end('i'));
      el.interrupt = rec?.marks.length ? continuity(rec, rec.marks[0]) : [];
    }
  }
  // Focus as the keyboard gives it: a key press first, so :focus-visible applies.
  const ring = (await original.evaluateHandle((n) => (n.matches('input') && getComputedStyle(n).opacity === '0' ? n.nextElementSibling ?? n : n))).asElement() ?? original;
  const before = await snapshot(ring, VISIBLE_PROPS);
  const beforePx = await shot(page, box);
  const focus = await traced(page, ring, async () => { await page.keyboard.press('Shift'); await original.focus().catch(() => {}); await page.waitForTimeout(300); });
  moment('focus', before, beforePx, await snapshot(ring, VISIBLE_PROPS), await shot(page, box), focus);
  await original.evaluate((n) => n.blur?.());
  return el;
};

const describe = (h, i) => h.evaluate((n, i) => {
  const text = (n.getAttribute('aria-label') || n.textContent || n.getAttribute('placeholder') || n.getAttribute('name') || '').trim().replace(/\s+/g, ' ').slice(0, 28);
  return `${n.tagName.toLowerCase()}${n.id ? `#${n.id}` : ''}${text ? ` "${text}"` : ''} [${i}]`;
}, i);

const isShown = (h) => h.evaluate((n) => {
  if (n.disabled || n.getAttribute('aria-disabled') === 'true') return false;
  const target = n.matches('input') && getComputedStyle(n).opacity === '0' ? n.closest('label') ?? n : n;
  for (let e = target; e; e = e.parentElement) { const c = getComputedStyle(e); if (c.opacity === '0' || c.visibility === 'hidden' || c.display === 'none') return false; }
  const r = target.getBoundingClientRect();
  if (r.width <= 1 || r.height <= 1 || r.right <= 0) return false;
  // Inside a closed drawer or collapsed panel: an ancestor that clips has no area left for the element.
  let box = { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
  for (let e = target.parentElement; e; e = e.parentElement) {
    if (e.inert) return false;
    const c = getComputedStyle(e);
    if (c.overflowX === 'visible' && c.overflowY === 'visible') continue;
    const a = e.getBoundingClientRect();
    if (a.width <= 1 || a.height <= 1) return false;
    if (c.overflowX !== 'visible' && (box.right <= a.left || box.left >= a.right)) return false;
    if (c.overflowY !== 'visible' && e !== document.body && e !== document.documentElement && (box.bottom <= a.top || box.top >= a.bottom)) return false;
  }
  return true;
}).catch(() => false);

// Sections below the fold: did anything animate in when they were first scrolled to? Also the long frames of the scroll.
const scrollPass = (page) => page.evaluate(async (limit) => {
  const sections = [...new Set([...document.querySelectorAll('h2, h3')].map((h) => h.closest('section, article, li, div') ?? h).filter((c) => c.getBoundingClientRect().top + scrollY > innerHeight))]
    .filter((c, _, all) => !all.some((o) => o !== c && o.contains(c)));
  const moved = new Set();
  const owner = (t) => sections.find((s) => s === t || s.contains(t));
  const mark = (e) => { const s = owner(e.target); if (s) moved.add(s); };
  document.addEventListener('animationstart', mark, true);
  document.addEventListener('transitionstart', mark, true);
  const mo = new MutationObserver((l) => { for (const m of l) { const s = owner(m.target); if (s) moved.add(s); } });
  mo.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
  const from = performance.now();
  for (let y = 0; y < document.documentElement.scrollHeight; y += 160) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 90));
    for (const a of document.getAnimations()) { const s = a.effect?.target && owner(a.effect.target); if (s) moved.add(s); }
  }
  await new Promise((r) => setTimeout(r, 600));
  mo.disconnect();
  const keyframeLayout = [...new Set(document.getAnimations().flatMap((a) => (a.effect?.getKeyframes?.() ?? []).flatMap((k) => Object.keys(k)))
    .filter((p) => /^(width|height|top|left|right|bottom|margin|padding|maxHeight|fontSize)/.test(p)))];
  window.scrollTo(0, 0);
  const long = window.__mt.loaf.filter(([s, d]) => s >= from && d > limit).map(([, d]) => Math.round(d));
  return { sections: sections.slice(0, 30).map((s) => ({ section: (s.querySelector('h2, h3')?.textContent ?? s.tagName).trim().slice(0, 40), animated: moved.has(s) })), long, keyframeLayout };
}, LONG_FRAME_MS);

// Text and images laid out but at opacity 0 (after the page was scrolled end to end).
const invisibleContent = () => [...document.querySelectorAll('h1, h2, h3, p, li, img')].filter((n) => {
  const r = n.getBoundingClientRect();
  if (r.width < 2 || r.height < 2 || n.closest('[aria-hidden="true"]')) return false;
  let shown = true;
  for (let e = n; e; e = e.parentElement) { const c = getComputedStyle(e); if (c.display === 'none' || c.visibility === 'hidden') return false; if (c.opacity === '0') shown = false; }
  return !shown;
}).map((n) => `${n.tagName.toLowerCase()} "${(n.textContent || n.getAttribute('alt') || '').trim().slice(0, 30)}"`);

const reducedPass = async (browser, url, paths) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load', timeout: 45000 });
  await page.waitForTimeout(800);
  const T = ['transform', 'translate', 'scale', 'rotate'];
  const per = new Map();
  for (const path of paths) {
    const h = await page.$(path);
    if (!h || !(await h.isVisible().catch(() => false))) continue;
    await h.scrollIntoViewIfNeeded().catch(() => {});
    const box = await h.boundingBox();
    if (!box) continue;
    const rest = await snapshot(h, T);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(150);
    await page.mouse.down();
    await page.waitForTimeout(250);
    const now = await snapshot(h, T);
    await page.mouse.move(1, 1);
    await page.mouse.up();
    await page.waitForTimeout(300);
    const after = await snapshot(h, T);
    per.set(path, { moves: diff(rest, now).map((k) => `${k}: ${now[k]}`).join(', '), residue: diff(rest, after).map((k) => `${k}: ${after[k]}`).join(', ') });
  }
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(600);
  const hidden = await page.evaluate(invisibleContent);
  const infinite = await page.evaluate(() => document.getAnimations().filter((a) => {
    const t = a.effect?.target;
    if (a.effect?.getTiming?.().iterations !== Infinity || !t || a.playState !== 'running') return false;
    for (let e = t; e; e = e.parentElement) { const c = getComputedStyle(e); if (c.opacity === '0' || c.display === 'none' || c.visibility === 'hidden') return false; }
    const k = a.effect.getKeyframes?.() ?? [];
    return k.some((f) => f.transform || f.translate || f.scale || f.rotate || f.left || f.top);
  }).map((a) => { const t = a.effect.target; return `${t.tagName.toLowerCase()}${t.id ? `#${t.id}` : ''}${t.classList[0] ? `.${t.classList[0]}` : ''}`; }));
  await ctx.close();
  return { per, hidden, infinite };
};

const TOGGLE = '[aria-expanded], [aria-controls], [aria-pressed], summary, [data-toggle]';

// Clicks a toggle, learns how long its motion lasts, then clicks the reverse at the middle of that motion
// in both directions (opening interrupted by closing, closing interrupted by opening) and looks for a restart.
const probeToggle = async (page, index) => {
  const click = () => page.evaluate(([sel, i]) => { const n = document.querySelectorAll(sel)[i]; n.click(); }, [TOGGLE, index]);
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(600);
  const label = await page.evaluate(([sel, i]) => { const n = document.querySelectorAll(sel)[i]; return n ? `${n.tagName.toLowerCase()}${n.id ? `#${n.id}` : ''} "${(n.getAttribute('aria-label') || n.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28)}"` : null; }, [TOGGLE, index]);
  const run = async (steps) => {
    await page.evaluate(() => window.__mt.begin('p', null, true));
    for (const s of steps) { if (s === 'click') await click(); else await page.waitForTimeout(s); }
    return page.evaluate(() => window.__mt.end('p'));
  };
  const moved = (rec) => analyzeRecording(rec).flatMap((e) => e.moves.filter((m) => m.startT >= rec.marks[0] - 2 * FRAME));
  const first = await run(['click', 1500]);
  const dur = Math.max(0, ...moved(first).map((m) => m.durationMs));
  if (dur < 80) return { label, dur, jumps: [] };
  const settle = Math.round(dur + 350);
  const jumps = [];
  const check = (rec, direction) => { if (rec.marks.length > 1) for (const j of interruptionJumps(rec, rec.marks.at(-1))) jumps.push({ ...j, direction }); };
  await run(['click', settle]); // back to the starting state
  for (const share of [0.3, 0.55]) {
    const half = Math.max(50, Math.round(dur * share));
    check(await run(['click', half, 'click', settle]), 'opening'); // opening, reversed part-way
    check(await run(['click', settle, 'click', half, 'click', settle]), 'closing'); // closing, reversed part-way
    await run(['click', settle]); // closed again
  }
  jumps.sort((x, y) => y.delta - x.delta);
  return { label, dur, jumps };
};

const contactSheet = async (page, browser, selector, out) => {
  const h = await page.$(selector);
  if (!h) return null;
  await h.scrollIntoViewIfNeeded();
  const box = await h.boundingBox();
  if (!box) return null;
  const clip = { x: Math.max(0, box.x - 16), y: Math.max(0, box.y - 16), width: box.width + 32, height: box.height + 32 };
  const shots = [];
  const take = async () => shots.push((await page.screenshot({ clip })).toString('base64'));
  await take();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  for (let i = 0; i < 8; i++) { await page.waitForTimeout(40); await take(); }
  await page.mouse.down();
  for (let i = 0; i < 5; i++) { await page.waitForTimeout(40); await take(); }
  await page.mouse.move(1, 1);
  await page.mouse.up();
  for (let i = 0; i < 6; i++) { await page.waitForTimeout(40); await take(); }
  const sheet = await browser.newPage({ viewport: { width: 1200, height: 200 } });
  await sheet.setContent(`<body style="margin:0;background:#888;display:flex;flex-wrap:wrap;gap:4px;padding:4px">${shots.map((s, i) => `<figure style="margin:0;font:10px sans-serif;color:#fff"><img src="data:image/png;base64,${s}"><figcaption>${i * 40} ms${i === 1 ? ' hover' : i === 9 ? ' press' : i === 14 ? ' out' : ''}</figcaption></figure>`).join('')}</body>`);
  const file = join(out, `${selector.replace(/[^\w-]+/g, '_').slice(0, 60)}.png`);
  await sheet.screenshot({ path: file, fullPage: true });
  await sheet.close();
  return file;
};

export const audit = async (url, o = {}) => {
  const pw = loadPlaywright();
  if (!pw) throw new Error('Playwright not found: `npm i -D playwright && npx playwright install chromium`, or set PLAYWRIGHT_ROOT to a project that has it.');
  const out = resolve(o.out ?? '.motion-audit');
  mkdirSync(out, { recursive: true });
  const browser = await pw.chromium.launch();
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
    await context.addInitScript(tracer);
    const page = await context.newPage();
    if (o.cpu > 1) await (await context.newCDPSession(page)).send('Emulation.setCPUThrottlingRate', { rate: o.cpu });
    const response = await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    if (response && response.status() >= 400) throw new Error(`${url} answered HTTP ${response.status()}`);
    await page.waitForTimeout(1200);
    const findings = [];
    const add = (level, kind, element, detail) => findings.push({ level, kind, element, detail });
    const loafSupported = await page.evaluate(() => window.__mt.loaf.supported !== false);
    const scroll = await scrollPass(page);
    const hiddenNormally = new Set(await page.evaluate(invisibleContent));
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(800);
    const handles = o.only?.length ? (await Promise.all(o.only.map((s) => page.$$(s)))).flat() : await page.$$(INTERACTIVE);
    const elements = [];
    const paths = [];
    for (const h of handles) {
      if (elements.length >= (o.max ?? 40)) break;
      if (!(await isShown(h))) continue;
      await h.scrollIntoViewIfNeeded().catch(() => {});
      const el = await auditElement(page, h, await describe(h, elements.length)).catch(() => null);
      if (!el) continue;
      el.path = await cssPath(h);
      elements.push(el);
      paths.push(el.path);
    }
    const css = await page.evaluate(ungatedHoverMotion);
    const reducedRule = await page.evaluate(hasReducedMotionRule);
    const toggles = [];
    const toggleCount = await page.evaluate((sel) => document.querySelectorAll(sel).length, TOGGLE);
    for (let i = 0; i < Math.min(toggleCount, 8); i++) {
      const r = await probeToggle(page, i).catch(() => null);
      if (!r?.label) continue;
      toggles.push(r);
      if (r.jumps.length) {
        const top = [...new Map(r.jumps.map((j) => [j.label, j])).values()].slice(0, 3).map((j) => `${j.label} ${j.prop} ${j.from} → ${j.to} in one frame (${j.direction}, ${j.delta})`).join('; ');
        add('error', 'not-interruptible', r.label, `reversed part-way through its ${r.dur} ms motion the animation restarts instead of continuing: ${top}`);
      }
    }
    let click = null;
    if (o.click) {
      await page.reload({ waitUntil: 'load' });
      await page.waitForTimeout(600);
      const h = await page.$(o.click);
      const box = h && (await h.scrollIntoViewIfNeeded().catch(() => {}), await h.boundingBox());
      if (!box) add('error', 'click-target', o.click, 'matches nothing visible');
      else {
        const at = [box.x + box.width / 2, box.y + box.height / 2];
        const play = async (trace) => {
          if (trace) await page.evaluate(() => window.__mt.begin('c', null));
          const from = await page.evaluate(() => window.__mt.now());
          await page.waitForTimeout(250);
          await page.mouse.click(...at);
          let half = 0;
          if (o.interrupt) { half = 160; await page.waitForTimeout(half); await page.mouse.click(...at); }
          await page.waitForTimeout(1500);
          return { from, half, rec: trace ? await page.evaluate(() => window.__mt.end('c')) : null };
        };
        // Long frames are measured in a pass with the per-frame tracer off: tracing hundreds of nodes
        // would itself overrun the frames it is timing on a large page.
        const quiet = await play(false);
        const long = (await page.evaluate(() => window.__mt.loaf)).filter(([s, d]) => s >= quiet.from && d > LONG_FRAME_MS).map(([, d]) => Math.round(d));
        await page.reload({ waitUntil: 'load' });
        await page.waitForTimeout(600);
        const h2 = await page.$(o.click);
        await h2.scrollIntoViewIfNeeded().catch(() => {});
        const box2 = await h2.boundingBox();
        at[0] = box2.x + box2.width / 2; at[1] = box2.y + box2.height / 2;
        const { rec, half } = await play(true);
        // What was already moving before the click (loops, carousels) is ambient, not the click's motion.
        const clickT = rec.marks[0] ?? Infinity;
        const moved = analyzeRecording(rec).map((e) => ({ ...e, moves: e.moves.filter((m) => m.startT >= clickT - 2 * FRAME) })).filter((e) => e.moves.length);
        click = { selector: o.click, moved: moved.length, long };
        const jumps = moved.flatMap((e) => e.moves.flatMap((m) => m.jumps.map((j) => `${e.label} ${m.prop} jumps ${j.size} at ${j.atMs} ms`)));
        if (jumps.length) add('error', 'jump', `click ${o.click}`, `${jumps.slice(0, 4).join('; ')}${jumps.length > 4 ? ` (+${jumps.length - 4} more)` : ''}`);
        for (const e of moved) for (const m of e.moves) {
          if (/^layout/.test(m.prop) && m.durationMs > 2 * FRAME) add('error', 'layout-animated', `click ${o.click}`, `${e.label} animates its ${m.prop === 'layoutWidth' ? 'width' : 'height'} over ${m.durationMs} ms`);
        }
        if (long.length) add('error', 'long-frame', `click ${o.click}`, `${long.length} frames over ${LONG_FRAME_MS} ms during the transition (${long.slice(0, 5).join(', ')} ms)`);
        if (o.interrupt && rec.marks.length > 1) {
          const jumps = continuity(rec, rec.marks[1]);
          click.interrupt = jumps;
          if (jumps.length) add('error', 'interrupt-jump', `click ${o.click}`, `second click at ${half} ms: ${jumps.slice(0, 4).map((j) => `${j.label} ${j.prop}`).join(', ')} jump`);
        }
      }
    }
    const sheets = [];
    for (const s of o.frames ?? []) sheets.push(await contactSheet(page, browser, s, out));
    const reduced = await reducedPass(browser, url, paths);
    for (const el of elements) el.reduced = reduced.per.get(el.path);

    for (const el of elements) findings.push(...judgeElement(el));
    findings.push(...inconsistencies(elements));
    for (const el of elements) if (el.long.length) add('error', 'long-frame', el.label, `frames over ${LONG_FRAME_MS} ms during ${el.long.slice(0, 3).join(', ')}`);
    if (scroll.long.length) add('error', 'long-frame', 'page scroll', `${scroll.long.length} frames over ${LONG_FRAME_MS} ms while scrolling${o.cpu > 1 ? ` (CPU ${o.cpu}×)` : ''}: ${scroll.long.slice(0, 6).join(', ')} ms`);
    if (scroll.keyframeLayout.length) add('error', 'layout-animated', 'keyframes', `CSS/WAAPI animations animate ${scroll.keyframeLayout.join(', ')}`);
    if (!o.noEntrances) for (const s of scroll.sections.filter((s) => !s.animated)) add('warning', 'no-entrance', `section "${s.section}"`, 'appears without an entrance the first time it is scrolled to');
    for (const sel of css.found) add('warning', 'ungated-hover', sel, 'moves on :hover outside @media (hover: hover) — sticks after a tap on touch screens');
    if (reduced.infinite.length) add('error', 'reduced-motion-loop', reduced.infinite.slice(0, 4).join(', '), 'infinite moving animation keeps running with prefers-reduced-motion');
    const strandedReduced = reduced.hidden.filter((h) => !hiddenNormally.has(h)).slice(0, 6);
    if (strandedReduced.length) add('error', 'reduced-motion-hidden', strandedReduced.join(', '), 'content stays at opacity 0 with prefers-reduced-motion: the entrance it waits for never runs');
    const anyMotion = elements.some((e) => Object.values(e.moments).some((d) => d?.motion.some((m) => m.moves.some((x) => x.prop !== 'opacity'))));
    if (anyMotion && !reducedRule.found && !reducedRule.unreadable) add('warning', 'reduced-motion-missing', 'stylesheets', 'elements move but no readable stylesheet has a prefers-reduced-motion rule (JS-driven handling is not seen here)');

    const report = { url, cpu: o.cpu ?? 1, loafSupported, cssUnreadable: css.unreadable, elements: elements.map(({ label, kind, transition, moments, interrupt, reduced }) => ({ label, kind, transition, moments: Object.fromEntries(Object.entries(moments).map(([k, d]) => [k, { changed: d.changed, pixels: d.pixels, motion: d.motion }])), interrupt, reduced })), sections: scroll.sections, toggles, click, sheets: sheets.filter(Boolean), findings };
    writeFileSync(join(out, 'report.json'), JSON.stringify(report, null, 1));
    return { ...report, out };
  } finally {
    await browser.close();
  }
};

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const opt = (name) => args.flatMap((a, i) => (a === name ? [args[i + 1]] : []));
  const takesValue = new Set(['--only', '--max', '--cpu', '--click', '--frames', '--out']);
  const target = args.find((a, i) => !a.startsWith('--') && !takesValue.has(args[i - 1]));
  if (!target || args.includes('--help')) {
    console.log('motion-audit.mjs <url|file> [--only <sel>]… [--max 40] [--cpu 4] [--click <sel> [--interrupt]] [--frames <sel>]… [--no-entrances] [--out dir] [--strict] [--json]');
    process.exit(target ? 0 : 2);
  }
  if (args.includes('--interrupt') && !opt('--click')[0]) { console.error('--interrupt needs --click <selector>'); process.exit(2); }
  const url = /^[a-z]+:\/\//i.test(target) ? target : existsSync(target) ? pathToFileURL(resolve(target)).href : target;
  let r;
  try {
    r = await audit(url, { only: opt('--only'), max: Number(opt('--max')[0] ?? 40), cpu: Number(opt('--cpu')[0] ?? 1), click: opt('--click')[0], interrupt: args.includes('--interrupt'), frames: opt('--frames'), noEntrances: args.includes('--no-entrances'), out: opt('--out')[0] });
  } catch (e) {
    console.error(`could not run: ${e.message}`);
    process.exit(2);
  }
  const strict = args.includes('--strict');
  const failing = r.findings.filter((f) => f.level === 'error' || strict);
  if (args.includes('--json')) console.log(JSON.stringify(r.findings, null, 1));
  else {
    const n = (m) => r.elements.filter((e) => e.moments[m]?.changed.length || e.moments[m]?.pixels).length;
    console.log(`${r.elements.length} elements · respond on hover ${n('hover')} · press ${n('press')} · focus ${n('focus')} · sections with entrance ${r.sections.filter((s) => s.animated).length}/${r.sections.length}${r.loafSupported ? '' : ' · long frames: not supported by this browser'}${r.cssUnreadable ? ` · ${r.cssUnreadable} cross-origin stylesheets not read` : ''}`);
    for (const f of r.findings) console.log(`${f.level.padEnd(7)} ${f.kind}: ${f.element} — ${f.detail}`);
    if (r.sheets.length) console.log(`contact sheets: ${r.sheets.join(', ')}`);
    console.log(`report: ${join(r.out, 'report.json')}`);
    console.log(failing.length ? `${failing.length} to fix (${r.findings.length - failing.length} warnings not failing)` : `clean: ${r.findings.length} warnings`);
  }
  process.exit(failing.length ? 1 : 0);
}
