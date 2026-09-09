"use client"

import { useEffect, useRef, useState } from "react"
import { useMediaQuery, useReducedMotion } from "@/hooks/use-runtime"

/**
 * A trailing ring that reacts to what's under it.
 *
 * The native cursor is never hidden — replacing it outright breaks text
 * selection affordances and anyone relying on the system pointer. This ring
 * rides alongside it and lags slightly, which is what makes the page feel
 * physical rather than decorated.
 *
 * Only mounts for real mouse users: no touch, no reduced motion.
 */
export function Cursor() {
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)")
  const reducedMotion = useReducedMotion()
  const [enabled, setEnabled] = useState(false)

  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setEnabled(finePointer && !reducedMotion)
  }, [finePointer, reducedMotion])

  useEffect(() => {
    if (!enabled) return

    const ring = ringRef.current
    const dot = dotRef.current
    if (!ring || !dot) return

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const current = { ...target }
    let frame = 0
    let visible = false

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX
      target.y = event.clientY
      start()

      if (!visible) {
        visible = true
        ring.style.opacity = "1"
        dot.style.opacity = "1"
      }

      const el = event.target as HTMLElement | null
      const interactive = el?.closest(
        'a, button, [role="button"], input, summary, [data-cursor]',
      )
      ring.dataset.state = interactive ? "active" : "idle"
    }

    const onLeave = () => {
      visible = false
      ring.style.opacity = "0"
      dot.style.opacity = "0"
    }

    const tick = () => {
      frame = 0
      // Ring lags; dot tracks exactly. The gap between them is the effect.
      current.x += (target.x - current.x) * 0.16
      current.y += (target.y - current.y) * 0.16
      ring.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`
      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`

      // Once the ring has caught up, every further frame would write the same
      // two transforms. Stop, and let the next pointer event restart the loop:
      // a still pointer costs nothing instead of a rAF callback per frame.
      const settled =
        Math.abs(target.x - current.x) < 0.05 &&
        Math.abs(target.y - current.y) < 0.05
      if (settled) {
        current.x = target.x
        current.y = target.y
        return
      }
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    document.addEventListener("pointerleave", onLeave)
    start()

    return () => {
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerleave", onLeave)
      cancelAnimationFrame(frame)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[80]">
      <div
        ref={ringRef}
        data-state="idle"
        className="absolute left-0 top-0 opacity-0 transition-opacity duration-300 [&[data-state=active]>span]:scale-[1.9] [&[data-state=active]>span]:border-accent [&[data-state=active]>span]:bg-accent/10"
      >
        <span className="block h-7 w-7 rounded-full border border-fg-faint transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" />
      </div>
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1 w-1 rounded-full bg-accent opacity-0 transition-opacity duration-300"
      />
    </div>
  )
}
