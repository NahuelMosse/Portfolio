# PF-3 · the site on a phone: no crash, the real screen, projects at their size

status: proposed
cap: 240 min
sources: the requester's chat message, 2026-11-11 (no Jira card), frozen in .validation/request.md
not_read: none

## Specs

- S1 · "al usar la pagina en el telefono tira A problem repeatedly occurred on "https://nawi.dev/" cuando estoy scrolleando"
- S2 · "la barra de busqueda de safari nunca se va dejando el boton let's talk gigante"
- S3 · "en chrome se ve un poco mejor porque si baja la barra, pero igual deja todo ese espacio libre"
- S4 · "eso hace que los proyectos se muestren muy chiquitos, los telefonos son diminutos"
- S5 · "las pantallas no respetan la relacion de aspecto de una pantalla"
- S6 · "ademas de que al scrollear se reinicia la pagina, no entiendo porque"
- PF-3-ASM-01 · the crash is Safari's tab running out of memory (it reloads the tab twice, then shows the message): on a phone what lies farther than a screen from the view is not rendered (its layers are dropped), and nothing keeps a standing layer of its own (no will-change, no 3D tilt: the devices stand flat and the art does not drift) · S1
- PF-3-ASM-02 · Safari collapses its bar only when the document itself scrolls: on a phone no box scrolls on its own and the body is not locked to the screen's height · S2
- PF-3-ASM-03 · the empty band is the gap between the small viewport (bars shown) and the screen once the bar hides: the pinned full-screen stages take the dynamic viewport height (dvh), the sections in the flow keep theirs so the page does not shift as the bar moves · S3
- PF-3-ASM-04 · the Let's talk bar keeps its 56 px whatever the screen's height and sits on the screen's bottom edge; it is huge only beside a browser bar that never collapses · S2
- PF-3-ASM-05 · a phone screen is drawn in the 390:844 shape of a phone and a browser screen in its capture's own shape, within 3 %, never cropped by a box of another shape · S5
- PF-3-ASM-06 · on a 390x844 phone and on a 390x664 one (Safari with its bars shown) the main device is as large as the stage leaves: a browser spans the width between the gutters, a phone stands at least 38 % of the screen's height, and no caption text covers either screen · S4
- PF-3-ASM-07 · the page that "restarts" while scrolling is the tab reloading after the crash of S1, or the scroll jumping when the browser bar shows or hides: walking down, the page loads once and the scroll never goes back · S6

## Tasks

- T1 · S1,ASM-01 · features/portfolio/presentation/showcase.css (presentation), features/portfolio/presentation/group.css (presentation), features/portfolio/presentation/experience.css (presentation), app/globals.css (presentation) · tests: e2e/mobile-memory.spec.ts "walking a 390x844 phone top to bottom in Chromium and WebKit, nothing farther than a screen from the view is rendered with a layer of its own @PF-3-S1 @PF-3-ASM-01"; e2e/mobile-memory.spec.ts "on a phone no element keeps will-change or a 3D transform @PF-3-ASM-01"
  reuses: features/portfolio/presentation/showcase.css the phone block `@media (max-width: 1099px)`; app/globals.css its phone blocks
- T2 · S2,S3,S6,ASM-02,ASM-03,ASM-04,ASM-07 · app/globals.css (presentation), features/portfolio/presentation/showcase.css (presentation), features/portfolio/presentation/group.css (presentation), features/portfolio/presentation/use-group-track.ts (presentation) · tests: e2e/mobile-viewport.spec.ts "on a phone the document is the only thing that scrolls and the body is not locked to the screen @PF-3-S2 @PF-3-ASM-02"; e2e/mobile-viewport.spec.ts "on a phone the pinned full-screen stages are sized by the dynamic viewport and fill the screen after the bar hides @PF-3-S3 @PF-3-ASM-03"; e2e/mobile-viewport.spec.ts "the Let's talk bar keeps 56 px on the bottom edge on a 390x664 and a 390x844 phone @PF-3-S2 @PF-3-ASM-04"; e2e/mobile-viewport.spec.ts "walking down a phone in Chromium and WebKit while the browser bar shows and hides, the page loads once and the scroll never goes back @PF-3-S6 @PF-3-ASM-07"
  reuses: features/portfolio/presentation/use-group-track.ts useGroupTrack place (the run of a pinned section)
- T3 · S4,S5,ASM-05,ASM-06 · features/portfolio/presentation/showcase.css (presentation), features/portfolio/presentation/project-group.tsx (presentation), features/portfolio/presentation/showcase-device.tsx (presentation) · tests: e2e/mobile-devices.spec.ts "on a phone a phone screen keeps the 390:844 shape and a browser screen its capture's shape, within 3 % @PF-3-S5 @PF-3-ASM-05"; e2e/mobile-devices.spec.ts "on a 390x844 and a 390x664 phone a browser spans the gutters and a phone stands 38 % of the screen, clear of the caption @PF-3-S4 @PF-3-ASM-06"
  reuses: features/portfolio/presentation/showcase-device.tsx ShowcaseDevice; features/portfolio/presentation/use-group-track.ts the --copy-h sizer

## Changes to existing behavior

- the project stages on a phone (below 1100 px): the devices stand flat and larger, the art holds still, the caption band gives the devices room · e2e/phone-390.spec.ts, e2e/phone-layout.spec.ts, e2e/phone-glance.spec.ts and e2e/one-screen-sections.spec.ts (@PF-1-ASM-27, @PF-1-S9, @PF-1-ASM-37) stay valid
- the pinned stages on a phone are 100dvh instead of 100svh · e2e/one-screen-sections.spec.ts "each project group is one pinned screen" (@PF-1-ASM-37) stays valid: in an emulated phone dvh and svh are the same height
- the desktop (1100 px and wider) does not change

## Look

- plain: the card fits the screens PF-1 designed to a phone and asks for no new look: their size, layers and viewport units change, not their design

## Gate

```
suite: npx playwright test e2e/mobile-memory.spec.ts e2e/mobile-viewport.spec.ts e2e/mobile-devices.spec.ts e2e/phone-390.spec.ts e2e/phone-layout.spec.ts e2e/phone-glance.spec.ts e2e/one-screen-sections.spec.ts e2e/one-screen.spec.ts e2e/contact-one-screen.spec.ts e2e/project-showcase.spec.ts e2e/project-presentation.spec.ts e2e/project-groups.spec.ts e2e/project-scroll-groups.spec.ts e2e/wide-screens.spec.ts
lint: npx eslint .
types: npx tsc --noEmit
app: npx next dev --webpack
overflow: node .claude/tools/overflow.mjs
```

## Log

- L1 · "literalmente al usar la pagina en el telefono tira A problem repeatedly occurred on "https://nawi.dev/" cuando estoy scrolleando, ademas de que la barra de busqueda de safari nunca se va dejando el boton let's talk gigante, y en chrome se ve un poco mejor porque si baja la barra, pero igual deja todo ese espacio libre. eso hace que los proyectos se muestren muy chiquitos, los telefonos son diminutos y las pantallas no respetan la relacion de aspecto de una pantalla. ademas de que al scrollear se reinicia la pagina, no entiendo porque"
