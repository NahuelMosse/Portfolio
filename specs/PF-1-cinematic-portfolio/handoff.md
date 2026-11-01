# Handoff PF-1 T6 (case file layout)

## Done (committed on portfolio-revamp)
- New layout built: top bar, typed chapters, paper only behind the id sheet, folders and credits sheet, spine thread, compact case and employer rows.
- `e2e/case-file-layout.spec.ts` (RED then green) and `e2e/case-file-layout-contracts.spec.ts` (replacements, logged L61 to L69): 14 passed at 390 and 1440.
- Last coordinator round fixes: employer grid (the `grid-area: pieces` rule now scoped to `.project`), folder overlap on phone, NAWI title right of the id sheet at wide, `.hero-door` transition.
- Gate (last verify run): types passed, overflow passed, probes passed, specs/states/layers/shape/boundaries passed. Motion had one item (hero door hover transition) fixed afterwards, not re-run.

## Not covered (turn budget), each could not run
- Visual check of the last captures (`.validation/rebuild/d-*.png`, `m-*.png`) for: Experience at 1 screen per employer (desktop and 390), Jüsto pieces next to its row, NAWI whole beside the sheet, folder overlap at 390.
- Re-run of `node .claude/tools/verify.mjs specs/PF-1-cinematic-portfolio` after the last commit (motion line).
- Point 5 of the coordinator: the credits roll stays, because PF-1-ASM-18 and PF-1-S22 require it. Removing it needs the card to change.
- lint cannot run (the repo's eslint config lacks the react-hooks plugin); fonts gate fails on 3 families (Courier Prime was already there); ref gate wants named captures; fonts/film ASM-15 e2e fail on localhost vs 127.0.0.1.
- The shared app is down (`app.mjs down` ran before the last restart; the last `up` is still alive and must be brought down).
