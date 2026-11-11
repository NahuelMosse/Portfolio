"use client"

import { useEffect } from "react"
import { landOn, landingFor, type Landing } from "./landing"

export type ChapterLink = {
  id: string
  label: string
  // the heading that takes focus after a jump; the chapter's own title when left out
  heading?: string
  // where the jump lands instead of the chapter's top under the bar; `wide` keeps it to wide screens
  land?: Landing
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

// The heading that takes focus once the page lands, never body: a chapter's title, a group's word, or the target itself.
function headingOf(target: HTMLElement, chapter?: ChapterLink): HTMLElement {
  const named = chapter?.heading ? document.querySelector<HTMLElement>(chapter.heading) : null
  const heading = named ?? target.querySelector<HTMLElement>(":is(h1, h2, h3)") ?? target
  if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1")
  return heading
}

// Focuses the heading. A scene hides itself while it is off screen, so a heading that refuses focus is tried again until the
// landing shows it, for as long as focus has stayed on the link or fallen to the page.
function focusHeading(heading: HTMLElement, link: HTMLElement) {
  heading.focus({ preventScroll: true })
  if (document.activeElement === heading) return
  const until = performance.now() + 3000
  const retry = () => {
    const held = document.activeElement
    if (held !== link && held !== document.body && held !== null) return
    heading.focus({ preventScroll: true })
    if (document.activeElement !== heading && performance.now() < until) requestAnimationFrame(retry)
  }
  requestAnimationFrame(retry)
}

// Every same-page link of the page (the index, the doors, Let's talk, Back to top, the proof link) lands through one place, which
// measures where its target stands in its first beat. A link names another landing target with data-land.
export function useLandingLinks(chapters: readonly ChapterLink[], onJump: () => void) {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!link) return
      const id = decodeURIComponent(link.hash.slice(1))
      const target = link.dataset.land ? document.querySelector<HTMLElement>(link.dataset.land) : document.getElementById(id)
      if (!target) return
      event.preventDefault()
      const chapter = link.dataset.land ? undefined : chapters.find((entry) => entry.id === id)
      const { element, edge } = landingFor(target, chapter?.land)
      landOn(element, edge, reducedMotion())
      focusHeading(headingOf(target, chapter), link)
      onJump()
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [chapters, onJump])
}

export function ChapterIndex({ chapters }: { chapters: readonly ChapterLink[] }) {
  return (
    <nav data-chapter-index="" aria-label="Chapters" className="chapter-index">
      {chapters.map((chapter) => (
        <a key={chapter.id} data-index-item={chapter.id} className="film-control" href={`#${chapter.id}`}>
          {chapter.label}
        </a>
      ))}
    </nav>
  )
}
