"use client"

import { origins } from "@/lib/content"
import { ScrollIndicator } from "../ui/scroll-indicator"
import { PhotoGallery } from "../ui/photo-gallery"
import { useSectionVisibility } from "@/hooks/use-section-visibility"
import { SectionLayout } from "../ui/section-layout"
import { FloatingTechSymbols, createSymbol, SYMBOL_PRESETS } from "../ui/floating-tech-symbols"
import { getStaggerStyle } from "@/lib/animation-config"

export function Origins() {
  const { isVisible, sectionRef } = useSectionVisibility()

  const images = [
    { src: "/origins-photo-1.webp", alt: "Early programming days" },
    { src: "/origins-photo-2.webp", alt: "Learning to code" },
    { src: "/origins-photo-3.webp", alt: "First projects" },
    { src: "/origins-photo-4.webp", alt: "Building experience" },
  ]

  // Floating symbols configuration - centralized and reusable
  const floatingSymbols = [
    createSymbol("∞", { top: "25%", right: "14%" }, {
      size: "text-6xl",
      ...SYMBOL_PRESETS.ACCENT("∞"),
      fontFamily: "font-mono",
      animation: { duration: 46 },
    }),
    createSymbol("{ }", { top: "42%", left: "16%" }, {
      size: "text-5xl",
      ...SYMBOL_PRESETS.SECONDARY("{ }"),
      fontFamily: "font-mono",
      animation: { duration: 42, delay: 8 },
    }),
    createSymbol("λ", { top: "62%", right: "18%" }, {
      size: "text-5xl",
      ...SYMBOL_PRESETS.PRIMARY("λ"),
      animation: { duration: 48, delay: 16 },
    }),
    createSymbol("</>", { bottom: "28%", left: "20%" }, {
      size: "text-6xl",
      ...SYMBOL_PRESETS.ACCENT("</>"),
      fontFamily: "font-mono",
      animation: { duration: 44, delay: 24 },
    }),
    createSymbol("ƒ", { bottom: "45%", right: "14%" }, {
      size: "text-4xl",
      opacity: "text-secondary/[0.25]",
      animation: { duration: 50, delay: 32 },
    }),
  ]

  return (
    <SectionLayout
      id="origins"
      title={origins.title}
      isVisible={isVisible}
      sectionRef={sectionRef}
      floatingSymbols={<FloatingTechSymbols symbols={floatingSymbols} />}
    >
      {/* Photo gallery */}
      <PhotoGallery images={images} isVisible={isVisible} />

      <div className="space-y-8 text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/80">
        {origins.paragraphs.map((paragraph, index) => (
          <p 
            key={paragraph.slice(0, 50)} 
            className="text-pretty"
            style={getStaggerStyle(isVisible, index, 0.3, 0.1)}
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div className="pt-36 pb-12 flex justify-center">
        <ScrollIndicator />
      </div>
    </SectionLayout>
  )
}
