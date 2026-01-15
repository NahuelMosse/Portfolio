"use client"

import { useEffect, useState } from "react"
import { personalInfo } from "@/lib/content"

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    // Subtle parallax effect - throttled
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section id="hero" className="snap-section min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Subtle ambient lighting - like warm interior lighting */}
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-secondary/30 rounded-full blur-[120px]"
          style={{
            animation: "float 30s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px]"
          style={{
            animation: "float 35s ease-in-out infinite reverse",
          }}
        />
      </div>

      {/* Minimal pattern with parallax */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "60px 60px",
            color: "oklch(0.72 0.06 75)",
          }}
        />
      </div>

      {/* Subtle code symbols floating - tech meets nature */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-[20%] left-[12%] text-accent/[0.30] text-6xl font-mono" style={{ animation: "code-flow 24s ease-in-out infinite", textShadow: '0 0 30px oklch(0.72 0.06 75 / 0.4)' }}>
          {'</>'}
        </div>
        <div className="absolute top-[35%] right-[15%] text-secondary/[0.28] text-5xl font-mono" style={{ animation: "float 28s ease-in-out infinite 6s", textShadow: '0 0 25px oklch(0.45 0.08 55 / 0.3)' }}>
          {'{}'}
        </div>
        <div className="absolute top-[55%] left-[18%] text-primary/[0.25] text-5xl" style={{ animation: "float 32s ease-in-out infinite 12s" }}>
          λ
        </div>
        <div className="absolute bottom-[25%] right-[20%] text-accent/[0.30] text-6xl font-mono" style={{ animation: "code-flow 30s ease-in-out infinite 18s", textShadow: '0 0 30px oklch(0.72 0.06 75 / 0.4)' }}>
          {'[]'}
        </div>
        <div className="absolute bottom-[40%] left-[10%] text-secondary/[0.25] text-4xl" style={{ animation: "float 26s ease-in-out infinite 24s" }}>
          →
        </div>
      </div>

      <div
        className="max-w-5xl mx-auto text-center space-y-10 md:space-y-12 relative z-10"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="space-y-6">
          <h1 
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-balance leading-[0.95]"
            style={{
              letterSpacing: "-0.02em",
            }}
          >
            <span className="text-foreground">{personalInfo.name}</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light tracking-wide">
            {personalInfo.role}
          </p>
          {/* Subtle accent line - like a simple design element */}
          <div className="flex justify-center pt-2">
            <div className="w-24 h-0.5 bg-accent/60 rounded-full" />
          </div>
        </div>

        <div className="max-w-2xl mx-auto pt-4">
          <p className="text-lg md:text-xl lg:text-2xl text-foreground/80 leading-relaxed text-pretty">
            {personalInfo.hero.tagline}
          </p>
        </div>

        <div className="pt-8">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground group cursor-default">
            <span className="transition-colors duration-300 group-hover:text-accent">Scroll to explore</span>
            <svg 
              className="w-4 h-4 text-accent/70 transition-transform duration-700 ease-in-out"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              aria-hidden="true"
              style={{
                animation: "bounce 2s cubic-bezier(0.16, 1, 0.3, 1) infinite",
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
