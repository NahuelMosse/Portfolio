# Handoff · T6 project stage order (ASM-26)

## Done
- RED committed: `e95eb59` e2e/project-stage-order.spec.ts (planned T6 title); project-stage.spec.ts removed.
- Code written, committed as work in progress, NOT run: at 390 the order is title, stage, details.
  - features/portfolio/presentation/projects.tsx: `.project-details` wraps fields and meta inside `.project-text`; prettier run on it.
  - app/globals.css: `.project-text` is `display: contents` below 1280 (title order 1, stage and fallback order 2, details order 3), grid again at 1280 and up; 1440 layout unchanged by design.

## Not covered (turn budget)
- could not run: `project-stage-order` + `phone-spreads` + `hero-flow` against a fresh `node .claude/tools/app.mjs up` (the shared app at http://127.0.0.1:58761 runs the previous build).
- could not run: tsc and eslint after the projects.tsx reformat.
- could not run: fix 2, Guardia at 1440. The second piece of the row, `triaje-mobile` in a phone frame, shows one giant "T": `.piece:not([data-lead]) .frame[data-frame="phone"] .frame-screen` uses `aspect-ratio: var(--phone-other-ratio)` (4/5, tokens.css) with object-fit cover. Needs a phone-shaped frame showing the whole capture, `object-position: top` (read the capture size first; `.frame-screen img` already has object-position top). Check Club and Grit rows are not harmed.
- could not run: `node D:/tmp/ill3/walk.cjs <url>` and viewing walk-m.png and walk-d.png; the 390 test measures that the interface's top half is in view when the title sits at the top (the Hire me bar was not measured).
- could not run: Log line (`node .claude/tools/log.mjs specs/PF-1-cinematic-portfolio "T6 · ..."`), final commit, leaving the app UP and reporting its URL.
