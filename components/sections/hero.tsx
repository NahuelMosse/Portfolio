"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import type { PortfolioContent } from "@/lib/content/types"
import { useIsDesktop, useReducedMotion, useZonedTime } from "@/hooks/use-runtime"

/** WebGL never reaches the server, and never blocks first paint. */
const FieldCanvas = dynamic(() => import("@/components/hero/field-canvas"), {
  ssr: false,
})

export function Hero({ content }: { content: PortfolioContent }) {
  const { hero, identity } = content
  const isDesktop = useIsDesktop()
  const reducedMotion = useReducedMotion()
  const time = useZonedTime(identity.timezone)

  const sectionRef = useRef<HTMLElement>(null)
  const [offScreen, setOffScreen] = useState(false)

  // The shader is expensive; stop it the moment the hero leaves the viewport.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setOffScreen(!entry.isIntersecting),
      { rootMargin: "10% 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const showShader = isDesktop && !reducedMotion

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden"
    >
      {/* Background ---------------------------------------------------- */}
      {showShader ? (
        <FieldCanvas paused={offScreen} />
      ) : (
        <StaticField />
      )}

      {/* Legibility scrim.
          The field is busiest exactly where the copy sits, so this darkens the
          left column and the bottom edge. Two soft gradients rather than one
          flat overlay: the shader stays visible, the text stays readable. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: `
            linear-gradient(100deg,
              color-mix(in oklab, var(--bg-deep) 92%, transparent) 0%,
              color-mix(in oklab, var(--bg-deep) 74%, transparent) 34%,
              transparent 68%),
            linear-gradient(0deg,
              color-mix(in oklab, var(--bg-deep) 88%, transparent) 0%,
              transparent 26%),
            linear-gradient(180deg,
              color-mix(in oklab, var(--bg-deep) 72%, transparent) 0%,
              transparent 18%)
          `,
        }}
      />

      {/* Top HUD — sits below the fixed nav, not under it. */}
      <header className="relative z-10 shell flex items-start justify-between pt-20 md:pt-24">
        <div className="mono flex items-center gap-2.5 text-fg-dim">
          <CornerTick />
          <span>{hero.eyebrow}</span>
        </div>

        <div className="mono flex items-center gap-2.5 text-fg-dim">
          <span className="tnum" suppressHydrationWarning>
            {time || "--:--"} <span className="text-fg-faint">BA</span>
          </span>
          <CornerTick align="right" />
        </div>
      </header>

      {/* Headline ------------------------------------------------------ */}
      <div className="relative z-10 shell flex-1 flex flex-col justify-center py-10">
        <h1 className="display text-fg">
          {hero.headline.map((line, i) => (
            <span
              key={line}
              data-reveal="rise"
              style={{ "--reveal-delay": `${200 + i * 140}ms` } as React.CSSProperties}
              className="block"
            >
              <span>{line}</span>
            </span>
          ))}
        </h1>

        <div
          className="mt-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
          data-reveal
          style={{ "--reveal-delay": "520ms" } as React.CSSProperties}
        >
          {/* The lede sits on its own reading plate.
              Contrast is fine on its own, but the shader's contour strokes are
              the same weight as the letterforms and they move, so the text and
              the field compete as figure. The plate settles that, and matches
              the treatment the role badge already has. */}
          <p className="max-w-[46ch] border-l border-accent/40 bg-bg-deep/55 py-2 pl-5 text-lg leading-relaxed text-fg-dim backdrop-blur-[3px]">
            {hero.statement}
          </p>

          {/* Its own backdrop: this sits over the brightest part of the field. */}
          <div className="mono shrink-0 border border-line-soft/60 bg-bg-deep/70 px-4 py-3 text-fg-faint backdrop-blur-sm md:text-right">
            <span className="block text-accent">{identity.role}</span>
            <span className="mt-1 block">{identity.availability}</span>
          </div>
        </div>
      </div>

      {/* Ticker + scroll cue ------------------------------------------- */}
      <footer className="relative z-10 border-t border-line-soft/60">
        <Ticker items={hero.ticker} paused={reducedMotion} />
        <div className="shell flex items-center justify-between py-3">
          <span className="mono text-fg-faint">{hero.paletteHint}</span>
          <span className="mono flex items-center gap-2 text-fg-dim">
            {hero.scrollCue}
            <span
              aria-hidden
              className="inline-block h-3 w-px bg-accent"
              style={{ animation: "rt-blink 1.6s steps(1) infinite" }}
            />
          </span>
        </div>
      </footer>
    </section>
  )
}

/* -------------------------------------------------------------------------- */

/** Mobile and reduced-motion fallback: the same visual language, in CSS. */
function StaticField() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 bg-bg-deep">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: `
            radial-gradient(90% 60% at 78% 18%, color-mix(in oklab, var(--accent) 16%, transparent) 0%, transparent 58%),
            radial-gradient(70% 50% at 15% 82%, color-mix(in oklab, var(--data) 12%, transparent) 0%, transparent 60%),
            linear-gradient(180deg, var(--bg-deep) 0%, var(--bg) 100%)
          `,
        }}
      />
      <div
        className="reticle absolute inset-0 opacity-[0.35]"
        style={{
          maskImage:
            "radial-gradient(100% 80% at 50% 40%, black 10%, transparent 78%)",
        }}
      />
    </div>
  )
}

/** Corner registration mark — the frame of an instrument, not a decoration. */
function CornerTick({ align = "left" }: { align?: "left" | "right" }) {
  return (
    <span
      aria-hidden
      className={`block h-2.5 w-4 shrink-0 border-accent/70 ${
        align === "left" ? "border-l border-t" : "border-r border-t"
      }`}
    />
  )
}

/**
 * Marquee of headline numbers. The list is rendered twice and translated by
 * exactly -50%, which is what makes the loop seamless.
 */
function Ticker({ items, paused }: { items: string[]; paused: boolean }) {
  return (
    <div
      className="relative overflow-hidden border-b border-line-soft/60 py-2.5"
      // Fades the cut edges so entries don't appear to be sliced mid-word.
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0, black 4rem, black calc(100% - 4rem), transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0, black 4rem, black calc(100% - 4rem), transparent 100%)",
      }}
    >
      <div
        className="flex w-max"
        style={
          paused
            ? undefined
            : { animation: "rt-ticker 42s linear infinite" }
        }
      >
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {items.map((item) => (
              <li
                key={item}
                className="mono flex items-center gap-4 whitespace-nowrap px-5 text-fg-dim"
              >
                <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
