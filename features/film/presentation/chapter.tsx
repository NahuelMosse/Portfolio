"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

type ChapterProps = {
  id: string
  label: string
  // two digits, shown on the thread at the left edge on phones
  number: string
  title: ReactNode
  // the photo of him that stands on this chapter's top edge (a server-rendered SeamFigure)
  seam: ReactNode
  // side of the torn scrap on this chapter's bottom edge; none on the last chapter
  torn?: "left" | "right"
  className?: string
  children: ReactNode
}

export function Chapter({ id, label, number, title, seam, torn, className, children }: ChapterProps) {
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
      <span data-spine-number="" className="spine-number" aria-hidden="true">{number}</span>
      {seam}
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
