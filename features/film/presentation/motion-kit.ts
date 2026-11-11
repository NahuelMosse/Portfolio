import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// The motion tokens of the page: eases, scrub smoothing, reveal lengths and staggers (PF-1-ASM-35).
export const MOTION = {
  easeOut: "power3.out",
  easeStrong: "power4.out",
  easeExpo: "expo.out",
  scrub: 1,
  reveal: 0.9,
  wordStagger: 0.05,
  lineStagger: 0.1,
} as const

// Every scene asks this first: reduced motion leaves the page stacked and still, with no pin and no hidden state.
export function motionAllowed() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export { gsap, ScrollTrigger }
