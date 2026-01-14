"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { education } from "@/lib/content"
import { ScrollIndicator } from "@/components/ui/scroll-indicator"

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
      id="education"
      ref={sectionRef}
      className="snap-section min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 py-24 relative overflow-hidden"
    >
      {/* Floating tech symbols in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[18%] right-[12%] text-accent/[0.30] text-6xl font-mono" style={{ animation: "float 40s ease-in-out infinite", textShadow: '0 0 30px oklch(0.72 0.06 75 / 0.4)' }}>
          {'()'}
        </div>
        <div className="absolute top-[32%] left-[14%] text-secondary/[0.28] text-5xl" style={{ animation: "float 36s ease-in-out infinite 8s", textShadow: '0 0 25px oklch(0.45 0.08 55 / 0.3)' }}>
          ƒ
        </div>
        <div className="absolute top-[50%] right-[16%] text-primary/[0.25] text-5xl font-mono" style={{ animation: "float 42s ease-in-out infinite 16s" }}>
          λ
        </div>
        <div className="absolute top-[66%] left-[22%] text-accent/[0.30] text-6xl font-mono" style={{ animation: "float 38s ease-in-out infinite 24s", textShadow: '0 0 30px oklch(0.72 0.06 75 / 0.4)' }}>
          {'<>'}
        </div>
        <div className="absolute top-[80%] right-[12%] text-secondary/[0.25] text-4xl" style={{ animation: "float 44s ease-in-out infinite 32s" }}>
          ≈
        </div>
        <div className="absolute bottom-[26%] left-[12%] text-accent/[0.28] text-5xl font-mono" style={{ animation: "float 46s ease-in-out infinite 40s", textShadow: '0 0 28px oklch(0.72 0.06 75 / 0.35)' }}>
          {'{}'}
        </div>
        <div className="absolute bottom-[10%] right-[24%] text-primary/[0.26] text-4xl" style={{ animation: "float 48s ease-in-out infinite 48s" }}>
          →
        </div>
      </div>

      <div
        className="max-w-4xl mx-auto space-y-14 relative z-10"
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
          <div className="w-20 h-0.5 bg-accent/60 rounded-full" />
        </div>

        <div className="space-y-10">
          <div className="space-y-8 text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/80">
            {education.intro.map((paragraph, index) => (
              <p key={index} className="text-pretty">{paragraph}</p>
            ))}
          </div>

          {/* Render all degrees */}
          <div className="space-y-6">
            {education.degrees.map((degree, index) => (
              <Card 
                key={index}
                className="bg-card/60 backdrop-blur-sm border border-border/60 p-8 md:p-10 space-y-6 transition-all duration-500 hover:border-border hover:bg-card/70 group relative"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + index * 0.15}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + index * 0.15}s`,
                }}
              >
                {/* Subtle ambient glow - minimal */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
                
                <div className="flex items-start justify-between flex-wrap gap-4 relative z-10">
                  <div className="space-y-3">
                    <h3 className="text-2xl md:text-3xl font-semibold text-foreground group-hover:text-accent transition-colors duration-300 flex items-center gap-2">
                      {degree.title}
                    </h3>
                    <p className="text-lg md:text-xl text-secondary font-medium">{degree.institution}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-sm text-muted-foreground px-3 py-1.5 bg-muted/30 rounded-full border border-border/40 w-fit">{degree.period}</p>
                    <p className="text-xs text-accent/90 font-medium px-3 py-1.5 bg-accent/10 rounded-full border border-accent/30 w-fit">{degree.status}</p>
                  </div>
                </div>
                <p className="text-foreground/70 leading-relaxed text-base md:text-lg relative z-10">
                  {degree.description}
                </p>
              </Card>
            ))}
          </div>

          <div className="space-y-8 text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/80 pt-4">
            {education.conclusion.map((paragraph, index) => (
              <p key={index} className="text-pretty">{paragraph}</p>
            ))}
          </div>

          <div className="pt-36 pb-12 flex justify-center">
            <ScrollIndicator />
          </div>
        </div>
      </div>
    </section>
  )
}
