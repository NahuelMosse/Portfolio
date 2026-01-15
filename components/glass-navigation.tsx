"use client"

import { useState, useEffect, useRef } from "react"
import { INTERSECTION_CONFIG, SCROLL_CONFIG, Z_INDEX } from "@/lib/constants"

const sections = [
  { id: "hero", label: "Home", icon: "◆" },
  { id: "origins", label: "Origins", icon: "◈" },
  { id: "education", label: "Education", icon: "◉" },
  { id: "professional-projects", label: "Work", icon: "◐" },
  { id: "personal-projects", label: "Personal", icon: "◑" },
  { id: "certifications", label: "Achievements", icon: "◊" },
  { id: "present", label: "Present", icon: "◒" },
  { id: "contact", label: "Contact", icon: "◓" },
]

export function GlassNavigation() {
  const [activeSection, setActiveSection] = useState("hero")
  const [showNav, setShowNav] = useState(false)
  const hasShownRef = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 && !hasShownRef.current) {
        setShowNav(true)
        hasShownRef.current = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Get all currently intersecting sections
        const intersecting = entries
          .filter(entry => entry.isIntersecting && entry.intersectionRatio > 0)
          .map(entry => ({
            id: entry.target.id,
            top: entry.boundingClientRect.top,
            bottom: entry.boundingClientRect.bottom,
            ratio: entry.intersectionRatio
          }))
        
        if (intersecting.length > 0) {
          // Find the section that occupies the most viewport space near the top
          // Prefer sections closer to top but with significant visibility
          const bestSection = intersecting.reduce((prev, current) => {
            // Section that's higher in viewport (closer to 0) wins
            // But only if it has reasonable visibility
            if (current.top < SCROLL_CONFIG.SECTION_TOP_MAX && current.top > SCROLL_CONFIG.SECTION_TOP_MIN) {
              if (prev.top < SCROLL_CONFIG.SECTION_TOP_MAX && prev.top > SCROLL_CONFIG.SECTION_TOP_MIN) {
                // Both near top, choose the one higher up
                return current.top > prev.top ? current : prev
              }
              return current
            }
            if (prev.top < SCROLL_CONFIG.SECTION_TOP_MAX && prev.top > SCROLL_CONFIG.SECTION_TOP_MIN) {
              return prev
            }
            // Neither near ideal range, choose based on intersection ratio
            return current.ratio > prev.ratio ? current : prev
          })
          setActiveSection(bestSection.id)
        }
      },
      { 
        threshold: INTERSECTION_CONFIG.NAVIGATION_THRESHOLDS,
        rootMargin: INTERSECTION_CONFIG.ROOT_MARGIN
      }
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <nav 
      className="fixed bottom-6 left-1/2 -translate-x-1/2" 
      style={{ zIndex: Z_INDEX.NAVIGATION }}
      role="navigation"
      aria-label="Page sections navigation"
    >
      <div 
        className={`flex items-center gap-0.5 lg:gap-1 px-2 lg:px-3 py-1.5 lg:py-2 rounded-full bg-background/30 backdrop-blur-2xl border border-border/20 shadow-2xl transition-all duration-500 ${
          showNav ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
      >
        {sections.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className={`
              relative px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-medium transition-all duration-300
              ${
                activeSection === id
                  ? "text-foreground bg-accent/20"
                  : "text-foreground/60 hover:text-foreground hover:bg-accent/10"
              }
            `}
            aria-label={label}
          >
            <span className="hidden lg:inline">{label}</span>
            <span className="lg:hidden text-base">{icon}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
