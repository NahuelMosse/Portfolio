# Handoff (builder, T6 ASM-28 and follow-ups)

## Done and committed (branch portfolio-present-d, no push)
- ASM-28: RED e2e/wide-screens.spec.ts; fix in app/globals.css (Projects margin-bottom 0 from 768px, offer-scene margin-top, scrollbar) and group.css (title drift capped); e2e/wide-screens-clear.spec.ts replaces two flawed tests (L176).
- ASM-21: e2e/designer-line-words.spec.ts and e2e/designer-line-rest.spec.ts replace designer-line.spec.ts (L177); experience.css body text 16px; terminals exempt from the Courier scan.
- ASM-27: e2e/phone-390.spec.ts replaces phone-layout and phone-glance (L178, L179). Commit 1594a7b.

## Left
1. Full-suite sweep: `.validation/full.log` (run: `APP_URL=http://127.0.0.1:49315 npx playwright test --reporter=list`, ends with `full: exit N`). It was still running. Known failing before: 11 tests in case-file-layout-contracts.spec.ts, 2 in project-showcase.spec.ts, credits.spec.ts:293 (chapter titles straddle). Per failing test: stale against a later Log decision means a `replaces:` Log line (node .claude/tools/log.mjs) plus a new spec with the same tags; page wrong means fix CSS. Never delete committed specs. Then rerun with --grep-invert of every replaced title until green, plus tsc and eslint, commit.
2. ASM-29 (contact drawing cut): Log line already appended (L180). Still to do: RED e2e/contact-drawing.spec.ts (img rendered box vs natural ratio, seal point about (0.76, 0.70) of the image mapped to the viewport, elementsFromPoint ignoring pointer-events against the panel and marquee rects, at 390, 1280x720, 1440x900, 1920x1080, 2560x1080), commit it, then CSS in contact.css and app/globals.css (.contact-scene .scene-art): stop it covering the whole tall section, sit at the right, melt the black left side into the red field. Gate: that spec, contact-marquee, wide-screens-clear, phone-390, tsc, eslint. Captures at 1440x900, 1920x1080 and 390 under .validation/asm29/.

## Notes
- Dev server http://127.0.0.1:49315 is the main thread's: do not kill it.
- Pre-existing failures unrelated to my CSS: experience-photos (replaced L166), phone specs (now replaced).
