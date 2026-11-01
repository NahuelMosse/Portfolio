# Handoff · T2, T4, T5 (builder, turn budget reached)

## Done
- RED committed (cf99007): e2e/scene-media.spec.ts, e2e/offer.spec.ts, e2e/pieces.spec.ts. Two in-place mechanical fixes declared as `refactor-tests:` in `## Gate` (tsc types in scene-media.spec.ts; S16 selector prefix match in pieces.spec.ts).
- Code (uncommitted before this commit): features/film/{index.ts, presentation/scene-media.tsx, cold-open.tsx, scene-asset.ts, reveal.tsx}; features/portfolio/presentation/{piece.tsx, offer.tsx, end-credits.tsx, projects.tsx, experience.tsx, hero-poster.tsx (backdrop + first door), content.ts (pieces, offer detail/door)}; app/globals.css (scene media, pieces, grain, employer band contrast, @source not for specs/.claude/catalog/cv/public, which fixed a Tailwind "Invalid code point" build crash caused by card.md); public/ASSETS.md (every generated asset a declared gap with tool, prompt, license, status, prompts updated to the Baroque fresco ASM-20); public/film/justo-team.webp and public/film/pieces/* (real captures: Cebador webm at 1280 and 390 + posters, ClubNahuelMosse 4 README screens, Grit 4 screens, Triaje 3 captures); specs/PF-1-cinematic-portfolio/steps/{loading,reduced-motion,error}.json.
- Before the last CSS/ASM-20 round: `npx playwright test e2e` -> 46 passed, tsc and eslint clean. The final rerun (after removing the arch radius and the ASSETS prompt edits) was started but its result was not read.

## Assumptions to log
- Dev kit "pull request it closed" = NahuelMosse/motion-audit #7 (a public skill of the kit); no merged PR exists in dev-kit or Portfolio.
- Pieces' grain is a CSS feTurbulence overlay (pf-grain-1x1 stays a gap until delivered); torn paper (pf-paper-torn) is not wired anywhere yet (needs the file to decide where).
- Generated-asset tests (S1 video, ASM-17 failure paths, S24/ASM-20 with real files, ASM-14 poster time) annotate `gap` and pass without the files: they could not run on real media.

## Not covered (turn budget)
- Gate `node .claude/tools/verify.mjs` after the last fixes: could not run. Last full run failed on motion (project entrances: fixed with Reveal, not re-run), overflow at 1280 pseudo-localized (offer h3 line-height raised to 1.05; `h2.poster-word` "Let's talk" scrollHeight 445 > 399 still unverified, belongs to the T3 CSS), axe color-contrast on the current employer band (band now rgb(137 24 19), not re-run), boundaries (fixed with features/film/index.ts, not re-run).
- `required` lists group A files (components/ui/*, fonts, depth-stage, character-sheet) not in any Tasks line: the main thread adds them.
- `specs` S17, S18, S21, S22 untagged and the `ref` captures belong to other tasks and the designer.
- Log lines (`log.mjs`) for T2, T4, T5 not written; app not brought down (verify handled it).
- ASM-12 names the doors "Start a project" / "Bring me in as TPM", but the committed @PF-1-S27 test needs the TPM door to say AI; the doors currently read "Hire me for a project" / "Bring AI-first delivery to your team".
- `.arch-media` keeps only the aspect ratio now (no closed frame, per ASM-25 note).
