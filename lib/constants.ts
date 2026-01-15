/**
 * Application Constants
 * 
 * Centralized constants for animations, intersection observers, and other configuration values
 */

// Animation timing constants (in milliseconds)
export const ANIMATION_TIMING = {
  SECTION_FADE_DELAY: 200,
  STAGGER_DELAY: 150,
  CARD_STAGGER_DELAY: 100,
  SNAP_TIMEOUT: 1000,
} as const

// IntersectionObserver configuration
export const INTERSECTION_CONFIG = {
  DEFAULT_THRESHOLD: 0.3,
  PROJECTS_THRESHOLD: 0.2,
  ROOT_MARGIN: "-100px 0px -50% 0px",
  NAVIGATION_THRESHOLDS: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
}

// Scroll detection thresholds
export const SCROLL_CONFIG = {
  SECTION_TOP_MIN: -100,
  SECTION_TOP_MAX: 200,
  SECTION_BOTTOM_THRESHOLD: 50,
  SECTION_TOP_THRESHOLD: 50,
} as const

// Z-index layering
export const Z_INDEX = {
  BACKGROUND: 0,
  CONTENT: 10,
  NAVIGATION: 40,
  MODAL: 50,
  TOAST: 60,
} as const
