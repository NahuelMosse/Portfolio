"use client"

import { useEffect, type ReactNode } from "react"
import type { Palette } from "@/lib/content/types"

/**
 * Palette zones.
 *
 * The accent — and, for Grit, the entire surface — is a CSS custom property
 * registered with @property, so handing it a new value interpolates rather than
 * snapping. The page changes temperature as you scroll instead of blinking
 * between themes.
 *
 * There is exactly ONE writer of `data-palette`: the controller below. Earlier
 * versions let the pinned Work rail set it imperatively as well, and the two
 * raced — the rail would overwrite the controller a frame later and leave Grit
 * stuck on the previous accent. Anything that wants to influence the palette
 * publishes a zone; the controller decides.
 */

export function PaletteZone({
  palette,
  children,
  className,
}: {
  palette: Palette
  children: ReactNode
  className?: string
}) {
  return (
    <div data-palette-zone={palette} className={className}>
      {children}
    </div>
  )
}

export function PaletteController() {
  useEffect(() => {
    const root = document.documentElement
    let frame = 0

    const resolve = (): string | null => {
      const centre = window.innerHeight / 2
      const zones = document.querySelectorAll<HTMLElement>("[data-palette-zone]")

      // Later in document order wins, which makes a nested zone override the
      // section that contains it. Walking backwards reaches that winner first,
      // so most passes stop after a couple of rect reads instead of measuring
      // every zone on the page.
      for (let i = zones.length - 1; i >= 0; i -= 1) {
        const zone = zones[i]
        const value = zone.dataset.paletteZone
        if (!value) continue
        const rect = zone.getBoundingClientRect()
        if (rect.top <= centre && rect.bottom >= centre) return value
      }
      return null
    }

    const update = () => {
      frame = 0
      const next = resolve()
      // Compare against the DOM rather than a cached local, so an external
      // write can never desynchronise the controller.
      if (next && next !== root.dataset.palette) {
        root.dataset.palette = next
      }
    }

    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule, { passive: true })

    // Layout can change without a scroll event — pinned sections resizing,
    // fonts landing, images loading. Observing the document box catches those
    // in the frame they happen instead of up to 250ms later.
    const resize = new ResizeObserver(schedule)
    resize.observe(document.documentElement)

    // The poll stays as the backstop for layout shifts the observer cannot
    // see: zones displaced by a sibling without the document box changing.
    // Skipped while the tab is hidden, where it would only queue callbacks
    // against a frame loop that is not running.
    const poll = window.setInterval(() => {
      if (document.hidden) return
      schedule()
    }, 250)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.clearInterval(poll)
      resize.disconnect()
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [])

  return null
}
