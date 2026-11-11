# PF-5 · the turn between two projects runs smooth: no image pops or jumps

status: proposed
cap: 240 min
sources: the requester's chat message, 2026-11-11 (no Jira card), frozen in .validation/request.md
not_read: none

## Specs

- S1 · "las transiciones entre diferentes proyectos, tipo cuando hace transicion horizontal se siente trabada"
- S2 · "creo que hace popeo alguna imagen, y pasa en pasi todas"
- S3 · "hace que se sienta trabado y creo que no es que se trabe, sino que se alguna imagen salta"
- PF-5-ASM-01 · "pops" is an image that comes into view, or is in view, during a turn between two projects of a group (and the second after it) and changes there: it shows the blank placeholder and then its picture, it swaps its source, or its box changes size. Walking down every turn of every group at 1440x900 and at 390x844, no image in view does any of the three · S2
- PF-5-ASM-02 · "jumps" is a layer of the stage (the art, the word, a device, a screen) that moves between two frames of a turn by more than the turn itself moves it: walking down a turn frame by frame at 1440x900 and 390x844, every layer of the two projects moves only one way and never by more than twice its largest step in the frames around it (the handoff halfway through the turn included) · S3
- PF-5-ASM-03 · the turn is "stuck" when it shifts the layout or the main thread blocks while it runs: walking the turns of every group there is no layout shift, and no image fetch or decode starts for an image that is already in view · S1
- declared · S3 · «no es que se trabe, sino que alguna imagen salta» is one behavior, the requester's own diagnosis of S1: its second branch is ASM-02's test and its first (it is not real jank) is ASM-03's
- PF-5-ASM-04 · the fix keeps PF-3's phone budget: on a phone the groups far from the view are still skipped (content-visibility) and nothing keeps will-change or a 3D transform; images may be fetched earlier, never kept as extra layers · S1

## Tasks

- T1 · S1,S2,S3,ASM-01,ASM-02,ASM-03,ASM-04 · features/portfolio/presentation/project-group.tsx (presentation), features/portfolio/presentation/use-group-track.ts (presentation), features/portfolio/presentation/showcase-device.tsx (presentation), features/portfolio/presentation/group.css (presentation), features/film/presentation/scene-media.tsx (presentation), features/film/presentation/plate-loader.tsx (presentation) · tests: e2e/project-turn-smooth.spec.ts "walking every turn at 1440x900 and 390x844, no image in view shows its placeholder, swaps its source or changes its size @PF-5-S2 @PF-5-ASM-01"; e2e/project-turn-smooth.spec.ts "frame by frame through a turn, no layer of the two projects steps back or jumps, the handoff included @PF-5-S3 @PF-5-ASM-02"; e2e/project-turn-smooth.spec.ts "walking the turns there is no layout shift and no image starts loading while in view @PF-5-S1 @PF-5-ASM-03"; e2e/project-turn-smooth.spec.ts "on a phone the far groups stay skipped and nothing keeps will-change or a 3D transform after the walk @PF-5-ASM-04"
  reuses: features/portfolio/presentation/use-group-track.ts useGroupTrack momentAt (the turn's timeline and its CSS variables); features/film/presentation/plate-loader.tsx PlateLoader (the deferred images' queue); features/portfolio/presentation/showcase-device.tsx Face, useShownShape

## Changes to existing behavior

- the project turns of every group: the layers move continuously through the handoff and the next project's pictures are ready before it comes into view · e2e/project-wipe-transitions.spec.ts, e2e/project-groups.spec.ts, e2e/project-scroll-groups.spec.ts, e2e/mobile-memory.spec.ts, e2e/mobile-memory-offscreen.spec.ts, e2e/mobile-devices.spec.ts stay valid
- the look of the stages does not change

## Look

- plain: the card asks for no new look; it fixes how the existing turns between projects move and when their images arrive

## Gate

```
suite: npx playwright test e2e/project-turn-smooth.spec.ts e2e/project-wipe-transitions.spec.ts e2e/project-groups.spec.ts e2e/project-scroll-groups.spec.ts e2e/project-showcase.spec.ts e2e/mobile-memory.spec.ts e2e/mobile-memory-offscreen.spec.ts e2e/mobile-devices.spec.ts e2e/slow-line.spec.ts e2e/scene-media.spec.ts
lint: npx eslint .
types: npx tsc --noEmit
app: npx next build && npx next start -p $PORT
```

## Log

- L1 · "las transiciones entre diferentes proyectos, tipo cuando hace transicion horizontal se siente trabada, porque creo que hace popeo alguna imagen, y pasa en pasi todas, hace que se sienta trabado y creo que no es que se trabe, sino que se alguna imagen salta"
- L2 · 2026-11-11 · candidates from reading the code, to be measured, not yet evidence: (a) group.css --p = cur*hold + (1-cur)*0.5 jumps by 0.5 on both cards at the handoff halfway through a turn (old card 1 to 0.5, new card 0.5 to 0), moving the plate, backdrop and word in one frame; --hold is written by the scroll handler and --cur by a React render, so they can land in different frames (old card p 1 to 0 to 0.5); (b) useShownShape reads the 1x1 DEFERRED_BLANK placeholder first (shape 1) and the device's --shape changes when the capture loads (phones, group.css aspect-ratio/--browser-height); (c) Face swaps an img for SceneMedia when a capture turns on, mounting a fresh deferred img with the blank placeholder that waits in PlateLoader's queue; (d) a card turns visible (data-reachable) only at the handoff, so its images get PlateLoader's hidden penalty until then
