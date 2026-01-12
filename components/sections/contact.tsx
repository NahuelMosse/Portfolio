"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

export function Contact() {
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
        className={`max-w-3xl mx-auto text-center space-y-12 transition-all duration-1000 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">Let's Connect</h2>
          <div className="w-24 h-1 bg-primary/40 rounded-full mx-auto" />
        </div>

        <p className="text-lg md:text-xl leading-relaxed text-foreground/80 text-pretty">
          I'm always interested in discussing new opportunities, technical challenges, or simply connecting with fellow
          engineers. If you're building something meaningful or looking for someone who approaches software with
          intention and care, let's talk.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
            asChild
          >
            <a href="mailto:your.email@example.com">Send an Email</a>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-border/50 hover:bg-card/50 px-8 py-6 text-lg transition-all duration-300 hover:scale-105 bg-transparent"
            asChild
          >
            <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-border/50 hover:bg-card/50 px-8 py-6 text-lg transition-all duration-300 hover:scale-105 bg-transparent"
            asChild
          >
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </Button>
        </div>

        <div className="pt-16 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Your Name. Built with intention.</p>
        </div>
      </div>
    </section>
  )
}
