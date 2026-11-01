"use client"

import { useRef, type ReactNode } from "react"
import { useInView } from "motion/react"

type SpreadProps = { id: string; side: "left" | "right"; children: ReactNode }

// One project as a spread: its illustration on one side, the work on the other. The entrance plays once, when the spread comes into view.
export function ProjectSpread({ id, side, children }: SpreadProps) {
  const spread = useRef<HTMLElement>(null)
  const seen = useInView(spread, { once: true, amount: 0.15 })

  return (
    <article ref={spread} id={id} data-project={id} data-side={side} data-seen={seen} className="spread">
      {children}
    </article>
  )
}
