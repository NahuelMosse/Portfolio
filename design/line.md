# Project design line

Every color, duration, radius and space of the site is a custom property in `design/tokens.css`; `app/globals.css` and the components use them with `var(--…)`.

## 1. References

The requester's 32 images, local in `specs/PF-1-cinematic-portfolio/ref/` (git-ignored). What is taken from each:

- ref-01: condensed type over a painted world, a staggered case list, the "featured in" marquee band, "Let's connect" over the hero image. Taken: the credits roll as two full-bleed bands and the closing over the image.
- ref-12 and ref-17: a cut-out subject breaking a red shape; high-contrast serif on bone paper with a red sun disc behind. Taken: the red disc and the bone paper scraps.
- ref-19 and ref-21..22: thin-line frames with corner brackets, four-point stars, a data sheet in small type. Taken: the character sheet of the cold open.
- ref-20: images joined to labels by thin leader lines. Taken: the leader labels on the pieces.
- ref-23: the requester's whole-page mockup, the approved direction: NAWI over the hub, torn paper between chapters, giant chapter words, two doors at the end. Layout only; its content is not used.
- ref-24..32: the dark pantheon, deities cut out in front of a giant serif title. Taken: the seam figures and the mood.

## 2. Direction

One visitor, a prospective client or a hiring lead, who reads the cold open in five seconds and the rest as a scroll. It must feel like one poster that unrolls, not a stack of sections; it avoids cinema as a theme, stat bars, figures and any full-width background change.

- Invention 9: the page is a showpiece; the structure (native scroll, four chapters, two doors) is conventional, the execution is not.
- Density 3: one idea per screen, small type only on the character sheet.
- Expression 9: showcase register.

Continuity decisions (ASM-25, ASM-26): one fresco behind every chapter; one crimson thread drawn by scroll that ends split into the two doors; one red disc fixed behind the chapters that sinks with scroll and rises behind the closing; each chapter title straddles the edge with the chapter before, half over each; a seam figure stands on each edge, mirrored on the right so it looks toward the chapter that follows; one HUD rail on the right edge with a tick per chapter; the paper is a torn scrap laid over the fresco on the seams, never a full-width band.

| Scene | States | Proves it with | Copies the composition of |
|---|---|---|---|
| Cold open | NAWI mark behind him, red disc, character sheet | who he is in five seconds | ref-23 and ref-21 |
| Projects | numbered cases, each a deity, scene and framed pieces | the work before the offer | ref-16 and ref-23 |
| Experience | employers as a list, the current one on a red band | where he served | ref-23 |
| End credits | the offer, the roll, the two doors | what to do next | ref-01 and ref-23 |

## 3. Tokens

All in `design/tokens.css`.

- Color: black `--ink`, bone cream `--bone` and one accent `--red`, plus tints of each by percentage (`--red-16`, `--bone-35`, `--ink-70`). Bone text on `--ink` and on `--red` meets 4.5:1. Nothing else is saturated.
- Space: 4 8 16 24 40 64 112 (`--space-1` to `--space-7`).
- Radius: `--radius-pill` for controls and arches, `--radius-round` for the disc. No shadows: separation is by thin line and by the fresco.
- Motion: `out` cubic-bezier(.16,1,.3,1) at `--motion-control` 200 ms for controls and `--motion-section` 900 ms for the section moves; the roll and marquee have their own long durations; press scales to `--press-scale`. Only transform, opacity and color move.
- Layout constants: `--poster-descent`, `--seam-height`, `--disc-size`.

## 4. Typography

Boska (display) is the identity: NAWI edge to edge as the mark, chapter titles at poster scale (4.5rem to 17rem), uppercase, tracking -0.03em, line height 0.82, letters crossed by the image. General Sans carries text and the small spaced uppercase labels between thin rules (0.75rem, tracking 0.16 to 0.32em). Two weights: 700 for display, regular for text. Both self-hosted in `public/fonts`.

## 5. The system: primitives, components and patterns

- Chapter (`features/film`): label between thin rules, the poster title, a seam figure and an optional torn scrap; the card of a chapter has no frame.
- Shell (`features/film`): fresco, red disc, crimson thread and HUD rail, plus the controls that never hold the visitor: skip, chapter index, sound toggle and the corner call to action. Controls are one pill with hover to red, a visible focus ring and a press scale.
- Credits roll: two full-bleed bands on the Magic UI marquee, edges faded into black, paused by hover or focus.
- Catalog items in use: Magic UI marquee, border beam, animated shiny text, text animate; Aceternity sticky scroll reveal and parallax scroll; shadcn button. Vendored as installed.
- Patterns: native scroll, never a hijacked wheel; a jump moves focus to the chapter heading; reduced motion leaves stills, the disc and the thread fully drawn, and the bands wrapped and still.

## 6. State changes of the screen

| Change | Trigger | Rules | Feedback | Kind | Token | Reduced |
|---|---|---|---|---|---|---|
| Thread draws | scroll | pathLength follows scroll progress; branches split above the doors | the red line reaches the two doors | expressive | scroll | drawn in full |
| Disc travels | scroll | sinks until 75% of the page, rises behind the closing | one sun across the page | expressive | scroll | still |
| Chapter enters | scroll into view | label fades up once | label settles | productive | `--motion-section` | no movement |
| Chapter index jump | click or Enter | native scroll, focus on the heading | HUD tick turns red | productive | `--motion-control` | instant |
| Roll pauses | hover or focus | animation paused | the band stops | productive | `--motion-control` | n/a |

## 7. Signature interactions

The crimson thread, the travelling red disc and the title that straddles each edge.

## 8. Data states

Loading holds the still with grain until the video can play; a failed video keeps its poster and a failed poster a dark field; there is no empty state (the content is static).

## 9. Voice

First person, short, no figures. Door labels: "Hire me for a project" and "Bring AI-first delivery to your team".

## 10. How it is extended

A new value goes into `design/tokens.css` with its purpose, or it does not go in. A new chapter passes `id`, `label`, `title`, `seamSide` and optionally `torn`.
