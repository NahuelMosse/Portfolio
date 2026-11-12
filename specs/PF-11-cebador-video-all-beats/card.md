# PF-11 · Cebador plays its live capture on all three beats, with Origen fully drawn

status: proposed
cap: 150 min
sources: the requester's chat message (no Jira card), frozen in .validation/request.md with the context gathered before the card
not_read: none

## Specs

- S1 · "en cebador creo que es mejor dejar el video en las 3 secciones"
- S2 · "asi no se corta a una imagen que de hecho ya viste en el video"
- S3 · "en el video, la parte de origen no habia terminado de cargar, tanto en la pantalla como en el telefono, y se ve feo"
- PF-11-ASM-01 · on each of Cebador's three beats, at 1440x900 and at 390x844, the browser device plays cebador-1280.webm and the phone device cebador-390.webm, captioned "Live"; the Flavor and Shop stills leave the scene (their files stay in public/); each device keeps the same video element across the beats, with no new load and no jump back to the start; the phone keeps standing beside the page (the two-layer composition Cebador had with its phone stills) · S1, S2
- PF-11-ASM-02 · "had not finished loading" is read as Origen's reveal animations caught half way: the section has no images and its fonts were loaded (measured in L2); what was seen was the heading words still rising, the paragraph faded, the Misiones map not drawn and the four counters still counting. On every frame of both captures where Origen is on screen, its heading, paragraph, map (contours, pin, labels) and four stats are at their final state, with their final numbers, and the page's fonts are loaded; the recorder plays those reveals on the real clock before it freezes the page's clock, and writes what it measured per frame · S3

## Tasks

- T1 · S1,S2,ASM-01 · features/portfolio/presentation/content.ts (presentation), features/portfolio/presentation/project-group.tsx (presentation), e2e/best-screens-walk-live.spec.ts, specs/PF-8-broken-tests-and-local-paths/retired.txt · tests: e2e/cebador-all-beats.spec.ts "on Cebador's three beats at 1440x900 and 390x844 the page and the phone play their live captures, the same video elements without a reload or a restart @PF-11-S1 @PF-11-S2 @PF-11-ASM-01"; e2e/best-screens-walk-live.spec.ts "walking each project chapter with the wheel at 1440x900 and 390x844, every beat shows the planned visual screens of that project, loaded @PF-2-S1 @PF-2-S2 @PF-2-ASM-01 @PF-11-S1"; e2e/best-screens-walk-live.spec.ts "desktop and phone screens of a project come in equal numbers and show the same section on the same beat @PF-2-ASM-02 @PF-11-S1"
  reuses: features/portfolio/presentation/project-group.tsx screenAt, companion, hasPhoneScreens (a single phone capture counts as a real phone screen); features/portfolio/presentation/showcase-device.tsx Face keeps a face mounted while it stays on
- T2 · S3,ASM-02 · scripts/record-cebador.mjs (data), scripts/record-cebador.origin.json (data), public/film/pieces/cebador-1280.webm (data), public/film/pieces/cebador-390.webm (data), public/film/pieces/cebador-1280-poster.webp (data), public/film/pieces/cebador-390-poster.webp (data), public/film/r/480/pieces/cebador-1280-poster.webp (data), public/film/r/800/pieces/cebador-1280-poster.webp (data), public/film/r/960/pieces/cebador-1280-poster.webp (data), public/film/r/360/pieces/cebador-390-poster.webp (data), features/portfolio/presentation/piece-bars.json (data), features/portfolio/presentation/piece-widths.json (data), features/film/presentation/plates.json (data), features/film/presentation/media-versions.json (data) · tests: e2e/cebador-origin-loaded.spec.ts "on every frame of both Cebador captures where Origen is on screen, its heading, paragraph, map and four stats are at their final state and the fonts are loaded @PF-11-S3 @PF-11-ASM-02"
  reuses: scripts/record-cebador.mjs record, installClock, readStops (the frame-by-frame recorder of PF-6; the reveals are played before the clock freezes)

## Changes to existing behavior

