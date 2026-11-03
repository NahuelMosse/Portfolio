"use client"

import type { MouseEvent } from "react"

export type ChapterLink = {
  id: string
  label: string
  // the heading that takes focus after a jump; the chapter's own title when left out
  heading?: string
  // wide screens only: put this element's top edge at the top ("top") or at the bottom ("bottom", so the screen is filled by what precedes it) of the viewport
  land?: { selector: string; edge: "top" | "bottom" }
}

const WIDE_LANDING = "(min-width: 1100px)"

// Scrolls to a heading (or, wide, to its landing edge) and leaves focus on it, never on body.
function goTo(event: MouseEvent, heading: Element | null, reduced: boolean, land?: ChapterLink["land"]) {
  if (!(heading instanceof HTMLElement)) return
  event.preventDefault()
  // the smooth-scroll engine also handles anchor clicks and would override this landing
  event.stopPropagation()
  const behavior = reduced ? "auto" : "smooth"
  const anchor = land && window.matchMedia(WIDE_LANDING).matches ? document.querySelector(land.selector) : null
  if (anchor) {
    const top = anchor.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: land!.edge === "top" ? top : top - window.innerHeight, behavior })
  } else {
    heading.scrollIntoView({ block: "start", behavior })
  }
  heading.focus({ preventScroll: true })
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

export function SkipIntro({ label }: { label: string }) {
  return (
    <a
      data-skip=""
      className="film-control skip-intro"
      href="#projects"
      onClick={(event) => goTo(event, document.querySelector("[data-project] h3"), prefersReducedMotion())}
    >
      {label}
    </a>
  )
}

export function ChapterIndex({ chapters, onJump }: { chapters: readonly ChapterLink[]; onJump: () => void }) {
  return (
    <nav data-chapter-index="" aria-label="Chapters" className="chapter-index">
      {chapters.map((chapter) => (
        <a
          key={chapter.id}
          data-index-item={chapter.id}
          className="film-control"
          href={`#${chapter.id}`}
          onClick={(event) => {
            const heading = document.querySelector(chapter.heading ?? `[data-chapter="${chapter.id}"] :is(h1, h2)`)
            goTo(event, heading, prefersReducedMotion(), chapter.land)
            onJump()
          }}
        >
          {chapter.label}
        </a>
      ))}
    </nav>
  )
}
