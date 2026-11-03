# Handoff (builder 4) - branch portfolio-present-d, no push

## Done and committed (dev server http://127.0.0.1:8704, run with APP_URL)
- Engine, experience pinned scenes, hire bar yield, cold open dolly out (earlier builders). Cold open end state: e2e/asm35-cold-open-end.spec.ts 3 of 3 (sheet and corner button visible at the pin end at 1910x912, 1920x1080, 2560x1080); asm35-cold-open 3 of 3; one-screen-sections 28 of 28 serial.
- Experience handoff: experience-motion.tsx offsets (OUT_COPY, INK_FROM, IN_ART, IN_COPY) overlap incoming art/copy with outgoing ink and copy; wide panels transparent in experience.css. e2e/asm35-experience-handoff.spec.ts (56-tick walk) passes; asm35-experience-rest 3 of 3.
- ASM-36: CreditsRoll moved inside .contact-scene (end-credits.tsx) between the tiles and the footer; `.credits-roll` full bleed, `.contact-scene .chapter-word` 8vw (6vw under 780px high) = EXPERIENCE size. e2e/ending-block.spec.ts 5 of 5 (five sizes). Captures .validation/asm36/{before,after,final}-1910x912.png. Log L207, L208 (replaces).
- ASM-38: OFFER word (min(17vw,19svh)) already exceeds EXPERIENCE; e2e/offer-word.spec.ts 5 of 5; capture .validation/asm38/after-1910x912.png.
- Re-run (serial): contact-footer, contact-one-screen, one-screen, tools-plain, wide-screens-offer-detail-clear, one-screen-sections, id-sheet-no-photos pass. Under 3 workers a few one-screen specs flake (they measure before the pin spacer exists); run with --workers=1.
- tsc --noEmit and eslint (features, app, new specs): clean.

## Not covered (turn budget), all could not run
- ASM-35 scene 5 (Offer doors pin 150svh, push-in 1 to 1.25 at 52% 45%, cards rise) and scene 6 (Contact seal pull-back 1.6 to 1, letters, curtain), with their specs; their final states must keep ending-block.spec.ts and offer-word.spec.ts green. A pin adds a pin-spacer: keep the one-screen measurements taken after `.pin-spacer` exists.
- Chapter entrances (masked word lines, red rule, top-bar numeral) and projects draw-on; the page-wide walk spec and the reduced-motion transform sweep.
- Stale specs from the old layout still red (need `replaces:` lines or rewrite): case-file-layout-contracts (S8/S19 cold open, ASM-01 order, S22 roll, S26, ASM-10, ASM-24), credits.spec (thread, doors, hover, wheel), credits-liceo-8 (roll location), contact-drawing (L188), experience-scene/experience-photos (L204).
- Delete .validation/*.tmp.mjs; do not commit public/.
- The dev server serves stale CSS after a shell write to globals.css; an Edit-tool change makes it recompile.
