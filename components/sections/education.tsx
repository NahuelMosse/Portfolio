"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { education } from "@/lib/content"

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
        className="max-w-4xl mx-auto space-y-14"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        }}
      >
        <div className="space-y-6">
          <h2 
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            {education.title}
          </h2>
          <div className="w-24 h-1 bg-primary/40 rounded-full" />
        </div>

        <div className="space-y-10">
          <div className="space-y-8 text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/80">
            {education.intro.map((paragraph, index) => (
              <p key={index} className="text-pretty">{paragraph}</p>
            ))}
          </div>

          <Card className="bg-card/50 backdrop-blur border-border/50 p-8 md:p-10 space-y-6 transition-all duration-500 hover:bg-card/60 hover:border-border/70 hover:shadow-lg hover:shadow-primary/5 group">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="space-y-3">
                <h3 className="text-2xl md:text-3xl font-semibold text-foreground group-hover:text-foreground transition-colors duration-300">
                  {education.degree.title}
                </h3>
                <p className="text-lg md:text-xl text-muted-foreground">{education.degree.institution}</p>
              </div>
              <div className="text-right">
                <p className="text-lg text-muted-foreground">{education.degree.period}</p>
              </div>
            </div>
            <p className="text-foreground/70 leading-relaxed text-base md:text-lg">
              {education.degree.description}
            </p>
          </Card>

          <div className="space-y-8 text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/80 pt-4">
            {education.conclusion.map((paragraph, index) => (
              <p key={index} className="text-pretty">{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
