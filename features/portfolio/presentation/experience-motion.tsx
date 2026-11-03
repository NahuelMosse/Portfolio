"use client"

import { useEffect } from "react"
import { MOTION, gsap, motionAllowed } from "@/features/film/motion"

const WIDE = "(min-width: 900px)"
const HOLD = 0.6
const STEP = 1.6
const SCROLL_PER_STEP = 85
// A jagged edge climbing from below the stage until it clears the top: the same seven points as the resting polygon in CSS.
const INK_COVER = "polygon(0% -6%, 25% -14%, 50% -4%, 75% -12%, 100% -8%, 100% 100%, 0% 100%)"

// The scrubbed scene of the experience (wide only): the stage pins, each employer's art is wiped by ink and the next is drawn on.
export function ExperienceMotion() {
  useEffect(() => {
    if (!motionAllowed()) return
    const scope = document.querySelector<HTMLElement>("#experience")
    if (!scope) return

    const context = gsap.context(() => {
      const media = gsap.matchMedia()
      media.add(WIDE, () => {
        const stage = scope.querySelector<HTMLElement>("[data-experience-stage]")!
        const panels = gsap.utils.toArray<HTMLElement>("[data-employer]", scope)
        const counter = scope.querySelector<HTMLElement>("[data-xp-counter]")!
        const fill = scope.querySelector<HTMLElement>(".xp-progress i")!
        const total = HOLD * 2 + (panels.length - 1) * STEP

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: `+=${(panels.length - 1) * SCROLL_PER_STEP}%`,
            pin: true,
            scrub: MOTION.scrub,
            onUpdate: (self) => {
              const index = Math.min(panels.length - 1, Math.floor(self.progress * total > HOLD ? (self.progress * total - HOLD + STEP / 2) / STEP : 0))
              counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(panels.length).padStart(2, "0")}`
            },
          },
        })
        timeline.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: total }, 0)

        panels.forEach((panel, index) => {
          if (index === 0) return
          const previous = panels[index - 1]
          const at = HOLD + (index - 1) * STEP
          const outgoing = previous.querySelectorAll("[data-xp-line]")
          const incoming = panel.querySelectorAll("[data-xp-line]")
          const art = panel.querySelector(".xp-art img")
          const ink = previous.querySelector(".xp-ink")

          timeline.to(outgoing, { yPercent: -40, autoAlpha: 0, clipPath: "inset(0 0 100% 0)", stagger: 0.04, duration: 0.45, ease: MOTION.easeOut }, at)
          timeline.to(ink, { clipPath: INK_COVER, duration: 0.6, ease: MOTION.easeStrong }, at + 0.1)
          timeline.set(previous, { autoAlpha: 0 }, at + 0.75)
          timeline.set(panel, { autoAlpha: 1 }, at + 0.75)
          timeline.fromTo(art, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: MOTION.easeExpo }, at + 0.75)
          timeline.fromTo(
            incoming,
            { yPercent: 60, autoAlpha: 0, clipPath: "inset(0 0 100% 0)" },
            { yPercent: 0, autoAlpha: 1, clipPath: "inset(0 0 0% 0)", stagger: 0.07, duration: 0.6, ease: MOTION.easeOut },
            at + 0.85,
          )
        })
      })
    }, scope)

    return () => context.revert()
  }, [])

  return null
}
