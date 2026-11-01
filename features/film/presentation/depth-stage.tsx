"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"

type Depth = { pointerX: MotionValue<number>; pointerY: MotionValue<number>; scrollY: MotionValue<number> }

const DepthContext = createContext<Depth | null>(null)
const POINTER_SPRING = { stiffness: 90, damping: 22 }

function useDepth(): Depth {
  const depth = useContext(DepthContext)
  if (!depth) throw new Error("DepthLayer needs a DepthStage around it")
  return depth
}

export function DepthStage({ className, children }: { className?: string; children: ReactNode }) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const pointerX = useSpring(rawX, POINTER_SPRING)
  const pointerY = useSpring(rawY, POINTER_SPRING)
  const { scrollY } = useScroll()

  useEffect(() => {
    const follow = (event: PointerEvent) => {
      rawX.set(event.clientX / window.innerWidth - 0.5)
      rawY.set(event.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener("pointermove", follow)
    return () => window.removeEventListener("pointermove", follow)
  }, [rawX, rawY])

  return (
    <DepthContext.Provider value={{ pointerX, pointerY, scrollY }}>
      <div className={className}>{children}</div>
    </DepthContext.Provider>
  )
}

type DepthLayerProps = {
  name: string
  // pixels the layer travels across the full pointer range
  pointerDepth: number
  // share of the page scroll the layer lags behind
  scrollLag: number
  className?: string
  children?: ReactNode
}

export function DepthLayer({ name, pointerDepth, scrollLag, className, children }: DepthLayerProps) {
  const { pointerX, pointerY, scrollY } = useDepth()
  const reduced = useReducedMotion()
  const x = useTransform(pointerX, (v) => (reduced ? 0 : v * pointerDepth))
  const y = useTransform([pointerY, scrollY], ([py, sy]: number[]) => (reduced ? 0 : py * pointerDepth + sy * scrollLag))

  return (
    <motion.div data-layer={name} data-motion className={className} style={{ x, y }}>
      {children}
    </motion.div>
  )
}
