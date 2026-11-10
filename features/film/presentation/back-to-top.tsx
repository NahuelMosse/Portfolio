"use client"

import { useEffect, useRef, useState } from "react"

const LANDING_MS = 3000

// Back to the very top of the page: the same-page link of the NAWI mark, so it lands through the one landing every link uses
// and focus goes to the cover's heading. It shows once the cover is out of view, and holds still while the landing runs: a
// control that hides under the finger would stop the scroll it started.
// `corner` sits beside Let's talk on wide screens; `bar` is the square at the right end of the phone's hire bar, fixed so it stays when the bar slides away.
export function BackToTop({ variant }: { variant: "corner" | "bar" }) {
  const [away, setAway] = useState(false)
  const [landing, setLanding] = useState(false)
  const release = useRef<number>(0)

  useEffect(() => {
    const cover = document.getElementById("cold-open")
    if (!cover) return
    const watch = new IntersectionObserver(([entry]) => setAway(!entry.isIntersecting))
    watch.observe(cover)
    return () => {
      watch.disconnect()
      window.clearTimeout(release.current)
    }
  }, [])

  const hold = () => {
    setLanding(true)
    window.clearTimeout(release.current)
    release.current = window.setTimeout(() => setLanding(false), LANDING_MS)
  }

  const visible = away || landing
  return (
    <a
      data-back-to-top={variant}
      data-visible={String(visible)}
      className={variant === "corner" ? "corner-cta corner-top" : "bar-top"}
      href="#main-content"
      aria-label={variant === "bar" ? "Back to top" : undefined}
      tabIndex={visible ? 0 : -1}
      onClick={hold}
    >
      {variant === "bar" ? "↑" : "↑ Top"}
    </a>
  )
}
