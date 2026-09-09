"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import type { PortfolioContent, WorkProject } from "@/lib/content/types"
import { SectionHead, Tags, delay } from "@/components/ui/primitives"
import { FlowDiagram } from "@/components/work/flow-diagram"
import { useIsDesktop, useReducedMotion } from "@/hooks/use-runtime"

export function Work({ content }: { content: PortfolioContent }) {
  const { work } = content
  const isDesktop = useIsDesktop()
  const reducedMotion = useReducedMotion()

  const pinned = isDesktop && !reducedMotion
  const [activeIndex, setActiveIndex] = useState(0)

  const sectionRef = useRef<HTMLElement>(null)
  const railRef = useRef<HTMLDivElement>(null)

  /* ---- Horizontal rail (desktop only) --------------------------------- */
  useEffect(() => {
    if (!pinned) return
    const section = sectionRef.current
    const rail = railRef.current
    if (!section || !rail) return

    let cleanup = () => {}
    let cancelled = false

    // GSAP is ~70KB; it only loads for the viewports that actually pin.
    void (async () => {
      const { gsap } = await import("gsap")
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        const distance = () => rail.scrollWidth - window.innerWidth

        gsap.to(rail, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const count = work.projects.length
              // Bias by half a panel so the palette flips at the midpoint of
              // a transition rather than the instant the next one appears.
              const index = Math.min(
                count - 1,
                Math.max(0, Math.round(self.progress * (count - 1))),
              )
              setActiveIndex(index)
            },
          },
        })
      }, section)

      cleanup = () => ctx.revert()
    })()

    return () => {
      cancelled = true
      cleanup()
    }
  }, [pinned, work.projects.length])

  /* ---- Stacked fallback: track the panel nearest the viewport centre ---- */
  useEffect(() => {
    if (pinned) return
    const panels = Array.from(
      document.querySelectorAll<HTMLElement>("[data-work-panel]"),
    )
    if (!panels.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        setActiveIndex(Number(visible.target.getAttribute("data-index")))
      },
      { rootMargin: "-30% 0px -30% 0px", threshold: [0, 0.3, 0.6] },
    )

    panels.forEach((p) => observer.observe(p))
    return () => observer.disconnect()
  }, [pinned])

  // Published as a zone rather than written directly, so the palette
  // controller stays the single writer of `data-palette`.
  const activePalette = work.projects[activeIndex]?.palette ?? "lime"

  return (
    <>
      {/* Intro sits outside the pinned area, so it scrolls normally. */}
      <div className="shell border-t border-line-soft/60 pt-20 md:pt-28">
        <SectionHead
          eyebrow={work.eyebrow}
          title={work.title}
          intro={work.intro}
          aside={
            <span className="mono text-fg-faint">
              {pinned ? work.dragHint : null}
            </span>
          }
        />
      </div>

      <section
        ref={sectionRef}
        id="work"
        data-palette-zone={activePalette}
        className={pinned ? "relative overflow-hidden" : "relative"}
        aria-label={work.title}
      >
        <div
          ref={railRef}
          className={
            pinned
              ? "flex h-[100svh] w-max items-stretch"
              : "flex flex-col"
          }
        >
          {work.projects.map((project, i) => (
            <Panel
              key={project.id}
              project={project}
              index={i}
              total={work.projects.length}
              active={activeIndex === i}
              pinned={pinned}
            />
          ))}
        </div>

        {pinned ? (
          <Progress
            projects={work.projects}
            activeIndex={activeIndex}
          />
        ) : null}
      </section>
    </>
  )
}

/* -------------------------------------------------------------------------- */

