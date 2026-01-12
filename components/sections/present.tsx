"use client"

import { useEffect, useRef, useState } from "react"

export function Present() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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
      ref={sectionRef}
      className="snap-section min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 py-24"
    >
      <div
        className={`max-w-4xl mx-auto space-y-12 transition-all duration-1000 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Present & Direction
          </h2>
          <div className="w-24 h-1 bg-primary/40 rounded-full" />
        </div>

        <div className="space-y-8 text-lg md:text-xl leading-relaxed text-foreground/80">
          <p className="text-pretty">
            Today, I'm focused on building software that scales—not just technically, but in terms of impact. I'm drawn
            to projects that require deep technical thinking, thoughtful architecture, and attention to both the
            engineering and the end-user experience.
          </p>

          <p className="text-pretty">I'm particularly interested in:</p>

          <ul className="space-y-4 pl-6 border-l-2 border-primary/30">
            <li className="text-pretty">
              <strong className="text-foreground">Distributed systems</strong> that solve complex coordination and
              scalability challenges
            </li>
            <li className="text-pretty">
              <strong className="text-foreground">Developer tooling</strong> that improves workflows and empowers other
              engineers
            </li>
            <li className="text-pretty">
              <strong className="text-foreground">Performance optimization</strong> where milliseconds matter and user
              experience is paramount
            </li>
            <li className="text-pretty">
              <strong className="text-foreground">Systems architecture</strong> that balances technical excellence with
              pragmatic delivery
            </li>
          </ul>

          <p className="text-pretty pt-4">
            I'm looking for opportunities to work with teams that value craftsmanship, continuous improvement, and
            building products that stand the test of time. I want to contribute to meaningful work, collaborate with
            talented engineers, and continue growing as a professional.
          </p>
        </div>
      </div>
    </section>
  )
}
