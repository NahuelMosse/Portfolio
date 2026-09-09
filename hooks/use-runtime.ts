"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/* -------------------------------------------------------------------------- */
/* Environment                                                                 */
/* -------------------------------------------------------------------------- */

/** Matches a media query and keeps up with changes. SSR-safe. */
export function useMediaQuery(query: string, fallback = false): boolean {
  const [matches, setMatches] = useState(fallback)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [query])

  return matches
}

export const useReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)")

export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)")

/** True once the component has mounted — gates anything browser-only. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

/* -------------------------------------------------------------------------- */
/* Reveal                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Flips `data-shown` on every `[data-reveal]` element as it enters the
 * viewport. One observer for the whole page instead of one per component, and
 * elements stay revealed once seen — re-hiding on scroll-up reads as a bug.
 */
export function useRevealObserver(): void {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return

    const reveal = (el: Element) => el.setAttribute("data-shown", "true")

    // Reduced motion: reveal everything immediately, and keep doing so as
    // components mount. A one-shot pass would leave anything rendered later
    // (a layout that switches after a media query resolves) permanently
    // invisible — the exact failure this whole system exists to avoid.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const revealAll = () =>
        document.querySelectorAll("[data-reveal]:not([data-shown])").forEach(reveal)
      revealAll()
      const mutation = new MutationObserver(revealAll)
      mutation.observe(document.body, { childList: true, subtree: true })
      return () => mutation.disconnect()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          reveal(entry.target)
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    )

    /**
     * Geometry pass. IntersectionObserver is the primary mechanism, but a
     * reveal that never fires leaves content permanently invisible — a far
     * worse failure than a missed animation. This sweeps anything already
     * inside the viewport using plain rects, which nothing can suppress.
     *
     * The horizontal check matters: the pinned Work rail moves its panels
     * sideways, and a panel parked off-screen to the right is still vertically
     * inside the viewport. Without it, those panels reveal invisibly and then
     * appear already-finished when the rail scrolls them into place.
     */
    const sweep = () => {
      const height = window.innerHeight
      const width = window.innerWidth
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown])")
        .forEach((el) => {
          const rect = el.getBoundingClientRect()
          const verticallyIn = rect.top < height * 0.94 && rect.bottom > 0
          const horizontallyIn = rect.left < width && rect.right > 0
          if (verticallyIn && horizontallyIn) {
            reveal(el)
            observer.unobserve(el)
          }
        })
    }

    /**
     * Backstop. Once the reader has been past a section, nothing there may
     * still be invisible — whatever the observers did or didn't do. This polls
     * only while something is still hidden and stops for good once the page is
     * fully revealed, so it costs nothing for the rest of the session.
     */
    let settleTimer = 0
    const settle = () => {
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(() => {
        const remaining = document.querySelectorAll(
          "[data-reveal]:not([data-shown])",
        )
        if (!remaining.length) return

        const height = window.innerHeight
        remaining.forEach((el) => {
          const rect = (el as HTMLElement).getBoundingClientRect()
          // Anything at or above the current viewport has been scrolled past.
          if (rect.top < height) {
            reveal(el)
            observer.unobserve(el)
          }
        })
        settle()
      }, 400)
    }

    const observeAll = () => {
      document
        .querySelectorAll("[data-reveal]:not([data-shown])")
        .forEach((el) => observer.observe(el))
    }

    // Both passes walk the document and read rects, so they run at most once
    // per frame: scroll fires far more often than frames are painted, and a
    // busy subtree can flush mutation records several times in one frame.
    let sweepFrame = 0
    let observeFrame = 0

    const scheduleSweep = () => {
      if (sweepFrame) return
      sweepFrame = requestAnimationFrame(() => {
        sweepFrame = 0
        sweep()
      })
    }

    const scheduleObserve = () => {
      if (observeFrame) return
      observeFrame = requestAnimationFrame(() => {
        observeFrame = 0
        observeAll()
      })
    }

    const onScroll = () => {
      scheduleSweep()
      settle()
    }

    observeAll()
    // After first paint, so rects are real.
    scheduleSweep()
    settle()

    // Sections mount lazily; pick up anything added later.
    const mutation = new MutationObserver(scheduleObserve)
    mutation.observe(document.body, { childList: true, subtree: true })

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })

    return () => {
      if (sweepFrame) cancelAnimationFrame(sweepFrame)
      if (observeFrame) cancelAnimationFrame(observeFrame)
      window.clearTimeout(settleTimer)
      observer.disconnect()
      mutation.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])
}

/* -------------------------------------------------------------------------- */
/* Section tracking                                                            */
/* -------------------------------------------------------------------------- */

/** Id of the section currently closest to the middle of the viewport. */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? "")

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 1] },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [ids])

  return active
}

/* -------------------------------------------------------------------------- */
/* Small utilities                                                             */
/* -------------------------------------------------------------------------- */

/** Live clock in a fixed IANA zone. Ticks on the minute, not every second. */
export function useZonedTime(timeZone: string): string {
  const [time, setTime] = useState("")

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date())

    setTime(format())
    const id = window.setInterval(() => setTime(format()), 15_000)
    return () => window.clearInterval(id)
  }, [timeZone])

  return time
}

/** Copy to clipboard with a self-resetting "copied" flag. */
export function useCopy(resetAfter = 2000) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setCopied(false), resetAfter)
      } catch {
        // Clipboard can be blocked by permissions; the mailto link still works.
      }
    },
    [resetAfter],
  )

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return { copied, copy }
}

/**
 * Counts to a target when `active` flips true. Eased, frame-based, and it
 * lands exactly on the target rather than near it.
 */
export function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!active) return
    if (reduced || duration <= 0) {
      setValue(target)
      return
    }

    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(target * eased)
      if (t < 1) frame = requestAnimationFrame(tick)
      else setValue(target)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, active, duration, reduced])

  return value
}

/** Fires once when the element first enters the viewport. */
export function useInView<T extends HTMLElement>(rootMargin = "-15% 0px") {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return { ref, inView }
}
