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

## Round 4 (`rondas/r5`, 390 first, then 1440; 18 FAIL rows)
1. Character: each project carries a one-ink plate drawn with Codex (barbell and chalk hand, hospital corridor with gurney and monitor line, kiosk awning with mate and sodas, floodlight with padel racket and ball), printed over the product color by multiply; the field now reads as a screen print, not a wallpaper.
2. Hierarchy and typography: words on the bright fields (Guardia, Cebador, Club) are bone with a hard ink shadow, since an ink word vanished into the plate's black masses; Grit and Kit stay bone.
3. Depth and color: experience, offer and contact leave the shared black slide: employer bands with a crimson case number and a hard crimson offset under an ink slab, the offer as a bone panel and a crimson panel with inverted doors, contact as a crimson field with the word at 26vw (390) and 16.5vw (1440) and the e-mail as a display line.
4. Composition: the second composition keeps a left gutter, so Cebador's interface is no longer cut at the edge; tap targets raised (wordmark, index links, proof link to 44px).
5. Motion: unchanged. Open rows: text contrast 21/28, text over images 29/39, image widths 7/33, pasted boxes 2/3, brand page background 0.171, CTA separation.

## Round 5 (`rondas/r6`, variant D pinned showcase, `--gpu --scrub --brand design/brand.json`, 390 first; 36 FAIL rows over 4 widths)
1. Character: projects are five pinned scenes (the dev kit's card walks six stations, the others change screens inside one large device); the product field, the plate and the backdrop stay, the device now stands in depth.
2. Hierarchy and typography: at 390 the index strip's links were 19x44 (20 tap targets failed): each link is now 44 wide.
3. Depth and color: the dev kit's field shade is `--shade-deep` at 11% of the product color (page background tint 0.020 against the brand sheet, now 0.001); the card's head number and the PR stamp are darkened (3.77:1 and 2.5:1 before).
4. Composition: at 1440 the card rode under the copy's shade and was cut at the top; it now sits above the shade, lower, over the station it is at (the plate's six stations at 9.5, 25.7, 38.3, 55.5, 75 and 92%). The lead of the kit stacks under its title instead of falling under the word. At 390 the card is 36vw and starts below the word, so DEV KIT is read.
5. Motion: pin lengths 46% of 22066 px at 390; the active face of each device is `loading="eager"`. `motion-audit compare` not run: the scroll is a pin, measured by `--scrub` (5 frames per pin in `rondas/r6/<width>/scrub`).

## Round 6 (`rondas/r7`, same flags; 33 FAIL rows over 4 widths)
1. Character: the card keeps its two-state read (red then green rows) and now the PR stamp is a darker crimson that reads on the bone card.
2. Hierarchy and typography: the index strip names stay on one line (`white-space: nowrap`, "DEV KIT" had wrapped at 390).
3. Depth and color: the token that rides the track sits above the station circle instead of over its number.
4. Composition: tap targets 0 failed at 390; brand rows (fonts, action, page background) all pass; the 1440 kit captures are whole (card, copy and station in one frame).
5. Open rows, unchanged by design: image file widths (the Grit and Guardia screen files are 390 px wide and are shown up to 244 px, needs 2x), repeated images (the glow repeats each screen), pasted boxes (the two work photos), text contrast on the numerals measured behind the stacked sections, CTA separation (the Hire me bar is bone like the body ink), frames with 2+ flags (pinned scenes stack many elements by design).
