"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { SeamFigure } from "./seam-figure"

type Tone = "dark" | "paper"

type ChapterProps = {
  id: string
  label: string
  title: ReactNode
  tone: Tone
  // tone of the chapter that follows, painted by the torn edge at the bottom
  nextTone?: Tone
  // side of the seam figure that crosses this chapter's top edge into the one above
  seamSide: "left" | "right"
  className?: string
  children: ReactNode
}

const TONE_COLOR: Record<Tone, string> = { dark: "var(--ink)", paper: "var(--bone)" }

export function Chapter({ id, label, title, tone, nextTone, seamSide, className, children }: ChapterProps) {
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
    <section ref={section} data-chapter={id} data-tone={tone} className={`chapter ${className ?? ""}`}>
      <div data-media className="chapter-media" aria-hidden="true" />
      <SeamFigure side={seamSide} />
      <div ref={card} data-title-card data-entered={entered} className="title-card">
        {label}
      </div>
      <motion.h2 data-motion tabIndex={-1} className="poster-word" style={{ x: drift }}>
        {title}
      </motion.h2>
      {children}
      {nextTone && (
        <div
          data-transition
          className="chapter-transition"
          aria-hidden="true"
          style={{ ["--next-tone" as string]: TONE_COLOR[nextTone] }}
        />
      )}
    </section>
  )
}
