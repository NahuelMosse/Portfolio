"use client"

import { useEffect, useRef, useState } from "react"
import { origins } from "@/lib/content"

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
      className="snap-section min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 py-24 relative overflow-hidden"
    >
      {/* Subtle floating tech symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[25%] right-[14%] text-accent/[0.30] text-6xl font-mono" style={{ animation: "float 46s ease-in-out infinite", textShadow: '0 0 30px oklch(0.72 0.06 75 / 0.4)' }}>
          ∞
        </div>
        <div className="absolute top-[42%] left-[16%] text-secondary/[0.28] text-5xl font-mono" style={{ animation: "float 42s ease-in-out infinite 8s", textShadow: '0 0 25px oklch(0.45 0.08 55 / 0.3)' }}>
          {'{ }'}
        </div>
        <div className="absolute top-[62%] right-[18%] text-primary/[0.25] text-5xl" style={{ animation: "float 48s ease-in-out infinite 16s" }}>
          λ
        </div>
        <div className="absolute bottom-[28%] left-[20%] text-accent/[0.30] text-6xl font-mono" style={{ animation: "float 44s ease-in-out infinite 24s", textShadow: '0 0 30px oklch(0.72 0.06 75 / 0.4)' }}>
          {'</>'}
        </div>
        <div className="absolute bottom-[45%] right-[14%] text-secondary/[0.25] text-4xl" style={{ animation: "float 50s ease-in-out infinite 32s" }}>
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
            {origins.title}
          </h2>
          <div className="w-20 h-0.5 bg-accent/60 rounded-full" />
        </div>

        <div className="space-y-8 text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/80">
          {origins.paragraphs.map((paragraph, index) => (
            <p 
              key={index} 
              className="text-pretty"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + index * 0.1}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + index * 0.1}s`,
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
