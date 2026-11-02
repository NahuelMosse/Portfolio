# PF-1 T6 handoff (ASM-26 poster art)

## Done (written, not yet verified green)
- RED committed: e2e/project-poster-art.spec.ts (3865001). Failed on an assertion (dev-kit "real interface or diagram in the frame").
- features/portfolio/domain/screen-matrix.ts (rule): `screenMatrix({width,height,corners})` -> matrix3d string, validates input.
- presentation/scene-art.ts: per-project art data (crop, quad per image, handHeld on grit and club), `imageStyle`, `panelStyle`, `imagePixels`, `KIT_ART`.
- presentation/drawn-scene.tsx (client): panel `[data-printed-art]` with two `img[data-art]`, overlay `[data-scene-screen]` mapped by ResizeObserver, `data-mapped`.
- presentation/kit-diagram.tsx (client, useInView), kit-step-icon.tsx, kit-piece.tsx, kit-art.tsx.
- presentation/projects.tsx rewritten (Stage, Others, KitArt first in the kit spread); content.ts lost `documents` and the kit screenshot pieces (`pieces: []`); poster-device.tsx deleted (git rm).
- app/globals.css: old `.poster-device`/`.scene-document` rules replaced by `.spread-stage`, `.drawn-stage`, `.drawn-screen`, kit plate, kit-art, draw-on keyframes (reduced motion keeps the final state); design/tokens.css gets `--check-green`.

## Not covered (turn budget), each *could not run*
- tsc (`npx tsc --noEmit -p .`) and eslint on the changed files: a background run was started, its log `.validation/tsc.log` was empty at the last look.
- The gate `APP_URL=http://127.0.0.1:55879 npx playwright test e2e/project-poster-art.spec.ts --timeout=120000` (log `.validation/green.log` if the background run finished): result unread.
- Captures at 1440 and 390 (D:/tmp/ill3/walk-b.cjs plus a zoom per drawn screen) and looking at them: the crops, the kit plate and art placement, the fade widths and the pieces' `margin-top` on phone scenes are unverified guesses.
- Old e2e/project-poster.spec.ts still references `[data-poster-device]`: replace or drop it (superseded by project-poster-art.spec.ts) and log the replacement.
- card.md: `reuses:`/`new:` lines under the T6 production tasks, layer marks, the Log line (`node .claude/tools/log.mjs specs/PF-1-cinematic-portfolio "T6 · ..."`), docs/features page update.
- The illustrations in public/film (ill-scene-*, ill-kit-*) are untracked: add the ones used (grit 4x5, triaje 16x9/4x5, cebador 16x9/4x5, club 16x9, kit 16x9/4x5) to the commit.
- App is left up; do not run `app.mjs down`.
