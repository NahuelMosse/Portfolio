"use client"

import { useEffect, useRef, useState } from "react"

interface ScrollSnapContainerProps {
  children: React.ReactNode
}

export function ScrollSnapContainer({ children }: ScrollSnapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<HTMLElement[]>([])
  const isSnapScrollingRef = useRef(false)
  const [currentSection, setCurrentSection] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Get all sections
    sectionsRef.current = Array.from(container.querySelectorAll("section"))

    const snapToSection = (index: number) => {
      if (index < 0 || index >= sectionsRef.current.length) return
      
      const section = sectionsRef.current[index]
      if (!section) return

      isSnapScrollingRef.current = true
      
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })

      setCurrentSection(index)

      // Reset scrolling flag after animation
      setTimeout(() => {
        isSnapScrollingRef.current = false
      }, 1000)
    }

    const getCurrentVisibleSection = (): number => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const viewportMiddle = scrollTop + windowHeight / 2

      for (let i = 0; i < sectionsRef.current.length; i++) {
        const section = sectionsRef.current[i]
        const rect = section.getBoundingClientRect()
        const sectionTop = scrollTop + rect.top
        const sectionBottom = sectionTop + rect.height

        if (viewportMiddle >= sectionTop && viewportMiddle < sectionBottom) {
          return i
        }
      }

      return currentSection
    }

    const isAtSectionBottom = (sectionIndex: number): boolean => {
      const section = sectionsRef.current[sectionIndex]
      if (!section) return false

      const rect = section.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const sectionBottom = rect.bottom
      
      // Considera que está al final si queda menos de 50px
      return sectionBottom - windowHeight < 50
    }

    const isAtSectionTop = (sectionIndex: number): boolean => {
      const section = sectionsRef.current[sectionIndex]
      if (!section) return false

      const rect = section.getBoundingClientRect()
      
      // Considera que está al inicio si está a menos de 50px del top
      return rect.top > -50 && rect.top < 50
    }

    const handleWheel = (e: WheelEvent) => {
      if (isSnapScrollingRef.current) {
        e.preventDefault()
        return
      }

      const visibleSection = getCurrentVisibleSection()
      const scrollingDown = e.deltaY > 0
      const scrollingUp = e.deltaY < 0

      // Si scrollea hacia abajo y está al final de la sección
      if (scrollingDown && isAtSectionBottom(visibleSection)) {
        if (visibleSection < sectionsRef.current.length - 1) {
          e.preventDefault()
          snapToSection(visibleSection + 1)
        }
      }
      // Si scrollea hacia arriba y está al inicio de la sección
      else if (scrollingUp && isAtSectionTop(visibleSection)) {
        if (visibleSection > 0) {
          e.preventDefault()
          snapToSection(visibleSection - 1)
        }
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSnapScrollingRef.current) return

      const visibleSection = getCurrentVisibleSection()

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (isAtSectionBottom(visibleSection) && visibleSection < sectionsRef.current.length - 1) {
          e.preventDefault()
          snapToSection(visibleSection + 1)
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (isAtSectionTop(visibleSection) && visibleSection > 0) {
          e.preventDefault()
          snapToSection(visibleSection - 1)
        }
      } else if (e.key === "Home") {
        e.preventDefault()
        snapToSection(0)
      } else if (e.key === "End") {
        e.preventDefault()
        snapToSection(sectionsRef.current.length - 1)
      }
    }

    // Handle touch for mobile
    let touchStartY = 0
    let touchStartTime = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
      touchStartTime = Date.now()
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isSnapScrollingRef.current) {
        e.preventDefault()
        return
      }

      const touchCurrentY = e.touches[0].clientY
      const deltaY = touchStartY - touchCurrentY
      const visibleSection = getCurrentVisibleSection()
      
      const swipingDown = deltaY > 0
      const swipingUp = deltaY < 0

      // Si hace swipe hacia abajo y está al final
      if (swipingDown && isAtSectionBottom(visibleSection)) {
        if (visibleSection < sectionsRef.current.length - 1 && Math.abs(deltaY) > 50) {
          e.preventDefault()
          snapToSection(visibleSection + 1)
        }
      }
      // Si hace swipe hacia arriba y está al inicio
      else if (swipingUp && isAtSectionTop(visibleSection)) {
        if (visibleSection > 0 && Math.abs(deltaY) > 50) {
          e.preventDefault()
          snapToSection(visibleSection - 1)
        }
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchmove", handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [currentSection])

  return (
    <div ref={containerRef} className="relative">
      {children}
    </div>
  )
}
