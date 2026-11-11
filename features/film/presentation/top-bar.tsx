"use client"

import { useCallback, useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { BrandMark } from "./brand-mark"
import { ChapterIndex, useLandingLinks, type ChapterLink } from "./chapter-index"
import { SoundCue } from "./sound-cue"
import { SoundToggle } from "./sound-toggle"

type TopBarProps = {
  chapters: readonly ChapterLink[]
  soundSrc?: string
}

// The page's one bar: the NAWI mark, the chapter index in typed caps and the sound toggle.
// On a phone the index opens from a menu button. The cue that invites the first click sits beside the bar,
// not in it, so it stacks below it.
export function TopBar({ chapters, soundSrc }: TopBarProps) {
  const [open, setOpen] = useState(false)
  const menu = useId()
  useLandingLinks(chapters, useCallback(() => setOpen(false), []))

  return (
    <>
      <header data-top-bar="" data-menu-open={open} className="top-bar">
        <a data-wordmark="" className="wordmark" href="#main-content"><BrandMark /></a>
        <div id={menu} className="top-nav">
          <ChapterIndex chapters={chapters} />
        </div>
        <SoundToggle src={soundSrc} />
        <Button
          type="button"
          variant="ghost"
          data-menu-button=""
          aria-expanded={open}
          aria-controls={menu}
          aria-label="Menu"
          className="film-control menu-button"
          onClick={() => setOpen(!open)}
        >
          <span className="menu-bars" aria-hidden="true" />
        </Button>
      </header>
      <SoundCue />
    </>
  )
}