- Cebador's scene: the browser and the phone play their captures on all three beats instead of turning to the Flavor and Shop stills · e2e/best-screens-walk.spec.ts (@PF-2-S1, @PF-2-S2, @PF-2-ASM-01, @PF-2-ASM-02) planned those stills on beats 1 and 2: replaced in L3 and L4
- the two Cebador captures and their posters are recorded again on the same 10.5 s timeline, sizes and frame rate · e2e/cebador-capture-frames.spec.ts (@PF-6-S1, @PF-6-ASM-01, @PF-6-ASM-04) stays valid; PF-9 gives them a new ?v= from their new bytes

## Look

- plain: the card keeps PF-1's devices and scene; it only changes which pieces Cebador shows and records the same captures again

## Gate

```
suite: npx playwright test e2e/cebador-all-beats.spec.ts e2e/cebador-origin-loaded.spec.ts e2e/best-screens-walk-live.spec.ts e2e/cebador-capture-frames.spec.ts e2e/cebador-playback.spec.ts e2e/media-cache-busting.spec.ts e2e/media-cache-busting-members.spec.ts e2e/media-cache-busting-urls.spec.ts e2e/retired-tests.spec.ts --grep-invert "@PF-6-ASM-02" --workers 1
lint: npx eslint .
types: npx tsc --noEmit
app: npx next start
```

## Log

- L1 · "y en cebador creo que es mejor dejar el video en las 3 secciones, asi no se corta a una imagen que de hecho ya viste en el video, ademas en el video, la parte de origen no habia terminado de cargar, tanto en la pantalla como en el telefono, y se ve feo"
- L2 · 2026-11-12 · measured · the live site (https://nahuelmosse.github.io/cebador-landing/, the recorder's source; https://lab.nawi.dev/cebador/ answers 200 too) after its loader at 1280x720 and 390x844: #origen holds no img, picture, video or CSS background image; document.fonts has Fraunces and Schibsted Grotesk loaded. Its main.js reveals Origen when each part crosses 20 % into view (IntersectionObserver, then GSAP): heading words rise 1.1 s with 0.07 s stagger, paragraph rises 1 s after 0.25 s, the map draws its six contours over 2.4 s + 0.22 s stagger, pin at 1.6 s, labels at 2 s, each stat slides 1 s and counts 1.8 s. The captures spend about 2 s on Origen, so contact sheets of the current captures (D:/tmp/pf11/old/sheet-1280.png, sheet-390.png) show the heading cut, the paragraph faded, no map and counters at 5, 7, 8 h, 15 g, 43 %, 70 %
- L3 · 2026-11-12 · replaces: e2e/best-screens-walk.spec.ts "walking each project chapter with the wheel at 1440x900 and 390x844, every beat shows the planned visual screens of that project, loaded @PF-2-S1 @PF-2-S2 @PF-2-ASM-01" · its plan has Cebador turn to the Flavor and Shop stills on beats 1 and 2, which S1 removes · by: e2e/best-screens-walk-live.spec.ts "walking each project chapter with the wheel at 1440x900 and 390x844, every beat shows the planned visual screens of that project, loaded @PF-2-S1 @PF-2-S2 @PF-2-ASM-01 @PF-11-S1"
- L4 · 2026-11-12 · replaces: e2e/best-screens-walk.spec.ts "desktop and phone screens of a project come in equal numbers and show the same section on the same beat @PF-2-ASM-02" · same plan of Cebador's stills on beats 1 and 2 · by: e2e/best-screens-walk-live.spec.ts "desktop and phone screens of a project come in equal numbers and show the same section on the same beat @PF-2-ASM-02 @PF-11-S1"
- L5 · 2026-11-12 · decision · the gate's suite leaves out @PF-6-ASM-02 (30 presented fps in headless Chromium): it is red on main under load (PF-6 L9, PF-8 L35) and is run apart, its result in the Log; e2e/project-presentation.spec.ts "each beat of a project shows a different screen" (@PF-1-ASM-26) is already retired by PF-8 and is not run
