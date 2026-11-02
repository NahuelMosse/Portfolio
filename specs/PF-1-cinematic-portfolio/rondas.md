## Direction

Concept: each project is a type poster in its product color: one giant Boska word and a numeral crossing a full-bleed ink illustration of the product's world, with the real interface large in front.
Surface: screen-printed noir poster (flat inks, hard light). Components: the scrim (product color sunk into ink), the outlined numeral, the code-drawn device frame.
Dealt direction: `design/taste/direction.json`, id `pinned-poster` (sector personal-portfolio, `--keep palette,type`: Boska, General Sans, Courier Prime and the product colors of design/tokens.css). Chosen because a title that holds its place while the picture changes is what each section already does; no slot redrawn.
References: ref-46 (the requester's case file: giant type crossed by image) sets the bar; ref-23/24 (condensed poster type over illustration) give the scale. Sheets: `ref/sheet-all-1.jpg`, `ref/sheet-all-2.jpg`.

| Trait | Reference | Measure on this screen |
|---|---|---|
| Display type with character | ref-23, ref-24 | word 16vw capped by length (66vw / chars), solid bone, line-height 0.82 |
| Palette with an owner | the five product colors | scrim = field 30% over ink; hue visible in the shadow at 390 and 1440 |
| Real illustration, integrated | ref-46 | full-bleed backdrop per project, interface large in front, no blend |

Motion grammar: unchanged from the card (view scrub of the heading, kit diagram draws on entering view).

## Round 1
1. Character: baseline of the previous backdrops kept; brand sheet has no fonts or colors (`brand: fonts … no brand sheet with fonts`).
2. Hierarchy: words and numerals still tone-on-tone; DEV KIT barely read.
3. Depth and color: neutral black scrims.
4. Composition: kit diagram second row read PR, GATE, BUILD on the phone.
5. Motion: none changed. Round ran on the state after the first commit; captures in `rondas/r1`.

## Round 2
1. Character: scrims are the product color sunk into ink, so each section keeps its hue.
2. Hierarchy: words solid bone, numerals outlined bone; the outlined composition gets a 3px stroke over a faint field fill.
3. Depth and color: bottom and top strips on wide screens.
4. Composition: the word is 16vw capped by its length, left aligned (right in the mirrored composition), the numeral hangs at the opposite top corner clear of "Let's talk"; a phone-stage section keeps its word clear above the phone, so CLUB is no longer cut; the kit text starts below its word.
5. Motion: unchanged (the kit diagram still draws on view).

## Round 3
1. Character: kit diagram on the phone reads left to right (BUILD, GATE, PR) in two parallel rows.
2. Hierarchy: kit title clears the word (padding-top var(--space-7)).
3. Depth and color: no change after round 2 captures; contrast of words checked by eye at 1440.
4. Composition: Guardia's word is now 885px wide at the left margin, no longer collides with the 03.
5. Open: the kit's icons repeat in the piece row; the committed spec asserts three `[data-pieces] [data-piece] svg`, so the row stays until that test is replaced.
