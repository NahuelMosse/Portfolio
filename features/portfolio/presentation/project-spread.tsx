"use client"

import { useRef, type ReactNode } from "react"
import { useInView } from "motion/react"

type SpreadProps = { id: string; children: ReactNode }

// One project: its scene, its words and its other pieces. The pieces fade in once, when the project comes into view.
export function ProjectSpread({ id, children }: SpreadProps) {
  const spread = useRef<HTMLElement>(null)
  const seen = useInView(spread, { once: true, amount: 0.15 })

  return (
    <article ref={spread} id={id} data-project={id} data-seen={seen} className="spread">
      {children}
    </article>
  )
}
