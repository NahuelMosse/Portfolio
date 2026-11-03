# Handoff T6 variant D (grouped chapters, ASM-26)

Worktree D:/projects/Portfolio-d, branch portfolio-present-d. Live app http://127.0.0.1:64913 is the requester's: do not bring it down. Run specs with `APP_URL=http://127.0.0.1:64913 npx playwright test <file>`.

## Done
- Groups by scroll, no click needed: project-group.tsx, use-group-track.ts, group.css. From 1280 with motion each group is one pinned scene (headline panel on one side, index as shortcut, horizontal track driven by scroll with a rest on each project); below 1280 or with reduced motion the headline and then each project as a stacked poster. e2e/project-scroll-groups.spec.ts 4/4. Old e2e/project-groups.spec.ts (click tabs) is replaced (Log).
- Heights: page 14063 -> 14189 at 390, 13641 -> 12669 at 1440.
- Experience: ruled ledger rows with a photo of him in the page ink per employer (experience.tsx, globals.css). 1239 at 390, 1165 at 1440.
- tsc exit 0. Captures in .validation/cap (v2-* groups, ey-exp-* experience; shot2.mjs and exp.mjs regenerate them).

## Not run
- Design round (design-round.mjs --gpu --scrub), full e2e classification; the old tests of the other specs that count the strip photos or tabs are stale (Log replaces lines).
- Do not stage any png or webp; the modified tracked triaje-*.webp stay unstaged.
