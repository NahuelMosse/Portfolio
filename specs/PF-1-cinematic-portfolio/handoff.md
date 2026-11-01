# Handoff PF-1 T2 T3 T6 T7

## Done (written, build and tsc clean at the last build; e2e not re-verified after the last three edits)
- features/film/presentation: lamp-light.tsx, hire-bar.tsx, seam-figure.tsx, chapter.tsx, film-shell.tsx, crimson-thread.tsx, cold-open.tsx (red-disc.tsx deleted); features/film/index.ts exports SeamFigure.
- features/portfolio/presentation: hero-poster, character-sheet, projects, experience, offer, end-credits, piece-row, case-details; content.ts (identity, doorHref, club copy without "booking").
- app/page.tsx, app/layout.tsx, app/globals.css, design/tokens.css, public/ASSETS.md, public/fonts/courier-prime-400.woff2.
- e2e/case-file.spec.ts committed RED (769e42c).

## Left
1. Re-run e2e: `PORT=3100 npx playwright test e2e/case-file.spec.ts --reporter=line > .validation/cf.log 2>&1`, then the whole e2e. Last full run was 52 passed, 12 failed, before the lamp tie, pf-desk ids and booking-copy fixes. The Bash tool here runs cmd: do not put `|` inside --grep, run whole files.
2. credits.spec.ts S18 sound focus ring (outlineStyle none): not investigated.
3. film.spec.ts ASM-15: expects Courier Prime among loaded fonts; only Boska and General Sans load. Use Courier Prime on a visible label or replace the test.
4. Old tests naming dropped assets or DOM (pieces.spec.ts S26, S16, [data-piece-strip]; scene-media.spec.ts S2; credits.spec.ts ASM-26; film.spec.ts ASM-21): replace in new files with the same tags, Log `replaces:` lines.
5. design/line.md sections 1 to 5 empty; T6 Tasks line paths; `reuses:`/`new:` lines.
6. Gate: eslint, tsc, probes (loading, reduced-motion, error), overflow, motion-audit, `verify.mjs` in background, `app.mjs down`.
7. Log one line per task T2, T3, T6, T7 with log.mjs.
8. Declared gaps: generated assets and the photos of him (public/ASSETS.md).
