/**
 * Section Layout Component
 * 
 * Reusable layout component following Composition Pattern
 * Implements Single Responsibility: only handles section structure and animations
 */

import { ReactNode } from "react"
import { getSectionHeaderStyle } from "@/lib/animation-config"

interface SectionLayoutProps {
  id: string
  title: string
  isVisible: boolean
  sectionRef: React.RefObject<HTMLElement | null>
  children: ReactNode
  floatingSymbols?: ReactNode
  className?: string
  maxWidth?: "3xl" | "4xl" | "5xl"
}

/**
 * Standard section layout with header, content and optional floating symbols
 * Follows Open/Closed Principle: extendable through composition, not modification
 */
export function SectionLayout({
  id,
  title,
  isVisible,
  sectionRef,
  children,
  floatingSymbols,
  className = "",
  maxWidth = "4xl",
}: SectionLayoutProps) {
  const maxWidthClass = {
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl", 
    "5xl": "max-w-5xl",
  }[maxWidth]

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`snap-section min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 py-24 relative overflow-hidden ${className}`}
    >
      {/* Floating tech symbols - optional composition */}
      {floatingSymbols}

      <div
        className={`${maxWidthClass} mx-auto space-y-14 relative z-10`}
        style={getSectionHeaderStyle(isVisible)}
      >
        {/* Section header */}
        <div className="space-y-6">
          <h2 
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            {title}
          </h2>
          <div className="w-20 h-0.5 bg-accent/60 rounded-full" />
        </div>

        {/* Section content */}
        {children}
      </div>
    </section>
  )
}
