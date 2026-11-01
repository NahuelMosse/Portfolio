# Project design line

Every color, duration, radius and space of the site is a custom property in `design/tokens.css`; `app/globals.css` and the components use them with `var(--…)`.

## 1. References

The requester's 46 images, local in `specs/PF-1-cinematic-portfolio/ref/` (git-ignored). What is taken from each:

- ref-46: his whole-page mockup of the case file, the approved direction: him under a hard desk lamp in front of NAWI with the identification sheet beside him, cases with typed tabs and their real pieces pinned to the thread, experience as a typed record, two open folders for the offer, Let's talk beside the sealed file and the credits sheet. Taken: the composition and the three paper pieces; its content is not used.
- ref-01: condensed type over a painted world, a staggered case list, a marquee band. Taken: the credits roll and the closing over the image.
- ref-12 and ref-17: a cut-out subject in front of a giant serif title, bone paper. Taken: him cut out in front of NAWI and the paper scraps.
- ref-16: each case numbered in a large display numeral with its real pieces in an uneven grid. Taken: the cases alternating sides.
- ref-19 and ref-21..22: thin-line frames, four-point stars, a data sheet in small type. Taken: the identification sheet.
- ref-20: images joined to labels by thin leader lines. Taken: the leader labels on the pieces.
- ref-24..32: the dark poster mood, giant ornate titles, grain. Taken: the mood only; no deity or generated person is used.

## 2. Direction

One visitor, a prospective client or a hiring lead, who reads the cold open in five seconds and the rest as a scroll. It is a neo-noir case file: one lamp on a desk, one crimson thread, he the only protagonist and always in real photos. It avoids cinema as a theme, stat bars, figures, generated people and any full-width background change.

- Invention 9: the page is a showpiece; the structure (native scroll, four chapters, two doors) is conventional, the execution is not.
- Density 3: one idea per screen, small type only on the identification sheet.
- Expression 9: showcase register.

Continuity decisions (ASM-25, ASM-26): one desk image behind every chapter; one crimson thread drawn by scroll that ties around the sealed file; one lamp light that travels onto what is read; each chapter title straddles the edge with the chapter before, half over each, and always paints above photos; a photo of him crosses two seams; one HUD rail on the right edge with a tick per chapter (on a phone the thread is the spine with the chapter numbers); paper backs only the identification sheet, the two folders and the credits sheet.

| Scene | States | Proves it with | Copies the composition of |
|---|---|---|---|
| Cold open | NAWI behind him, sealed envelope, identification sheet | who he is in five seconds | ref-46 and ref-21 |
| Projects | numbered cases, one still-life exhibit and framed real pieces each | the work before the offer | ref-16 and ref-46 |
| Experience | employers as a typed record, the current one on a red band | where he served | ref-46 |
| End credits | the offer in two folders, the roll, the two doors, the sealed file | what to do next | ref-01 and ref-46 |

## 3. Tokens

All in `design/tokens.css`.

- Color: black `--ink`, bone cream `--bone` and one accent `--red`, plus tints of each by percentage (`--red-16`, `--bone-35`, `--ink-70`). Bone text on `--ink` and on `--red` meets 4.5:1. Nothing else is saturated.
- Space: 4 8 16 24 40 64 112 (`--space-1` to `--space-7`).
- Radius: `--radius-rectangle` (0) for controls, `--radius-round` for the lamp pool. No shadows: separation is by thin line and by the desk image.
- Motion: `out` cubic-bezier(.16,1,.3,1) at `--motion-control` 200 ms for controls and `--motion-section` 900 ms for the section moves; the roll and marquee have their own long durations; press scales to `--press-scale`. Only transform, opacity and color move.
- Layout constants: `--poster-descent`, `--seam-height`, `--lamp-size`, `--hire-bar-height`.

## 4. Typography

Boska (display) is the identity: NAWI edge to edge as the mark, chapter titles at poster scale (4.5rem to 17rem on a wide screen, 2.25rem to 3.5rem on a phone), uppercase, tracking -0.03em, line height 0.82. Courier Prime is the typed voice: body text, the name under NAWI and the labels of the file (identification sheet, off-duty line). Two weights: 700 for display, regular for text. All self-hosted in `public/fonts`.

## 5. The system: primitives, components and patterns

- Chapter (`features/film`): label between thin rules, the poster title above everything, a seam figure and an optional torn scrap; the card of a chapter has no frame.
- Shell (`features/film`): desk image, thread, lamp light and HUD rail, plus the controls that never hold the visitor: skip, chapter index, sound toggle, the corner call to action and, on a phone, the fixed Hire me bar. Controls are one pill with hover to red, a visible focus ring and a press scale.
- Credits roll: two full-bleed bands on the Magic UI marquee, edges faded into black, paused by hover or focus.
- Piece row: on a phone a case's pieces are one row that swipes sideways with a counter; case details open with a toggle.
- Catalog items in use: Magic UI marquee, border beam, animated shiny text, text animate; Aceternity sticky scroll reveal and parallax scroll; shadcn button. Vendored as installed.
- Patterns: native scroll, never a hijacked wheel; a jump moves focus to the chapter heading; reduced motion leaves stills, the thread fully drawn, and the bands wrapped and still; a photo slot whose image is missing falls back to a dark field and never covers text.

## 6. State changes of the screen

| Change | Trigger | Rules | Feedback | Kind | Token | Reduced |
|---|---|---|---|---|---|---|
| Thread draws | scroll | pathLength follows scroll progress; it ties around the sealed file | the red line reaches the seal | expressive | scroll | drawn in full |
| Lamp travels | scroll | a slow spring moves the pool onto the nearest lit target | the light follows what is read | expressive | scroll | jumps to the target |
| Chapter enters | scroll into view | label fades up once | label settles | productive | `--motion-section` | no movement |
| Chapter index jump | click or Enter | native scroll, focus on the heading | HUD tick turns red | productive | `--motion-control` | instant |
| Roll pauses | hover or focus | animation paused | the band stops | productive | `--motion-control` | n/a |

## 7. Signature interactions

The crimson thread, the lamp light and the title that straddles each edge.

## 8. Data states

Loading holds the still with grain until the video can play; a failed video keeps its poster and a failed poster a dark field; there is no empty state (the content is static).

## 9. Voice

First person, short, no figures. Door labels: "Hire me for a project" and "Bring AI-first delivery to your team".

## 10. How it is extended

A new value goes into `design/tokens.css` with its purpose, or it does not go in. A new chapter passes `id`, `label`, `number`, `title`, `seam` and optionally `torn`.
