"use client"

import { STAMP_ID, STAMP_VIEWBOX } from "./brand-mark"
import { STAMP_PATH } from "./n5-stamp"

export const INK_ID = "n5-ink"

// the ink of a stamp not yet pressed: a few specks
const BLANK_INK = "-4.8"

// commas, not spaces, between the coordinates: a run like "800 1094" in the HTML reads as a phone number to the scrubbers
const OUTLINE = STAMP_PATH.replaceAll(" ", ",")

const defs = (ink: string) =>
  `<symbol id="${STAMP_ID}" viewBox="${STAMP_VIEWBOX}" fill="currentColor"><path d="${OUTLINE}"/></symbol>` +
  `<filter id="${INK_ID}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">` +
  `<feTurbulence type="fractalNoise" baseFrequency="0.014 0.02" numOctaves="3" seed="11" result="grain"/>` +
  `<feComponentTransfer in="grain" result="pressure"><feFuncA id="${INK_ID}-a" type="linear" slope="6" intercept="${ink}"/></feComponentTransfer>` +
  `<feComposite in="SourceGraphic" in2="pressure" operator="in"/></filter>`

// The ink the head script has already let through. When React regenerates the page it draws the sprite again, and it has to
// draw it at that reading, not at the blank stamp, or the ink goes back for a frame.
const inkSoFar = () => (typeof window === "undefined" ? undefined : (window as { __nawiBoot?: { ink?: string } }).__nawiBoot?.ink)

// The n5 stamp, once per page and inside the HTML itself, so the opening title paints it from the first frame with no request of
// its own; every mark on the page is a <use> of it and takes the color of where it sits. With it, the ink filter: a grain of
// rubber-stamp noise whose threshold (n5-ink-a, written by the head script) drops as the page arrives, from a few specks of ink
// to the full impression. The Preloader draws it, from its own bundle: anything at the top of the body that waits on a script
// chunk or on a long string of the server payload suspends the hydration of the whole body, and React then regenerates the page.
export function StampSprite() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      style={{ position: "absolute" }}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: `<defs>${defs(inkSoFar() ?? BLANK_INK)}</defs>` }}
    />
  )
}
