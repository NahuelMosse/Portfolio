# Handoff (builder 3: ASM-35 scroll engine, ASM-36/37/38) - branch portfolio-present-d, no push

## Done and committed
- ASM-37 cold open one screen (.cover-scene 100svh, NAWI min(41vw, 52svh), ink pool under the sheet). e2e/one-screen-sections.spec.ts 28 of 28 at the five sizes. Captures .validation/asm37/cold-open-{1910x912,1280x720}.png. Log L199-L202 (ASM-35/36/37/38 frozen, replaces ASM-30).
- ASM-35 engine: features/film/presentation/motion-engine.tsx (Lenis, GSAP ticker, has-motion), motion-kit.ts (+ features/film/motion.ts, the client-safe entry; the index pulls node:fs), head script in app/layout.tsx sets html.has-motion before paint. Reduced motion: no class, no Lenis. Touch: class only, native scroll.
- ASM-35 scene 4 experience: experience.tsx, experience-motion.tsx, experience.css (pinned stage wide >= 900, sticky scenes narrow, static without has-motion). e2e/asm35-engine (5/5), asm35-experience, asm35-experience-rest (3/3). Captures .validation/asm35/experience-1910x912-{0..5}.png.
- Phone HIRE ME bar: hire-bar.tsx slides away (data-yield) while .end-of-file is on screen; tested in asm35-engine at 390x844.
- Scene 1 cold open: RED committed (e2e/asm35-cold-open.spec.ts); code written (cold-open-motion.tsx, .cold-ink in hero-poster and globals.css): check g4 result .validation/g4.log and commit if green.

## Not covered (turn budget), all could not run
- ASM-35 scenes 5 (offer pin 150svh, push-in, cards rise), 6 (contact seal, letters, curtain), chapter entrances (masked word lines, red rule, top-bar numeral), projects draw-on, and their specs; the walk spec (no overlap, no empty viewport) and the reduced-motion transform sweep.
- ASM-36: ending block (roll back below Let's talk, tiles in one row, marquees re-toned AA on the red, footer last, one red ground, LET'S TALK font-size >= EXPERIENCE word); RED e2e/ending-block.spec.ts not written. The ASM-33/ASM-29 specs (contact-footer.spec.ts, one-screen.spec.ts contact test) go stale then: they need replaces lines.
- ASM-38: OFFER word at least the EXPERIENCE word's size (8vw, 6vw under 780px high), cards compacted; no spec yet. Currently .offer-scene --size-word is min(17vw, 19svh).
- Experience mid-transition ticks look nearly empty for a moment (lines leave before the ink covers); tighten timings in experience-motion.tsx.
- Existing specs that assert the old experience (experience-scene, experience-photos, wide-screens experience rows, project-wipe-transitions parts) are stale, see Log L204; full sweep, tsc --noEmit and eslint were not run.
- Delete .validation/*.tmp.mjs; do not commit public/.
