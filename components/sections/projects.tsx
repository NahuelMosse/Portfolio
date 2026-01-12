"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { projects as projectsContent } from "@/lib/content"
import { ScrollIndicator } from "@/components/ui/scroll-indicator"

export function Projects() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
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
        className="max-w-5xl mx-auto space-y-14"
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
            {projectsContent.title}
          </h2>
          <div className="w-24 h-1 bg-primary/40 rounded-full" />
        </div>

        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/80 max-w-3xl text-pretty">
          {projectsContent.intro}
        </p>

        <div className="grid gap-6 md:gap-8">
          {projectsContent.items.map((project, index) => (
            <Card
              key={index}
              className="bg-card/50 backdrop-blur border-border/50 p-6 md:p-8 space-y-5 group transition-all duration-500 hover:bg-card/60 hover:border-border/70 hover:shadow-lg hover:shadow-primary/5"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.1}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.1}s`,
              }}
            >
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-semibold text-foreground group-hover:text-foreground transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{project.period}</p>
                </div>
              </div>

              <p className="text-foreground/70 leading-relaxed text-base md:text-lg">{project.description}</p>

              <div className="flex flex-wrap gap-2 pt-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-sm bg-primary/10 text-primary-foreground/80 rounded-full border border-primary/20 transition-all duration-300 hover:bg-primary/20 hover:border-primary/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-border/50">
                <p className="text-sm md:text-base text-accent-foreground/90 italic leading-relaxed">{project.impact}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="pt-48 flex justify-center">
          <ScrollIndicator />
        </div>
      </div>
    </section>
  )
}
