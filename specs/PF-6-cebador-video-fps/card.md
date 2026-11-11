# PF-6 · the Cebador captures play smooth

status: proposed
cap: 180 min
sources: the requester's chat message, 2026-11-11 (no Jira card), frozen in .validation/request.md
not_read: none

## Specs

- S1 · "el video de cebador en la pantalla se ve a pocos fps"
- S2 · "haciendo que se sienta trabada la pagina"
- PF-6-ASM-01 · the low frame rate is in the files (measured in L2): a scroll moves in visible steps. They are recorded again from the live site frame by frame on a fixed 30 fps clock: each is 30 fps, at least 95 % of its frames differ from the one before, it lasts 10.5 s, weighs under 1.5 MB and its poster is its first frame · S1
- PF-6-ASM-02 · with the Cebador stage in view at 1440x900 and at 390x844, the browser presents at least 30 new frames a second of the main capture and of the phone's · S1, S2
- PF-6-ASM-03 · the phone keeps the main capture's clock (both show the same section at the same second) by speeding up or slowing down its own playback, never by a jump: after the first catch-up it does not seek again, the main's loop back to the start included, and stays within 0.2 s of the main · S2
- PF-6-ASM-04 · both captures walk the same sections at the same seconds of the 10.5 s timeline as before (hero, flavors, origin, ingredients, reviews, where to buy), driven by each section's place in the page at 1280 and at 390, so the shared clock keeps them on the same section · S1

## Tasks

- T1 · S1,ASM-01,ASM-04 · scripts/record-cebador.mjs (data), public/film/pieces/cebador-1280.webm (data), public/film/pieces/cebador-390.webm (data), public/film/pieces/cebador-1280-poster.webp (data), public/film/pieces/cebador-390-poster.webp (data), public/film/r/480/pieces/cebador-1280-poster.webp (data), public/film/r/800/pieces/cebador-1280-poster.webp (data), public/film/r/960/pieces/cebador-1280-poster.webp (data), public/film/r/360/pieces/cebador-390-poster.webp (data), features/portfolio/presentation/piece-widths.json (data), features/portfolio/presentation/piece-bars.json (data), features/film/presentation/plates.json (data), public/ASSETS.md (data) · tests: e2e/cebador-capture-frames.spec.ts "each Cebador capture is 30 fps with a new picture on at least 95 % of its frames, 10.5 s long, under 1.5 MB, its poster its first frame @PF-6-S1 @PF-6-ASM-01"; e2e/cebador-capture-frames.spec.ts "the 1280 and 390 Cebador captures show the same section at the same second of the shared 10.5 s timeline @PF-6-ASM-04"
  new: no recorder exists in scripts/ (derive-plates.mjs and derive-bars.mjs only derive copies); the earlier captures came from Playwright's screen recorder, which drops and repeats frames
- T2 · S1,S2,ASM-02,ASM-03 · features/portfolio/presentation/showcase-device.tsx (presentation) · tests: e2e/cebador-playback.spec.ts "with the Cebador stage in view at 1440x900 and 390x844 the browser presents at least 30 new frames a second of each capture @PF-6-S1 @PF-6-S2 @PF-6-ASM-02"; e2e/cebador-playback.spec.ts "the phone follows the main capture's clock within 0.2 s by its speed and never seeks after the first catch-up @PF-6-S2 @PF-6-ASM-03"
  reuses: features/portfolio/presentation/showcase-device.tsx useFollowMain (the follow loop keeps its place; the seek on drift becomes a speed correction)

## Changes to existing behavior

- the two Cebador captures and their posters are new files on the same timeline and at the same sizes · e2e/best-screens-walk.spec.ts (@PF-2-S1, @PF-2-ASM-02) and e2e/scene-media.spec.ts stay valid
- the phone beside the main capture follows its clock by playback speed instead of seeking every time it drifts past 0.15 s

## Look

- plain: the card asks for smoother playback of the same captures; their content, frames and devices keep PF-1's design

## Gate

```
suite: npx playwright test e2e/cebador-capture-frames.spec.ts e2e/cebador-playback.spec.ts e2e/scene-media.spec.ts e2e/best-screens-walk.spec.ts
lint: npx eslint .
types: npx tsc --noEmit
app: npx next start
```

## Log

- L1 · "el video de cebador en la pantalla se ve a pocos fps, haciendo que se sienta trabada la pagina"
