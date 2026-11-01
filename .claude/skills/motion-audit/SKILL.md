---
name: motion-audit
description: Measure, in a real browser, how a running web UI moves and find what is wrong with it — controls that give no hover/press/focus feedback, transitions that snap, animations that jank (layout properties animated, long frames during a transition or scroll), ease-in or wrong durations for the gesture, inconsistent durations for the same kind of control, transitions that jump when interrupted, and prefers-reduced-motion that is missing or broken (still moving, looping, or leaving content invisible). Use when the user asks to audit, test or QA the motion/animations/microinteractions of a page or app, says it "feels janky", "dead", "stutters", "jumps", or asks whether reduced motion works. Not for reviewing animation code in a diff without running it (review-animations), choosing where to add new motion (find-animation-opportunities), writing or tuning a specific animation or spring (motion, apple-design), or scroll-driven storytelling against a reference site.
---

# Motion audit

Motion bugs are invisible in code review and in still screenshots: the CSS says `transition: transform
200ms` and the button still snaps, because the hover rule sets a property the transition does not list.
Audit what the browser actually draws, frame by frame, then fix at the cause.

**Stance.** Every interactive control owes a visible, quick response to hover, press and keyboard
focus — frequent controls included. Frequency decides *how much* motion (a list row gets a 120 ms tint,
a primary CTA gets lift and press), never *whether* there is feedback. "Instant" is a valid response only
when something visibly changes. Motion must never cost legibility, input latency or accessibility.

## What counts as a finding

| Kind (script output) | What the user feels | Level |
|---|---|---|
| `no-feedback` | Hover or press on a control changes nothing — the UI feels dead | error |
| `no-focus-feedback` | Keyboard focus is invisible | error |
| `snaps` | Feedback exists but jumps: the changed properties have no transition | warning |
| `layout-animated` | Width/height/top/margin/padding/font animate: neighbours shift, layout every frame | error |
| `long-frame` | A frame over 50 ms during hover, press, a click's transition, or scroll — visible stutter | error (load: warning) |
| `ease-in` | The response starts slow — declared curve or measured trajectory | error |
| `duration` | Outside the band for the gesture (hover 80–300, press 50–200, focus ≤ 250 ms); over 2× is an error | warning / error |
| `linear` | A transform or opacity moves at constant speed — mechanical | warning |
| `transition-all` | `transition: all` animates whatever changes, layout included | warning |
| `inconsistent-duration` | Same kind of control, same gesture, durations ≥ 1.5× and ≥ 60 ms apart | warning |
| `jump` | A frame moves over 3× the median step — a dropped or skipped animation | error |
| `interrupt-jump` | Leaving hover mid-way, or clicking again mid-transition, jumps instead of reversing | error |
| `not-interruptible` | A toggle (drawer, menu, accordion, switch) clicked back part-way through its motion restarts from the other end: the element, or an inner panel, skips a large step in one frame (250 px → 1 px) | error |
| `ungated-hover` | `:hover` moves things outside `@media (hover: hover)` — sticks after a tap on touch | warning |
| `reduced-motion-moves` / `-residue` | With `prefers-reduced-motion: reduce` a press still scales/translates, or stays transformed | error |
| `reduced-motion-loop` | An infinite moving animation keeps running under reduced motion | error |
| `reduced-motion-hidden` | Content waits for an entrance that reduced motion skipped: it stays at opacity 0 | error |
| `reduced-motion-missing` | Things move and no stylesheet has a reduced-motion rule | warning |
| `no-entrance` | A section below the fold appears with no entrance when first scrolled to | warning |

## Method

### 1. Measure — on the running page

```bash
node <skill-dir>/scripts/motion-audit.mjs http://localhost:3000/orders
node <skill-dir>/scripts/motion-audit.mjs http://localhost:3000/orders --cpu 4 --click '[aria-controls=filters]' --interrupt
node <skill-dir>/scripts/motion-audit.mjs http://localhost:3000/orders --only 'nav a' --only '.toolbar button' --frames '.btn-primary'
```

