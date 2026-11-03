# Handoff (builder 6) - branch portfolio-present-d, no push; dev server http://127.0.0.1:8704

## Done and committed
- ASM-39 complete (c86aabf RED logos, 3c14bf4 code): 78 passed serial, tsc and eslint clean, captures .validation/asm-spacing/. Platzi and EF SET marks in the roll (public/logos/, masks 1em, e2e/roll-brand-logos.spec.ts). credits.spec.ts and credits-liceo-8.spec.ts fail as before (stale, L168).
- ASM-40 (af11e37, RED commit before it): e2e/cover-handoff.spec.ts 15 of 15. Ink wipe removed (cold-open-motion.tsx, hero-poster.tsx, globals.css .cold-ink gone); cover art starts under the top bar (.cover-scene .scene-art top, object-position 50% 0%, transform-origin 50% 0%, top mask fade removed); NAWI --size-nawi 41vw at >=701px (globals.css, cover block near line 606).
- Scratch .validation/m.mjs, m2.mjs, cap-spacing.mjs deleted (also walk.mjs, sheet.mjs).

## Not covered (turn budget), all *could not run*
- Requester decision on NAWI/sheet overlap («no tape otros textos»): keep NAWI 41vw, no text of the cover (sheet, NAHUEL MOSSE — BUENOS AIRES, I'm Nawi block, buttons) may intersect NAWI's glyph box at 1910x912, 1920x1080, 2560x1080, 1440x900, 1280x720; sheet heading starts below the N's foot with >= 12px clearance; compact the sheet (row height, padding, font a notch smaller) and/or lift NAWI's baseline (never behind the bar); hair stays uncut.
- The 9 tests that fail now must pass AS THEY ARE (do not replace): e2e/cold-open-short.spec.ts x5, e2e/id-sheet-no-photos.spec.ts (1910x912), e2e/one-screen-sections.spec.ts sheet-clear x3 (1910x912, 1280x720, 2560x1080). First read how they measure (NAWI .mark box bottom versus the sheet top: at 1910x912 the box is ~72 to ~737 with font 783px and the sheet starts ~620, so the line box may have to be tightened: smaller line-height on .mark at >=701px, or a negative margin, before the sheet is compacted).
- Add to e2e/cover-handoff.spec.ts (new test, same tag @PF-1-ASM-40): no cover text element intersects NAWI's glyph box.
- Log: append a line saying the 9 tests are restored under ASM-40 (the earlier line "replaces: e2e/cold-open-short.spec.ts ... by: none yet" is superseded).
- Re-run cover-handoff + those 9 serially (APP_URL=http://127.0.0.1:8704, --workers=1); recapture .validation/asm-cover/after-cover-1910x912.png and look at it; commit.
- Dev server serves stale CSS after edits: a comment-only edit of app/globals.css forces the recompile.
