"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"

const certifications = [
  {
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    year: "2024",
    description: "Advanced certification in cloud architecture and infrastructure design.",
  },
  {
    title: "Professional Scrum Master",
    issuer: "Scrum.org",
    year: "2023",
    description: "Certification in Agile methodologies and team leadership.",
  },
  {
    title: "Advanced React Development",
    issuer: "Meta",
    year: "2023",
    description: "Comprehensive course covering advanced React patterns and performance optimization.",
  },
]

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
        className={`max-w-4xl mx-auto space-y-12 transition-all duration-1000 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Continuous Learning
          </h2>
          <div className="w-24 h-1 bg-primary/40 rounded-full" />
        </div>

        <p className="text-lg md:text-xl leading-relaxed text-foreground/80 text-pretty">
          Learning is not a phase—it's a practice. I invest in staying current, deepening expertise, and expanding my
          understanding of both emerging technologies and fundamental principles.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {certifications.map((cert, index) => (
            <Card
              key={index}
              className="bg-card/50 backdrop-blur border-border/50 p-6 space-y-3 transition-all duration-300 hover:bg-card/70 hover:border-primary/30"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">{cert.title}</h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{cert.issuer}</span>
                  <span>{cert.year}</span>
                </div>
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed">{cert.description}</p>
            </Card>
          ))}
        </div>

        <div className="pt-8 space-y-6 text-lg leading-relaxed text-foreground/80">
          <p className="text-pretty">
            Beyond formal certifications, I maintain a commitment to continuous education—reading technical literature,
            contributing to open source, experimenting with new frameworks, and engaging with the broader engineering
            community.
          </p>
        </div>
      </div>
    </section>
  )
}
