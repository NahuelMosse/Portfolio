"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { personalInfo, contact } from "@/lib/content"

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
        className="max-w-3xl mx-auto text-center space-y-14"
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
            {contact.title}
          </h2>
          <div className="w-24 h-1 bg-primary/40 rounded-full mx-auto" />
        </div>

        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/80 text-pretty">
          {contact.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-medium transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
            asChild
          >
            <a href={contact.cta.primary.href}>{contact.cta.primary.text}</a>
          </Button>

          {contact.cta.secondary.map((link, index) => (
            <Button
              key={index}
              size="lg"
              variant="outline"
              className="border-border/50 hover:bg-card/50 hover:border-border/70 px-8 py-6 text-lg font-medium transition-all duration-500 hover:scale-105 bg-transparent"
              asChild
            >
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.text}
              </a>
            </Button>
          ))}
        </div>

        <div className="pt-16 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {personalInfo.name}. {personalInfo.footer.tagline}</p>
        </div>
      </div>
    </section>
  )
}
