"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { PortfolioContent } from "@/lib/content/types"
import { useReducedMotion } from "@/hooks/use-runtime"

const SESSION_KEY = "runtime:booted"
const LINE_MS = 190
const HOLD_MS = 260

/**
 * A short boot sequence on first visit.
 *
 * It earns its place by doing real work — the page behind it is mounting and
 * the shader is compiling — and it is deliberately skippable, session-scoped
 * and skipped entirely under reduced motion. A splash you cannot dismiss is a
 * toll booth, not an intro.
 */
export function BootSequence({ content }: { content: PortfolioContent }) {
  const reducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [step, setStep] = useState(0)

  const timers = useRef<number[]>([])
  const lines = content.boot.lines

  const dismiss = useCallback(() => {
    setLeaving(true)
    timers.current.push(
      window.setTimeout(() => {
        setVisible(false)
        document.documentElement.style.removeProperty("overflow")
      }, 620),
    )
  }, [])

  useEffect(() => {
    setMounted(true)

    if (reducedMotion) return
    let alreadyBooted = false
    try {
      alreadyBooted = sessionStorage.getItem(SESSION_KEY) === "1"
    } catch {
      // Private browsing can throw on sessionStorage; treat it as first visit.
    }
    if (alreadyBooted) return

    try {
      sessionStorage.setItem(SESSION_KEY, "1")
    } catch {
      /* not fatal */
    }

    setVisible(true)
    document.documentElement.style.overflow = "hidden"

    lines.forEach((_, i) => {
      timers.current.push(
        window.setTimeout(() => setStep(i + 1), HOLD_MS + i * LINE_MS),
      )
    })
    timers.current.push(
      window.setTimeout(dismiss, HOLD_MS + lines.length * LINE_MS + 340),
    )

    const captured = timers.current
    return () => {
      captured.forEach(window.clearTimeout)
      document.documentElement.style.removeProperty("overflow")
    }
  }, [reducedMotion, lines, dismiss])

  // Never render on the server: the boot state depends on sessionStorage, and
  // a server-rendered overlay would flash for returning visitors.
  if (!mounted || !visible) return null

  const progress = Math.round((step / lines.length) * 100)

  return (
    <div
      role="status"
      aria-live="polite"
      onClick={dismiss}
      className="fixed inset-0 z-[100] flex cursor-pointer flex-col justify-end bg-bg-deep transition-opacity duration-500"
      style={{ opacity: leaving ? 0 : 1 }}
    >
      <div
        className="reticle pointer-events-none absolute inset-0 opacity-25"
        aria-hidden
      />

      <div className="shell relative pb-[14vh]">
        {/* Every line is rendered from the first frame and revealed with
            opacity. Appending them one at a time grew this box by ~24px per
            step, and each growth was a layout shift measured against the page
            underneath — the single largest CLS contributor on the site. */}
        <ol className="mono space-y-1.5 text-fg-dim">
          {lines.map((line, i) => (
            <li
              key={line}
              className="flex items-center gap-3 transition-opacity duration-200"
              style={{ opacity: i < step ? 1 : 0 }}
              aria-hidden={i >= step}
            >
              <span className="text-accent">›</span>
              <span>{line}</span>
              <span
                aria-hidden
                className="inline-block h-3 w-1.5 bg-accent"
                style={{
                  opacity: i === step - 1 ? 1 : 0,
                  animation: "rt-blink 900ms steps(1) infinite",
                }}
              />
            </li>
          ))}
        </ol>

        <div className="mt-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-line">
            {/* Scaled rather than resized: a flat fill looks identical either
                way, and this keeps the boot overlay off the layout path while
                the rest of the page is still hydrating. */}
            <div
              className="h-px w-full origin-left bg-accent transition-transform duration-200 ease-linear"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>
          <span className="mono tnum text-fg-faint">
            {String(progress).padStart(3, "0")}%
          </span>
        </div>

        <p className="mono mt-4 text-fg-faint opacity-70">{content.boot.skip}</p>
      </div>
    </div>
  )
}
