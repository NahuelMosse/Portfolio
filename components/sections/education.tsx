"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"

export function Education() {
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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Education & Foundations
          </h2>
          <div className="w-24 h-1 bg-primary/40 rounded-full" />
        </div>

        <div className="space-y-8">
          <div className="space-y-6 text-lg md:text-xl leading-relaxed text-foreground/80">
            <p className="text-pretty">
              My formal education provided the theoretical foundation—data structures, algorithms, software
              architecture, and systems thinking. But more importantly, it taught me how to learn, how to approach
              problems methodically, and how to think like an engineer.
            </p>
          </div>

          <Card className="bg-card/50 backdrop-blur border-border/50 p-8 space-y-4">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-foreground">Bachelor of Science in Computer Science</h3>
                <p className="text-lg text-muted-foreground">University Name</p>
              </div>
              <div className="text-right">
                <p className="text-lg text-muted-foreground">20XX - 20XX</p>
              </div>
            </div>
            <p className="text-foreground/70 leading-relaxed">
              Completed comprehensive coursework in software engineering, systems design, database management, and
              computational theory. Graduated with honors, focusing on building scalable and maintainable software
              solutions.
            </p>
          </Card>

          <div className="space-y-6 text-lg md:text-xl leading-relaxed text-foreground/80 pt-4">
            <p className="text-pretty">
              Now, I'm deliberately building a professional career in software engineering—not as a side pursuit, but as
              a focused, long-term commitment. I'm investing in expertise, craftsmanship, and the continuous refinement
              of my technical skills.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
