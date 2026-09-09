"use client"

import { useState } from "react"
import type { FlowNode } from "@/lib/content/types"

interface FlowDiagramProps {
  title: string
  nodes: FlowNode[]
  /** Only the visible panel animates — five pulsing diagrams at once is noise. */
  active: boolean
}

/**
 * A pipeline, drawn for this site.
 *
 * These are not screenshots of client systems and never were: each diagram is
 * the shape of a real process — goods through a warehouse, a credit application
 * through review — reduced to the five stages that mattered to the work.
 *
 * The travelling pulse is the point. A static row of boxes says "there was a
 * process"; a pulse says things move through it, end to end.
 */
export function FlowDiagram({ title, nodes, active }: FlowDiagramProps) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="w-full">
      <p className="mono mb-5 text-fg-faint">{title}</p>

      <div className="relative">
        {/* One continuous rail behind every marker, so the pipeline reads as a
            single path rather than five disconnected steps. */}
        <span
          aria-hidden
          className="absolute bottom-4 left-[5px] top-3 w-px overflow-hidden bg-line"
        >
          {active ? (
            // Full-height carrier: `rt-flow` translates by percentages of its
            // own box, so the pulse travels the rail on the compositor.
            <span
              className="absolute inset-0"
              style={{ animation: "rt-flow 3.4s linear infinite" }}
            >
              <span className="absolute left-0 top-0 h-10 w-px bg-accent" />
            </span>
          ) : null}
        </span>

        <ol className="relative space-y-1">
          {nodes.map((node, i) => {
            const isOpen = open === node.id

            return (
              <li key={node.id}>
                <button
                  type="button"
                  className="group flex w-full items-start gap-4 text-left"
                  onMouseEnter={() => setOpen(node.id)}
                  onMouseLeave={() => setOpen(null)}
                  onFocus={() => setOpen(node.id)}
                  onBlur={() => setOpen(null)}
                  onClick={() => setOpen(isOpen ? null : node.id)}
                  aria-expanded={isOpen}
                >
                  <span
                    aria-hidden
                    className={`relative mt-[7px] h-2.5 w-2.5 shrink-0 border transition-colors duration-200 ${
                      isOpen
                        ? "border-accent bg-accent"
                        : "border-fg-faint bg-bg group-hover:border-accent"
                    }`}
                  />

                  <span className="min-w-0 flex-1 pb-4">
                    <span className="flex items-baseline gap-3">
                      <span className="mono text-fg-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`text-base font-medium transition-colors duration-200 ${
                          isOpen ? "text-accent" : "text-fg"
                        }`}
                      >
                        {node.label}
                      </span>
                    </span>

                    {node.detail ? (
                      <span
                        className="grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{
                          gridTemplateRows: isOpen ? "1fr" : "0fr",
                          opacity: isOpen ? 1 : 0,
                        }}
                      >
                        <span className="overflow-hidden">
                          <span className="mt-1.5 block max-w-[42ch] text-sm leading-relaxed text-fg-dim">
                            {node.detail}
                          </span>
                        </span>
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
