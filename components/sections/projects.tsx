"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"

const projects = [
  {
    title: "Enterprise Dashboard Platform",
    period: "2024",
    description:
      "Built a comprehensive analytics dashboard serving 10,000+ users daily. Focused on performance optimization, real-time data synchronization, and intuitive user experience.",
    technologies: ["React", "Node.js", "PostgreSQL", "Redis"],
    impact: "Reduced load times by 60% and improved user engagement metrics significantly.",
  },
  {
    title: "Distributed Task Processing System",
    period: "2023",
    description:
      "Designed and implemented a scalable microservices architecture for handling asynchronous job processing across multiple services with fault tolerance.",
    technologies: ["Python", "RabbitMQ", "Docker", "Kubernetes"],
    impact: "Successfully processes over 1M tasks daily with 99.9% uptime.",
  },
  {
    title: "Mobile-First E-Commerce Platform",
    period: "2023",
    description:
      "Developed a responsive e-commerce solution with emphasis on mobile performance, seamless checkout experience, and inventory management integration.",
    technologies: ["Next.js", "TypeScript", "Stripe", "Supabase"],
    impact: "Achieved 40% increase in mobile conversion rates and improved user satisfaction scores.",
  },
  {
    title: "Real-Time Collaboration Tool",
    period: "2022",
    description:
      "Created a collaborative workspace with real-time synchronization, conflict resolution, and offline support for distributed teams.",
    technologies: ["WebSockets", "CRDTs", "MongoDB", "Express"],
    impact: "Enabled seamless collaboration for teams across different time zones with sub-100ms latency.",
  },
]

export function Projects() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
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
        className={`max-w-5xl mx-auto space-y-12 transition-all duration-1000 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Professional Projects
          </h2>
          <div className="w-24 h-1 bg-primary/40 rounded-full" />
        </div>

        <p className="text-lg md:text-xl leading-relaxed text-foreground/80 max-w-3xl text-pretty">
          Each project represents growth, responsibility, and the evolution of my technical expertise. These are not
          just features—they're solutions to real problems, built with intention and care.
        </p>

        <div className="grid gap-6 md:gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="bg-card/50 backdrop-blur border-border/50 p-6 md:p-8 space-y-4 transition-all duration-300 hover:bg-card/70 hover:border-primary/30"
            >
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-semibold text-foreground">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.period}</p>
                </div>
              </div>

              <p className="text-foreground/70 leading-relaxed">{project.description}</p>

              <div className="flex flex-wrap gap-2 pt-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-sm bg-primary/10 text-primary-foreground/80 rounded-full border border-primary/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-border/50">
                <p className="text-sm text-accent-foreground italic">{project.impact}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
