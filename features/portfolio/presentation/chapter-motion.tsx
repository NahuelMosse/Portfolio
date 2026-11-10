"use client"

import { useEffect } from "react"
// kit-boundary: features/film/motion.ts is the film slice's client entry; its index reaches the server-only scene assets
import { MOTION, gsap, motionAllowed } from "@/features/film/motion"

// The chapter words rise letter by letter as they arrive, their fine detail drawing in beside them; the projects and experience words then
// drift up as their first scene arrives, and that group opens out of a clipped frame. Mounted once for every chapter.
export function ChapterMotion() {
  useEffect(() => {
    if (!motionAllowed()) return

    const context = gsap.context(() => {
      document.querySelectorAll<HTMLElement>("[data-chapter-title]").forEach((title) => {
        const arrival = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: title, start: "top bottom", end: "top 55%", scrub: MOTION.scrub },
        })
        arrival.fromTo(title.querySelectorAll(".chapter-letter"), { yPercent: 135 }, { yPercent: 0, stagger: 0.05, ease: "power3.out" }, 0)
        // the detail line is one piece wiped in from the left over the same span and curve as the letters, not faded: at any scroll
        // position its text reads at full contrast
        arrival.fromTo(
          title.querySelector(".chapter-detail"),
          { clipPath: "inset(-50% 100% -50% 0%)" },
          { clipPath: "inset(-50% 0% -50% 0%)", duration: arrival.duration(), ease: "power3.out" },
          0,
        )

        if (title.dataset.chapterTitle === "projects" || title.dataset.chapterTitle === "experience") {
          gsap.fromTo(
            title.querySelector(".chapter-word"),
            { yPercent: 0 },
            { yPercent: -8, ease: "none", scrollTrigger: { trigger: title, start: "top 35%", end: "bottom top", scrub: MOTION.scrub } },
          )
        }
      })

      const apps = document.querySelector<HTMLElement>("#projects #apps")
      const pin = apps?.querySelector(".group-pin")
      if (apps && pin) {
        const opening = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: apps, start: "top bottom", end: "top top", scrub: MOTION.scrub },
        })
        opening.fromTo(pin, { clipPath: "inset(0% 7% 0% 7%)" }, { clipPath: "inset(0% 0% 0% 0%)" }, 0)
        const plate = apps.querySelector(".plate img")
        if (plate) opening.fromTo(plate, { scale: 1.12 }, { scale: 1 }, 0)
      }
    })

    return () => context.revert()
  }, [])

  return null
}
