"use client"

import { useEffect, useRef, useState } from "react"
import { present } from "@/lib/content"
import { ScrollIndicator } from "../ui/scroll-indicator"

export function Present() {
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
      className="snap-section min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 py-24 relative overflow-hidden"
    >
      {/* Floating tech symbols in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[18%] right-[16%] text-accent/[0.30] text-6xl font-mono" style={{ animation: "float 42s ease-in-out infinite", textShadow: '0 0 30px oklch(0.72 0.06 75 / 0.4)' }}>
          {'{ }'}
        </div>
        <div className="absolute top-[32%] left-[14%] text-secondary/[0.28] text-5xl" style={{ animation: "float 38s ease-in-out infinite 8s", textShadow: '0 0 25px oklch(0.45 0.08 55 / 0.3)' }}>
          →
        </div>
        <div className="absolute top-[50%] right-[22%] text-primary/[0.25] text-5xl font-mono" style={{ animation: "float 44s ease-in-out infinite 16s" }}>
          {'[]'}
        </div>
        <div className="absolute top-[66%] left-[10%] text-accent/[0.30] text-6xl" style={{ animation: "float 40s ease-in-out infinite 24s", textShadow: '0 0 30px oklch(0.72 0.06 75 / 0.4)' }}>
          ∞
        </div>
        <div className="absolute top-[80%] right-[16%] text-secondary/[0.25] text-4xl font-mono" style={{ animation: "float 46s ease-in-out infinite 32s" }}>
          λ
        </div>
        <div className="absolute bottom-[24%] left-[24%] text-accent/[0.28] text-5xl font-mono" style={{ animation: "float 48s ease-in-out infinite 40s", textShadow: '0 0 28px oklch(0.72 0.06 75 / 0.35)' }}>
          {'</>'}
        </div>
        <div className="absolute bottom-[10%] right-[12%] text-primary/[0.26] text-4xl" style={{ animation: "float 50s ease-in-out infinite 48s" }}>
          ƒ
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
            {present.title}
          </h2>
          <div className="w-20 h-0.5 bg-accent/60 rounded-full" />
        </div>

        <div className="space-y-10 text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/80">
          {present.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-pretty">{paragraph}</p>
          ))}

          <div className="pt-2">
            <p className="text-pretty font-medium text-foreground/90">{present.interests.title}</p>
          </div>

          <ul className="space-y-6 pl-6 border-l border-border/60 relative">
            {present.interests.items.map((interest, index) => (
              <li 
                key={index} 
                className="text-pretty group relative"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateX(0)" : "translateX(-16px)",
                  transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + index * 0.1}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + index * 0.1}s`,
                }}
              >
                <span className="absolute -left-[1.68rem] top-2 w-1.5 h-1.5 bg-accent rounded-full transition-all duration-300 group-hover:bg-secondary group-hover:scale-125" />
                <strong className="text-foreground transition-colors duration-300 group-hover:text-accent">
                  {interest.title}
                </strong>{" "}
                {interest.description}
              </li>
            ))}
          </ul>

          {present.conclusion.map((paragraph, index) => (
            <p key={index} className="text-pretty pt-4">{paragraph}</p>
          ))}
        </div>

        <div className="pt-48 flex justify-center">
          <ScrollIndicator />
        </div>
      </div>
    </section>
  )
}
