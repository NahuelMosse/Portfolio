# Handoff T6 variant D (grouped chapters, ASM-26)

Worktree D:/projects/Portfolio-d, branch portfolio-present-d. Live app http://127.0.0.1:64913 (pid 49372) is the requester's: do not bring it down.

## Done
- e2e/project-groups.spec.ts (committed, 7 tests): 6 pass, 1 fails (experience height).
- content.ts: sonria and miga projects plus `groups` (apps grit/club, landings cebador/sonria/miga, game guardia, dev-kit).
- project-showcase.tsx, projects.tsx, kit-scene.tsx: grouped pinned scenes with click tabs.
- experience.tsx: compact timeline (five employers, details for problem and role, work strip).
- showcase.css, design/tokens.css (`--beat-run` 42svh, spot colors), design/brand.json, app/globals.css (compact timeline styles).
- Untracked webp: pieces sonria-* and miga-* at 1440 and 390 (2x); triaje-* recaptured at 2x (tracked, do not stage).
- Heights: page 390 22910 -> 15631, 1440 23780 -> 13924. Groups 1907 (390) and 2034 (1440); dev kit 2616 and 2790.

## Open bug (cause found)
Experience is 2898 px at 390 and 1398 at 1440 (ceilings 1350 and 1170). The served CSS has TWO `.employer-index` rules in app/globals.css: the new one (`font-size: var(--text-title)`, about line 3248 of served css) and an old poster-style one later (`font-size: var(--poster-word-size-phone)`, about line 3700, followed by `.employer h3`), which wins and makes the index 273 px tall. Delete the old block and the stale comment "experience: each employer is a band of its own..." near line 1300 of app/globals.css, then re-measure with D:/tmp/d6/exp.mjs.

## Not covered (turn budget)
All *could not run*:
- Fix of the duplicate `.employer-index` rule, then re-run `APP_URL=http://127.0.0.1:64913 npx playwright test e2e/project-groups.spec.ts`.
- tsc: `node .claude/tools/once.mjs types -- npx tsc --noEmit`.
- Plates plate-{sonria,miga}-{16x9,9x16}.webp: check D:/tmp/ill4/chain-landing.log, view them.
- Card edit: ASM-26 clause and T6 (grouped result, `reuses:` lines); `replaces:` Log lines for superseded content.spec project/experience tests (via log.mjs).
- Full e2e once in background, classified main vs this branch; fix layout failures caused here.
- Design round (--gpu --scrub --brand design/brand.json, 390 first).
- Grit 2x: no source (needs a device run of the Flutter app).
- Log T6 evidence with log.mjs; final commit of code only (no images).
