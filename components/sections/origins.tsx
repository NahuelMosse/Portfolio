"use client"

import { useEffect, useRef, useState } from "react"

export function Origins() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="snap-section min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 py-24"
    >
      <div
        className={`max-w-4xl mx-auto space-y-12 transition-all duration-1000 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">How It Started</h2>
          <div className="w-24 h-1 bg-primary/40 rounded-full" />
        </div>

        <div className="space-y-6 text-lg md:text-xl leading-relaxed text-foreground/80">
          <p className="text-pretty">
            My journey into software began with curiosity—a question about how things work beneath the surface. What
            started as tinkering with code snippets quickly evolved into a deeper exploration of logic, problem-solving,
            and the art of building systems that matter.
          </p>

          <p className="text-pretty">
            I was drawn to the elegance of well-structured code and the satisfaction of solving complex problems. Each
            project taught me something new, and each challenge reinforced my commitment to this craft.
          </p>

          <p className="text-pretty">
            Software development wasn't just something I could do—it was something I needed to pursue. It combined
            creativity with technical rigor, abstract thinking with tangible results.
          </p>
        </div>
      </div>
    </section>
  )
}
