"use client"

import { Button } from "@/components/ui/button"
import { personalInfo, contact } from "@/lib/content"
import { useSectionVisibility } from "@/hooks/use-section-visibility"

export function Contact() {
  const { isVisible, sectionRef } = useSectionVisibility()

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="snap-section min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 py-24 relative overflow-hidden"
    >
      {/* Subtle tech elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[28%] left-[14%] text-accent/[0.30] text-6xl font-mono" style={{ animation: "float 44s ease-in-out infinite", textShadow: '0 0 30px oklch(0.72 0.06 75 / 0.4)' }}>
          @
        </div>
        <div className="absolute top-[46%] right-[16%] text-secondary/[0.28] text-5xl font-mono" style={{ animation: "float 40s ease-in-out infinite 8s", textShadow: '0 0 25px oklch(0.45 0.08 55 / 0.3)' }}>
          {'//'}
        </div>
        <div className="absolute top-[64%] left-[18%] text-primary/[0.25] text-5xl" style={{ animation: "float 46s ease-in-out infinite 16s" }}>
          →
        </div>
        <div className="absolute bottom-[34%] right-[12%] text-accent/[0.30] text-6xl font-mono" style={{ animation: "float 42s ease-in-out infinite 24s", textShadow: '0 0 30px oklch(0.72 0.06 75 / 0.4)' }}>
          {'{ }'}
        </div>
        <div className="absolute bottom-[50%] left-[10%] text-secondary/[0.25] text-4xl" style={{ animation: "float 48s ease-in-out infinite 32s" }}>
          λ
        </div>
      </div>

      <div
        className="max-w-3xl mx-auto text-center space-y-14 relative z-10"
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
          <div className="w-20 h-0.5 bg-accent/60 rounded-full mx-auto" />
        </div>

        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/80 text-pretty">
          {contact.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-6 text-lg font-medium transition-all duration-300 hover:scale-[1.02] border border-secondary/40"
            asChild
          >
            <a href={contact.cta.primary.href} aria-label={`${contact.cta.primary.text} - Opens email client`}>{contact.cta.primary.text}</a>
          </Button>

          {contact.cta.secondary.map((link) => (
            <Button
              key={link.href}
              size="lg"
              variant="outline"
              className="border border-border/60 hover:bg-muted/30 hover:border-border px-8 py-6 text-lg font-medium transition-all duration-300 hover:scale-[1.02] bg-transparent"
              asChild
            >
              <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.text} - Opens in new tab`}>
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
