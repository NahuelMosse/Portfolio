# PF-3 handoff

Done (uncommitted before this handoff, committed with it): new tests `e2e/mobile-memory.spec.ts`, `e2e/mobile-viewport.spec.ts`, `e2e/mobile-devices.spec.ts`; production changes in `features/portfolio/presentation/group.css`, `showcase.css`, `use-group-track.ts`, `project-group.tsx`, `showcase-device.tsx`, `piece-image.ts`, `piece-shapes.json`, `scripts/derive-shapes.mjs`, and `app/globals.css`.

Last run (`.validation/green.log`, 24 passed, 43 failed) mixes the new specs with the existing suites. Many failures also hit desktop (`one-screen-sections` at 1910, 1440, 1280 and 2560, `project-presentation` at 1440), with errors such as `getBoundingClientRect` of null and `toHaveCount`. Check first whether the dev server on port 8703 was healthy or whether a change broke the page: open `/` and read the dev log. Then separate real regressions from stale assertions about the old glow, tilt and `svh`.

Left: fix the failures, then eslint, tsc, `overflow.mjs`, docs (`docs/features/<feature>.md` with a `tests:` list), the formatter, `verify.mjs` in the background, Log lines for T1 to T3, and kill the dev server with the pid in `.validation/dev.pid`.
