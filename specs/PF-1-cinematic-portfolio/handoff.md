# Handoff: mobile Offer, Let's talk on phones, end-of-page band

## Done (app/globals.css, features/portfolio/presentation/contact-marquee.tsx)
- Offer below 701px: each door is a screen of its own (min-height from 100svh), button anchored to the panel foot, no band under the TPM door.
- Let's talk below 1100px: the word is larger (min(36vw, 15svh)); the address is a display line that breaks at the @ (a `<wbr>` was added), left on the gutter; networks are big serif names on the same left gutter (the negative margins that pushed GITHUB out were removed); the © line is left-aligned and on one line; the roll has the desktop opacity and gap.
- Page end at 1100-1279px: the word was 26vw and wrapped to two lines, which overflowed the screen and left a black strip. It now follows the 1280+ rule (16.5vw, one line). Sweep of 1100/1140/1280/1366/1440 at 768/800/912 plus the phone sizes: gap 0, word under the header, eyebrow visible (D:/tmp/ia3/sweep-after.log). lt-measure: FITS at all six sizes.
- Desktop diff 1910x912: only the animated roll band (ticks 27, 28) differs.

## Not covered (turn budget)
- Offer: the door text is meant to sit centred between the tab and the button. The last edit (`.offer-scene .folder p.folder-tab { margin-top: auto }`) is not served by the dev server on 8707 (served CSS still has the older merged rule), so it is *could not run*. Check why the served chunk lacks it (stale turbopack cache?) and re-walk 390x844, 375x667, 360x740, 414x896, 768x1024, 844x390 and reduced motion.
- Contact at 768x1024 and 844x390 looked right in D:/tmp/ia3/contact-final.jpg; the reduced-motion contact measure was not read.
- The dev server on 8707 had died; a new one was started from D:/projects/Portfolio-d (pid 65588).
