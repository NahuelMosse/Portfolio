"use client"

import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChapterIndex, SkipIntro, type ChapterLink } from "./chapter-index"
import { SoundToggle } from "./sound-toggle"

type TopBarProps = {
  chapters: readonly ChapterLink[]
  skipLabel: string
  hire: { label: string; href: string }
  soundSrc?: string
}

// The page's one bar: the NAWI mark, the chapter index in typed caps, Let's talk and the sound toggle.
// On a phone the index and the skip link open from a menu button.
export function TopBar({ chapters, skipLabel, hire, soundSrc }: TopBarProps) {
  const [open, setOpen] = useState(false)
  const menu = useId()

  return (
    <header data-top-bar="" data-menu-open={open} className="top-bar">
      <a data-wordmark="" className="wordmark" href="#main-content">NAWI</a>
      <div id={menu} className="top-nav">
        <SkipIntro label={skipLabel} />
        <ChapterIndex chapters={chapters} onJump={() => setOpen(false)} />
      </div>
      <a data-top-hire="" className="film-control top-hire" href={hire.href}>{hire.label}</a>
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
  )
}
