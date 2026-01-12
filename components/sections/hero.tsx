"use client"

import { useEffect, useState } from "react"

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="snap-section min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.15) 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div
        className={`max-w-5xl mx-auto text-center space-y-8 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance">
            <span className="text-foreground">Your Name</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light tracking-wide">
            Software Engineer
          </p>
        </div>

        <div className="max-w-2xl mx-auto pt-8">
          <p className="text-lg md:text-xl text-foreground/80 leading-relaxed text-pretty">
            Building thoughtful software solutions with intention, precision, and a commitment to continuous growth.
            This is the story of how curiosity became craft.
          </p>
        </div>

        <div className="pt-12">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span>Scroll to explore</span>
            <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
