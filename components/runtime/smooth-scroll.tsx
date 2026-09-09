"use client"

import { useEffect } from "react"
import { useReducedMotion } from "@/hooks/use-runtime"
import { registerScroller, scrollToElement } from "@/lib/scroll"

/**
 * Lenis-driven scrolling, wired into GSAP's ticker.
 *
 * Lenis scrolls the real window rather than a virtual container, so
 * ScrollTrigger needs no scrollerProxy — it only needs to be told to update on
 * every Lenis tick, and to stop running its own RAF loop so the two don't
 * fight over frame ordering.
 *
 * Under `prefers-reduced-motion` this mounts nothing at all: native scrolling
 * is the correct behaviour, not a degraded one.
 */
export function SmoothScroll() {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    let dispose = () => {}
    let cancelled = false

    void (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ])
      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger)

      const lenis = new Lenis({
        duration: 1.05,
        // Slightly overshooting exponential — reads as weight, not lag.
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.6,
      })

      lenis.on("scroll", ScrollTrigger.update)

      const raf = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)

      // Publish the instance so anything else that needs to move the page
      // (the ⌘K palette, in-page anchors) goes through Lenis instead of
      // fighting it with scrollIntoView.
      registerScroller(lenis)

      const onClick = (event: MouseEvent) => {
        const anchor = (event.target as HTMLElement | null)?.closest?.(
          'a[href^="#"]',
        ) as HTMLAnchorElement | null
        if (!anchor) return
        const id = anchor.getAttribute("href")?.slice(1)
        if (!id) return
        const target = document.getElementById(id)
        if (!target) return
        event.preventDefault()
        scrollToElement(target)
      }

      document.addEventListener("click", onClick)

      dispose = () => {
        document.removeEventListener("click", onClick)
        registerScroller(null)
        gsap.ticker.remove(raf)
        lenis.destroy()
      }
    })()

    return () => {
      cancelled = true
      dispose()
    }
  }, [reducedMotion])

  return null
}
