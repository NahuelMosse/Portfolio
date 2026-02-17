"use client"

import { Card } from "@/components/ui/card"
import { projects as projectsContent, type Project } from "@/lib/content"
import { ScrollIndicator } from "@/components/ui/scroll-indicator"
import { PhotoGallery } from "@/components/ui/photo-gallery"
import { useSectionVisibility } from "@/hooks/use-section-visibility"
import { INTERSECTION_CONFIG } from "@/lib/constants"
import { useState } from "react"

export function ProfessionalProjects() {
  const { isVisible, sectionRef } = useSectionVisibility(INTERSECTION_CONFIG.PROJECTS_THRESHOLD)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section
      id="professional-projects"
      ref={sectionRef}
      className="snap-section min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-24 py-24 relative overflow-hidden"
    >
      {/* Subtle tech elements in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="hidden sm:block absolute top-[15%] right-[12%] text-accent/[0.30] text-4xl sm:text-6xl font-mono" style={{ animation: "float 38s ease-in-out infinite", textShadow: '0 0 30px oklch(0.72 0.06 75 / 0.4)' }}>
          {'{ }'}
        </div>
        <div className="hidden sm:block absolute top-[35%] left-[10%] text-secondary/[0.28] text-3xl sm:text-5xl" style={{ animation: "float 34s ease-in-out infinite 8s", textShadow: '0 0 25px oklch(0.45 0.08 55 / 0.3)' }}>
          →
        </div>
        <div className="hidden sm:block absolute top-[55%] right-[16%] text-primary/[0.25] text-3xl sm:text-5xl font-mono" style={{ animation: "float 40s ease-in-out infinite 16s" }}>
          {'</>'}
        </div>
        <div className="hidden sm:block absolute bottom-[25%] left-[14%] text-accent/[0.30] text-4xl sm:text-6xl" style={{ animation: "float 36s ease-in-out infinite 24s", textShadow: '0 0 30px oklch(0.72 0.06 75 / 0.4)' }}>
          λ
        </div>
        <div className="hidden sm:block absolute bottom-[10%] right-[18%] text-secondary/[0.25] text-2xl sm:text-4xl font-mono" style={{ animation: "float 42s ease-in-out infinite 32s" }}>
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
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            {projectsContent.professional.title}
          </h2>
          <div className="w-20 h-0.5 bg-accent/60 rounded-full" />
        </div>

        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/80 max-w-3xl text-pretty">
          {projectsContent.professional.intro}
        </p>

        <div className="relative">
          {/* Vertical timeline line with animation */}
          <div
            className="absolute left-2 sm:left-3 md:left-8 w-0.5 rounded-full transition-all duration-1000 ease-out border-primary/50"
            style={{
              backgroundColor: 'hsl(var(--primary) / 0.5)',
              top: '56px',
              height: isVisible ? 'calc(100% - 400px)' : '0px',
              transitionDelay: '0.5s'
            }}
          ></div>
          
          {projectsContent.professional.items.map((project: Project, index: number) => (
            project.url ? (
              <div
                key={project.id}
                className="relative flex items-start mb-12"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.1}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.1}s`,
                }}
              >
                {/* Timeline dot with icon */}
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`absolute flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 bg-accent/10 border-2 rounded-full shadow-lg transition-all duration-300 border-primary/50 ${hoveredId === project.id ? 'scale-110 bg-accent/20' : ''}`}
                  style={{ left: '2px', top: '28px' }}
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="absolute inset-0 bg-background rounded-full"></div>
                  {/* Briefcase icon */}
                  <svg
                    className="w-9 h-8 text-accent transition-transform duration-300 group-hover:scale-110 relative z-10"
                    fill="none"
                    viewBox="0 0 25 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    style={{ position: "relative", top: "1px" }}
                  >
                    <rect x="5" y="8" width="15" height="10" rx="2" />
                    {/* Manija cuadrada más alta, desplazada 1px arriba */}
                    <rect x="8.5" y="3.2" width="8" height="4.2" rx="0.7" />
                  </svg>
                </a>
                
                {/* Project card */}
                <div
                  className="ml-12 sm:ml-16 md:ml-20 flex-1 text-foreground"
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => project.url && window.open(project.url, '_blank')}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && project.url) {
                      e.preventDefault()
                      window.open(project.url, '_blank')
                    }
                  }}
                  role={project.url ? "link" : undefined}
                  tabIndex={project.url ? 0 : undefined}
                  style={{ cursor: project.url ? 'pointer' : 'default' }}
                >
                  <Card
                    className={`bg-card/60 backdrop-blur-sm border border-border/60 p-4 sm:p-6 md:p-8 space-y-5 transition-all duration-500 relative overflow-hidden cursor-pointer ${hoveredId === project.id ? 'border-accent/50 bg-card/70 shadow-xl shadow-accent/10' : ''}`}
                  >
                    <div className={`absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl transition-opacity duration-500 ${hoveredId === project.id ? 'opacity-100' : 'opacity-0'}`} />
                    
                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent/0 via-accent/30 to-accent/0 transition-opacity duration-500 ${hoveredId === project.id ? 'opacity-100' : 'opacity-0'}`}></div>
                    
                    <div className="flex items-start justify-between flex-wrap gap-4 relative z-10">
                      <div className="space-y-2">
                        <h3 className={`text-2xl md:text-3xl font-semibold transition-colors duration-300 flex items-center gap-2 ${hoveredId === project.id ? 'text-accent' : ''}`}>
                          {project.logo && (
                            <img
                              src={project.logo}
                              alt={`${project.title} logo`}
                              className="w-8 h-8 object-contain"
                            />
                          )}
                          {project.title}
                          <svg
                            className={`w-5 h-5 transition-opacity ${hoveredId === project.id ? 'opacity-100' : 'opacity-0'}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </h3>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="text-sm text-muted-foreground px-3 py-1.5 bg-muted/30 rounded-full border border-border/40 w-fit">{project.period}</p>
                      </div>
                    </div>

                    <p className="text-foreground/70 leading-relaxed text-base md:text-lg relative z-10">{project.description}</p>

                    <div className="flex flex-wrap gap-2 pt-2 relative z-10">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 text-sm bg-muted/40 text-foreground/80 rounded-full border border-border/50 transition-all duration-300 hover:bg-accent/20 hover:border-accent/60 hover:text-accent hover:scale-105 cursor-pointer"
                          title={`Technology: ${tech}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-border/40 relative z-10">
                      <p className="text-sm md:text-base text-accent/90 italic leading-relaxed">{project.impact}</p>
                    </div>

                    {project.images && project.images.length > 0 && (
                      <div className="pt-4 relative z-10">
                        <PhotoGallery images={project.images} isVisible={isVisible} />
                      </div>
                    )}

                    {/* Interactive hint */}
                    <div className={`absolute bottom-4 right-4 transition-opacity duration-300 ${hoveredId === project.id ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="flex items-center gap-1 text-xs text-accent/70">
                        <span>Click to explore</span>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            ) : (
              <div 
                key={project.id}
                className="relative flex items-start mb-12"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.1}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.1}s`,
                }}
              >
                {/* Timeline dot with icon */}
                <div className={`absolute flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 bg-accent/10 border-2 rounded-full shadow-lg transition-all duration-300 border-primary/50 ${hoveredId === project.id ? 'scale-110 bg-accent/20' : ''}`} style={{ left: '2px', top: '28px' }} onMouseEnter={() => setHoveredId(project.id)} onMouseLeave={() => setHoveredId(null)}>
                  <div className="absolute inset-0 bg-background rounded-full"></div>
                  {/* Briefcase icon */}
                  <svg
                    className="w-9 h-8 text-accent transition-transform duration-300 group-hover:scale-110 relative z-10"
                    fill="none"
                    viewBox="0 0 25 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    style={{ position: "relative", top: "1px" }}
                  >
                    <rect x="5" y="8" width="15" height="10" rx="2" />
                    {/* Manija cuadrada más alta, desplazada 1px arriba */}
                    <rect x="8.5" y="3.2" width="8" height="4.2" rx="0.7" />
                  </svg>
                </div>
                
                {/* Project card */}
                <div className="ml-12 sm:ml-16 md:ml-20 flex-1">
                  <Card
                    className={`bg-card/60 backdrop-blur-sm border border-border/60 p-4 sm:p-6 md:p-8 space-y-5 transition-all duration-500 relative overflow-hidden cursor-pointer text-foreground ${hoveredId === project.id ? 'border-accent/50 bg-card/70 shadow-xl shadow-accent/10' : ''}`}
                    onMouseEnter={() => setHoveredId(project.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div className={`absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl transition-opacity duration-500 ${hoveredId === project.id ? 'opacity-100' : 'opacity-0'}`} />
                    
                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent/0 via-accent/30 to-accent/0 transition-opacity duration-500 ${hoveredId === project.id ? 'opacity-100' : 'opacity-0'}`}></div>
                    
                    <div className="flex items-start justify-between flex-wrap gap-4 relative z-10">
                      <div className="space-y-2">
                        <h3 className={`text-2xl md:text-3xl font-semibold transition-colors duration-300 flex items-center gap-2 ${hoveredId === project.id ? 'text-accent' : ''}`}>
                          {project.logo && (
                            <img
                              src={project.logo}
                              alt={`${project.title} logo`}
                              className="w-8 h-8 object-contain"
                            />
                          )}
                          {project.title}
                        </h3>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="text-sm text-muted-foreground px-3 py-1.5 bg-muted/30 rounded-full border border-border/40 w-fit">{project.period}</p>
                      </div>
                    </div>

                    <p className="text-foreground/70 leading-relaxed text-base md:text-lg relative z-10">{project.description}</p>

                    <div className="flex flex-wrap gap-2 pt-2 relative z-10">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 text-sm bg-muted/40 text-foreground/80 rounded-full border border-border/50 transition-all duration-300 hover:bg-accent/20 hover:border-accent/60 hover:text-accent hover:scale-105 cursor-pointer"
                          title={`Technology: ${tech}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-border/40 relative z-10">
                      <p className="text-sm md:text-base text-accent/90 italic leading-relaxed">{project.impact}</p>
                    </div>

                    {project.images && project.images.length > 0 && (
                      <div className="pt-4 relative z-10">
                        <PhotoGallery images={project.images} isVisible={isVisible} />
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            )
          ))}
        </div>

        <div className="space-y-8 text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/80 pt-4">
          {projectsContent.professional.conclusion.map((paragraph) => (
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
