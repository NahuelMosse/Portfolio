"use client"

import { useEffect, useState } from "react"
import { personalInfo } from "@/lib/content"

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    
    // Subtle parallax effect
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="snap-section min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Subtle background pattern with parallax */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.15) 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div
        className="max-w-5xl mx-auto text-center space-y-10 md:space-y-12"
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
        </div>

        <div className="max-w-2xl mx-auto pt-4">
          <p className="text-lg md:text-xl lg:text-2xl text-foreground/80 leading-relaxed text-pretty">
            {personalInfo.hero.tagline}
          </p>
        </div>

        <div className="pt-8">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground group cursor-default">
            <span className="transition-colors duration-300 group-hover:text-foreground/60">Scroll to explore</span>
            <svg 
              className="w-4 h-4 transition-transform duration-700 ease-in-out" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
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
