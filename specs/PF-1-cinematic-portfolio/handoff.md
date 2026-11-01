# T6 handoff

Committed: designer line (NAWI over the cover head, poster chapter words, ruled sheet, rectangles, General Sans), the dev-kit lines in content.ts (L115), the ASSETS.md cover entry, the radius line in design/line.md.

Passing: designer-line, project-glance-dev-kit-line, phone-glance, hero-flow (5 passed); tsc --noEmit clean. App up at http://127.0.0.1:50793 (restart with `node .claude/tools/app.mjs up` after each CSS change).

## Not covered (turn budget)

All of these are *could not run*; a fresh builder takes only these:

1. ID sheet at 1440: the two photos overlap the "IDENTIFICATION SHEET" label. Lay the label and photos out so nothing collides (`.sheet-head`, `.sheet-photos` in app/globals.css).
2. The difference blend turns the N stem navy over the lamp light. No hue outside ink, bone and red: neutralize the color (for example a grayscale or contrast filter on the art under NAWI) or use another device that stays bone or ink.
2b. At 390 the blue cast also shows in the A over his hair (same fix as item 2). The top 130 px under the bar are empty black and NAWI starts at y near 215: lift NAWI and the name line (the phone `.cover-title` offset `calc(var(--space-7) + var(--space-3))` in app/globals.css) so there is no dead band, with NAWI edge to edge at 390; designer-line must stay green.
3. Project titles keep the red rule and a modest title-case heading. Give them the poster treatment: own scale, case numeral 01-05 in Boska, fine small-type detail, no red rule. Keep what 739aac6 committed (AI line, stack chips, link).
4. At 1440 the projects piece row starts at y near 800, cut by the fold under the PROJECTS word. The first case must show its lead and pieces within the viewport, or the word takes less height there.
5. T6 Log line (`node .claude/tools/log.mjs specs/PF-1-cinematic-portfolio "T6 · ..."`), `reuses:`/`new:` under T6 for features/portfolio/presentation/chapter-word.tsx, eslint on the changed files only (explicit file list, not the folders: folder runs time out), formatter.
6. In the background, report each as passed, failed or could not run, without fixing old-layout failures: e2e fonts.spec, fonts-two-faces.spec, case-file-layout-contracts.
7. Rerun designer-line, project-glance-dev-kit-line, phone-glance, hero-flow; recapture `node D:/tmp/ill3/cover.cjs <url>` and `node D:/tmp/ill3/walk.cjs <url>`, look at them, commit.
