"use client"

import { useEffect } from "react"
// kit-boundary: features/film/motion.ts is the film slice's client entry; its index reaches the server-only scene assets
import { MOTION, gsap, motionAllowed } from "@/features/film/motion"

// The offer holds for a stretch of scroll with its bottom on the screen's bottom edge, so OFFER, its note and both doors all show; while it holds, the doors' plate pushes in and the doors themselves stay still.
export function OfferMotion() {
  useEffect(() => {
    if (!motionAllowed()) return
    const scope = document.querySelector<HTMLElement>(".offer-scene")
    if (!scope) return
    if (scope.offsetHeight > window.innerHeight) return

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: scope, start: "bottom bottom", end: "+=30%", pin: true, anticipatePin: 1, scrub: MOTION.scrub },
      })
      const plate = scope.querySelector(".scene-art img")
      // grown from its top edge: the scene's top is on screen, its bottom on the screen's edge
      if (plate) timeline.fromTo(plate, { scale: 1 }, { scale: 1.04, transformOrigin: "50% 0%", duration: 1, immediateRender: false }, 0)
    }, scope)
    return () => context.revert()
  }, [])

  return null
}
