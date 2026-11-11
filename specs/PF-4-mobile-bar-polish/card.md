# PF-4 · mobile bar polish

status: proposed
cap: 120 min
sources: the requester's chat message, 2026-11-11 (no Jira card), frozen in .validation/request.md
not_read: none

## Specs

- S1 · "el boton de let's talk es 1 pixel menos alto que el de la flechita, es justo el borde lo que queda mas alto"
- S2 · "let's talk ocupa toda la parte de atras de la barra de busqueda, pero cuando desaparece ya no la ocupa mas, queda negra esa seccion"
- S3 · "el boton de la flecha queda raro con esa extension de let's talk que queda hasta abajo de la barra de busqueda, porque el boton de la flecha nunca lo hace"
- S4 · "el elemento de arriba de offer se ve two doors en dos lineas, cuando entra perfectaemnte en una"
- S5 · "pasa lo mismo con buenos aires"
- PF-4-ASM-01 · the 1 px is the hire bar's dark top line: the bone face of Let's talk starts 1 px below the bar's top while the arrow square's bone border starts at it. On a phone the Let's talk face and the arrow square share the same top edge, bottom edge and 56 px height, at rest and while the page scrolls, in Chromium and WebKit · S1
- PF-4-ASM-02 · the strip behind Safari's toolbar takes the background color of the fixed element on the bottom edge (Safari 26 reads the element's `background-color`), so the bone of Let's talk spills there and the arrow square never does. Of the two readings (both spill, or neither), the cheapest to undo: neither. Every element on the bottom edge of a phone's screen has the ink background color of the arrow square and the page; Let's talk keeps its bone face, painted as an image over that ink, so it looks the same. That Safari then tints the strip ink, with the toolbar shown and collapsed, only a real iPhone confirms · S2, S3
- PF-4-ASM-03 · the line above the chapter word (numeral, rule, catalog note, star) stays on one line on a phone when it fits: "Two doors" above Offer and "Buenos Aires" above Let's talk, and the same for the notes of the other chapters, which share the component, at 375 and 390 px; at 320 px too, and nothing crosses the screen's edge · S4, S5

## Tasks

- T1 · S1,S2,S3,ASM-01,ASM-02 · app/globals.css (presentation) · tests: e2e/mobile-bar-edges.spec.ts "on a 390x844 and a 375x667 phone in Chromium and WebKit the Let's talk face and the arrow square share their top, bottom and 56 px height while scrolling @PF-4-S1 @PF-4-ASM-01"; e2e/mobile-bar-edges.spec.ts "on a phone in Chromium and WebKit every element on the bottom edge of the screen has the ink background color, and Let's talk still shows bone @PF-4-S2 @PF-4-S3 @PF-4-ASM-02"
  reuses: app/globals.css the phone block `@media (max-width: 700px)` with `.hire-bar` and `.bar-top`, and the `--ink`/`--bone` tokens of design/tokens.css
- T2 · S4,S5,ASM-03 · app/globals.css (presentation) · tests: e2e/chapter-note-line.spec.ts "on a 390x844, a 375x667 and a 320x568 phone in Chromium and WebKit Two doors, Buenos Aires and every chapter note sit on one line inside the screen @PF-4-S4 @PF-4-S5 @PF-4-ASM-03"
  reuses: app/globals.css `.chapter-detail` (the fine detail around the chapter word)

## Changes to existing behavior

- the phone's hire bar (below 701 px): no dark 1 px line above Let's talk; Let's talk's bone is a background image over ink · e2e/mobile-viewport.spec.ts "the Let's talk bar keeps 56 px on the bottom edge" (@PF-3-ASM-04), e2e/phone-390.spec.ts and e2e/lets-talk-doors.spec.ts stay valid
- the chapter notes never break inside themselves, at every width · e2e/chapter-numerals.spec.ts and e2e/wide-screens-offer-detail*.spec.ts stay valid

## Look

- plain: the card corrects an edge, a background color the browser reads and a line break on screens PF-1 designed; it asks for no new look

## Gate

```
suite: npx playwright test e2e/mobile-bar-edges.spec.ts e2e/chapter-note-line.spec.ts e2e/mobile-viewport.spec.ts e2e/phone-390.spec.ts e2e/phone-layout.spec.ts e2e/phone-glance.spec.ts e2e/lets-talk-doors.spec.ts e2e/chapter-numerals.spec.ts e2e/wide-screens-offer-detail.spec.ts e2e/wide-screens-offer-detail-clear.spec.ts e2e/wide-screens-clear.spec.ts
lint: npx eslint .
types: npx tsc --noEmit
app: npx next dev --webpack
overflow: node .claude/tools/overflow.mjs
```

## Log

- L1 · cosas que vi, el boton de let's talk es 1 pixel menos alto que el de la flechita, es justo el borde lo que queda mas alto. Ademas hay una detallito, porque let's talk ocupa toda la parte de atras de la barra de busqueda, pero cuando desaparece ya no la ocupa mas, queda negra esa seccion, y el boton de la flecha queda raro con esa extension de let's talk que queda hasta abajo de la barra de busqueda, porque el boton de la flecha nunca lo hace y creo que quedaria raro / el elemento de arriba de offer se ve two doors en dos lineas, cuando entra perfectaemnte en una y pasa lo mismo con buenos aires.
- L2 · 2026-11-11 · kit: npm ci crawled (registry ~20 min per package, disk copy ~1 file/s under contention with other worktrees); node_modules is a junction to D:/projects/Portfolio-d/node_modules, same lockfile
- L3 · 2026-11-11 · kit: time-cap counted 14000+ min since card.md's commit on a card committed minutes before
- L4 · 2026-11-11 · replaces: e2e/mobile-bar-edges.spec.ts and e2e/chapter-note-line.spec.ts (RED 367a0aa) · page.mouse.wheel is unsupported in mobile WebKit · by: e2e/mobile-bar-edges-scroll.spec.ts and e2e/chapter-note-line-scroll.spec.ts, same tags, window.scrollBy steps
