# Handoff (builder, T6 ASM-29 revised, ASM-30, ASM-31, sweep)

## Done and committed (branch portfolio-present-d, no push)
- ASM-28, ASM-21, ASM-27: earlier (commit 1594a7b).
- ASM-29 first round (shrunk box): bdfa46c; replaced by the revised ASM-29 (L185, L188 replaces line for e2e/contact-drawing.spec.ts). e2e/contact-links.spec.ts replaces the links test of contact-marquee.spec.ts (L182; grep-invert "the drawing covers the section").
- ASM-30 RED e2e/cold-open-short.spec.ts committed; CSS in app/globals.css (cover-scene min-height max(100svh, size-nawi*0.8 + 29rem), cover-foot padding-right 13rem): 5 of 5 pass.
- ASM-29 revised and ASM-31 RED e2e/one-screen.spec.ts committed (10 tests). CSS: block "wide screens" at the end of app/globals.css (min-width 1100px) and cover fit restored in features/portfolio/presentation/contact.css. Result: 9 of 10 pass; offer 5/5 pass.

## Open
1. contact at 1280x720 fails by 9px (673.97 vs 665): the contact word computed 100.8px = 14svh although the CSS says min(16.5vw, 12.5svh); the dev server probably served stale CSS. Rerun `node cap2.tmp.mjs` (a scratch script, delete cap.tmp.mjs and cap2.tmp.mjs, they are not part of the product) or the test; if still over, shrink .roll-item (4svh) or .band-item (8svh) in the same block.
2. Uncommitted: app/globals.css, contact.css, e2e specs are saved; commit them (`git add -A app features e2e specs && git commit`), captures are in .validation/asm29 (after-1910x912, after-1280x720) and .validation/asm31 (after-*); recapture ASM-29 after the new ill-contact-16x9 (1672x941) is judged by eye.
3. ASM-30 captures at 1910x912 and 2560x1080 under .validation/asm30/ not taken.
4. Sweep: .validation/full2.log ended with 98 failed / 111 passed but it ran while CSS was changing, so it is not valid. Rerun in background: `APP_URL=http://127.0.0.1:49315 npx playwright test --reporter=list --grep-invert "the drawing covers the section" > .validation/full3.log`, then per failing test: stale against a later Log decision means a `replaces:` Log line plus a new spec with the same tags; page wrong means fix CSS. Known before: case-file-layout-contracts (11), project-showcase (2), credits.spec.ts:293, experience-photos (replaced L166). Check also that the wide block (>=1100) did not break designer-line-rest, designer-line-words, wide-screens-clear, phone-390, contact-links, and that folder translucency did not break offer.spec / contrast tests.
5. Gate: `npx tsc --noEmit`, `npx eslint app features e2e` (one warning: BODY_FLOOR unused in committed designer-line.spec.ts, stale file replaced by designer-line-words/rest).

## Notes
- Dev server http://127.0.0.1:49315 is the main thread's: do not kill it.
- The log line L181 is a stray probe line; ignore.
