"use client"

import { useEffect, useRef } from "react"

// Where the page already holds the way to talk to him: the two doors, the contact scene and the footer under it.
const YIELDS_TO = "[data-doors], .contact-scene, .end-of-file"

// The phone's call to action: a fixed bar under the thumb. It exists in the page at every width and shows on phones.
// It slides away while the doors, the contact or the footer are on screen, so it never covers them or repeats them.
export function HireBar({ label, href }: { label: string; href: string }) {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = bar.current
    const targets = document.querySelectorAll(YIELDS_TO)
    if (!node || targets.length === 0) return
    const inView = new Set<Element>()
    const watch = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) inView.add(entry.target)
        else inView.delete(entry.target)
      }
      node.dataset.yield = String(inView.size > 0)
    })
    targets.forEach((target) => watch.observe(target))
    return () => watch.disconnect()
  }, [])

  return (
    <div ref={bar} data-hire-bar="" className="hire-bar">
      <a href={href}>{label}</a>
    </div>
  )
}
