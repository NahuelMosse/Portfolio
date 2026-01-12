"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { certifications as certificationsContent } from "@/lib/content"
import { ScrollIndicator } from "@/components/ui/scroll-indicator"

export function Certifications() {
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
            {certificationsContent.title}
          </h2>
          <div className="w-20 h-0.5 bg-accent/60 rounded-full" />
        </div>

        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/80 text-pretty">
          {certificationsContent.intro}
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {certificationsContent.items.map((cert, index) => (
            <Card
              key={index}
              className="bg-card/60 backdrop-blur-sm border border-border/60 p-6 md:p-7 space-y-4 group transition-all duration-500 hover:border-border hover:bg-card/70 relative"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.1}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.1}s`,
              }}
            >
              {/* Subtle glow on hover */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/5 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
              
              <div className="space-y-3 relative z-10">
                <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
                  {cert.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="font-medium text-secondary">{cert.issuer}</span>
                  <span className="px-2.5 py-1 bg-muted/30 text-foreground/80 rounded-full border border-border/40 text-xs">{cert.year}</span>
                </div>
              </div>
              <p className="text-sm md:text-base text-foreground/70 leading-relaxed relative z-10">{cert.description}</p>
            </Card>
          ))}
        </div>

        <div className="pt-8 space-y-8 text-lg md:text-xl leading-relaxed text-foreground/80">
          {certificationsContent.conclusion.map((paragraph, index) => (
            <p key={index} className="text-pretty">{paragraph}</p>
          ))}
        </div>

        <div className="pt-48 flex justify-center">
          <ScrollIndicator />
        </div>
      </div>
    </section>
  )
}
