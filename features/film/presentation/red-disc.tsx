"use client"

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

const TRAVEL_END = 0.75

// The red sun of the cold open: it sinks behind every chapter as the page scrolls and
// rises again behind the closing.
export function RedDisc() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, TRAVEL_END, 1], ["0vh", "30vh", "4vh"])
  const scale = useTransform(scrollYProgress, [0, TRAVEL_END, 1], [1, 0.8, 1.15])

  return (
    <motion.div
      data-red-disc=""
      className="red-disc"
      aria-hidden="true"
      style={reduced ? undefined : { y, scale }}
    />
  )
}
