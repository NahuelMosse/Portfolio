"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

type ChapterProps = {
  id: string
  // typed over the title, e.g. "02 · PROJECTS"
  label: string
  // typed beside the title, e.g. "EVIDENCE // WHAT I BUILT"
  subtitle: string
  title: ReactNode
  className?: string
  children: ReactNode
}

const DRIFT = 16

// A chapter typed on the dark: its label, then the title at section scale with its typed subtitle, then its content.
export function Chapter({ id, label, subtitle, title, className, children }: ChapterProps) {
  const section = useRef<HTMLElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] })
  const drift = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-DRIFT, DRIFT])

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
      <div ref={card} data-title-card data-chapter-label data-entered={entered} className="title-card">
        {label}
      </div>
      <div className="chapter-head">
        <motion.h2 data-motion tabIndex={-1} className="poster-word chapter-title" style={{ x: drift }}>
          {title}
        </motion.h2>
        <p data-chapter-subtitle className="chapter-subtitle">{subtitle}</p>
      </div>
      {children}
    </section>
  )
}
