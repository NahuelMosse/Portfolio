# Critique · PF-1 portfolio (poster branch), round 4 start

Captures: `.validation/cap/base-m.png` (390, the five projects), `.validation/cap/base-d.png` (1440, Grit to Club), `specs/PF-1-cinematic-portfolio/rondas/r4/m390.png` and `d1440.png` (cover, experience, offer, contact). Level: `ref/sheet-all-1.jpg` (ref-23 the requester's whole-page mockup, ref-24, ref-21, ref-22: a character or an object cut in front of a giant word, with real illustration in the layers). `round.json` ran on a GPU renderer: motion numbers are valid. `1 Issue` badge in the captures is the Next dev overlay, not the page.

**Thumbnail:** a dark editorial portfolio of 2024 with a good cover and a row of colored sections that all read as the same slide recolored. The eye lands on the giant word, and then there is nothing to land on in the project: the interface is a pasted rectangle.

redo: the five project posters (composition, backdrop and word)
redo: the project text block (title repeated under the word, chips in 11px Courier)
redo: the dev kit lead (a row of six generic line icons)

keep: the cover (NAWI crossing his head, ink portrait, `r4/1440x900/section-01.png`), and the idea of a product field per project with a Boska word and numeral.

## Polish defects

1. Grit and Cebador words are hairline outlines over a busy backdrop and cannot be read at a glance (`base-d.png`, Grit and Cebador): solid bone fill, no outline.
2. The word is repeated one size down as the project title ("GRIT" over "GRIT", "GUARDIA" over "GUARDIA"; `base-d.png`) and a camel-case "CLUBNAHUELMOSSE" in 36px: the title leaves, the poster word is the title, the full name goes in the strip above.
3. Text over images fails: `palette: text over images: 20` at 390 and 32 at 1440 (`round.json`): copy sits straight on the busy backdrop (Cebador lines at 1440). Fix with the line set on a solid ink block of 8px radius 0, not on the art.
4. Dev kit at 390 shows its line cut at the sticky bar and the text below the second row of icons is clipped (`base-m.png`, first and second frame); the kit lead is six equal line icons in two rows: it is a generic infographic.
5. Cebador at 1440 crops the lead interface at the left edge ("Dietética" cut) and Guardia's laptop crops at the right: a pasted box sliding out of the frame, `pasted boxes: 6`.
6. `tap targets under 44x44: 9`, `clicks of 24x24 or less: 7`, `dead clicks: 2`, `navigation, compact: bare hamburger`: the stack chips, the strip and the top bar.
7. `image file width >= shown x 2: 28` at 1440: backdrops and device pieces are served smaller than they display.
8. The page background reads `0.023` off the sheet (`brand: page background`): the ink is `#0c0c0b` but the body is a warm tint; set the body to the sheet's ink.

## Level differences

1. **Imagery as layers, not as a wallpaper.** The reference posters (ref-21, ref-22, ref-24) put an object cut in front of the word and the type crossing it; here a backdrop photo lies under everything (`base-d.png`). Fix: a one-ink plate printed by multiply over the product color, drawn objects cropped by the frame and crossing the word; the interface on top. 
2. **Scale.** Words are 16vw and one line. Reference words fill the poster and are cropped by it (ref-23). Fix: the word at 30vw on two stacked lines when short (GRIT, CLUB), cropped bleeding off the edge by 4 to 8 percent, numerals at 40vw behind it in the product color darkened.
3. **Same composition five times.** The sections swap left and right only. Fix: five different skeletons: kit as a wall with the word along the bottom, Grit a diagonal with a phone breaking the word, Guardia the word as a horizontal band behind a laptop, Cebador a vertical split with the word rotated 90 degrees, Club a pitch perspective with the word at the top.
4. **The real interface is a plain rectangle** with a three dot bar (`base-d.png`, Guardia). Fix: device with a thick ink bezel, a hard offset shadow in the product color and a 2 degree tilt on wide screens; a phone with a bezel and a notch bar.
5. **Experience, offer and contact are a column of text** (`r4/m390.png`): no rhythm of scale, same black. They are next in line after the projects; open at the end of this round.

## Scores

polish: 5 · motion: 5

Design 40: 22 (a strong first frame; projects a pasted box over a wallpaper; five equal compositions). Usability 30: 20 (the CTA is findable, but 2 dead clicks and 9 small targets). Creativity 20: 12. Content 10: 8. Total 62.

**Generic:** swapping the product name leaves the project block just as true: a colored field, a word, a rectangle · `base-d.png`.

**Blocker:** dead clicks 2 and text over images 20/32 · `rondas/r4/round.json`.
