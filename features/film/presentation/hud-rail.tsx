"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion, useScroll } from "motion/react"

const READING_LINE = 0.4

// The chapter being read is the last one whose top edge has passed the reading line.
function readingChapter(ids: readonly string[]) {
  const passed = ids.filter((id) => {
    const section = document.querySelector(`[data-chapter="${id}"]`)
    return section !== null && section.getBoundingClientRect().top <= window.innerHeight * READING_LINE
  })
  return passed.at(-1) ?? ids[0]
}

// One thin rail down the edge of the whole page, a tick per chapter, filled by scroll.
export function HudRail({ chapters }: { chapters: readonly { id: string }[] }) {
  const ids = chapters.map((chapter) => chapter.id)
  const [current, setCurrent] = useState(ids[0])
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    const update = () => setCurrent(readingChapter(ids))
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
    // ids is derived from the chapters prop, which does not change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div data-hud-rail="" className="hud-rail" aria-hidden="true">
      <motion.span className="hud-rail-fill" style={{ scaleY: reduced ? 1 : scrollYProgress }} />
      {ids.map((id, index) => (
        <span
          key={id}
          data-rail-tick={id}
          aria-current={id === current}
          className="hud-rail-tick"
          style={{ top: `${(index / Math.max(ids.length - 1, 1)) * 100}%` }}
        />
      ))}
    </div>
  )
}
