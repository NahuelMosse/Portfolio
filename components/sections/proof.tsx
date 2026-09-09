"use client"

import { useMemo, useState } from "react"
import type { Achievement, PortfolioContent } from "@/lib/content/types"
import { Section, delay } from "@/components/ui/primitives"
import { cn } from "@/lib/utils"

const MAX_STAGGER = 350
const STAGGER_STEP = 30

/** Rarity → visual weight. Legendary is the only one allowed to glow. */
const RARITY: Record<
  Achievement["rarity"],
  { border: string; mark: string; bar: string; width: string; glow?: boolean }
> = {
  common: {
    border: "border-line-soft",
    mark: "text-fg-faint",
    bar: "bg-fg-faint",
    width: "w-[30%]",
  },
  rare: {
    border: "border-data/40",
    mark: "text-data",
    bar: "bg-data",
    width: "w-[55%]",
  },
  epic: {
    border: "border-warn/45",
    mark: "text-warn",
    bar: "bg-warn",
    width: "w-full",
  },
  legendary: {
    border: "border-accent/60",
    mark: "text-accent",
    bar: "bg-accent",
    width: "w-full",
    glow: true,
  },
}

/** Ranks a rarity so the wall opens with the rarest pieces first. */
const RARITY_RANK: Record<Achievement["rarity"], number> = {
  legendary: 0,
  epic: 1,
  rare: 2,
  common: 3,
}

export function Proof({ content }: { content: PortfolioContent }) {
  const { proof } = content
  const [filter, setFilter] = useState<string>("all")

  const items = useMemo(() => {
    const filtered =
      filter === "all" ? proof.items : proof.items.filter((item) => item.kind === filter)
    // Stable sort: rarity first, original array order within the same rarity.
    return filtered
      .map((item, index) => ({ item, index }))
      .sort((a, b) => RARITY_RANK[a.item.rarity] - RARITY_RANK[b.item.rarity] || a.index - b.index)
      .map(({ item }) => item)
  }, [proof.items, filter])

  return (
    <Section
      id="proof"
      eyebrow={proof.eyebrow}
      title={proof.title}
      intro={proof.intro}
      aside={
        <span className="mono text-fg-dim">
          <span className="tnum text-accent">{items.length}</span>{" "}
          <span className="text-fg-faint">/ {proof.items.length}</span>{" "}
          {proof.counterLabel}
        </span>
      }
    >
      <div className="mb-8 flex flex-wrap gap-2">
        {proof.filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "mono flex min-h-6 items-center border px-3 py-1.5 transition-colors duration-200",
              filter === f.id
                ? "border-accent text-accent"
                : "border-line-soft text-fg-dim hover:border-line hover:text-fg",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const rarity = RARITY[item.rarity]
          return (
            <div
              key={item.id}
              // Filtered views must land visible immediately — only the initial
              // "all" pass gets the scroll-triggered reveal.
              {...(filter === "all"
                ? { "data-reveal": true, style: delay(Math.min(i * STAGGER_STEP, MAX_STAGGER)) }
                : {})}
              className={cn(
                "relative overflow-hidden border bg-surface/40 p-4 transition-colors duration-200 hover:bg-surface",
                rarity.border,
                rarity.glow && "shadow-[0_0_24px_-10px_var(--accent)]",
              )}
            >
              <span
                aria-hidden
                className={cn("absolute left-0 top-0 h-0.5", rarity.bar, rarity.width)}
              />

              <div className="mono flex items-baseline justify-between">
                <span className="tnum text-fg-faint">{item.year}</span>
                <span className={rarity.mark}>{item.rarity.toUpperCase()}</span>
              </div>

              <h3 className="mt-3 text-base font-medium leading-snug text-fg">{item.title}</h3>
              <p className="mt-1 text-sm text-fg-dim">{item.issuer}</p>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
