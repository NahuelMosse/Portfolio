"use client"

import { useEffect, useRef } from "react"

// The phone's call to action: a fixed bar under the thumb. It exists in the page at every width and shows on phones.
// At the end of the page it slides away while the footer is on screen, so it never covers the footer text.
export function HireBar({ label, href }: { label: string; href: string }) {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const footer = document.querySelector(".end-of-file")
    const node = bar.current
    if (!footer || !node) return
    const watch = new IntersectionObserver(([entry]) => {
      node.dataset.yield = String(entry.isIntersecting)
    })
    watch.observe(footer)
    return () => watch.disconnect()
  }, [])

  return (
    <div ref={bar} data-hire-bar="" className="hire-bar">
      <a href={href}>{label}</a>
    </div>
  )
}
