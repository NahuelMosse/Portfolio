"use client"

import { useEffect, useRef, useState } from "react"

// Share of one project's stretch of scroll in which the track rests on it before it moves to the next.
const REST_FROM = 0.3
const REST_TO = 0.7

const smooth = (x: number) => x * x * (3 - 2 * x)

// Where the track stands, in projects: whole numbers rest on a project, in between the track is moving.
export function trackAt(progress: number, count: number) {
  if (count < 2) return 0
  const stretch = progress * (count - 1)
  const whole = Math.floor(stretch)
  const moved = Math.min(1, Math.max(0, (stretch - whole - REST_FROM) / (REST_TO - REST_FROM)))
  return whole + smooth(moved)
}

// A group is a tall section with one pinned stage; the scroll through it drives a horizontal track of its projects. The track goes
// to the section as the CSS variable --track, and the project nearest to it is the state, so the others are kept out of reach.
export function useGroupTrack(count: number) {
  const scene = useRef<HTMLElement>(null)
  const [nearest, setNearest] = useState(0)

  useEffect(() => {
    const node = scene.current
    if (!node) return
    let frame = 0

    const measure = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      const run = rect.height - window.innerHeight
      const progress = run > 0 ? Math.min(1, Math.max(0, -rect.top / run)) : 0
      const track = trackAt(progress, count)
      node.style.setProperty("--track", track.toFixed(4))
      setNearest(Math.round(track))
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
  }, [count])

  return { scene, nearest }
}
