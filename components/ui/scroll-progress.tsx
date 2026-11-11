"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

// The reading progress: a hairline scaled with the page's scroll, painted at most once per frame.
export function ScrollProgress({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const paint = () => {
      frame = 0
      const root = document.documentElement
      const range = root.scrollHeight - root.clientHeight
      bar.current?.style.setProperty("transform", `scaleX(${range > 0 ? root.scrollTop / range : 0})`)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint)
    }
    schedule()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [])

  return (
    <div
      ref={bar}
      aria-hidden="true"
      className={cn("scroll-progress fixed inset-x-0 top-0 z-50 h-px origin-left bg-(--red)", className)}
      style={{ transform: "scaleX(0)" }}
      {...props}
    />
  )
}
