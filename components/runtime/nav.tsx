"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { Locale, PortfolioContent } from "@/lib/content/types"
import { localePath, otherLocale } from "@/lib/content"
import { CommandPalette } from "./command-palette"
import { useActiveSection } from "@/hooks/use-runtime"

/**
 * A thin persistent bar. It hides on the way down and returns on the way up,
 * so the full-bleed sections get the whole viewport without the user ever
 * losing the way out.
 */
export function Nav({
  content,
  locale,
}: {
  content: PortfolioContent
  locale: Locale
}) {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lastY = useRef(0)

  const sectionIds = useMemo(
    () => content.ui.sections.map((s) => s.id),
    [content.ui.sections],
  )
  const active = useActiveSection(sectionIds)
  const activeLabel =
    content.ui.sections.find((s) => s.id === active)?.label ?? ""

  useEffect(() => {
    let frame = 0

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(y > 24)
        // Ignore sub-pixel jitter, and never hide near the very top.
        if (Math.abs(y - lastY.current) > 8) {
          setHidden(y > lastY.current && y > 220)
          lastY.current = y
        }
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{ transform: hidden ? "translateY(-110%)" : "translateY(0)" }}
    >
      <div
        className={`transition-colors duration-300 ${
          scrolled
            ? "border-b border-line-soft/70 bg-bg/80 backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <div className="shell flex items-center justify-between gap-4 py-3">
          <a
            href="#hero"
            className="mono group flex items-center gap-2.5 text-fg"
          >
            <span
              aria-hidden
              className="h-2 w-2 bg-accent transition-transform duration-300 group-hover:rotate-45"
            />
            <span className="hidden sm:inline">{content.identity.name}</span>
            <span className="sm:hidden">NM</span>
          </a>

          {/* Current position — the page is long enough that this matters. */}
          <span
            className="mono hidden text-fg-faint md:block"
            aria-live="polite"
            aria-atomic="true"
          >
            {activeLabel}
          </span>

          <div className="flex items-center gap-2">
            <a
              href={localePath(otherLocale(locale))}
              hrefLang={otherLocale(locale)}
              className="mono border border-line-soft px-2.5 py-2.5 text-fg-dim transition-colors hover:border-accent hover:text-accent"
              aria-label={content.ui.commandPalette.switchLocale}
            >
              {content.ui.localeLabel}
            </a>
            <CommandPalette content={content} locale={locale} />
          </div>
        </div>
      </div>
    </header>
  )
}
