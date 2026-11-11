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

- T1 · S1,S2,S3,ASM-01,ASM-02,ASM-03,ASM-04 · features/portfolio/presentation/project-group.tsx (presentation), features/portfolio/presentation/use-group-track.ts (presentation), features/portfolio/presentation/showcase-device.tsx (presentation), features/portfolio/presentation/group.css (presentation), features/film/presentation/scene-media.tsx (presentation), features/film/presentation/plate-loader.tsx (presentation) · tests: e2e/project-turn-measured.spec.ts "walking every turn and the moment after it, no picture in view shows its placeholder, swaps its source or changes its size @PF-5-S2 @PF-5-ASM-01"; e2e/project-turn-measured.spec.ts "frame by frame through every turn and into the next hold, no layer of the two projects steps back or jumps, the handoff included @PF-5-S3 @PF-5-ASM-02"; e2e/project-turn-measured.spec.ts "walking every turn there is no layout shift and every picture in view is already drawn @PF-5-S1 @PF-5-ASM-03"; e2e/project-turn-smooth.spec.ts "on a phone the far groups stay skipped and nothing keeps will-change or a 3D transform after the walk @PF-5-ASM-04"
  reuses: features/portfolio/presentation/use-group-track.ts useGroupTrack momentAt (the turn's timeline and its CSS variables); features/film/presentation/plate-loader.tsx PlateLoader (the deferred images' queue); features/portfolio/presentation/showcase-device.tsx Face, useShownShape

## Changes to existing behavior

- the project turns of every group: the layers move continuously through the handoff and the next project's pictures are ready before it comes into view · e2e/project-wipe-transitions.spec.ts, e2e/project-groups.spec.ts, e2e/project-scroll-groups.spec.ts, e2e/mobile-memory.spec.ts, e2e/mobile-memory-offscreen.spec.ts, e2e/mobile-devices.spec.ts stay valid
- the look of the stages does not change

## Look

- plain: the card asks for no new look; it fixes how the existing turns between projects move and when their images arrive

## Gate

```
suite: npx playwright test e2e/project-turn-measured.spec.ts e2e/project-turn-smooth.spec.ts e2e/project-wipe-transitions.spec.ts e2e/project-groups.spec.ts e2e/project-scroll-groups.spec.ts e2e/project-showcase.spec.ts e2e/mobile-memory.spec.ts e2e/mobile-memory-offscreen.spec.ts e2e/mobile-devices.spec.ts e2e/slow-line.spec.ts e2e/slow-line-painted.spec.ts e2e/scene-media.spec.ts
lint: npx eslint .
types: npx tsc --noEmit
app: npx next build && npx next start
public-allow: specs/PF-6-cebador-video-fps/sessions.md [path] · already in main; the merge of main into this branch carries it unchanged
public-allow: specs/PF-7-triaje-phone-first-screen/sessions.md [path] · already in main; the merge of main into this branch carries it unchanged
```

## Log

