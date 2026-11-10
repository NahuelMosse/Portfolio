# Handoff · designer fix round, mobile (below 1100px)

## Done (committed)
1. Let's talk fits 100svh below 1100: `app/globals.css`, end of the `max-width: 1099px` block. Measured block (scene top to last network link) at 390x844 639, 375x667 485, 360x740 560, 414x896 698, 768x1024 784, 844x390 283: all under innerHeight. Desktop 1910x912 722 and 1440x900 675 unchanged. The roll and the © line sit inside the same 100svh.
2. Offer doors: below 1100 the `.offer-scene .folder` takes the wide screen's colors (freelance: ink glass 45 %, bone button with ink type; company: crimson glass 45 %, crimson button).
3. Website/app plates: `group.css` fixes `--avail` for `data-layers="both"` and `data-kind="phone"` cards to Cebador's room (23.75rem caption reserve), so Sonria, Miga and the apps size like Cebador.
4. Bezel: below 1100 `--device-bezel: 3px` and `--radius-phone: 1.125rem` on phone rigs (`showcase.css`).
5. Status bar on every phone (all widths): `showcase-device.tsx` (`StatusBar`, inline SVG), `showcase.css` (cqw sizes), `piece-bars.json` from `scripts/derive-bars.mjs` (bar color = the app's top edge, light or dark icons by luminance). Club's captures have an Android bar baked in: cropped by `trim: 0.04` (CSS translate of the image under the screen's overflow), so it is drawn once and every phone gets the same bar and frame.

## Not covered (turn budget)
- *could not run*: visual review of the after captures (`D:/tmp/ia3/walk2-a390`, `walk2-a390r` reduced motion, `walk2-a1910`, `walk2-a1440`) and of Let's talk after (`D:/tmp/ia3/lt/after-sheet.jpg`, taken before the last handle-size and offer edits). Check the status bar reads on Grit, Club, Cebador, Sonria, Miga, Triaje (phone), that Club shows no second bar, the offer doors at 390 and 768, and Sonria/Miga against Cebador.
- *could not run*: desktop pixel diff. `node D:/tmp/ia3/diff.cjs D:/tmp/ia3/walk2-b1910 D:/tmp/ia3/walk2-a1910` (and 1440) with `NODE_PATH=D:/projects/Portfolio-d/node_modules`; only the phone status bars may differ. Baselines were taken before any change.
- *could not run*: Let's talk measure with reduced motion; `D:/tmp/ia3/lt-measure.cjs reduce`. The offer after-sheet. The affected tests (`node .claude/tools/affected.mjs <files>`).
- Open: the 768-1099 bezel is 3px too; `--copy-h` is set inline by `use-group-track.ts`, so the plate fix overrides `--avail` instead.
- Before/after sheets: Let's talk `D:/tmp/ia3/lt/before-sheet.jpg` / `after-sheet.jpg`; projects before `D:/tmp/ia3/lt/b390-proj.jpg`.
