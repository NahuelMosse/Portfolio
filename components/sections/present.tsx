"use client"

import { useEffect, useRef, useState } from "react"
import { present } from "@/lib/content"

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
            {present.title}
          </h2>
          <div className="w-24 h-1 bg-primary/40 rounded-full" />
        </div>

        <div className="space-y-10 text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/80">
          {present.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-pretty">{paragraph}</p>
          ))}

          <div className="pt-2">
            <p className="text-pretty font-medium text-foreground/90">{present.interests.title}</p>
          </div>

          <ul className="space-y-6 pl-6 border-l-2 border-primary/30">
            {present.interests.items.map((interest, index) => (
              <li 
                key={index} 
                className="text-pretty group"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateX(0)" : "translateX(-16px)",
                  transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + index * 0.1}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + index * 0.1}s`,
                }}
              >
                <strong className="text-foreground transition-colors duration-300 group-hover:text-primary">
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
      </div>
    </section>
  )
}
