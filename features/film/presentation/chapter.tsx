"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { SeamFigure } from "./seam-figure"

type ChapterProps = {
  id: string
  label: string
  title: ReactNode
  // side of the seam figure that crosses this chapter's top edge into the one above
  seamSide: "left" | "right"
  // side of the torn paper scrap laid over the fresco on this chapter's bottom edge; none on the last chapter
  torn?: "left" | "right"
  className?: string
  children: ReactNode
}

export function Chapter({ id, label, title, seamSide, torn, className, children }: ChapterProps) {
  const section = useRef<HTMLElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] })
  const drift = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-80, 80])

  useEffect(() => {
    const target = card.current
    if (!target) return
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setEntered(true),
      { threshold: 0.15 },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={section} data-chapter={id} className={`chapter ${className ?? ""}`}>
      <div data-media className="chapter-media" aria-hidden="true" />
      <SeamFigure side={seamSide} toward={id} />
      <div ref={card} data-title-card data-entered={entered} className="title-card">
        {label}
      </div>
      <motion.h2 data-motion tabIndex={-1} className="poster-word chapter-title" style={{ x: drift }}>
        {title}
      </motion.h2>
      {children}
      {torn && <div data-transition data-side={torn} className="chapter-transition" aria-hidden="true" />}
    </section>
  )
}
