# PF-7 · Triaje's phone shows its mobile version first

status: proposed
cap: 60 min
sources: the requester's chat message, 2026-11-11 (no Jira card), frozen in .validation/request.md
not_read: none

## Specs

- S1 · "triaje tiene una version mobile"
- S2 · "pero en el telefono se muestra la version de escritorio en la primer imagen"
- PF-7-ASM-01 · Triaje's mobile version is the game's own layout at phone width (https://html-classic.itch.zone/html/19771092/index.html, the page the itch.io page runs, at 390x844); the current first phone screen is itch.io's page on a phone, which shows the desktop cover banner cropped. The phone's first screen becomes a real capture of the game's first screen on a fresh visit at 390x844 (the shift map with its Start the shift button), taken by a script from the live game; the piece keeps its id triaje-mobile and its caption "Triaje on itch.io, on a phone" (PF-2 makes each phone caption the desktop beat's plus ", on a phone"); its alt text and its ASSETS.md line describe the game's first screen on a phone · S1,S2

## Tasks

- T1 · S1,S2,ASM-01 · scripts/capture-triaje-mobile.mjs (data), public/film/pieces/triaje-mobile.webp (data), public/film/r/480/pieces/triaje-mobile.webp (data), public/film/r/780/pieces/triaje-mobile.webp (data), features/portfolio/presentation/piece-bars.json (data), public/ASSETS.md (data) · tests: e2e/triaje-phone-first.spec.ts "Triaje's first phone screen is the game's own phone layout at 390x844: its top is the game's dark ground and its Start the shift band the game's mint, not the itch.io cover @PF-7-S1 @PF-7-S2 @PF-7-ASM-01"
  reuses: scripts/record-cebador.mjs (Playwright Chromium against the live site at 390x844, sharp to WebP); scripts/derive-plates.mjs and scripts/derive-bars.mjs write the width copies and the status bar color
- T2 · S2,ASM-01 · features/portfolio/presentation/content.ts (presentation) · tests: e2e/triaje-phone-first.spec.ts "on the page Triaje's phone opens on triaje-mobile, its alt names the game's first screen on a phone and ASSETS.md names the game at 390x844 @PF-7-S2 @PF-7-ASM-01"
  reuses: features/portfolio/presentation/content.ts screen (only the alt text of the triaje-mobile entry changes)

## Changes to existing behavior

- the picture of triaje-mobile, its alt text and its ASSETS.md line · e2e/best-screens.spec.ts and e2e/best-screens-walk.spec.ts (@PF-2-S1, @PF-2-ASM-01, @PF-2-ASM-02: same ids, order and captions) stay valid; PF-2-ASM-01 named the opening phone beat "the itch.io page with its cover art", this card replaces that picture with the game's own phone screen

## Look

- plain: the card swaps one real capture for another real capture of the same project; the phone device, its frame and the beat order keep PF-1 and PF-2's design

## Gate

```
suite: npx playwright test e2e/triaje-phone-first.spec.ts e2e/best-screens.spec.ts e2e/best-screens-walk.spec.ts
lint: npx eslint .
types: npx tsc --noEmit
app: npx next start
```

## Log

- L1 · "otra cosa para cambiar, triaje tiene una version mobile, pero en el telefono se muestra la version de escritorio en la primer imagen"
