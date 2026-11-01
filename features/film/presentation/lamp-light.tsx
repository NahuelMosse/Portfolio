"use client"

import { useEffect } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react"

const LAMP_SPRING = { stiffness: 60, damping: 18 }
const KEEP_IN_VIEW = 0.25

type Spot = { x: number; y: number }

// The nearest lit target to the middle of the screen: its distance is zero when the middle is inside it.
function nearestTarget(targets: Element[]): DOMRect | null {
  const middle = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  let best: { rect: DOMRect; distance: number } | null = null
  for (const target of targets) {
    const rect = target.getBoundingClientRect()
    const dx = Math.max(rect.left - middle.x, 0, middle.x - rect.right)
    const dy = Math.max(rect.top - middle.y, 0, middle.y - rect.bottom)
    const distance = Math.hypot(dx, dy)
    if (!best || distance < best.distance) best = { rect, distance }
  }
  return best?.rect ?? null
}

function spotOn(rect: DOMRect): Spot {
  const top = window.innerHeight * KEEP_IN_VIEW
  const bottom = window.innerHeight * (1 - KEEP_IN_VIEW)
  const centreY = rect.top + rect.height / 2
  return { x: rect.left + rect.width / 2, y: Math.min(Math.max(centreY, top), bottom) }
}

// One pool of desk-lamp light that travels down the page onto whatever is being read:
// him, each case, the two folders, and the sealed file at the end.
export function LampLight() {
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, LAMP_SPRING)
  const springY = useSpring(y, LAMP_SPRING)

  useEffect(() => {
    const move = () => {
      const rect = nearestTarget([...document.querySelectorAll("[data-lamp-target]")])
      if (!rect) return
      const spot = spotOn(rect)
      x.set(spot.x)
      y.set(spot.y)
      if (reduced) {
        springX.jump(spot.x)
        springY.jump(spot.y)
      }
    }
    move()
    window.addEventListener("scroll", move, { passive: true })
    window.addEventListener("resize", move)
    window.addEventListener("load", move)
    return () => {
      window.removeEventListener("scroll", move)
      window.removeEventListener("resize", move)
      window.removeEventListener("load", move)
    }
  }, [reduced, x, y, springX, springY])

  return <motion.div data-lamp-light="" className="lamp-light" aria-hidden="true" style={{ x: springX, y: springY }} />
}
