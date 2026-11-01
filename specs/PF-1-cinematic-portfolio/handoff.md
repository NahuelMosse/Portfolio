# Handoff · T6, T7 (builder, context cap reached)

## Done
- RED committed (6c74893): e2e/credits.spec.ts (10 tests, S17 S18 S21 S22 ASM-04 08 12 13 18 25), e2e/machine-text.spec.ts (T7: ASM-07, S14, ASM-16; S14 and ASM-16 already pass). New file instead of content.spec.ts because committed tagged tests cannot be edited.
- Code written, UNVERIFIED (tsc had one error, fixed by a wrapper div in crimson-thread.tsx; no test run since):
  - features/film/presentation/{crimson-thread, seam-figure, credits-roll, call-to-action, chapter-index (SkipIntro + ChapterIndex), sound-toggle}.tsx; chapter.tsx (seamSide prop, h2 tabIndex -1); film-shell.tsx (fresco, thread, controls; props chapters, skipLabel, cta); scene-asset.ts (mp3); index.ts.
  - features/portfolio/presentation/end-credits.tsx (stays in portfolio, not film/end-credits.tsx as the Tasks line says: it needs content.ts), content.ts (credits with logos, door prompts), projects/experience (header column so motion-audit sees the Reveal article; data-thread-stop), offer.tsx, character-sheet.tsx (data-sealed-card), hero-poster.tsx (h1 tabIndex).
  - app/page.tsx, app/llms.txt/route.ts (offer lines), app/globals.css rewritten on design/tokens.css (new file, all colors, durations, radius, space), components/ui/{marquee, border-beam, sticky-scroll-reveal}.tsx moved to tokens, public/ASSETS.md (pf-soundtrack gap), design/line.md copied from the template, EMPTY (sections 1 to 5 not filled).
  - Overflow fixes: .poster-word padding-bottom var(--poster-descent); .offer h3 line-height 1.2.

## Left
1. ASM-26 (coordinator message, card commit f18bf1f): add a test tagged @PF-1-ASM-26 in a NEW RED commit, then build: chapter titles straddle the edge with the previous chapter; the one red disc travels down the page with scroll and becomes the closing's rising disc; figure slots mirrored and oriented toward the next chapter; one thin HUD rail with a tick per chapter down the whole page; no full-width background change between chapters (today .chapter[data-tone="paper"] is a full-width bone band: needs resolving).
2. Fill design/line.md sections 1 to 5 (card ## Look, ASM-09/15/20/25/26).
3. Run: `npx tsc --noEmit`, `npx eslint .`, `npx playwright test e2e/credits.spec.ts e2e/machine-text.spec.ts` then whole e2e (existing tests may break: dark chapters now transparent, .chapter overflow-x only, doors reduced to 2 links, hero-door), then `node .claude/tools/verify.mjs` in background. Check: motion (Reveal), overflow pseudo-localized, required (tokens), ref and dead-clicks via design-round.mjs (could not run if captures are needed).
4. Update the T6 Tasks line (end-credits.tsx path, seam-figure.tsx), write Log lines T6 and T7 with log.mjs, `node .claude/tools/app.mjs down`.
