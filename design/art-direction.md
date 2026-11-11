# Art direction: the chapter illustrations

Every illustration on the page follows this line. It applies to a regenerated image, a new chapter, and any tool (Codex, Gemini, Kling).

## The line in one sentence

A graphic-novel ink print: thick black contour, flat hard-edged shadows and coarse halftone, two tones only (black ink and white paper), with most of the frame left as open paper so the page's own color fills it.

## Color: the page prints it

The file holds two tones: black ink and pure white paper. The page lays it with `mix-blend-mode: multiply` over the chapter's field color, so white paper takes the color and black stays black. No color is drawn into the file.

| Chapter | Field | Where it comes from |
|---|---|---|
| Grit, HTTP attack | `#1F55D6` blue | Grit's primary |
| ClubNahuelMosse | `#CDEB3A` lime | the app's accent |
| Cebador | `#F0A8AC` pink | the site's background |
| Sonria | `#6A4BD8` violet | the app's primary |
| Miga, migrations-safe | `#E8A33D` amber | Miga's primary |
| Guardia | `#36D1A8` teal | the TRIAJE logotype |
| Motion audit | `#B3261E` crimson | the site's own method |
| Smart Warehousing, Grupo ST, Visma, Frávega, Jüsto | the employer's brand color | the employer |

Three frames keep the palette the page already gives them, drawn with the same technique:

| Frame | Tones |
|---|---|
| Cold open | solid black and a warm amber lamp light |
| Offer | solid black and a deep red light from the open door |
| Closing | black ink on white paper; the page tints it crimson |

## Mark

- **Contour.** One brush line, thick on the outer contour and thin inside, slightly irregular, hand-printed.
- **Shadow.** Closed black shapes with a hard edge, never soft falloff.
- **Midtone.** Coarse halftone dots, visible at the page's size, only on the lit forms that turn (the face, the arms, the object of the act).
- **Detail decides.** Hands, face and the object of the act carry the detail; the setting is a few contour lines; the rest is untouched paper. The same texture spread evenly over face, wall and floor reads as generated.

## Light and camera

- **Light.** One hard source per frame, named in the prompt, and the shadows fall from it. A visible lamp or window is the light on him.
- **No atmosphere.** No glow, bloom, haze, rays, neon or lens effects.
- **Shots.** Each frame uses a different shot for its act: an extreme close-up of hands, top-down, a low angle, over the shoulder, a silhouette, a wide shot with him small.
- **Composition.** Asymmetric, never a centered portrait.

## Room for the page

The page crops every plate and sets type and devices over it. The open paper is where they go.

| Plate | What the page shows of it | Where he goes | Open paper |
|---|---|---|---|
| Project 16:9, phone | x 15–85 % and y 17–68 % at 1910 × 912; the word over the top-left, the phone at x 55–66 %, the copy in the lower-left corner | large, filling the open middle-left: x 28–54 %, head and shoulders at y 22–48 %, the body running past the bottom of the band | the lower-left corner under the copy; right of the phone only a few lines of the setting |
| Project 16:9, browser | the same crop; the browser over x 38 % to the right edge, the copy in the lower-left; the second composition mirrors it | the copy side, x 15–36 %, head and shoulders at y 34–62 % | right of x 38 %, a few light lines of the setting |
| Tool 16:9 (no device) | the same crop; the word across the top, the copy over the left | x 45–84 %, head at y 28–50 % | x 0–42 % |
| Employer 16:9 | the same crop; logo and copy over the left | x 38–80 %, head in the upper third | x 0–35 % |
| Project or employer 9:16 | the full width, but a device covers from y 38 % down | head and shoulders at y 14–36 % | the top 12 %; below y 40 % only light contour |
| Cold open 16:9 | the full frame under the top bar; the name over the right | the left half | the right 45 %, solid black |
| Offer 16:9 | object-position 62 % 0; title over the top, panels over the bottom 45 % | small, in the middle band | the floor, solid black |
| Closing 16:9 | the full frame, tinted crimson; title and copy over the left | the hand in the right half | the left 50 % |

## Him

- **Identity.** He is the only figure. His identity comes from his own photographs, attached to every prompt: slim build, soft jaw, dark curly hair, a plain black t-shirt.
- **Drawing.** An ordinary face doing the act, half in shadow, with asymmetry; never idealized.
- **Action.** Absorbed in the act, eyes on the work, never looking at the viewer, never posing.

## One act per chapter

| Chapter | Formats | The act | Shot |
|---|---|---|---|
| Cold open | 16:9, 9:16 | at his desk under the lamp, reading the label of a sealed envelope | medium, from the side |
| Grit | 16:9, 9:16 | chalking his hands before a lift, a power rack behind | low angle, three-quarter |
| ClubNahuelMosse | 16:9, 9:16 | lunging low on a padel court to reach the ball | wide, him small |
| Cebador | 16:9, 9:16 | pouring hot water from a thermos into a mate at a stall | close profile, hands and face |
| Sonria | 16:9, 9:16 | writing an appointment into a ledger at a clinic desk | high angle, from above |
| Miga | 16:9, 9:16 | pulling loaves from the oven with a long peel | silhouette against the oven mouth |
| Guardia | 16:9, 9:16 | pushing a stretcher fast down a corridor | low angle, in motion |
| Motion audit | 16:9, 9:16 | studying a film strip on a light table through a loupe | extreme close-up, profile |
| HTTP attack | 16:9, 9:16 | trying a key from a ring in a fortress door lock | over the shoulder |
| Migrations-safe | 16:9, 9:16 | pushing a hand truck of file boxes across a rope bridge | wide, from behind |
| Smart Warehousing | 16:9, 9:16 | at a mezzanine railing looking down at racks and a robot | high, over the shoulder |
| Grupo ST | 16:9, 9:16 | walking a bank hallway reading a file, a vault door behind | medium profile, walking |
| Visma | 16:9, 9:16 | checking a payroll sheet line by line with a pen, a laptop beside | top-down, hands and sheet |
| Frávega | 16:9, 9:16 | setting a parcel onto a conveyor | close, hands in front, face beyond |
| Jüsto | 16:9, 9:16 | scanning a crate of produce in an aisle | low angle in the aisle |
| Offer | 16:9 | walking toward two doors, the left one open | wide from behind, him small |
| Closing | 16:9 | a hand pressing a wax seal onto an envelope | extreme close-up of the hand |

## Never

- Text, letters, numbers or logos anywhere in the image; labels and screens are blank.
- A drawn device screen in a project frame: the page sets the real interface over the open paper.
- A color in the file; grays as smooth gradients; a photographic or 3D look.
- Extra fingers, warped hands, a second person.
