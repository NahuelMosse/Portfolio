"use client"

import { useEffect, useState } from "react"

const APPEARS_AFTER_MS = 3000

// The corner call to action: it shows from second 3 of the cold open, or when the cold open ends, whichever comes first,
// and gives way to the two doors when they are on screen.
export function CallToAction({ label, href }: { label: string; href: string }) {
  const [arrived, setArrived] = useState(false)
  const [doorsInView, setDoorsInView] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setArrived(true), APPEARS_AFTER_MS)
    const coldOpen = document.querySelector('[data-chapter="cold-open"]')
    const doors = document.querySelector("[data-doors]")
    const leaving = new IntersectionObserver(([entry]) => entry.isIntersecting || setArrived(true))
    const meeting = new IntersectionObserver(([entry]) => setDoorsInView(entry.isIntersecting))
    if (coldOpen) leaving.observe(coldOpen)
    if (doors) meeting.observe(doors)
    return () => {
      window.clearTimeout(timer)
      leaving.disconnect()
      meeting.disconnect()
    }
  }, [])

  const visible = arrived && !doorsInView
  return (
    <a data-cta="" data-visible={String(visible)} className="corner-cta" href={href} tabIndex={visible ? 0 : -1}>
      {label}
    </a>
  )
}
