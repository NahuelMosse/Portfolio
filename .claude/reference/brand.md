# Brand identity

A brand is defined once and every asset reuses it: packaging, label, social piece, the landing. An asset in another typeface or palette
breaks the brand, whatever its craft: a label in another typeface reads as a different brand.

## The brand sheet

One sheet per card, as a `## Brand` block in `card.md` or a `brand.json` next to it. It holds:
- `wordmark`: the exact font and its settings (family, style, weight and every variable axis), and its minimum size.
- `fonts:` the families the brand allows, wordmark first, text face next (`fonts: <wordmark family>, <text family>`). The gate reads this line.
- `palette`: tokens per variant (flavor, line, season), with the neutral and the legal-text color.
- `icon`: the mark that travels without the wordmark, and its clear space.
- `voice`: 3 to 5 traits with a line of example each, and the dialect of the audience.

Where the card gives no sheet, the repo's existing site, logo or design system is the sheet; the Direction writes it down and an `ASM` marks it.
`node .claude/tools/design-round.mjs <url> --brand <brand.json|card.md>` fails a text family outside `fonts`; without a sheet it only reports the fonts used.

## Every asset reuses it

- The wordmark is the same file or the same font settings everywhere; it is never retyped in a similar face.
- Text on any asset uses the text face of the sheet; the palette of a variant is the palette of that variant on the page, the label and the social piece.
- Variants share layout and change at most two variables (color and motif or character).
- A new asset is checked against the sheet before it is shown: font, palette, icon, voice.

## When the product is a physical package

- **Silhouette against a real photo:** the object's outline is overlaid on a real photo of it and its proportions are corrected before the label or finish is judged.
- **One style across variants:** same frame, same wordmark, same text face; per variant a color, a character or pattern, and a phrase. Characters and motifs are made one at a time with a fixed seed and prompt and compared side by side.
- **A personality strategy chosen on purpose** (character, massive type, pattern system, color block, voice, collectible series) and named in the Direction; a centered small wordmark with a stock photo is the generic default.
- **Real over code-made:** the label is composited onto a photograph of the real object when one exists; organic objects are never built from primitives (`reference/3d.md`). A generated illustration is checked at 100 % (hands, eyes, props), text never inside the image.
- **Judge generated imagery next to a real photo of the same object.**
