# Handoff PF-1 T6

## Done (committed, portfolio-revamp, not pushed)
- Phone hero in flow: `transform: none !important` on `.layer-sheet` and `.layer-mark` at 700px and under; `e2e/hero-flow.spec.ts` (@PF-1-ASM-27, 320 and 390) green.
- General Sans dropped for Courier Prime (css, preload, tokens, design/line.md); replacements in `e2e/fonts-two-faces.spec.ts` (logged L70, L71).
- S2 replaced by `case-file-layout-contracts.spec.ts:180` (L72). Lint wired with react-hooks (passes). `.corner-cta` opacity-only, `app/loading.tsx` with main and h1.
- Cold open uses `pf-cover-him-*` when present; `features/portfolio/presentation/profile-seam.tsx` between Projects and Experience; `ASSETS.md` updated. The four webp files are untracked on purpose, never commit them.
- Last verify (`.validation/t6-verify3.log`): suite 55 passed, 2 failed (old scene-media S24 and ASM-20 tests, already replaced in L67); ref failed (no real reference captures, L75); rounds, I-tokens, dead-clicks, contrast and focus could not run.

## Not covered (turn budget), each could not run
- Phone cold-open framing (coordinator's last request): at 700px and under, `.layer-backdrop { height: 64svh }` (about L1246 of `app/globals.css`) and `.layer-sheet { margin-top: 12svh }` (about L1282) must change so the sheet top lands at about 85-90svh, with his face and the envelope visible above it. Check 320, 390 and 390x664.
- New test in a new file (for example `e2e/hero-framing.spec.ts`) tagged @PF-1-ASM-26: at 390 the sheet top is at least 80% of the viewport height at scroll 0. Write it RED first, commit, then fix the CSS.
- Re-run only hero-flow, the new spec, overflow and motion; then a fresh `.validation/review/m-cold-open.png` with `node .validation/review-shots.cjs <APP_URL>` (app down then up after the CSS change), and commit.
