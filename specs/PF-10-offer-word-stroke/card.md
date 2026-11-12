# PF-10 · the outlined OFFER word keeps a stroke that scales with it

status: proposed
cap: 60 min
sources: the requester's chat message (2026-11-12, no Jira card) and its screenshot .validation/offer-thin.png (desktop about 1668 px wide), with the context the orchestrating session gathered, frozen in .validation/request.md
not_read: none

## Specs

- S1 · "offer dependiendo del tamaño de la pantalla, la letra de offer es muy fina"
- S2 · "On every screen size the outlined "OFFER" reads with a clearly visible, proportional stroke."
- S3 · "The outline must scale with the word's size"
- S4 · "and keep a floor that stays legible on the phone."
- S5 · "It stays an outline: the hollow look is the design."
- S6 · "Check it at 390x844, 1280, 1440x900, 1668 and 1910x912."
- PF-10-ASM-01 · the outline is `max(1.5px, 0.012em)` of the OFFER word: 1.2 % of its font size at every width, never under 1.5 px (the floor only binds below a 125 px word); 1280 and 1668 are checked at 1280x720 and 1668x904, the screenshot's height · S2,S3,S4,S6

## Tasks

- T1 · S1,S2,S3,S4,S5,S6,ASM-01 · app/globals.css (presentation) · tests: e2e/offer-word-stroke.spec.ts "the OFFER outline is 1.2% of the word and never under 1.5px (the floor below a 125px word) at 390x844, 1280x720, 1440x900, 1668x904 and 1910x912, captured @PF-10-S1 @PF-10-S2 @PF-10-S3 @PF-10-S4 @PF-10-S6 @PF-10-ASM-01"; e2e/offer-word-stroke.spec.ts "the OFFER word stays hollow: transparent fill, bone outline @PF-10-S5"
  reuses: app/globals.css `.offer-scene .chapter-word` and its `-webkit-text-stroke`; the word's size stays `--size-word` / `--size-word-phone`

## Changes to existing behavior

- app/globals.css `.offer-scene .chapter-word` · the outline goes from a fixed `var(--rule)` (1 px) to `max(1.5px, 0.012em)` · e2e/offer-word.spec.ts "@PF-1-ASM-38" stays valid: the word's size does not change

## Look

- plain: the outlined OFFER word keeps PF-1's design, font, size and colour; only the width of its outline follows the word

## Gate

```
lint: npx eslint .
types: npx tsc --noEmit
app: node scripts/media-versions.mjs && npx next build --webpack && npx next start
suite: npx playwright test e2e/offer-word-stroke.spec.ts e2e/offer-word.spec.ts e2e/chapter-arrival.spec.ts
probe offer: node .claude/tools/app.mjs probe specs/PF-10-offer-word-stroke/steps/offer.json --widths 390,1440,1910 --axe --contrast ".offer-scene .folder-tab,.offer-scene .door" --out .validation/probe/offer
```

## Log

- L1 · Requirement as frozen in .validation/request.md (2026-11-12), verbatim: # Request (verbatim from the requester, in Spanish) / > "offer dependiendo del tamaño de la pantalla, la letra de offer es muy fina" / Attached: `.validation/offer-thin.png`. The screenshot was taken on a desktop about 1668 px wide. The big outlined chapter word "OFFER" in the offer scene reads as a hairline. / ## Context gathered before the card / - `app/globals.css`, `.offer-scene .chapter-word`: `color: transparent; -webkit-text-stroke: var(--rule) var(--bone);`. The outline is a fixed `--rule` width while the word scales with the screen (`--size-word` / `--size-word-phone`), so on larger screens the stroke gets relatively thinner. Boska's thin serifs make it worse. / ## What is asked / On every screen size the outlined "OFFER" reads with a clearly visible, proportional stroke. The outline must scale with the word's size and keep a floor that stays legible on the phone. It stays an outline: the hollow look is the design. Check it at 390x844, 1280, 1440x900, 1668 and 1910x912.
- L2 · 2026-11-12 · T1 · verify.mjs: lint, types, suite (offer-word-stroke, offer-word, chapter-arrival) passed; axe/contrast/focus could not run (no probe line in the card's Gate); captures in .validation/PF-10/
- L3 · 2026-11-12 · RED checked at the card's base CSS (474edc2): e2e/offer-word-stroke.spec.ts failed on 'stroke at 390' (1px, ratio 0.0073); with the code both tests pass
- L4 · 2026-11-12 · measured stroke / font size: 390x844 1.638/136.5px, 1280x720 2.611/217.6px, 1440x900 2.938/244.8px, 1668x904 3.403/283.56px, 1910x912 3.896/324.7px, ratio 0.0120 at each; the 1.5px floor binds only under a 125px word (320 px phones)
- L5 · 2026-11-12 · Gate gains 'probe offer' (steps/offer.json) so axe, contrast and focus run; they pass
- L6 · 2026-11-12 · main's: busy fails on the probe's first step (right after goto), the preloader of app/loading.tsx (aria-busy) holding hidden span/svg/p; the same probe on the base build (474edc2 CSS) records the same at 1910; timing-dependent, outside this card, for a person
