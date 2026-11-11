"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { SoundBars } from "./sound-toggle"

// The invitation to the first tap on a touch screen: a chip that lives inside the cover and scrolls with it, resting above the
// sheet while the cover's drawing is in view. The drawing alone is watched: the chip leaves before the projects arrive.
// It leaves for good once <html data-sound> is no longer "idle". With a mouse the cover carries a typographic line instead.
// below this share of the drawing on screen the chapter word is already rising under the chip
const HELD_RATIO = 0.35

export function SoundCue() {
  const chip = useRef<HTMLDivElement>(null)
  const [cover, setCover] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setCover(document.querySelector<HTMLElement>("#cold-open .cover-scene") ?? document.querySelector<HTMLElement>("#cold-open"))
  }, [])

  useEffect(() => {
    const resting = chip.current
    if (!cover || !resting) return
    const watcher = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= HELD_RATIO) resting.dataset.visible = ""
        else delete resting.dataset.visible
      },
      { threshold: [0, HELD_RATIO, 1] },
    )
    watcher.observe(cover)
    return () => watcher.disconnect()
  }, [cover])

  if (!cover) return null
  return createPortal(
    <div ref={chip} className="sound-cue sound-cue-chip" aria-hidden="true">
      <SoundBars />
      <span>Tap anywhere — sound on</span>
    </div>,
    cover,
  )
}
