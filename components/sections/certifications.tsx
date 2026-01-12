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
          <div className="w-24 h-1 bg-primary/40 rounded-full" />
        </div>

        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/80 text-pretty">
          {certificationsContent.intro}
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {certificationsContent.items.map((cert, index) => (
            <Card
              key={index}
              className="bg-card/50 backdrop-blur border-border/50 p-6 md:p-7 space-y-4 group transition-all duration-500 hover:bg-card/60 hover:border-border/70 hover:shadow-lg hover:shadow-primary/5"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.1}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.1}s`,
              }}
            >
              <div className="space-y-3">
                <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-foreground transition-colors duration-300">
                  {cert.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{cert.issuer}</span>
                  <span className="font-medium">{cert.year}</span>
                </div>
              </div>
              <p className="text-sm md:text-base text-foreground/70 leading-relaxed">{cert.description}</p>
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
