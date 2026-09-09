"use client"

import { useState, type KeyboardEvent } from "react"
import type { PortfolioContent } from "@/lib/content/types"
import { Section, Panel, delay } from "@/components/ui/primitives"
import { cn } from "@/lib/utils"

export function Method({ content }: { content: PortfolioContent }) {
  const { method } = content
  const steps = method.steps
  const [selected, setSelected] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)

  const active = hovered ?? selected
  const step = steps[active]

  const move = (from: number, delta: number) => {
    const next = Math.min(Math.max(from + delta, 0), steps.length - 1)
    setSelected(next)
    const el = document.getElementById(`method-node-${next}`)
    el?.focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault()
      move(index, 1)
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault()
      move(index, -1)
    }
  }

  return (
    <Section id="method" eyebrow={method.eyebrow} title={method.title} intro={method.intro}>
      <div
        className="flex flex-col gap-0 md:flex-row md:items-start"
        onKeyDown={(e) => onKeyDown(e, active)}
      >
        {steps.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              "flex flex-col items-center md:flex-row md:items-start",
              // Only the steps that carry a connector need to stretch; giving
              // the last one flex-1 would push it off-centre.
              i < steps.length - 1 && "md:flex-1",
            )}
          >
            <button
              id={`method-node-${i}`}
              type="button"
              aria-pressed={selected === i}
              aria-label={`Step ${i + 1}: ${s.title}`}
              onClick={() => setSelected(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              className="flex shrink-0 flex-col items-center gap-2.5 px-2 outline-none"
              data-reveal
              style={delay(i * 60)}
            >
              <span
                className={cn(
                  "mono tnum flex h-11 w-11 items-center justify-center border transition-colors duration-200",
                  active === i
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-line-soft text-fg-faint hover:border-line hover:text-fg-dim",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {/* No clamping: a truncated step title reads as a broken layout,
                  and these are the five words the section exists to convey. */}
              <span
                className={cn(
                  "mono max-w-[16ch] text-balance text-center leading-relaxed",
                  active === i ? "text-accent" : "text-fg-faint",
                )}
              >
                {s.title}
              </span>
            </button>

            {i < steps.length - 1 ? (
              <span
                aria-hidden
                className={cn(
                  "bg-line-soft transition-colors duration-300",
                  "h-8 w-px md:mt-[22px] md:h-px md:w-auto md:min-w-4 md:flex-1 md:self-start",
                  i < active && "bg-accent",
                )}
              />
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-12 md:mt-16">
        <span className="mono text-fg-faint">
          {`${String(active + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`}
        </span>

        <Panel
          key={step.id}
          className="mt-4 p-8"
          style={{ animation: "rt-fade-in 420ms var(--ease-out)" }}
        >
          <h3 className="text-2xl">{step.title}</h3>
          <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-fg-dim">{step.body}</p>
        </Panel>
      </div>

      <p className="mt-12 max-w-[62ch] text-lg text-fg-dim" data-reveal>
        {method.outro}
      </p>
    </Section>
  )
}
