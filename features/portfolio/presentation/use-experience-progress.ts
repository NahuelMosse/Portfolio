"use client"

import { useEffect, useRef } from "react"

// The scroll through the experience section as one number: --xp goes from 0 (the section reaches the top) to 1 (its pinned run ends).
// The track, the progress rule and each poster's parallax read it in CSS, so no render happens per frame.
export function useExperienceProgress() {
  const scene = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = scene.current
    if (!node) return
    let frame = 0

    const measure = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      const run = rect.height - window.innerHeight
      const progress = run > 0 ? Math.min(1, Math.max(0, -rect.top / run)) : 0
      node.style.setProperty("--xp", progress.toFixed(4))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [])

  return scene
}
