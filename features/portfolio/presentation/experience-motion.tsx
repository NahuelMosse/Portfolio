"use client"

import { useEffect } from "react"
import { MOTION, gsap, motionAllowed } from "@/features/film/motion"

const WIDE = "(min-width: 900px)"
const HOLD = 0.6
const STEP = 1.6
const SCROLL_PER_STEP = 85
// A jagged edge climbing from below the stage until it clears the top: the same seven points as the resting polygon in CSS.
const INK_COVER = "polygon(0% -6%, 25% -14%, 50% -4%, 75% -12%, 100% -8%, 100% 100%, 0% 100%)"

// Offsets inside one handoff, in timeline units. The incoming art and copy start while the outgoing copy is still leaving and the ink
// is still rising, so the stage always has something on it.
const OUT_COPY = 0.4
const INK_FROM = 0.15
const INK_LENGTH = 0.6
const IN_ART = 0.1
const IN_COPY = 0.18
const OUT_PANEL_HIDDEN = 0.95

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

          timeline.to(outgoing, { yPercent: -40, autoAlpha: 0, clipPath: "inset(0 0 100% 0)", stagger: 0.03, duration: OUT_COPY, ease: MOTION.easeOut }, at)
          timeline.to(ink, { clipPath: INK_COVER, duration: INK_LENGTH, ease: MOTION.easeStrong }, at + INK_FROM)
          timeline.set(panel, { autoAlpha: 1 }, at + IN_ART)
          timeline.fromTo(art, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: MOTION.easeExpo }, at + IN_ART)
          timeline.fromTo(
            incoming,
            { yPercent: 60, autoAlpha: 0, clipPath: "inset(0 0 100% 0)" },
            { yPercent: 0, autoAlpha: 1, clipPath: "inset(0 0 0% 0)", stagger: 0.06, duration: 0.5, ease: MOTION.easeOut },
            at + IN_COPY,
          )
          timeline.set(previous, { autoAlpha: 0 }, at + OUT_PANEL_HIDDEN)
        })
      })
    }, scope)

    return () => context.revert()
  }, [])

  return null
}
