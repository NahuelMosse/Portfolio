# Handoff: phone fit and type passes (designer)

## Done and committed (app/globals.css, phone media queries only)
- Task 1 (Let's talk, 571e2f2), verified: lt-measure prints FITS at 390x844, 375x667, 360x740, 414x896 (also 768, landscape, desktop). Email on one line at 30.0px (390), 28.9 (375), 27.7 (360), 31.9 (414) without overflow (scrollWidth = viewport). Hint is 2 lines under the rule (8-13px gap), roll ends 8px above the "© NAHUEL MOSSE" line.
- Task 2, offer (b06c878): body 16px/1.45 (14.5px/1.35 at max-height 760px), kickers 13px, door titles 25px (may wrap; 22px on short phones), OFFER word 81.9px at 390 / 87px at 414 (64px on short phones), CTA 14px, proof link 16px. offer-measure: 390x844 787/788 FITS, 414x896 839/840 FITS, 360x740 683/684 FITS, 375x667 610/611 FITS. A new dev server on 8707 was started with up8707.sh because none was listening.

## Left in the working tree, NOT committed, NOT measured (could not run, turn budget)
- Task 3 CSS (cover ID sheet on the phone) written in the first `@media (max-width: 700px)` cover block of app/globals.css: plate at `object-position: 50% 100%`, `.cover-foot` relative z-index 3, `.layer-sheet` absolute with `inset: auto 0 calc(100% + 7.6rem) 0` and an ink scrim, compact rows (dd 14px, dt 12px, title 13px, row padding 3px; 1px under 760px height). It has never been rendered. Check with `node cov.cjs 390x844,414x896,360x740,375x667` in D:/tmp/ia3 (the sed edit of line 12-13 may need a syntax fix; it prints face hair/chin/sheetTop and element rects) and read cov-<w>.png. Expected: sheet top at least ~40px under the chin (chin = img.top + 0.576 * img.height), sheet bottom above the sound cue chip (~114px from the viewport bottom), no horizontal scroll. If the result is bad, `git checkout app/globals.css` drops it.
- A dev-server quirk: after an Edit the CSS sometimes is not recompiled; a `sed -i` rewrite of any comment forced it.

## Not covered (turn budget), all could not run
- Task 3 verification and commit (above).
- Type sweep of cover, projects, experience and Let's talk for body <15px and labels <12px: not started. Known: Let's talk hint is 12px, `.end-of-file` 10.8-12.4px (below the 12px label floor on 360-390), `.professional-name` 14px.
- Sheet images: D:/tmp/ia3/off2-390.png (offer at 390), cov-390.png (cover before the sheet change).
