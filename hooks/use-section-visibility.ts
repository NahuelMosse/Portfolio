import { useEffect, useRef, useState } from "react"

/**
 * Custom hook for managing section visibility with IntersectionObserver
 * 
 * @param threshold - The threshold at which the observer's callback should be executed (default: 0.3)
 * @returns Object containing isVisible state and sectionRef
 */
export function useSectionVisibility(threshold: number = 0.3) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const currentSection = sectionRef.current
    if (!currentSection) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Desconectar después de volverse visible para mejorar rendimiento
          observerRef.current?.disconnect()
        }
      },
      { 
        threshold,
        rootMargin: "50px", // Pre-cargar animaciones 50px antes
      },
    )

    observerRef.current.observe(currentSection)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [threshold])

  return { isVisible, sectionRef }
}
