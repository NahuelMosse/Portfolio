"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import "lenis/dist/lenis.css"
import { gsap, ScrollTrigger, motionAllowed } from "./motion-kit"

// anchor links are not Lenis's: every same-page link lands through landOn, which knows the pins and the top bar
const SMOOTH = { lerp: 0.08, wheelMultiplier: 0.9 } as const

let engine: Lenis | null = null

// The running smooth-scroll engine, or null where the page scrolls natively (touch, reduced motion).
export function smoothScroll() {
  return engine
}

const PHONE_MAX_WIDTH = 700

// --screen-h is the screen height measured at load; it follows only a width or orientation change, so the browser bar showing or
// hiding never resizes the scenes. Above the phone width it is unset and the scenes keep their svh.
function pinScreenHeight() {
  const root = document.documentElement
  let width = 0
  const measure = () => {
    if (window.innerWidth === width) return
    width = window.innerWidth
    if (width > PHONE_MAX_WIDTH) root.style.removeProperty("--screen-h")
    else root.style.setProperty("--screen-h", `${window.innerHeight}px`)
  }
  measure()
  window.addEventListener("resize", measure)
  return () => window.removeEventListener("resize", measure)
}

// The scroll engine: Lenis smooths the wheel on desktop and is driven by the GSAP ticker; the position stays the native one, so
// every scroll reader keeps working. Reduced motion has no engine at all, and touch keeps its native scroll.
export function MotionEngine() {
  useEffect(pinScreenHeight, [])

  useEffect(() => {
    if (!motionAllowed()) return
    const root = document.documentElement
    root.classList.add("has-motion")

    // kit-overdesign: the load listener would pass its Event as ScrollTrigger.refresh(safe); the arrow calls it with no argument
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
    engine = lenis
    const tick = (time: number) => lenis.raf(time * 1000)
    lenis.on("scroll", ScrollTrigger.update)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      window.removeEventListener("load", refresh)
      gsap.ticker.remove(tick)
      lenis.destroy()
      engine = null
      root.classList.remove("has-motion")
    }
  }, [])

  return null
}
