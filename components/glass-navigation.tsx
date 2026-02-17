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
  const [isMobile, setIsMobile] = useState(false)
  const hasShownRef = useRef(false)

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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
    if (isMobile) {
      // Mobile: Use scroll-based detection (more reliable)
      const handleScroll = () => {
        const scrollPosition = window.scrollY + window.innerHeight / 3

        // Find which section we're in based on scroll position
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = document.getElementById(sections[i].id)
          if (section) {
            const rect = section.getBoundingClientRect()
            const sectionTop = window.scrollY + rect.top

            if (scrollPosition >= sectionTop) {
              setActiveSection(sections[i].id)
              break
            }
          }
        }
      }

      handleScroll() // Initial call
      window.addEventListener("scroll", handleScroll, { passive: true })

      return () => {
        window.removeEventListener("scroll", handleScroll)
      }
    } else {
      // Desktop: Use IntersectionObserver
      const observer = new IntersectionObserver(
        (entries) => {
          const intersecting = entries
            .filter(entry => entry.isIntersecting && entry.intersectionRatio > 0)
            .map(entry => ({
              id: entry.target.id,
              top: entry.boundingClientRect.top,
              bottom: entry.boundingClientRect.bottom,
              ratio: entry.intersectionRatio
            }))

          if (intersecting.length > 0) {
            const visibleSections = intersecting.filter(section => section.ratio > 0.05)

            if (visibleSections.length > 0) {
              const bestSection = visibleSections.reduce((prev, current) => {
                const prevDistance = Math.abs(prev.top)
                const currentDistance = Math.abs(current.top)

                if (currentDistance < prevDistance) {
                  return current
                }
                if (currentDistance === prevDistance && current.ratio > prev.ratio) {
                  return current
                }
                return prev
              })
              setActiveSection(bestSection.id)
            }
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
    }
  }, [isMobile])

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
