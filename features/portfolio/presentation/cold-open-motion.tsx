"use client"

import { useEffect } from "react"
import { MOTION, gsap, motionAllowed } from "@/features/film/motion"

const PIN_LENGTH = "+=120%"
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
      const risers = scope.querySelectorAll(".layer-sheet, .hero-line, .hero-door")

      gsap.from(risers, { y: 36, autoAlpha: 0, duration: MOTION.reveal, stagger: MOTION.lineStagger, ease: MOTION.easeOut, delay: 0.3 })

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: scope, start: "top top", end: PIN_LENGTH, pin: true, scrub: MOTION.scrub },
      })
      // scaled from its top edge, so his hair never rises under the top bar
      timeline.fromTo(cover, { scale: COVER_START }, { scale: 1, duration: 1 }, 0)
      timeline.to(mark, { scale: 1.18, autoAlpha: 0, transformOrigin: "50% 50%", duration: 0.6, ease: MOTION.easeOut }, 0.1)
      timeline.to(name, { autoAlpha: 0, duration: 0.3 }, 0.1)
    }, scope)

    return () => context.revert()
  }, [])

  return null
}
