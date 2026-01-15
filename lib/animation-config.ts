/**
 * Animation Configuration
 * 
 * Centralized animation values following DRY principle
 */

// Cubic bezier easing functions
export const EASING = {
  SMOOTH: "cubic-bezier(0.16, 1, 0.3, 1)",
  EASE_IN_OUT: "ease-in-out",
  EASE_OUT: "ease-out",
} as const

// Animation durations (in seconds)
export const DURATION = {
  FAST: "0.3s",
  MEDIUM: "0.8s",
  SLOW: "1s",
  VERY_SLOW: "1.2s",
} as const

// Fade-in animation configuration
export const FADE_IN_CONFIG = {
  initial: {
    opacity: 0,
    transform: "translateY(32px)",
  },
  animate: {
    opacity: 1,
    transform: "translateY(0)",
  },
  transition: (delay: number = 0.2) => 
    `opacity ${DURATION.SLOW} ${EASING.SMOOTH} ${delay}s, transform ${DURATION.SLOW} ${EASING.SMOOTH} ${delay}s`,
} as const

// Stagger animation helpers
export const getStaggerDelay = (index: number, baseDelay: number = 0.3, increment: number = 0.1) => 
  baseDelay + index * increment

export const getStaggerStyle = (
  isVisible: boolean,
  index: number,
  baseDelay: number = 0.3,
  increment: number = 0.1
) => ({
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? "translateY(0)" : "translateY(16px)",
  transition: `opacity ${DURATION.MEDIUM} ${EASING.SMOOTH} ${getStaggerDelay(index, baseDelay, increment)}s, transform ${DURATION.MEDIUM} ${EASING.SMOOTH} ${getStaggerDelay(index, baseDelay, increment)}s`,
})

// Section header styles (DRY)
export const getSectionHeaderStyle = (isVisible: boolean) => ({
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? "translateY(0)" : "translateY(32px)",
  transition: FADE_IN_CONFIG.transition(0.2),
})

// Floating symbol animation generator
export const getFloatingSymbolStyle = (
  animationName: string = "float",
  duration: number = 40,
  delay: number = 0
) => ({
  animation: `${animationName} ${duration}s ${EASING.EASE_IN_OUT} infinite ${delay}s`,
})
