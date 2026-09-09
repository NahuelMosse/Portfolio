/**
 * Shared scroll entry point.
 *
 * Lenis owns the scroll position while it is mounted. Anything that calls
 * `scrollIntoView` behind its back gets fought over for a few frames and often
 * lands somewhere else — which is what made ⌘K navigation unreliable. Whoever
 * wants to move the page goes through here.
 */

type LenisLike = {
  scrollTo: (target: HTMLElement | number, options?: { offset?: number }) => void
}

let lenis: LenisLike | null = null

export function registerScroller(instance: LenisLike | null) {
  lenis = instance
}

export function scrollToElement(target: HTMLElement | string, offset = -8) {
  const el =
    typeof target === "string" ? document.getElementById(target) : target
  if (!el) return

  if (lenis) {
    lenis.scrollTo(el, { offset })
    return
  }

  // No smooth scroller (reduced motion, or before hydration): native is right.
  el.scrollIntoView({ behavior: "auto", block: "start" })
}
