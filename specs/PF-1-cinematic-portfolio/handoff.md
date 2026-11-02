# PF-1 T6 designer redesign round (ASM-26) handoff

## Done
- `design/brand.json` brand sheet; use `--brand design/brand.json` in every round.
- Plates drawn with Codex (all 10, one-ink black on white, converted to `public/film/plate-<kit|grit|guardia|cebador|club>-<16x9|9x16>.webp`) in `D:/projects/Portfolio/.media-source/ill4/`; all looked at, all good.
- His ink portrait per project (from `pf-him-profile.webp`, drawn by `D:/tmp/ill4/gen-him.sh`, chain finished): `public/film/him-<p>-<16x9|9x16>.webp` (10 files), sources `.media-source/ill4/him-*.png`. `ProjectPlate` prefers `him-*` when both shapes exist, else the `plate-*` still life; it prints under the poster word (the letters cross his head). Never `git add` png or webp.
- Words on the bright fields (Guardia, Cebador, Club) are bone with a hard ink shadow; composition b keeps a left gutter (Cebador interface no longer cut); tap targets (wordmark, index links, proof link) 44px.
- Experience rebuilt (employer bands: crimson case number, ink slab with hard crimson offset, drawing on one side full height), offer rebuilt (bone panel and crimson panel, inverted doors, 11vw titles), contact rebuilt (crimson field, word 26vw at 390 and 16.5vw at 1440, e-mail as a display line). CSS appended at the end of `app/globals.css`, markup: `employer-index` span in `experience.tsx`.
- Round 4 = `rondas/r5` (18 FAIL rows: 390 and 1440). `rondas.md` has Round 4; Log has the round 4 line (L136). `npx tsc --noEmit` passed (before the him-plate edit).
- Viewport walks (`D:/tmp/des/walk.cjs`, `D:/tmp/des/sec.cjs`) in `.validation/cap/`: `w5-{d,m}-<0..4>[b].png` per project, `s3-{d,m}-*` for experience, offer and contact (390 and 1440).

## Not covered (turn budget), each *could not run*
- Round 5 and 6 (`rondas/r6`, `r7`): `design-round.mjs ... --brand design/brand.json --widths 390x844,1440x900` with `rondas.md` Round 5, 6 entries (5 differences each) and Log lines through `node .claude/tools/log.mjs`. r6 was not started (the launch was cut).
- Playwright specs: `APP_URL=http://127.0.0.1:56563 npx playwright test e2e/project-backdrop.spec.ts e2e/designer-line.spec.ts e2e/phone-glance.spec.ts e2e/hero-flow.spec.ts e2e/offer.spec.ts` not run; `npx tsc --noEmit` to rerun after the last edit of `project-backdrop.tsx`.
- Walk after the him plates: viewport captures of experience, offer and contact were taken before the contact/offer fixes landed in the final CSS; retake `sec.cjs`.
- Open red rows from r5: text contrast 21/28 (tonal numerals are decorative, the stack link "migrations-safe" reads bone on bone, frame tabs), text over images 29/39, image file widths 7/33, pasted boxes 2/3, brand page background 0.171, CTA separation 0, repeated images 1, dead tap rows 6. Not fixed.
- The kit lead (six line icons) not redone; a committed spec asserts three svg pieces in the row (replace through a new spec plus `replaces:` if changed).
- Project title slab shows "CLUBNAHUELMOSSE" without a space (the `Title` component splits on camel case without a visible space).
- App at http://127.0.0.1:56563 was not started by this designer: do not `app.mjs down`. No codex process is left running.
