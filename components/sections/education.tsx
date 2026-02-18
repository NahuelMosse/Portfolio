"use client"

import { Card } from "@/components/ui/card"
import { education } from "@/lib/content"
import { ScrollIndicator } from "@/components/ui/scroll-indicator"
import { useSectionVisibility } from "@/hooks/use-section-visibility"
import { useState, useEffect, useRef } from "react"

export function Education() {
  const { isVisible, sectionRef } = useSectionVisibility()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [lineHeight, setLineHeight] = useState(0)
  const firstItemRef = useRef<HTMLDivElement>(null)
  const lastItemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const calculateLineHeight = () => {
      if (firstItemRef.current && lastItemRef.current) {
        const firstTop = firstItemRef.current.offsetTop
        const lastTop = lastItemRef.current.offsetTop

        // Calcular desde el centro del primer dot hasta el centro del último dot
        // Los dots tienen h-10 sm:h-12, así que usamos 48px (h-12) para el cálculo
        const dotCenterOffset = 24 // Mitad de 48px
        const startPoint = firstTop + dotCenterOffset
        const endPoint = lastTop + dotCenterOffset

        setLineHeight(endPoint - startPoint)
      }
    }

    // Calcular después de que las animaciones se completen
    if (isVisible) {
      // Pequeño delay para asegurar que el DOM está actualizado
      const timer = setTimeout(calculateLineHeight, 100)

      window.addEventListener('resize', calculateLineHeight)

      return () => {
        clearTimeout(timer)
        window.removeEventListener('resize', calculateLineHeight)
      }
    }
  }, [isVisible])

  return (
    <section
      id="education"
      ref={sectionRef}
      className="snap-section min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-24 py-24 relative overflow-hidden"
    >
      {/* Floating tech symbols in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="hidden sm:block absolute top-[18%] right-[12%] text-accent/[0.30] text-4xl sm:text-6xl font-mono" style={{ animation: "float 40s ease-in-out infinite", textShadow: '0 0 30px oklch(0.72 0.06 75 / 0.4)' }}>
          {'()'}
        </div>
        <div className="hidden sm:block absolute top-[32%] left-[14%] text-secondary/[0.28] text-3xl sm:text-5xl" style={{ animation: "float 36s ease-in-out infinite 8s", textShadow: '0 0 25px oklch(0.45 0.08 55 / 0.3)' }}>
          ƒ
        </div>
        <div className="hidden sm:block absolute top-[50%] right-[16%] text-primary/[0.25] text-3xl sm:text-5xl font-mono" style={{ animation: "float 42s ease-in-out infinite 16s" }}>
          λ
        </div>
        <div className="hidden sm:block absolute top-[66%] left-[22%] text-accent/[0.30] text-4xl sm:text-6xl font-mono" style={{ animation: "float 38s ease-in-out infinite 24s", textShadow: '0 0 30px oklch(0.72 0.06 75 / 0.4)' }}>
          {'<>'}
        </div>
        <div className="hidden sm:block absolute top-[80%] right-[12%] text-secondary/[0.25] text-2xl sm:text-4xl" style={{ animation: "float 44s ease-in-out infinite 32s" }}>
          ≈
        </div>
        <div className="hidden sm:block absolute bottom-[26%] left-[12%] text-accent/[0.28] text-3xl sm:text-5xl font-mono" style={{ animation: "float 46s ease-in-out infinite 40s", textShadow: '0 0 28px oklch(0.72 0.06 75 / 0.35)' }}>
          {'{}'}
        </div>
        <div className="hidden sm:block absolute bottom-[10%] right-[24%] text-primary/[0.26] text-2xl sm:text-4xl" style={{ animation: "float 48s ease-in-out infinite 48s" }}>
          →
        </div>
      </div>

      <div
        className="max-w-4xl mx-auto space-y-14 relative z-10"
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
            {education.title}
          </h2>
          <div className="w-20 h-0.5 bg-accent/60 rounded-full" />
        </div>

        <div className="space-y-10">
          <div className="space-y-8 text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/80">
            {education.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 50)} className="text-pretty">{paragraph}</p>
            ))}
          </div>

          {/* Render all degrees in a timeline */}
          <div className="relative">
            {/* Vertical timeline line with animation - Dynamic height */}
            <div
              className="absolute left-5 sm:left-4 md:left-6 w-[2px] rounded-full transition-all duration-1000 ease-out bg-accent/50"
              style={{
                top: '56px',
                height: isVisible && lineHeight > 0 ? `${lineHeight}px` : '0px',
                transitionDelay: '0.5s',
                zIndex: 0
              }}
            ></div>
            
            {education.degrees.map((degree, index) => (
              degree.url ? (
                <div
                  ref={index === 0 ? firstItemRef : index === education.degrees.length - 1 ? lastItemRef : null}
                  key={degree.id}
                  className="relative flex items-start mb-12"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(24px)",
                    transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.08}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.08}s`,
                  }}
                >
                  {/* Timeline dot with icon */}
                  <a
                    href={degree.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`absolute flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 bg-accent/10 border-2 rounded-full shadow-lg transition-all duration-300 border-accent/50 ${hoveredId === degree.id ? 'scale-110 bg-accent/20' : ''}`}
                    style={{ left: '2px', top: '32px', zIndex: 10 }}
                    onMouseEnter={() => setHoveredId(degree.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div className="absolute inset-0 bg-background rounded-full"></div>
                    <svg
                      className="w-6 h-6 text-accent transition-transform duration-300 group-hover:scale-110 relative z-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 14l9-5-9-5-9 5 9 5z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                      />
                    </svg>
                  </a>
                  
                  {/* Degree card */}
                  <a
                    href={degree.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-12 sm:ml-16 md:ml-20 flex-1 text-foreground"
                    onMouseEnter={() => setHoveredId(degree.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <Card
                      className={`bg-card/60 backdrop-blur-sm border border-border/60 p-6 sm:p-8 md:p-10 space-y-6 transition-all duration-500 relative overflow-hidden cursor-pointer ${hoveredId === degree.id ? 'border-accent/50 bg-card/70 shadow-xl shadow-accent/10' : ''}`}
                    >
                      {/* Subtle ambient glow */}
                      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl transition-opacity duration-500 ${hoveredId === degree.id ? 'opacity-100' : 'opacity-0'}`} />
                      
                      {/* Decorative accent line */}
                      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent/0 via-accent/30 to-accent/0 transition-opacity duration-500 ${hoveredId === degree.id ? 'opacity-100' : 'opacity-0'}`}></div>
                      
                      <div className="flex items-start justify-between flex-wrap gap-4 relative z-10">
                        <div className="space-y-3">
                          <h3 className={`text-2xl md:text-3xl font-semibold transition-colors duration-300 flex items-center gap-2 ${hoveredId === degree.id ? 'text-accent' : ''}`}>
                            {degree.title}
                            <svg
                              className={`w-5 h-5 transition-opacity ${hoveredId === degree.id ? 'opacity-100' : 'opacity-0'}`}
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
                          <div className="flex items-center gap-2">
                            {degree.logo && (
                              <img
                                src={degree.logo}
                                alt={`${degree.institution} logo`}
                                className="w-8 h-8 object-contain"
                              />
                            )}
                            <p className="text-lg md:text-xl text-secondary font-medium">{degree.institution}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <p className="text-sm text-muted-foreground px-3 py-1.5 bg-muted/30 rounded-full border border-border/40 w-fit">{degree.period}</p>
                          <p className="text-xs text-accent/90 font-medium px-3 py-1.5 bg-accent/10 rounded-full border border-accent/30 w-fit">{degree.status}</p>
                        </div>
                      </div>
                      <p className="text-foreground/70 leading-relaxed text-base md:text-lg relative z-10">
                        {degree.description}
                      </p>
                      
                      {/* Interactive hint */}
                      <div className={`absolute bottom-4 right-4 transition-opacity duration-300 ${hoveredId === degree.id ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="flex items-center gap-1 text-xs text-accent/70">
                          <span>Click to explore</span>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Card>
                  </a>
                </div>
              ) : (
                <div
                  ref={index === 0 ? firstItemRef : index === education.degrees.length - 1 ? lastItemRef : null}
                  key={degree.id}
                  className="relative flex items-start mb-12"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(24px)",
                    transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.08}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.08}s`,
                  }}
                >
                  {/* Timeline dot with icon */}
                  <div className={`absolute flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 bg-accent/10 border-2 rounded-full shadow-lg transition-all duration-300 border-accent/50 ${hoveredId === degree.id ? 'scale-110 bg-accent/20' : ''}`} style={{ left: '2px', top: '32px', zIndex: 10 }} onMouseEnter={() => setHoveredId(degree.id)} onMouseLeave={() => setHoveredId(null)}>
                    <div className="absolute inset-0 bg-background rounded-full"></div>
                    <svg
                      className="w-6 h-6 text-accent transition-transform duration-300 group-hover:scale-110 relative z-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 14l9-5-9-5-9 5 9 5z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                      />
                    </svg>
                  </div>
                  
                  {/* Degree card */}
                  <div className="ml-12 sm:ml-16 md:ml-20 flex-1">
                    <Card
                    className={`bg-card/60 backdrop-blur-sm border border-border/60 p-6 sm:p-8 md:p-10 space-y-6 transition-all duration-500 relative overflow-hidden cursor-pointer text-foreground ${hoveredId === degree.id ? 'border-accent/50 bg-card/70 shadow-xl shadow-accent/10' : ''}`}
                    onMouseEnter={() => setHoveredId(degree.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    >
                      {/* Subtle ambient glow */}
                      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl transition-opacity duration-500 ${hoveredId === degree.id ? 'opacity-100' : 'opacity-0'}`} />
                      
                      {/* Decorative accent line */}
                      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent/0 via-accent/30 to-accent/0 transition-opacity duration-500 ${hoveredId === degree.id ? 'opacity-100' : 'opacity-0'}`}></div>
                      
                      <div className="flex items-start justify-between flex-wrap gap-4 relative z-10">
                        <div className="space-y-3">
                          <h3 className={`text-2xl md:text-3xl font-semibold transition-colors duration-300 flex items-center gap-2 ${hoveredId === degree.id ? 'text-accent' : ''}`}>
                            {degree.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {degree.logo && (
                              <img
                                src={degree.logo}
                                alt={`${degree.institution} logo`}
                                className="w-8 h-8 object-contain"
                              />
                            )}
                            <p className="text-lg md:text-xl text-secondary font-medium">{degree.institution}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <p className="text-sm text-muted-foreground px-3 py-1.5 bg-muted/30 rounded-full border border-border/40 w-fit">{degree.period}</p>
                          <p className="text-xs text-accent/90 font-medium px-3 py-1.5 bg-accent/10 rounded-full border border-accent/30 w-fit">{degree.status}</p>
                        </div>
                      </div>
                      <p className="text-foreground/70 leading-relaxed text-base md:text-lg relative z-10">
                        {degree.description}
                      </p>
                      
                      {/* Interactive hint */}
                      <div className={`absolute bottom-4 right-4 transition-opacity duration-300 ${hoveredId === degree.id ? 'opacity-100' : 'opacity-0'}`}>
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
              )
            ))}
          </div>

          <div className="space-y-8 text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/80 pt-4">
            {education.conclusion.map((paragraph) => (
              <p key={paragraph.slice(0, 50)} className="text-pretty">{paragraph}</p>
            ))}
          </div>

          <div className="pt-36 pb-12 flex justify-center">
            <ScrollIndicator />
          </div>
        </div>
      </div>
    </section>
  )
}