Node 18+, Playwright as a peer dependency (cwd, then `PLAYWRIGHT_ROOT`). Exit 0 clean, 1 findings,
2 could not run — a 2 is never a pass. `report.json` carries every element's changed properties, measured
moves (duration, curve shape, overshoot, jumps) and the reduced-motion result.

What it does: hovers, presses (releasing away, so nothing is clicked) and keyboard-focuses each
interactive element while sampling rect, opacity and transform of the element and its children on every
animation frame; leaves hover halfway to test interruption; clicks every toggle (`aria-expanded`, `aria-controls`, `aria-pressed`, `summary`, `[data-toggle]`, up to 8) back at 30 % and 55 % of its measured duration in both directions, tracing every element on the page including descendants and zero-size ones; scrolls end to end watching entrances and
Long Animation Frames; repeats press and scroll in a second context with `reducedMotion: 'reduce'`.

- `--cpu 4` throttles like a mid-range phone. Jank that only shows throttled is still jank.
- `--click <sel>` records everything that moves for 1.5 s after a real click (dialog, drawer, menu,
  accordion, tab switch); `--interrupt` clicks again at 160 ms. Do it for every overlay the screen opens.
- `--frames <sel>` writes a contact sheet, one frame every 40 ms through hover, press and release. Look at
  it: the numbers say *that* it moved, the sheet shows *how*.
- States the first load does not show (open menus, toasts, loading, error) need the page put in that
  state: run against a route or story that renders it, or use `--click` to open it.

Without the script, in DevTools: Animations panel at 10 % speed for curves and interruption; Performance
panel with 4× CPU for long frames and purple Layout blocks inside the animation; Rendering → Emulate
`prefers-reduced-motion: reduce`; `document.getAnimations()` to list what runs.

### 2. Diagnose — name the cause before editing

For each finding: which element, which gesture, which property moved (or failed to), and **who drives
it** — a CSS transition, `@keyframes`, WAAPI, a JS library (Motion, GSAP, React Spring), or a rAF loop
writing styles. Then map it to a row below. A jump during a click is usually a JS animation fighting a
CSS transition on the same property, or an element re-mounted mid-animation (React `key` change).

### 3. Fix — at the cause, in the component or the tokens

| Root cause | Correct fix | Wrong fix |
|---|---|---|
| Hover/press rule changes a property the `transition` does not list | List exactly the properties that change: `transition: background-color 140ms var(--ease-out), transform 120ms var(--ease-out)` | `transition: all` |
| Control has no hover/press state | Add one sized to frequency: tint or shadow on hover, `scale(0.97)` or a 1–2 px `translateY` on press, opacity on links | Leaving frequent controls static "because they are frequent" |
| `outline: none` with nothing in its place | `:focus-visible { outline: 2px solid …; outline-offset: 2px }` | `:focus` ring shown on every mouse click; removing the outline |
| Width/height/margin/top animated (expand, grow, slide) | `transform`/`opacity`; for size, FLIP (measure, invert with `scale`, play), `grid-template-rows: 0fr → 1fr` for accordions, or `interpolate-size: allow-keywords` with a short duration | `max-height: 9999px` hacks; `will-change` on everything |
| Long frame when the gesture starts | Move work out of the handler: precompute, `requestIdleCallback`, `scheduler.yield()`, defer the fetch until after the first frame of the transition; animate on the compositor | Shortening the animation so the stutter is shorter |
| Long frames while scrolling | Scroll-driven animations (`animation-timeline: view()`) or IntersectionObserver instead of scroll listeners; no layout reads in scroll handlers; fewer/lighter blurs and shadows animating | `passive: true` alone (it fixes input delay, not frame cost) |
| `ease-in` or `linear` on a response | Strong ease-out (`cubic-bezier(0.23, 1, 0.32, 1)`) for enter and feedback; ease-in-out only for on-screen movement between two places; springs for gesture-driven motion | `ease` everywhere |
| Durations out of band or inconsistent | Duration tokens per gesture (`--dur-hover`, `--dur-press`, `--dur-enter`, `--dur-overlay`) used by every component | Tuning each component by eye |
| Hover driven by `@keyframes`, or a JS animation restarting from its start value | CSS transitions (they reverse from the current value) or springs that retarget from the live value | `animation-fill-mode` tricks; disabling pointer events during the animation |
| Toggle reversed mid-motion restarts (`not-interruptible`): the open/close states are `@keyframes` classes, each starting at its own `from` | Transitions between two states (`.open { transform: none }` with `transition: transform …`), which reverse from the current value; or WAAPI: keep the `Animation` and call `reverse()`, or start the new one from `getComputedStyle(el).transform`; with Motion/springs, retarget from the live value | Disabling the button or pointer events while it animates; `animation-fill-mode` tricks; a longer duration |
| JS animation and CSS transition on the same property | One owner per property: remove the CSS transition where the library animates | Adding `!important` |
| `:hover` transform on touch | Wrap motion in `@media (hover: hover) and (pointer: fine)`; keep colour feedback outside it | Removing hover motion everywhere |
| Reduced motion ignored | `@media (prefers-reduced-motion: reduce)`: drop translate/scale/parallax/loops, keep opacity and colour changes, keep feedback; in JS honour `matchMedia` (Motion: `MotionConfig reducedMotion="user"`) | `* { animation: none !important; transition: none !important }` — it also kills feedback and can strand entrances at opacity 0 |
| Entrance leaves content at opacity 0 when its animation is skipped | Put the visible state in the base style and animate *from* hidden (`@starting-style`, `animation-fill-mode: backwards`, or a class added by an observer that is a no-op under reduced motion) | Hiding content until JS runs |
| Infinite decorative loop | Stop it or replace with a slow opacity pulse under reduced motion; pause off-screen | Leaving it because it is "small" |
| Section pops in with no entrance | A short opacity + 8–16 px translate on first view, 30–80 ms stagger for groups, once only | Re-animating on every scroll pass; entrances over 600 ms |

