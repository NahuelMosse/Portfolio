"use client"

import { useEffect, useRef, useState } from "react"

// A pinned scene is a tall section with a sticky stage. Its progress runs from 0 as the stage pins to 1 as it lets go.
// The progress goes to the section as the CSS variable --p, so the parallax and the lighting follow the scroll without a render
// per frame; only the beat, the part of the story that is on, is state.
export function useScrollBeat(beats: number) {
  const scene = useRef<HTMLElement>(null)
  const [beat, setBeat] = useState(0)

  useEffect(() => {
    const node = scene.current
    if (!node) return
    let frame = 0

    const measure = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      const run = rect.height - window.innerHeight
      const progress = run > 0 ? Math.min(1, Math.max(0, -rect.top / run)) : 0
      node.style.setProperty("--p", progress.toFixed(4))
      setBeat(Math.min(beats - 1, Math.floor(progress * beats)))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [beats])

  return { scene, beat }
}

// The screen a beat shows when a project has fewer or more screens than beats.
export function screenAt(beat: number, beats: number, screens: number) {
  return Math.min(screens - 1, Math.floor((beat * screens) / beats))
}