- L1 · "las transiciones entre diferentes proyectos, tipo cuando hace transicion horizontal se siente trabada, porque creo que hace popeo alguna imagen, y pasa en pasi todas, hace que se sienta trabado y creo que no es que se trabe, sino que se alguna imagen salta"
- L2 · 2026-11-11 · candidates from reading the code, to be measured, not yet evidence: (a) group.css --p = cur*hold + (1-cur)*0.5 jumps by 0.5 on both cards at the handoff halfway through a turn (old card 1 to 0.5, new card 0.5 to 0), moving the plate, backdrop and word in one frame; --hold is written by the scroll handler and --cur by a React render, so they can land in different frames (old card p 1 to 0 to 0.5); (b) useShownShape reads the 1x1 DEFERRED_BLANK placeholder first (shape 1) and the device's --shape changes when the capture loads (phones, group.css aspect-ratio/--browser-height); (c) Face swaps an img for SceneMedia when a capture turns on, mounting a fresh deferred img with the blank placeholder that waits in PlateLoader's queue; (d) a card turns visible (data-reachable) only at the handoff, so its images get PlateLoader's hidden penalty until then
- L3 · 2026-11-11 · T1 · code and e2e/project-turn-smooth.spec.ts written, NOT run: npm ci in this worktree never completed (TAR_ENTRY_ERROR on Windows), so no next/playwright/eslint/tsc; fixes are from reading, not measured
- L4 · 2026-11-11 · kit: the time-cap hook reads specs/.current of the session cwd (D:/projects/Portfolio, PF-1: 14089 of 6000 min), not this worktree's; PF-5 started at 8fb6ec5
- L5 · 2026-11-11 · install: the npm ci of this worktree and of PF-4/PF-6 shared the npm cache and failed with TAR_ENTRY_ERROR; rerun with its own cache (D:/tmp/pf5/npm-cache)
- L6 · 2026-11-11 · replaces: e2e/project-turn-smooth.spec.ts "walking every turn, no image in view shows its placeholder, swaps its source or changes its size @PF-5-S2 @PF-5-ASM-01" · counts an image hidden by opacity as in view, misses the tools group (groups hardcoded) and a fixed 90 ms wait reads frames before they paint · by: e2e/project-turn-measured.spec.ts "walking every turn and the moment after it, no picture in view shows its placeholder, swaps its source or changes its size @PF-5-S2 @PF-5-ASM-01"
- L7 · 2026-11-11 · replaces: e2e/project-turn-smooth.spec.ts "frame by frame through a turn, no layer of the two projects steps back or jumps, the handoff included @PF-5-S3 @PF-5-ASM-02" · on 390 the narrow settle moves the scroll between frames (a jump of a whole project that is the test's own doing), it reads box corners not centres and takes the sign of the first step; misses the tools group · by: e2e/project-turn-measured.spec.ts "frame by frame through every turn and into the next hold, no layer of the two projects steps back or jumps, the handoff included @PF-5-S3 @PF-5-ASM-02"
- L8 · 2026-11-11 · replaces: e2e/project-turn-smooth.spec.ts "walking the turns there is no layout shift and no image starts loading while in view @PF-5-S1 @PF-5-ASM-03" · sums the shifts of scrolling into each group (not part of a turn) and reads data-loaded, which the capture posters never carry · by: e2e/project-turn-measured.spec.ts "walking every turn there is no layout shift and every picture in view is already drawn @PF-5-S1 @PF-5-ASM-03"
- L9 · 2026-11-11 · T1 · RED measured on main's code (66152a9): the handoff jump fails at 1440 on every turn of every group (plate and backdrop y step 11, the jump from the hold's centred plate to the turn's); ASM-01, ASM-03 and 390 pass on main, so they guard, they do not reproduce
- L10 · 2026-11-11 · replaces: e2e/slow-line.spec.ts "@PF-1-ASM-44 at 1910 every image a section shows is painted once the visitor is there" · fails on main (2441746) before any change of this card: the cover's address carries the plate version ?v= since b0a966f and the test's pattern ends at the extension · by: e2e/slow-line-painted.spec.ts "@PF-1-ASM-44 at 1910 every image a section shows is painted once the visitor is there"
- L11 · 2026-11-11 · replaces: e2e/slow-line.spec.ts "@PF-1-ASM-44 at 390 every image a section shows is painted once the visitor is there" · fails on main (2441746) before any change of this card: the cover's address carries the plate version ?v= since b0a966f and the test's pattern ends at the extension · by: e2e/slow-line-painted.spec.ts "@PF-1-ASM-44 at 390 every image a section shows is painted once the visitor is there"
- L12 · 2026-11-11 · gate · suite red from main: on main's code (2441746, features/ checked out, same tests) 24 tests of project-groups, project-scroll-groups, project-showcase, project-wipe-transitions, scene-media and slow-line already fail (PF-1 frozen tests the later PF-1 work left behind, none replaced); 22 of them are not replaced by any card. On this card's code the PF-5 tests, mobile-memory, mobile-devices and ASM-04 pass; mobile-memory-offscreen PF-3-S1 failed once under load in verify and passed 4 of 4 alone
- L13 · 2026-11-11 · closing: lo que corrige: en 1440 cada giro entre proyectos saltaba en el relevo (placa y fondo ~20 px en y al pasar del hold al giro, y volvían); medido sobre main falla en todos los giros de todos los grupos; con este cambio e2e/project-turn-measured.spec.ts pasa entero en 1440 y 390 (6 de 6) y el presupuesto de teléfono de PF-3 (ASM-04) se mantiene
- L14 · 2026-11-11 · closing: cambios: group.css (el progreso de la placa no salta en el relevo), showcase-device.tsx (el póster de las capturas queda montado; el placeholder no cuenta como forma), plate-loader.tsx (las imágenes de la tarjeta siguiente se piden cuando su grupo está cerca, antes del giro)
- L15 · 2026-11-11 · closing: la suite del gate está roja por pruebas que ya fallan en main (2441746): con el código de main y las mismas pruebas fallan 24 en project-groups, project-scroll-groups, project-showcase, project-wipe-transitions, scene-media y slow-line, pruebas congeladas de PF-1 que el trabajo posterior de PF-1 dejó atrás; 22 sin reemplazo en ninguna card. Para una persona: reemplazarlas en PF-1 o retirarlas; hasta entonces ningún gate que las incluya queda verde
- L16 · 2026-11-11 · closing: mobile-memory-offscreen (PF-3-S1) falló una vez con la máquina cargada durante el gate y pasó 4 de 4 sola sobre este código
