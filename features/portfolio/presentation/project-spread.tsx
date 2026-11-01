"use client"

import { useRef, type ReactNode } from "react"
import { useInView } from "motion/react"

type SpreadProps = { id: string; composition: "a" | "b"; children: ReactNode }

// One project poster: its numeral and word, its device, its words and its other pieces. The composition alternates between cases.
// The pieces fade in once, when the project comes into view.
export function ProjectSpread({ id, composition, children }: SpreadProps) {
  const spread = useRef<HTMLElement>(null)
  const seen = useInView(spread, { once: true, amount: 0.15 })

  return (
    <article ref={spread} id={id} data-project={id} data-composition={composition} data-seen={seen} className="spread">
      {children}
    </article>
  )
}
