# Handoff T6 variant D (grouped chapters, ASM-26)

Worktree D:/projects/Portfolio-d, branch portfolio-present-d. Live app http://127.0.0.1:64913 is the requester's: do not bring it down. Run specs with `APP_URL=http://127.0.0.1:64913 npx playwright test <file>`.

## Current design
- Each group (apps, landings, game) is one pinned scene scrubbed by the scroll (project-group.tsx, use-group-track.ts, group.css), at every width with motion. Each project holds four beats (its screens swap in the device), then the group turns to the next project.
- The turn is a wipe: the next project's card slides over the one on show (from the right wide, from below at 390) while its stage counter-slides with a lag, so the scene is revealed in place; the one on show stays opaque underneath. Field, art, word and devices carry no opacity; only transforms move. The word leaves on the other axis. Copy fades out in the first 20% of the turn and in over the last 30%, so two texts never share the screen.
- Reduced motion: no pin, each project a still with its copy whole and no transform.
- The index in the group head is a shortcut; scrolling alone reaches every project.
- Dev kit (kit-scene.tsx) is a separate scene and was not changed.

## Verified
- e2e/project-wipe-transitions.spec.ts 5/5 (reached by scroll at 390 and 1440, no two texts and opaque fields at 13 frames per turn, reduced-motion stills). tsc exit 0.
- Heights: page 14373 at 390, 14123 at 1440; apps 2042/2178, landings 2785/2970, game 1300/1386.
- Frames with GPU raster: median 16.7 ms, a few strays at the project handoff (React re-render). Headless software rendering is 116 ms median and says nothing.
- Captures: .validation/cap/w-<group>-rest<n>, w-<group>-turn<n>a|b|c, w-kit-a|b, each -390 and -1440. Scripts: .validation/cap-wipe.mjs, cap-kit.mjs, jank.mjs.

- Experience row photos: each has a focal y (focusY in experience.tsx, --photo-y) so his face is in the low strip; Jüsto uses data-crop="face" (work-presenting zoomed 330% and mirrored onto him alone, the slide cropped out). Chapter 1165 at 1440, 1239 at 390. e2e/experience-photos.spec.ts 2/2. Captures .validation/cap/x-exp-<row>-390|1440, script .validation/cap-exp.mjs.

## Open
- Design round and motion-audit.mjs not run. First cold decode of the art can drop one long frame.
- Older e2e specs (backdrop, poster, poster-art, glance-ai-line, showcase, groups) fail against this design; the Log has their replaces lines.
- Do not stage any png or webp; the modified tracked triaje-*.webp stay unstaged.
