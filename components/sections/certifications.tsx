"use client"

import { Card } from "@/components/ui/card"
import { certifications as certificationsContent } from "@/lib/content"
import { ScrollIndicator } from "@/components/ui/scroll-indicator"
import { useSectionVisibility } from "@/hooks/use-section-visibility"

export function Certifications() {
  const { isVisible, sectionRef } = useSectionVisibility()

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="snap-section min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-24 py-24 relative overflow-hidden"
    >
      {/* Floating tech symbols in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="hidden sm:block absolute top-[15%] right-[14%] text-accent/[0.30] text-4xl sm:text-6xl font-mono" style={{ animation: "float 40s ease-in-out infinite", textShadow: '0 0 30px oklch(0.72 0.06 75 / 0.4)' }}>
          {'</>'}
        </div>
        <div className="hidden sm:block absolute top-[28%] left-[12%] text-secondary/[0.28] text-3xl sm:text-5xl font-mono" style={{ animation: "float 36s ease-in-out infinite 8s", textShadow: '0 0 25px oklch(0.45 0.08 55 / 0.3)' }}>
          {'{}'}
        </div>
        <div className="hidden sm:block absolute top-[42%] right-[18%] text-primary/[0.25] text-3xl sm:text-5xl" style={{ animation: "float 42s ease-in-out infinite 16s" }}>
          λ
        </div>
        <div className="hidden sm:block absolute top-[58%] left-[16%] text-accent/[0.30] text-4xl sm:text-6xl font-mono" style={{ animation: "float 38s ease-in-out infinite 24s", textShadow: '0 0 30px oklch(0.72 0.06 75 / 0.4)' }}>
          {'[]'}
        </div>
        <div className="hidden sm:block absolute top-[72%] right-[22%] text-secondary/[0.25] text-2xl sm:text-4xl" style={{ animation: "float 44s ease-in-out infinite 32s" }}>
          →
        </div>
        <div className="hidden sm:block absolute top-[85%] left-[24%] text-accent/[0.28] text-3xl sm:text-5xl" style={{ animation: "float 46s ease-in-out infinite 40s", textShadow: '0 0 28px oklch(0.72 0.06 75 / 0.35)' }}>
          ƒ
        </div>
        <div className="hidden sm:block absolute bottom-[18%] right-[12%] text-primary/[0.26] text-2xl sm:text-4xl font-mono" style={{ animation: "float 48s ease-in-out infinite 48s" }}>
          {'()'}
        </div>
        <div className="hidden sm:block absolute bottom-[6%] left-[10%] text-secondary/[0.27] text-3xl sm:text-5xl" style={{ animation: "float 50s ease-in-out infinite 56s", textShadow: '0 0 26px oklch(0.45 0.08 55 / 0.32)' }}>
          ∞
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
            {certificationsContent.title}
          </h2>
          <div className="w-20 h-0.5 bg-accent/60 rounded-full" />
        </div>

        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/80 text-pretty">
          {certificationsContent.intro}
        </p>

        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
          {certificationsContent.items.map((cert, index) => (
            <Card
              key={cert.id}
              className="bg-card/60 backdrop-blur-sm border border-border/60 p-2.5 sm:p-3 space-y-1.5 group transition-all duration-500 hover:border-border hover:bg-card/70 relative"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.05}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.05}s`,
              }}
            >
              {/* Subtle glow on hover */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/5 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
              
              <div className="space-y-1.5 relative z-10">
                <div className="flex items-start justify-between gap-1.5">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors duration-300 leading-tight flex-1">
                    {cert.title}
                  </h3>
                  <span className="px-1.5 py-0.5 bg-muted/30 text-foreground/80 rounded-full border border-border/40 text-[10px] shrink-0 font-medium">{cert.year}</span>
                </div>
                <p className="text-[11px] text-secondary/80 font-medium truncate">{cert.issuer}</p>
              </div>
              <p className="text-[11px] text-foreground/60 leading-relaxed relative z-10 line-clamp-2">{cert.description}</p>
            </Card>
          ))}
        </div>

        <div className="pt-8 space-y-8 text-lg md:text-xl leading-relaxed text-foreground/80">
          {certificationsContent.conclusion.map((paragraph) => (
            <p key={paragraph.slice(0, 50)} className="text-pretty">{paragraph}</p>
          ))}
        </div>

        <div className="pt-36 pb-12 flex justify-center">
          <ScrollIndicator />
        </div>
      </div>
    </section>
  )
}
