# PF-3 handoff

Done (committed): new tests `e2e/mobile-memory.spec.ts`, `e2e/mobile-viewport.spec.ts`, `e2e/mobile-devices.spec.ts`; production changes in `features/portfolio/presentation/group.css`, `showcase.css`, `use-group-track.ts`, `project-group.tsx`, `showcase-device.tsx`, `piece-image.ts`, `piece-shapes.json`, `scripts/derive-shapes.mjs`, and `app/globals.css`.

Last run (`.validation/green.log`, 24 passed, 43 failed) mixes the new specs with the existing suites. Many failures also hit desktop (`one-screen-sections` at 1910, 1440, 1280 and 2560, `project-presentation` at 1440), with errors such as `getBoundingClientRect` of null and `toHaveCount`. Check first whether the dev server on port 8703 was healthy or whether a change broke the page: open `/` and read the dev log. Then separate real regressions from stale assertions about the old glow, tilt and `svh`. Known real failures: S3 "pin top at 844"; S4/ASM-06 second phone at 664 is 242 tall against a 251 minimum for Sonría and Miga.

## Not covered (turn budget)

- *could not run*: fixing the 43 failing tests.
- *could not run*: eslint, tsc, `overflow.mjs`.
- *could not run*: docs (`docs/features/<feature>.md` with `Tested:` lines and a `tests:` list), and the formatter.
- *could not run*: `verify.mjs` (mutation and lint).
- *could not run*: Log lines for T1, T2, T3.
- *could not run*: bringing the dev server down (pid in `.validation/dev.pid`).
