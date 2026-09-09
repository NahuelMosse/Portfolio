"use client"

import { useMemo } from "react"
import type { Metric, PortfolioContent } from "@/lib/content/types"
import { Section, delay } from "@/components/ui/primitives"
import { useCountUp, useInView } from "@/hooks/use-runtime"
import { cn } from "@/lib/utils"

export function Telemetry({ content }: { content: PortfolioContent }) {
  const { telemetry } = content

  return (
    <Section
      id="telemetry"
      eyebrow={telemetry.eyebrow}
      title={telemetry.title}
      intro={telemetry.intro}
    >
      {/* gap-px over a line-coloured bed draws the hairline grid for free.
          One metric spans two columns and is typeset larger: six identical
          cells give a reader nothing to hold on to, and letting the widest
          number win by accident makes the hierarchy a typographic coincidence
          rather than a decision. */}
      <div className="grid gap-px bg-line-soft sm:grid-cols-2 lg:grid-cols-3">
        {telemetry.metrics.map((metric, i) => (
          <MetricCell key={metric.id} metric={metric} index={i} />
        ))}
      </div>

      <p className="mono mt-6 max-w-[70ch] text-fg-faint" data-reveal>
        {telemetry.footnote}
      </p>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */

/**
 * Splits "40M+" into 40 and "M+" so the number can count up while the
 * magnitude suffix stays put. Anything unparseable renders verbatim.
 */
function splitValue(value: string): { number: number | null; suffix: string } {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/)
  if (!match) return { number: null, suffix: value }
  return { number: parseFloat(match[1]), suffix: match[2] }
}

function MetricCell({ metric, index }: { metric: Metric; index: number }) {
  const { ref, inView } = useInView<HTMLElement>("-10% 0px")
  const { number, suffix } = useMemo(() => splitValue(metric.value), [metric.value])

  const counted = useCountUp(number ?? 0, inView, 1500)
  const display =
    number === null
      ? metric.value
      : `${Math.round(counted).toLocaleString("en-US")}${suffix}`

  const featured = metric.featured === true

  const body = (
    <>
      <div className="flex items-start justify-between gap-4">
        <span className="mono text-fg-faint">
          {String(index + 1).padStart(2, "0")}
        </span>
        {metric.projectId ? (
          <span
            aria-hidden
            className="mono text-fg-faint transition-colors group-hover:text-accent"
          >
            ↗
          </span>
        ) : null}
      </div>

      <div className="mt-6 flex items-baseline gap-2">
        <span
          className={cn(
            "tnum font-display font-extrabold leading-none tracking-[-0.04em] transition-colors group-hover:text-accent",
            featured
              ? "text-[clamp(3rem,5.5vw,4.75rem)] text-accent"
              : "text-[clamp(2.25rem,3.6vw,3rem)] text-fg",
          )}
          suppressHydrationWarning
        >
          {display}
        </span>
        {metric.unit ? (
          <span
            className={cn("mono pb-1", featured ? "text-fg" : "text-fg-dim")}
          >
            {metric.unit}
          </span>
        ) : null}
      </div>

      <p
        className={cn(
          "mt-3 leading-snug",
          featured ? "max-w-[26ch] text-lg text-fg" : "text-base text-fg-dim",
        )}
      >
        {metric.label}
      </p>

      <div className="flex-1" aria-hidden />

      {metric.shape ? <Sparkline points={metric.shape} active={inView} /> : null}

      <p className="mono mt-4 pt-1 text-fg-faint">{metric.source}</p>
    </>
  )

  // The ref must sit on a real box. An earlier version wrapped this in
  // `display: contents`, which has no layout box at all — IntersectionObserver
  // measured 0×0, never fired, and every counter stayed at zero.
  const className = cn(
    "group relative flex flex-col bg-bg p-6 text-left transition-colors duration-200 hover:bg-surface",
    featured && "sm:col-span-2 sm:p-8",
  )

  if (metric.projectId) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={`#work-${metric.projectId}`}
        data-reveal
        style={delay(Math.min(index * 70, 340))}
        className={className}
      >
        {body}
      </a>
    )
  }

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      data-reveal
      style={delay(Math.min(index * 70, 340))}
      className={className}
    >
      {body}
    </div>
  )
}

/* -------------------------------------------------------------------------- */

/**
 * Shape-only sparkline, rendered as bars.
 *
 * It carries the direction of the change — up and to the right, or down and to
 * the right — and nothing more; these are not sampled series and are never
 * labelled as such.
 *
 * A line stretched to a card's full width across 40px of height flattens into
 * something that reads as a rule, not as data. Bars keep the shape legible at
 * this size and match the instrument-panel vocabulary of the rest of the page.
 */
function Sparkline({ points, active }: { points: number[]; active: boolean }) {
  const bars = useMemo(
    () =>
      points.map((p, i) => ({
        // Floor keeps every bar visible, so a low value reads as low rather
        // than as missing.
        height: Math.max(0.12, p),
        delay: i * 55,
      })),
    [points],
  )

  return (
    <div className="mt-5 flex h-11 items-end gap-[3px]" aria-hidden>
      {bars.map((bar, i) => (
        <span
          key={i}
          className="flex-1 origin-bottom bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            height: `${bar.height * 100}%`,
            transform: active ? "scaleY(1)" : "scaleY(0)",
            transitionDelay: `${bar.delay}ms`,
            opacity: 0.28 + bar.height * 0.62,
          }}
        />
      ))}
    </div>
  )
}
