"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

type RevealProps = { id?: string; className?: string; children: ReactNode } & Record<`data-${string}`, string | undefined>

const ENTRANCE = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }

// An article that rises into place the first time it is scrolled to; under reduced motion it is simply there.
export function Reveal({ className, children, ...attributes }: RevealProps) {
  const reduced = useReducedMotion()
  return (
    <motion.article
      {...attributes}
      className={className}
      initial={reduced ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={ENTRANCE}
    >
      {children}
    </motion.article>
  )
}
