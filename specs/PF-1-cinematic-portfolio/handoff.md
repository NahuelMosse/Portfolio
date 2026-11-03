# Handoff (builder 2: ASM-29..34, sweep) - branch portfolio-present-d, no push

## Done and committed
- ASM-29: stale dev CSS was the cause (served 14svh); after touch plus .end-of-file margin space-2, e2e/one-screen.spec.ts 10 of 10 passed (before the ASM-33 move). Captures .validation/asm29/after-{1910x912,1280x720}.png checked by eye. Commit 354ab62.
- ASM-30: captures .validation/asm30/after-{1910x912,2560x1080}.png.
- ASM-32: RED e2e/tools-plain.spec.ts, then code: terminal removed (terminal-output.ts, terminal.css, kind "tool" in content.ts/projects.tsx/project-group.tsx/showcase-device.tsx), new features/portfolio/presentation/tool.css (plain type, link buttons), copy as ordered. tools-plain 2 of 2 pass. Captures .validation/asm32/after-{1910x912,390x844}-{2,50,98}.png.
- ASM-33 RED committed: e2e/contact-footer.spec.ts.
- ASM-34 RED committed: e2e/id-sheet-no-photos.spec.ts.

## Uncommitted (commit with `git add app features e2e specs && git commit`)
- character-sheet.tsx: photos removed (ASM-34); .sheet-photos/.sheet-photo CSS removed from app/globals.css.
- end-credits.tsx: roll moved between the offer and the contact scene; footer is inside .contact-scene after .contact (ASM-33, my assumption ASM: the roll goes above Let's talk so the footer can be the last thing in the red block). globals.css: .contact-scene margin-bottom 0.
- globals.css wide block: .chapter-title[data-chapter-title="projects"] .chapter-word margin-bottom 0.2em (wide-screens "Projects word clears Apps header" at 2560+).
- e2e/wide-screens-offer-detail.spec.ts (new, pointer-events turned on for the hit test; replaces e2e/wide-screens.spec.ts "Offer detail line is not covered", stale since titles got pointer-events none in 7ec8937).

## Last results (after the moves)
- id-sheet-no-photos and cold-open-short: not shown failing in the last run (only the lines listed below failed); confirm.
- contact-footer: fails only on pageEnd 8px at 1280x720 (something adds ~8px below the footer after the scene; find with the ancestors margin/padding probe, cap2.tmp.mjs). Other assertions unverified.
- one-screen.spec.ts ASM-29 test: stale after the roll moved: its `halvesClear` compares the tiles to `.credits-roll`; needs a replacing spec (new file, same tag, measure LET'S TALK to footer bottom and tiles clear of the footer) plus a `replaces:` Log line.
- wide-screens-offer-detail still fails at 1280x720, 1536, 2560x1440, 3440x1440: something really covers the detail line; not diagnosed (page wrong or the experience cards overlap; investigate).

## Not covered (turn budget), all could not run
- Add Log lines: ASM-32 evidence, replaces lines for terminal specs (project-presentation.spec.ts:55, project-title-fit.spec.ts:118, project-presentation-terminal-height.spec.ts, content.spec.ts tool copy, project-presentation 100/122), ASM-34 replaces (case-file.spec.ts:97 and sheetPhotos checks in case-file-layout*.spec.ts, designer-line-words offer size vs ASM-31).
- Captures .validation/asm33/after-{1910x912,390x844}.png and .validation/asm34/after-1910x912.png.
- Full sweep: .validation/full4.log had 116 failed / 110 passed (run before ASM-33/34). Most failures are specs from earlier design directions (deities, hero-line, show-index, case-file-*, scene-media pf-* assets, fonts, project-groups dev-kit, pieces, credits roll position); none triaged to replaces lines yet. Page-wrong candidates: wide-screens offer detail (above), offer.spec (dev-kit proof absent), experience-photos (experience chapter 3132 > 1170), designer-line-rest at 1440.
- tsc --noEmit and eslint not run after ASM-32..34.
- Delete cap.tmp.mjs and cap2.tmp.mjs in the worktree root (last step).
- Do not commit any png/webp under public/.
