"use client"

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PhotoGalleryProps {
  images: Array<{ src: string; alt: string }>
  isVisible: boolean
}

export function PhotoGallery({ images, isVisible }: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (selectedImage === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setSelectedImage((prev) => (prev! > 0 ? prev! - 1 : images.length - 1))
      } else if (e.key === "ArrowRight") {
        setSelectedImage((prev) => (prev! < images.length - 1 ? prev! + 1 : 0))
      } else if (e.key === "Escape") {
        setSelectedImage(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedImage, images.length])

  const goToPrevImage = () => {
    setSelectedImage((prev) => (prev! > 0 ? prev! - 1 : images.length - 1))
  }

  const goToNextImage = () => {
    setSelectedImage((prev) => (prev! < images.length - 1 ? prev! + 1 : 0))
  }

  return (
    <>
      {/* Photo gallery grid */}
      <div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
        }}
      >
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-border/40 bg-card/30 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:border-accent/60"
          >
            <img 
              src={image.src} 
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Image Modal */}
      {mounted && selectedImage !== null && createPortal(
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/30 backdrop-blur-2xl"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-foreground/60 hover:text-foreground text-4xl font-light leading-none w-12 h-12 flex items-center justify-center transition-colors z-10"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToPrevImage()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground text-5xl font-light leading-none w-14 h-14 flex items-center justify-center transition-all hover:scale-110 z-10"
            aria-label="Previous image"
          >
            ‹
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToNextImage()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground text-5xl font-light leading-none w-14 h-14 flex items-center justify-center transition-all hover:scale-110 z-10"
            aria-label="Next image"
          >
            ›
          </button>

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-foreground/60 text-sm font-medium bg-background/30 backdrop-blur-md px-4 py-2 rounded-full">
            {selectedImage + 1} / {images.length}
          </div>

          <img 
            src={images[selectedImage].src}
            alt={images[selectedImage].alt}
            className="max-w-[90vw] max-h-[75vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body
      )}
    </>
  )
}
