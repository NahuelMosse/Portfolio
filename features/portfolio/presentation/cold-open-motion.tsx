"use client"

import { useEffect } from "react"
// kit-boundary: features/film/motion.ts is the film slice's client entry; its index reaches the server-only scene assets
import { MOTION, gsap, motionAllowed } from "@/features/film/motion"

const PIN_LENGTH = "+=15%"
const COVER_START = 1.12

// The cold open as a dolly out: the camera pulls back from the cover while NAWI parts and fades; the cover then hands straight to the projects.
export function ColdOpenMotion() {
  useEffect(() => {
    if (!motionAllowed()) return
    const scope = document.querySelector<HTMLElement>("#cold-open")
    if (!scope) return

    const context = gsap.context(() => {
      const cover = scope.querySelector(".scene-art img")
      const mark = scope.querySelector(".mark")
      const name = scope.querySelector(".professional-name")

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: scope, start: "top top", end: PIN_LENGTH, pin: true, scrub: MOTION.scrub },
      })
      // scaled from its top edge, so his hair never rises under the top bar
      timeline.fromTo(cover, { scale: COVER_START }, { scale: 1, duration: 1 }, 0)
      // opacity, not autoAlpha: the page's only h1 stays in the accessibility tree once it has faded
      timeline.to(mark, { scale: 1.18, opacity: 0, transformOrigin: "50% 50%", duration: 0.6, ease: MOTION.easeOut }, 0.1)
      timeline.to(name, { autoAlpha: 0, duration: 0.3 }, 0.1)
      // from an explicit brightness(1): tweening from "none" starts at brightness(0) and flashes the cover black
      timeline.fromTo(cover, { filter: "brightness(1)" }, { filter: "brightness(0.5)", duration: 1 }, 0)
      timeline.to(cover, { y: "-6%", duration: 0.75 }, 0.25)
      // the sheet fades with NAWI. On a phone it stays, in flow: hiding it would leave a blank band.
      if (window.matchMedia("(min-width: 701px)").matches) {
        timeline.fromTo(scope.querySelector(".layer-sheet"), { y: 0, autoAlpha: 1 }, { y: -30, autoAlpha: 0, duration: 0.6 }, 0.1)
      }
    }, scope)

    return () => context.revert()
  }, [])

  return null
}
