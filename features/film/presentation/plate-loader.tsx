"use client"

import { useEffect } from "react"
import { DEFERRED_SELECTOR } from "./deferred"

// Two at a time: on a slow line every extra image in flight only delays the one on screen.
const IN_FLIGHT = 2
// what lies within two screens of the view is fetched first, so it is there when the visitor arrives
const AHEAD = "200% 0px 200% 0px"
// an element still hidden (a later beat of a showcase) waits behind everything shown at the same distance
const HIDDEN_PENALTY = 1.5
const VIDEO_TURN_MS = 15000
// On a slow line a plate is fetched no wider than its cap, in device pixels, whatever the layout asked for: a sharper copy that
// arrives after the visitor has gone by is worse than a softer one that is there. Rates in bytes per ms; Slow 3G is about 50.
const LINE_CAPS = [
  { below: 100, cap: 640 },
  { below: 250, cap: 960 },
]

type Deferred = HTMLImageElement | HTMLVideoElement
type Connection = { saveData?: boolean; effectiveType?: string }

// what the layout does not draw at this size (the phone copy on a desktop) is not fetched until it is drawn
function distance(node: Element) {
  if (!node.getClientRects().length) return Infinity
  const box = node.getBoundingClientRect()
  const away = box.top > innerHeight ? box.top - innerHeight : box.bottom < 0 ? -box.bottom : 0
  const shown = node.checkVisibility?.({ opacityProperty: true, visibilityProperty: true }) ?? true
  return away + (shown ? 0 : innerHeight * HIDDEN_PENALTY)
}

// The cap for this line, measured on the largest image fetched so far (the cover), or as the browser reports it; none on a fast one.
function lineCap(connection?: Connection) {
  if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? "")) return LINE_CAPS[0].cap
  const timed = (performance.getEntriesByType("resource") as PerformanceResourceTiming[])
    .filter((entry) => entry.encodedBodySize > 20000 && entry.responseEnd > entry.responseStart)
    .filter((entry) => entry.initiatorType === "img" || entry.initiatorType === "link")
    .sort((x, y) => y.encodedBodySize - x.encodedBodySize)[0]
  if (!timed) return connection?.effectiveType === "3g" ? LINE_CAPS[1].cap : null
  const rate = timed.encodedBodySize / (timed.responseEnd - timed.responseStart)
  return LINE_CAPS.find((line) => rate < line.below)?.cap ?? null
}

function capWidth(node: HTMLImageElement, sources: HTMLSourceElement[], cap: number) {
  const drawn = Math.round(node.getBoundingClientRect().width) || cap
  const sizes = `${Math.min(drawn, Math.round(cap / devicePixelRatio))}px`
  node.sizes = sizes
  sources.forEach((source) => (source.sizes = sizes))
}

function settle(node: Deferred, cap: number | null): Promise<void> {
  return new Promise((resolve) => {
    const done = () => {
      if (node.hasAttribute("data-loaded")) return
      node.setAttribute("data-loaded", "")
      resolve()
    }
    if (node instanceof HTMLVideoElement) {
      // a capture unmounted before its first frame never reports: its turn is given back anyway
      window.setTimeout(done, VIDEO_TURN_MS)
      node.addEventListener("loadeddata", done, { once: true })
      node.addEventListener("error", done, { once: true })
      node.src = node.dataset.src!
      node.load()
      return
    }
    const ready = () => (node.decode ? node.decode().catch(() => undefined) : Promise.resolve()).then(done)
    node.addEventListener("load", ready, { once: true })
    node.addEventListener("error", done, { once: true })
    const sources = [...(node.parentElement?.querySelectorAll<HTMLSourceElement>("source[data-srcset]") ?? [])]
    if (cap && node.dataset.srcset) capWidth(node, sources, cap)
    sources.forEach((source) => (source.srcset = source.dataset.srcset!))
    if (node.dataset.srcset) node.srcset = node.dataset.srcset
    if (node.dataset.src) node.src = node.dataset.src
  })
}

// The images of the page below the cover arrive before the visitor reaches them: each shows its blurred proof (or the ink) until
// its copy is fetched. Nothing starts before the opening title gives way, so nothing competes with the cover. Then what lies
// within two screens goes first, two at a time. Once the visitor scrolls, the line is never idle: when none is left near, the
// next one down is fetched one at a time, unless the visitor asked the browser to save data. Before that first scroll nothing
// farther than two screens is fetched, so the first screens of a phone are not competing with the rest of the page.
export function PlateLoader() {
  useEffect(() => {
    const html = document.documentElement
    const connection = (navigator as Navigator & { connection?: Connection }).connection
    const waiting = new Set<Deferred>()
    const near = new Set<Deferred>()
    let flying = 0
    let cap: number | null = null
    let open = false
    let roamed = false
    const roam = () => {
      roamed = true
      pump()
    }
    addEventListener("scroll", roam, { once: true, passive: true })

    const nearest = (pool: Set<Deferred>, idle: boolean) => {
      let next: Deferred | null = null
      let best = Infinity
      for (const node of pool) {
        // a capture plays only near the visitor, and on a capped line not at all: its poster stands for it
        if (node instanceof HTMLVideoElement && (idle || cap)) continue
        const d = distance(node)
        if (d < best) [next, best] = [node, d]
      }
      return next
    }

    const pump = () => {
      if (!open) return
      for (;;) {
        const next =
          (flying < IN_FLIGHT ? nearest(near, false) : null) ??
          (roamed && flying < 1 && !connection?.saveData ? nearest(waiting, true) : null)
        if (!next) return
        near.delete(next)
        waiting.delete(next)
        watcher.unobserve(next)
        flying++
        settle(next, cap).then(() => {
          flying--
          pump()
        })
      }
    }

    const watcher = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const node = entry.target as Deferred
          if (!waiting.has(node)) continue
          if (entry.isIntersecting) near.add(node)
          else near.delete(node)
        }
        pump()
      },
      { rootMargin: AHEAD },
    )
    const join = (node: Deferred) => {
      if (node.hasAttribute("data-loaded") || waiting.has(node)) return
      waiting.add(node)
      watcher.observe(node)
    }
    const watch = (root: ParentNode) => root.querySelectorAll<Deferred>(DEFERRED_SELECTOR).forEach(join)
    watch(document)

    // nodes React mounts later (a showcase's next beat, a live capture) join the queue
    const added = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return
          if (node.matches(DEFERRED_SELECTOR)) join(node as Deferred)
          watch(node)
        })
      }
    })
    added.observe(document.body, { childList: true, subtree: true })

    // the queue opens when the title gives way, once the cover has told how fast the line is
    const start = () => {
      open = true
      cap = lineCap(connection)
      pump()
    }
    const title = new MutationObserver(() => {
      if (html.classList.contains("is-preloading")) return
      title.disconnect()
      start()
    })
    if (html.classList.contains("is-preloading")) title.observe(html, { attributes: true, attributeFilter: ["class"] })
    else start()

    return () => {
      removeEventListener("scroll", roam)
      watcher.disconnect()
      added.disconnect()
      title.disconnect()
    }
  }, [])

  return null
}
