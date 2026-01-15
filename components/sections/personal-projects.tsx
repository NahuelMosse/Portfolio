"use client"

import { Card } from "@/components/ui/card"
import { projects as projectsContent } from "@/lib/content"
import { ScrollIndicator } from "@/components/ui/scroll-indicator"
import { TechDecorator } from "@/components/ui/tech-decorators"
import { useSectionVisibility } from "@/hooks/use-section-visibility"
import { INTERSECTION_CONFIG } from "@/lib/constants"

export function PersonalProjects() {
  const { isVisible, sectionRef } = useSectionVisibility(INTERSECTION_CONFIG.PROJECTS_THRESHOLD)

  return (
    <section
      id="personal-projects"
      ref={sectionRef}
      className="snap-section min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 py-24 relative overflow-hidden"
    >
      {/* Subtle tech elements in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[18%] left-[14%] text-primary/[0.28] text-6xl font-mono" style={{ animation: "float 40s ease-in-out infinite", textShadow: '0 0 28px oklch(0.42 0.08 165 / 0.35)' }}>
          {'<>'}
        </div>
        <div className="absolute top-[38%] right-[12%] text-accent/[0.26] text-5xl" style={{ animation: "float 36s ease-in-out infinite 8s", textShadow: '0 0 26px oklch(0.72 0.06 75 / 0.32)' }}>
          ∞
        </div>
        <div className="absolute top-[58%] left-[16%] text-secondary/[0.27] text-5xl font-mono" style={{ animation: "float 42s ease-in-out infinite 16s" }}>
          {'{}'}
        </div>
        <div className="absolute bottom-[30%] right-[14%] text-primary/[0.30] text-6xl" style={{ animation: "float 38s ease-in-out infinite 24s", textShadow: '0 0 30px oklch(0.42 0.08 165 / 0.38)' }}>
          λ
        </div>
        <div className="absolute bottom-[12%] left-[18%] text-accent/[0.25] text-4xl font-mono" style={{ animation: "float 44s ease-in-out infinite 32s" }}>
          ƒ
        </div>
      </div>

      <div
        className="max-w-5xl mx-auto space-y-14 relative z-10"
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
            {projectsContent.personal.title}
          </h2>
          <div className="w-20 h-0.5 bg-accent/60 rounded-full" />
        </div>

        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/80 max-w-3xl text-pretty">
          {projectsContent.personal.intro}
        </p>

        <div className="grid gap-6 md:gap-8">
          {projectsContent.personal.items.map((project, index) => (
            <Card
              key={project.id}
              className="bg-card/60 backdrop-blur-sm border border-border/60 p-6 md:p-8 space-y-5 group transition-all duration-500 hover:border-border hover:bg-card/70 relative"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.1}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.1}s`,
              }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
              
              <div className="absolute top-6 right-6 opacity-40 group-hover:opacity-70 transition-opacity duration-500">
                <TechDecorator variant="lambda" size="lg" />
              </div>
              
              <div className="flex items-start justify-between flex-wrap gap-4 relative z-10">
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-sm text-secondary font-medium">{project.period}</p>
                </div>
              </div>

              <p className="text-foreground/70 leading-relaxed text-base md:text-lg relative z-10">{project.description}</p>

              <div className="flex flex-wrap gap-2 pt-2 relative z-10">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-sm bg-muted/40 text-foreground/80 rounded-full border border-border/50 transition-all duration-300 hover:bg-muted/60 hover:border-border"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-border/40 relative z-10">
                <p className="text-sm md:text-base text-accent/90 italic leading-relaxed">{project.impact}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-8 text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/80 pt-4">
          {projectsContent.personal.conclusion.map((paragraph) => (
            <p key={paragraph.slice(0, 50)} className="text-pretty">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="pt-36 pb-12 flex justify-center">
          <ScrollIndicator />
        </div>
      </div>
    </section>
  )
}
