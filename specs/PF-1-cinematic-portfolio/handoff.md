# Handoff (builder 5) - branch portfolio-present-d, no push; dev server http://127.0.0.1:8704

## ASM-39 (next free number; Log line NOT written, no turns left: append "ASM-39 · requester: Let's talk is one full screen with its content spread; Offer word clears the top bar and no red shows; certificates/education rows closer and smaller, LinkedIn/GitHub tiles >= 1.8x taller" with `node .claude/tools/log.mjs`)

Done (uncommitted code, see below):
- app/globals.css (>=1100px block): `.contact-scene[data-has-art]` height/min-height 100svh; `.scene-copy` box-sizing, height 100%, padding-top = top bar + space-3, bottom 0; `.contact` flex column space-between; tiles gap clamp 2svh; `.band-field` padding-bottom 3.6svh; `.band-half` min-height 12.5svh; `.roll-band` padding 0 and line-height 1; `.roll-item` font min(clamp(1.25rem,1.5vw,1.5rem),2.6svh), img 24px; `.end-of-file` margin/padding 0.
- features/film/presentation/chapter-index.tsx: `land` option (wide only: scroll so an element's top edge sits at the viewport top or bottom) plus `event.stopPropagation()` because Lenis `anchors:true` overrides anchor clicks; app/page.tsx: Offer lands with `.contact-scene` at the bottom edge, Contact with it at the top.
- Specs committed: e2e/chapter-arrival.spec.ts (10 tests, all passed on the code before the last CSS edits), e2e/contact-tiles-roll.spec.ts (tiles >= 110px, roll font < 31px, gap <= 16px, 1910x912; reference values before: font 31px, tile 61px, gap 32px).
- Captures: .validation/asm-spacing/offer-1910x912.png (word clear of bar, no red: looked at, good) and contact-1910x912.png (looked at before the last two CSS edits: spread, hint clear, footer inside).
- No `replaces:` needed so far: no committed test changed.

Last known serial run (asm39c.log, before the final CSS edits): 31 passed, 6 failed: contact-footer x5 "the page ends with the scene" (footer 24px above the page end: scene-copy bottom padding was still 24px, I set it to 0 and re-edited globals.css to force a recompile, NOT re-measured) and contact-tiles-roll gap 19.8 > 16 (added `.roll-band line-height: 1`, NOT re-run).
Earlier run (asm39b): the 1280x720 contact specs (ending-block, contact-one-screen, one-screen, chapter-arrival) failed by 1 to 19 px; the 24px bottom padding removal should fix them, verify.

## Not covered (turn budget), all could not run
- Re-run after the last CSS edits: contact-tiles-roll, chapter-arrival, ending-block, contact-footer, contact-one-screen, one-screen, offer-word, one-screen-sections, wide-screens-offer-detail-clear; `npx tsc --noEmit`; eslint on chapter-index.tsx and page.tsx.
- Recapture contact at 1910x912 after the tile and roll change (tiles and roll rows were looked at once, good).
- Items A (black between cover and PROJECTS), B (head cropped under the top bar), C (NAWI size from git history): not started; each needs its own ASM, RED spec, commit and captures in .validation/asm-cover/.
- Delete .validation/m.mjs, m2.mjs, cap-spacing.mjs (scratch) when done; do not commit public/.
