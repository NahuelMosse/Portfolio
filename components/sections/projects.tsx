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
          <div className="w-20 h-0.5 bg-accent/60 rounded-full" />
        </div>

        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/80 max-w-3xl text-pretty">
          {projectsContent.intro}
        </p>

        <div className="grid gap-6 md:gap-8">
          {projectsContent.items.map((project, index) => (
            <Card
              key={index}
              className="bg-card/60 backdrop-blur-sm border border-border/60 p-6 md:p-8 space-y-5 group transition-all duration-500 hover:border-border hover:bg-card/70 relative"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.1}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.1}s`,
              }}
            >
              {/* Minimal ambient glow */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
              
              <div className="flex items-start justify-between flex-wrap gap-4 relative z-10">
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-sm text-secondary font-medium">{project.period}</p>
                </div>
              </div>

              <p className="text-foreground/70 leading-relaxed text-base md:text-lg relative z-10">{project.description}</p>

              <div className="flex flex-wrap gap-2 pt-2 relative z-10">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-sm bg-muted/40 text-foreground/80 rounded-full border border-border/50 transition-all duration-300 hover:bg-muted/60 hover:border-border"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-border/40 relative z-10">
                <p className="text-sm md:text-base text-accent/90 italic leading-relaxed">{project.impact}</p>
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