function Panel({
  project,
  index,
  total,
  active,
  pinned,
}: {
  project: WorkProject
  index: number
  total: number
  active: boolean
  pinned: boolean
}) {
  return (
    <article
      id={`work-${project.id}`}
      data-work-panel
      data-index={index}
      className={
        pinned
          ? "flex w-screen shrink-0 flex-col justify-center border-l border-line-soft/50 px-[clamp(1.25rem,4vw,4.5rem)]"
          : "border-t border-line-soft/50 py-16 px-[clamp(1.25rem,4vw,4.5rem)] first:border-t-0"
      }
    >
      <div className="mx-auto grid w-full max-w-[88rem] gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        {/* ---- Left: the story ---- */}
        <div className="min-w-0">
          <div className="flex items-center gap-4">
            <span className="mono tnum text-accent">
              {String(index + 1).padStart(2, "0")}
              <span className="text-fg-faint"> / {String(total).padStart(2, "0")}</span>
            </span>
            <span aria-hidden className="h-px flex-1 bg-line-soft" />
            {/* Fixed box, `object-contain` inside.
                With `w-auto` the width is only known once the file decodes, so
                the header row reflowed on every panel as the logos landed. */}
            {project.logo ? (
              <span className="relative block h-5 w-[72px] shrink-0">
                <Image
                  src={project.logo}
                  alt={project.client}
                  fill
                  sizes="72px"
                  className="object-contain object-right opacity-60"
                />
              </span>
            ) : null}
          </div>

          <p className="mono mt-6 text-fg-dim">{project.client}</p>

          <h3 className="display-3 mt-2 max-w-[19ch]">
            {project.title}
          </h3>

          {/* Stacked below lg. Inline, a long role wraps and the next line
              opens with a stranded "· ". */}
          <div className="mono mt-4 flex flex-col gap-1 text-fg-faint lg:flex-row lg:items-center lg:gap-4">
            <span className="text-fg-dim">{project.role}</span>
            <span aria-hidden className="hidden lg:inline">
              ·
            </span>
            <span>{project.period}</span>
          </div>

          <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-fg">
            {project.summary}
          </p>

          <div className="mt-5 max-w-[58ch] space-y-3.5">
            {project.body.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-fg-dim">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-7">
            <Tags items={project.stack} max={pinned ? undefined : 8} />
          </div>
        </div>

        {/* ---- Right: the number and the pipeline ---- */}
        <div className="min-w-0 border-t border-line-soft pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          {/* Two treatments, deliberately unequal.
              A measured number earns display size; a qualitative claim like
              "Cross-team" does not — typeset the same way it out-shouts the
              case study title, which is the thing the panel is actually about.
              Either way it stays below the title's size. */}
          <div className="border-b border-line-soft pb-7">
            {project.headline.kind === "claim" ? (
              <p className="max-w-[18ch] text-[clamp(1.3rem,2vw,1.7rem)] font-medium leading-tight text-accent">
                {project.headline.value}
              </p>
            ) : (
              <p className="tnum font-display text-[clamp(2rem,3.4vw,2.9rem)] font-extrabold leading-none tracking-[-0.04em] text-accent">
                {project.headline.value}
              </p>
            )}
            <p className="mt-3 max-w-[34ch] text-base leading-snug text-fg">
              {project.headline.label}
            </p>
            <p className="mono mt-2.5 text-fg-faint">{project.headline.source}</p>
          </div>

          <div className="pt-8">
            <FlowDiagram
              title={project.flow.title}
              nodes={project.flow.nodes}
              active={active}
            />
          </div>
        </div>
      </div>
    </article>
  )
}

/* -------------------------------------------------------------------------- */

/** Pinned-only progress rail — without it the horizontal scroll feels endless. */
function Progress({
  projects,
  activeIndex,
}: {
  projects: WorkProject[]
  activeIndex: number
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
      <div className="shell flex items-center gap-4 border-t border-line-soft/60 bg-bg/70 py-3 backdrop-blur-sm">
        <ol className="flex flex-1 items-center gap-1.5">
          {projects.map((project, i) => (
            <li key={project.id} className="flex-1">
              <span
                className="block h-0.5 w-full transition-colors duration-500"
                style={{
                  background:
                    i <= activeIndex ? "var(--accent)" : "var(--line-soft)",
                }}
              />
            </li>
          ))}
        </ol>
        <span className="mono tnum shrink-0 text-fg-dim">
          {projects[activeIndex]?.client}
        </span>
      </div>
    </div>
  )
}
