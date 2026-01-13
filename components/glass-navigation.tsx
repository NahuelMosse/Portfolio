"use client"

import { useState, useEffect } from "react"

const sections = [
  { id: "hero", label: "Home", icon: "◆" },
  { id: "origins", label: "Origins", icon: "◈" },
  { id: "education", label: "Education", icon: "◉" },
  { id: "projects", label: "Projects", icon: "◐" },
  { id: "certifications", label: "Achievements", icon: "◊" },
  { id: "present", label: "Present", icon: "◑" },
  { id: "contact", label: "Contact", icon: "◒" },
]

export function GlassNavigation() {
  const [activeSection, setActiveSection] = useState("hero")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { 
        threshold: 0.3,
        rootMargin: "0px"
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
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-1 px-3 py-2 rounded-full bg-background/30 backdrop-blur-2xl border border-border/20 shadow-2xl">
        {sections.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className={`
              relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${
                activeSection === id
                  ? "text-foreground bg-accent/20"
                  : "text-foreground/60 hover:text-foreground hover:bg-accent/10"
              }
            `}
            aria-label={label}
          >
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden text-lg">{icon}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
