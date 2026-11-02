# PF-1 T6 designer redesign round (ASM-26) handoff

## Done
- `design/brand.json` (Boska, General Sans, Courier Prime; ink, bone, crimson, five product colors). Use `--brand design/brand.json` in every round.
- `specs/PF-1-cinematic-portfolio/critique.md` written (score 62, redo: project posters, project text, kit lead).
- Baseline round `rondas/r4` (390 and 1440 only): 20 FAIL rows (text contrast 20/27, text over images 20/32, tap targets 9, dead clicks 2, image widths 7/28, pasted boxes 6, brand page background 0.023, CTA separation, frames with flags). Contact sheets: `rondas/r4/m390.png`, `d1440.png`; project walk by `D:/tmp/des/walk.cjs <url> <tag>` -> `.validation/cap/<tag>-{d,m}-<i>[b].png`. Row details: `node D:/tmp/des/rows.cjs r4 "<rule>"`.
- Code (uncommitted until the commit that carries this file): `features/portfolio/presentation/project-backdrop.tsx` (+ `ProjectPlate`, returns null while the plate files are missing), `projects.tsx` (renders the plate), `app/globals.css` (bright fields with ink type on teal, pink, lime; backdrop at 0.3 opacity; `.plate` multiply layer; words 94vw/(chars*.55) capped 34vw and solid; tonal numeral 30vw; ink bezel and hard shadow on the lead frame; ink slabs for title and details), `design/tokens.css` (word 34vw, numeral 30vw), `id="cold-open"` and `id="contact"` (the two dead clicks).

## Images (Codex, one at a time, a chain is running or finished)
- Chain `D:/tmp/ill4/chain.sh` -> `D:/projects/Portfolio/.media-source/ill4/plate-<kit|grit|guardia|cebador|club>-<16x9|9x16>.png` (one-ink black on white plates; prompts in `D:/tmp/ill4/gen-plate.sh`); ends by writing `D:/tmp/ill4/chain.log`. Done at handoff: plate-kit 16x9 (good, looked at) and 9x16. Check `ps` before re-launching, never two codex at once; regenerate bad ones by running `sh D:/tmp/ill4/gen-plate.sh <p> <a>`.
- Convert with `sh D:/tmp/ill4/conv.sh` (kit webps already in public/film). Never `git add` webp or png.

## Left (each *not done*)
- Look at every plate, regenerate bad ones; convert; then walk (`walk.cjs`) and read both widths; tune plate `object-position`, word overlap on the phone sections, numeral and slab placement (code written blind).
- At least 3 `design-round.mjs ... --brand design/brand.json --widths 390x844,1440x900` rounds (r5, r6, r7), `rondas.md` Round 4..6 entries (5 differences each), Log lines per round via `node .claude/tools/log.mjs`.
- Run `npx playwright test e2e/project-backdrop.spec.ts e2e/designer-line.spec.ts e2e/phone-glance.spec.ts e2e/hero-flow.spec.ts` (APP_URL http://127.0.0.1:56563); title h3 is now a small slab label (the poster word is the title); the committed backdrop spec forbids transform and blend on the interface chain, which holds.
- Remaining red rows: text contrast and text over images (check slabs fixed them), tap targets (wordmark 63x42, chapter links 21px, proof link 24px), image file widths (pieces served 390 wide, shown 294 at DPR 2), pasted boxes of the experience photos, CTA separation, brand page background tint.
- Experience, offer and contact are still unredesigned (critique level difference 5). `npx tsc --noEmit` not run.
- App at http://127.0.0.1:56563 was not started by this builder: do not `app.mjs down`.
