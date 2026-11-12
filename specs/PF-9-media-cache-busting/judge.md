# PF-9 · plan judge

- ACT-01 · M · S3 names four members («content.ts pieces, scene plates, the `r/<width>/` responsive variants, posters») and the planned tests require only the Cebador pieces and posters to be present: the HTML test asserts `urls.length > 20` and the walking test `requested.length > 0`, so a scene plate or an `r/<width>/` variant that is never emitted or requested passes vacuously (lenses.md interpretation: «Does a quantifier name its members, and does each member have a test?») · card.md S3, T2 · plan · closed · T2: e2e/media-cache-busting-members.spec.ts "the page emits versioned content.ts pieces, scene plates, r/<width>/ copies and posters, and every versioned /film URL answers 200 @PF-9-S3"
- ACT-02 · M · T2 edits view files (plate-sources.tsx, showcase-device.tsx, chapter-illustration.tsx, app/layout.tsx, design/tokens.css, L4 drops --paper-texture) while `## Look` says «plain: no screen changes» and `## Gate` carries no `no-visual:` line; a view file in Tasks voids it, and no planned test or Gate line says the media still render, e.g. every versioned /film request answers 200 and the screen at 320/768/1280 is the one of main (lenses.md visual: «What does the screen show at 320, 768 and 1280 px», and the `no-visual` rule of the lens) · card.md Look, T2, L4 · plan · closed · T2 (the members test HEADs every versioned /film URL for a 200) and L10 (the smoke's load and 404 checks at 390, 1440 and 1910)

## Verified

- interpretation: fails (ACT-01). S1, S2, S4, S5 each have a tagged test; ASM-01 and ASM-02 declare the two readings of S1/S2; L5 declares /fonts/ OUT.
- visual: fails (ACT-02). The `ref:` question does not apply: no screen is designed.
- overdesign: meets. media-url.ts is one helper read by the plate, piece and scene consumers; motion.ts and index.ts export it as the slice's client and server entries; no interface, factory, flag or one-file folder.
