"use client"

import type { CSSProperties, ReactNode } from "react"
import { useExperienceProgress } from "./use-experience-progress"

// The scrubbed section of the experience: it only owns the scroll progress; the markup inside comes from the server.
export function ExperienceScene({ count, children }: { count: number; children: ReactNode }) {
  const scene = useExperienceProgress()
  return (
    <section ref={scene} data-chapter="experience" id="experience" className="experience xp" style={{ "--count": count } as CSSProperties}>
      {children}
    </section>
  )
}
