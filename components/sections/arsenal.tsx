"use client"

import { useMemo, useState } from "react"
import type { PortfolioContent } from "@/lib/content/types"
import { Section, delay } from "@/components/ui/primitives"
import { cn } from "@/lib/utils"

const MAX_LEVEL = 5
const MAX_STAGGER = 400
const STAGGER_STEP = 35

export function Arsenal({ content }: { content: PortfolioContent }) {
  const { arsenal } = content
  const [filter, setFilter] = useState<string>("All")

  const items = useMemo(
    () =>
      filter === "All"
        ? arsenal.items
        : arsenal.items.filter((item) => item.category === filter),
    [arsenal.items, filter],
  )

  return (
    <Section
      id="arsenal"
      eyebrow={arsenal.eyebrow}
      title={arsenal.title}
      intro={arsenal.intro}
      aside={
        <span className="mono text-fg-dim">
          <span className="text-accent">{items.length}</span> / {arsenal.items.length}
        </span>
      }
    >
      <div className="mb-8 flex flex-wrap gap-2">
        <FilterButton active={filter === "All"} onClick={() => setFilter("All")}>
          All
        </FilterButton>
        {arsenal.categories.map((category) => (
          <FilterButton
            key={category}
            active={filter === category}
            onClick={() => setFilter(category)}
          >
            {category}
          </FilterButton>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-px bg-line-soft sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item, i) => (
          <div
            key={item.name}
            // Filtered views must land visible immediately — only the initial
            // "All" pass gets the scroll-triggered reveal.
            {...(filter === "All"
              ? { "data-reveal": true, style: delay(Math.min(i * STAGGER_STEP, MAX_STAGGER)) }
              : {})}
            className="group flex min-h-[7.5rem] flex-col justify-between bg-bg p-5 transition-colors duration-200 hover:bg-surface"
          >
            <div>
              <h3 className="text-xl font-medium text-fg transition-colors duration-200 group-hover:text-accent">
                {item.name}
              </h3>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <div className="flex flex-1 gap-1">
                  {Array.from({ length: MAX_LEVEL }, (_, level) => (
                    <div
                      key={level}
                      className={cn(
                        "h-1 flex-1",
                        level < Math.min(item.years, MAX_LEVEL) ? "bg-accent" : "bg-line-soft",
                      )}
                    />
                  ))}
                </div>
                <span className="mono shrink-0 text-fg-faint" title={arsenal.legend}>
                  {item.years}y
                </span>
              </div>
              <p className="mt-3 text-sm text-fg-dim">{item.note}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "mono flex min-h-6 items-center border px-3 py-1.5 transition-colors duration-200",
        active
          ? "border-accent text-accent"
          : "border-line-soft text-fg-dim hover:border-line hover:text-fg",
      )}
    >
      {children}
    </button>
  )
}
