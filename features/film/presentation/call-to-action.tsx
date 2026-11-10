"use client"

import { useEffect, useState } from "react"

const APPEARS_AFTER_MS = 3000

// Where the page already holds the way to talk to him: the two doors and the contact scene. The corner button gives way there.
const YIELDS_TO = "[data-doors], .contact-scene"

// The corner call to action: it shows from second 3 of the cold open, or when the cold open ends, whichever comes first,
// and gives way while the doors or the contact are on screen.
export function CallToAction({ label, href }: { label: string; href: string }) {
  const [arrived, setArrived] = useState(false)
  const [yielding, setYielding] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setArrived(true), APPEARS_AFTER_MS)
    const coldOpen = document.querySelector('[data-chapter="cold-open"]')
    const inView = new Set<Element>()
    const leaving = new IntersectionObserver(([entry]) => entry.isIntersecting || setArrived(true))
    const meeting = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) inView.add(entry.target)
        else inView.delete(entry.target)
      }
      setYielding(inView.size > 0)
    })
    if (coldOpen) leaving.observe(coldOpen)
    document.querySelectorAll(YIELDS_TO).forEach((target) => meeting.observe(target))
    return () => {
      window.clearTimeout(timer)
      leaving.disconnect()
      meeting.disconnect()
    }
  }, [])

  const visible = arrived && !yielding
  return (
    <a data-cta="" data-visible={String(visible)} className="corner-cta" href={href} tabIndex={visible ? 0 : -1}>
      {label}
    </a>
  )
}