### 4. Verify

1. Re-run with the same flags; exit 0, and every warning left is either fixed or justified in the report.
2. Re-run with `--cpu 4` on the screens that had long frames.
3. Look at a contact sheet (`--frames`) of the primary control and one frequent control: press reads as
   a press, nothing flashes, nothing lands from the wrong place.
4. Lock it in with a test. The pure helpers are exported, and the CLI's exit code fits CI:

```js
// motion.spec.mjs — fails the build when a control stops responding or reduced motion breaks
import { test, expect } from '@playwright/test';
import { audit } from '<skill-dir>/scripts/motion-audit.mjs';
test('orders: motion', async () => {
  const r = await audit('http://localhost:3000/orders', { only: ['main button', 'nav a'], out: 'test-results/motion' });
  expect(r.findings.filter((f) => f.level === 'error')).toEqual([]);
});
```

## Limits of the script

- Chromium only. Safari renders some transitions differently; check gesture-heavy UI there by hand.
- Colour and shadow transitions are judged from computed styles and pixels, not traced per frame; the
  frame tracer follows rect, opacity and transform.
- Long Animation Frames need Chromium 123+; when unsupported the summary says so — never read that as clean.
- Cross-origin stylesheets (and linked ones under `file://`) cannot be read for the `:hover` and reduced-motion rule checks: they are counted in the summary, and `reduced-motion-missing` is not reported when any sheet was unreadable.
- Controls inside a clipped, collapsed or off-screen container (closed drawer, zero-width panel, `inert`) are skipped: they cannot be reached.
- `not-interruptible` reads position: a restart that lands close to where it was, or a reversal under a very strong ease-out interrupted late, can slip under the step threshold. Toggles whose click navigates or loads data may not be probed.
- Shadow DOM and iframes are not entered; canvas/WebGL motion is not measured.
- Durations are compared within the same element kind (`button`, `a`, `tab`…), so a ghost button and a
  primary button with intentionally different timing can be flagged — justify or align them.

## Reporting back

Per finding fixed: element, gesture, cause (catalogue row), fix, and the measured value before → after.
Warnings left in place with the reason. The script result as exit code and its last line; if it could
not run, say so — never report an unrun audit as passed.
