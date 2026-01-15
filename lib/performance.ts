import type { Metadata } from "next"

// Resource hints para mejorar rendimiento
export function generateResourceHints(): Metadata {
  return {
    other: {
      'dns-prefetch': ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
      'preconnect': ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
    },
  }
}

// Optimización de imágenes críticas above-the-fold
export const imageOptimization = {
  priority: true,
  loading: 'eager' as const,
  sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}

// Lazy loading para imágenes below-the-fold
export const imageLazyLoading = {
  priority: false,
  loading: 'lazy' as const,
  sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}
