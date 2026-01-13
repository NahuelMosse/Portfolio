"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { origins } from "@/lib/content"
import { ScrollIndicator } from "../ui/scroll-indicator"

export function Origins() {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const images = [
    { src: "/origins-photo-1.jpeg", alt: "Early programming days" },
    { src: "/origins-photo-2.jpeg", alt: "Learning to code" },
    { src: "/origins-photo-3.jpeg", alt: "First projects" },
    { src: "/origins-photo-4.jpeg", alt: "Building experience" },
  ]

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="origins"
      ref={sectionRef}
      className="snap-section min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 py-24 relative overflow-hidden"
    >
      {/* Subtle floating tech symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[25%] right-[14%] text-accent/[0.30] text-6xl font-mono" style={{ animation: "float 46s ease-in-out infinite", textShadow: '0 0 30px oklch(0.72 0.06 75 / 0.4)' }}>
          ∞
        </div>
        <div className="absolute top-[42%] left-[16%] text-secondary/[0.28] text-5xl font-mono" style={{ animation: "float 42s ease-in-out infinite 8s", textShadow: '0 0 25px oklch(0.45 0.08 55 / 0.3)' }}>
          {'{ }'}
        </div>
        <div className="absolute top-[62%] right-[18%] text-primary/[0.25] text-5xl" style={{ animation: "float 48s ease-in-out infinite 16s" }}>
          λ
        </div>
        <div className="absolute bottom-[28%] left-[20%] text-accent/[0.30] text-6xl font-mono" style={{ animation: "float 44s ease-in-out infinite 24s", textShadow: '0 0 30px oklch(0.72 0.06 75 / 0.4)' }}>
          {'</>'}
        </div>
        <div className="absolute bottom-[45%] right-[14%] text-secondary/[0.25] text-4xl" style={{ animation: "float 50s ease-in-out infinite 32s" }}>
          ƒ
        </div>
      </div>
      
      <div
        className="max-w-4xl mx-auto space-y-14 relative z-10"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        }}
      >
        <div className="space-y-6">
          <h2 
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            {origins.title}
          </h2>
          <div className="w-20 h-0.5 bg-accent/60 rounded-full" />
        </div>

        {/* Image grid after title */}
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
                <div className="text-accent text-4xl">+</div>
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-8 text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/80">
          {origins.paragraphs.map((paragraph, index) => (
            <p 
              key={index} 
              className="text-pretty"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + index * 0.1}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + index * 0.1}s`,
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="pt-36 pb-12 flex justify-center">
          <ScrollIndicator />
        </div>
      </div>

      {/* Modal for enlarged image - rendered via portal */}
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
    </section>
  )
}
