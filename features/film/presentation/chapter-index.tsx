"use client"

import type { MouseEvent } from "react"

type ChapterLink = { id: string; label: string }

// Scrolls natively to a heading and leaves focus on it, never on body.
function goTo(event: MouseEvent, heading: Element | null, reduced: boolean) {
  if (!(heading instanceof HTMLElement)) return
  event.preventDefault()
  heading.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" })
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

export function ChapterIndex({ chapters }: { chapters: readonly ChapterLink[] }) {
  return (
    <nav data-chapter-index="" aria-label="Chapters" className="chapter-index">
      {chapters.map((chapter) => (
        <a
          key={chapter.id}
          data-index-item={chapter.id}
          className="film-control"
          href={`#${chapter.id}`}
          onClick={(event) =>
            goTo(event, document.querySelector(`[data-chapter="${chapter.id}"] :is(h1, h2)`), prefersReducedMotion())
          }
        >
          {chapter.label}
        </a>
      ))}
    </nav>
  )
}
