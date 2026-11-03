"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import "lenis/dist/lenis.css"
import { gsap, ScrollTrigger, motionAllowed } from "./motion-kit"

const SMOOTH = { lerp: 0.08, wheelMultiplier: 0.9, anchors: true } as const

// The scroll engine: Lenis smooths the wheel on desktop and is driven by the GSAP ticker; the position stays the native one, so
// every scroll reader keeps working. Reduced motion has no engine at all, and touch keeps its native scroll.
export function MotionEngine() {
  useEffect(() => {
    if (!motionAllowed()) return
    const root = document.documentElement
    root.classList.add("has-motion")

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener("load", refresh)

    const touch = window.matchMedia("(pointer: coarse)").matches
    if (touch) {
      return () => {
        window.removeEventListener("load", refresh)
        root.classList.remove("has-motion")
      }
    }

    const lenis = new Lenis(SMOOTH)
    const tick = (time: number) => lenis.raf(time * 1000)
    lenis.on("scroll", ScrollTrigger.update)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      window.removeEventListener("load", refresh)
      gsap.ticker.remove(tick)
      lenis.destroy()
      root.classList.remove("has-motion")
    }
  }, [])

  return null
}
