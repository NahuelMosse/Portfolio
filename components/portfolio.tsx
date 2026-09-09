"use client"

import type { Locale, PortfolioContent } from "@/lib/content/types"
import { useRevealObserver } from "@/hooks/use-runtime"

import { BootSequence } from "@/components/runtime/boot-sequence"
import { Cursor } from "@/components/runtime/cursor"
import { Nav } from "@/components/runtime/nav"
import {
  PaletteController,
  PaletteZone,
} from "@/components/runtime/palette-zone"
import { SmoothScroll } from "@/components/runtime/smooth-scroll"

import { Hero } from "@/components/sections/hero"
import { Telemetry } from "@/components/sections/telemetry"
import { Work } from "@/components/sections/work"
import { Lab } from "@/components/sections/lab"
import { Method } from "@/components/sections/method"
import { Arsenal } from "@/components/sections/arsenal"
import { Origins } from "@/components/sections/origins"
import { Proof } from "@/components/sections/proof"
import { Contact, Footer } from "@/components/sections/contact"

export function Portfolio({
  content,
  locale,
}: {
  content: PortfolioContent
  locale: Locale
}) {
  useRevealObserver()

  return (
    <>
      <BootSequence content={content} />
      <SmoothScroll />
      <PaletteController />
      <Cursor />
      <Nav content={content} locale={locale} />

      <a
        href="#telemetry"
        className="mono sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[95] focus:border focus:border-accent focus:bg-bg focus:px-4 focus:py-2 focus:text-accent"
      >
        {content.ui.sections[1]?.label}
      </a>

      {/* One base zone covering the whole page. Nested zones (the Work rail,
          Grit, the SDD kit) win because the controller takes the last match in
          document order — and because nothing is left uncovered, the palette
          can never get stranded in a gap between sections. */}
      <PaletteZone palette="lime">
        <main id="main">
          <Hero content={content} />
          <Telemetry content={content} />
          <Work content={content} />
          <Lab content={content} />
          <Method content={content} />
          <Arsenal content={content} />
          <Origins content={content} />
          <Proof content={content} />
          <Contact content={content} />
        </main>
      </PaletteZone>

      <Footer content={content} />
    </>
  )
}
