# Handoff: variant D, pinned showcase (worktree Portfolio-d, branch portfolio-present-d)

## Done
- Pinned scenes: `use-scroll-beat.ts`, `showcase-device.tsx`, `project-showcase.tsx`, `kit-scene.tsx`, `showcase.css` (imported from app/globals.css), `projects.tsx` rewritten, `TrackPlate` in `project-backdrop.tsx`, tokens added to design/tokens.css.
- Old components removed (device-frame, piece, piece-row, project-spread, kit-diagram, kit-piece, kit-step-icon).
- Plates `plate-track-kit-16x9/9x16.webp` in public/film (untracked; PNG sources in D:/projects/Portfolio/.media-source/ill5d/). Never `git add` png/webp.
- Captures reviewed: grit, guardia, club at 1440 and grit at 390 are good. Kit at 390 is good.

## Open
- Kit 1440 (D:/tmp/ill5d/s/dev-kit-1440-p50.png): the card's top is cut under the copy shade and it does not sit above its station. Fix: per-beat `--x` matching the plate stations (9.5, 25.7, 38.3, 55.5, 75, 92%), and lower the card or the copy shade.
- Check guardia and cebador at 390.
- Remove dead old project CSS from app/globals.css by Edit (`.spread*`, `.poster-*`, `.frame*`, `.piece*`, `.stage`, old `.kit-*`; ranges in D:/tmp/ill5d/cut.cjs; the hook blocks scripts).
- At least 2 `design-round.mjs --gpu --scrub --brand design/brand.json` rounds (390 first), rondas.md, Log lines, commit per round.
- Run e2e specs that reference removed classes. Replace blocking ones with a new spec plus a Log "replaces:" line. Add a spec tagged @PF-1-ASM-26 (`--p`, beats, index, reduced-motion stills).
- `npx tsc --noEmit`, affected specs, then `node .claude/tools/app.mjs down` (dev server on 127.0.0.1:50522 is still up).

## Tools
`node D:/tmp/ill5d/shot.cjs <url> <outdir> <WxH> <project-id> <p0,p1,...>`
