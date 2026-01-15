/**
 * Floating Tech Symbols Component
 * 
 * Reusable component for background tech symbols using Composition Pattern
 * Follows Single Responsibility Principle: only renders decorative symbols
 */

import { getFloatingSymbolStyle } from "@/lib/animation-config"

export interface FloatingSymbol {
  content: string
  position: {
    top?: string
    bottom?: string
    left?: string
    right?: string
  }
  size: string
  opacity: string
  animation: {
    name: string
    duration: number
    delay: number
  }
  textShadow?: string
  fontFamily?: string
}

interface FloatingTechSymbolsProps {
  symbols: FloatingSymbol[]
  className?: string
}

/**
 * Renders a collection of floating tech symbols with animations
 * @param symbols - Array of symbol configurations
 * @param className - Optional additional classes
 */
export function FloatingTechSymbols({ symbols, className = "" }: FloatingTechSymbolsProps) {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} 
      aria-hidden="true"
    >
      {symbols.map((symbol, index) => (
        <div
          key={`${symbol.content}-${index}`}
          className={`absolute ${symbol.size} ${symbol.opacity} ${symbol.fontFamily || ""}`}
          style={{
            ...symbol.position,
            ...getFloatingSymbolStyle(symbol.animation.name, symbol.animation.duration, symbol.animation.delay),
            textShadow: symbol.textShadow,
          }}
        >
          {symbol.content}
        </div>
      ))}
    </div>
  )
}

/**
 * Factory function to create symbol configurations
 * Implements Factory Pattern for consistent symbol creation
 */
export const createSymbol = (
  content: string,
  position: FloatingSymbol['position'],
  options: {
    size?: string
    opacity?: string
    animation?: { name?: string; duration?: number; delay?: number }
    textShadow?: string
    fontFamily?: string
  } = {}
): FloatingSymbol => ({
  content,
  position,
  size: options.size || "text-5xl",
  opacity: options.opacity || "text-accent/[0.30]",
  animation: {
    name: options.animation?.name || "float",
    duration: options.animation?.duration || 40,
    delay: options.animation?.delay || 0,
  },
  textShadow: options.textShadow,
  fontFamily: options.fontFamily,
})

/**
 * Preset symbol configurations for common use cases
 */
export const SYMBOL_PRESETS = {
  ACCENT: (content: string) => ({
    opacity: "text-accent/[0.30]",
    textShadow: "0 0 30px oklch(0.72 0.06 75 / 0.4)",
  }),
  SECONDARY: (content: string) => ({
    opacity: "text-secondary/[0.28]",
    textShadow: "0 0 25px oklch(0.45 0.08 55 / 0.3)",
  }),
  PRIMARY: (content: string) => ({
    opacity: "text-primary/[0.25]",
  }),
} as const
