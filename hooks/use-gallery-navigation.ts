/**
 * Custom Hooks for Image Gallery
 * 
 * Follows Single Responsibility Principle by separating concerns:
 * - useGalleryState: manages image selection state
 * - useKeyboardNavigation: handles keyboard events
 * - useImageNavigation: provides navigation functions
 */

import { useCallback, useEffect, useState } from "react"

/**
 * Manages gallery image selection state
 */
export function useGalleryState() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const openImage = (index: number) => setSelectedImage(index)
  const closeImage = () => setSelectedImage(null)

  return {
    selectedImage,
    setSelectedImage,
    mounted,
    openImage,
    closeImage,
  }
}

/**
 * Handles keyboard navigation for gallery
 * Follows Interface Segregation: only keyboard-related logic
 */
export function useKeyboardNavigation(
  isOpen: boolean,
  onPrevious: () => void,
  onNext: () => void,
  onClose: () => void
) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          onPrevious()
          break
        case "ArrowRight":
          onNext()
          break
        case "Escape":
          onClose()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onPrevious, onNext, onClose])
}

/**
 * Provides image navigation functions
 * Implements Strategy Pattern for navigation logic
 */
export function useImageNavigation(
  currentIndex: number | null,
  totalImages: number,
  setCurrentIndex: (index: number) => void
) {
  const goToPrevious = useCallback(() => {
    if (currentIndex === null) return
    const newIndex = currentIndex > 0 ? currentIndex - 1 : totalImages - 1
    setCurrentIndex(newIndex)
  }, [currentIndex, totalImages, setCurrentIndex])

  const goToNext = useCallback(() => {
    if (currentIndex === null) return
    const newIndex = currentIndex < totalImages - 1 ? currentIndex + 1 : 0
    setCurrentIndex(newIndex)
  }, [currentIndex, totalImages, setCurrentIndex])

  return {
    goToPrevious,
    goToNext,
  }
}
