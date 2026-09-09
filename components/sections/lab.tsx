"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import type { LabProject, PortfolioContent, SmallProject } from "@/lib/content/types"
import { Link, SectionHead, Tags, delay } from "@/components/ui/primitives"
import { PaletteZone } from "@/components/runtime/palette-zone"
import { useReducedMotion } from "@/hooks/use-runtime"

export function Lab({ content }: { content: PortfolioContent }) {
  const { lab } = content
  const [grit, sddKit] = lab.projects

  return (
    <section id="lab" className="border-t border-line-soft/60">
      <div className="shell pt-20 md:pt-28">
        <SectionHead eyebrow={lab.eyebrow} title={lab.title} intro={lab.intro} />
      </div>

      {/* Grit takes the whole page with it — cream paper, hard black, electric
          blue. After eight screens of dark instrument panel, the inversion is
          the point. */}
      {grit ? (
        <PaletteZone palette={grit.palette}>
          <GritShowcase project={grit} />
        </PaletteZone>
      ) : null}

      {sddKit ? (
        <PaletteZone palette={sddKit.palette}>
          <KitShowcase project={sddKit} />
        </PaletteZone>
      ) : null}

      <div className="shell pb-20 pt-16 md:pb-28">
        <h3 className="mono mb-6 text-fg-faint">{lab.smallTitle}</h3>
        <div className="grid gap-px bg-line-soft sm:grid-cols-2 lg:grid-cols-3">
          {lab.small.map((project, i) => (
            <SmallCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Grit                                                                        */
/* -------------------------------------------------------------------------- */

const GRIT_SHOTS = [
  { src: "/lab/grit/today.png", key: "today" },
  { src: "/lab/grit/appearance.png", key: "appearance" },
]

function GritShowcase({ project }: { project: LabProject }) {
  const [shot, setShot] = useState(0)
  const reducedMotion = useReducedMotion()
  const deviceRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  // Nothing below this point is worth doing while the block is off-screen:
  // neither the parallax write nor the screenshot swap can be perceived.
  useEffect(() => {
    const el = deviceRef.current
    if (!el || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "20% 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Gentle parallax on the device as the block scrolls past.
  useEffect(() => {
    if (reducedMotion || !inView) return
    const el = deviceRef.current
    if (!el) return

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const progress = (rect.top + rect.height / 2) / window.innerHeight - 0.5
        el.style.transform = `translate3d(0, ${(-progress * 46).toFixed(1)}px, 0)`
      })
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [reducedMotion, inView])

  // Rotate the screenshot on a slow loop, pausing for reduced motion.
  useEffect(() => {
    if (reducedMotion || !inView || GRIT_SHOTS.length < 2) return
    const id = window.setInterval(
      () => setShot((s) => (s + 1) % GRIT_SHOTS.length),
      5200,
    )
    return () => window.clearInterval(id)
  }, [reducedMotion, inView])

  return (
    <div id="grit" className="relative overflow-hidden bg-bg pb-16 pt-16 md:pb-24 md:pt-12">
      <div className="shell grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-20">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="h-3 w-3 bg-accent"
              style={{ boxShadow: "3px 3px 0 var(--fg)" }}
            />
            <span className="mono text-fg-dim">local-first</span>
          </div>

          <h3
            className="display-2 mt-5 font-extrabold text-fg"
            data-reveal
          >
            {project.title}
          </h3>

          <p
            className="mt-5 max-w-[40ch] text-xl leading-snug text-fg"
            data-reveal
            style={delay(90)}
          >
            {project.tagline}
          </p>

          <div className="mt-7 max-w-[58ch] space-y-4" data-reveal style={delay(150)}>
            {project.body.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-fg-dim">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Hard-shadow stat blocks: the app's own neubrutalist vocabulary,
              borrowed so the section feels like the product it describes. */}
          <ul className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {project.stats.map((stat, i) => (
              <li
                key={stat.label}
                className="border-2 border-fg bg-surface p-3"
                data-reveal
                style={{ boxShadow: "4px 4px 0 var(--fg)", ...delay(200 + i * 60) }}
              >
                <span className="tnum block font-display text-xl font-extrabold leading-none text-fg">
                  {stat.value}
                </span>
                <span className="mono mt-1.5 block text-fg-dim">{stat.label}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Tags items={project.stack} />
          </div>
        </div>

        {/* ---- Device ---- */}
        <div
          ref={deviceRef}
          className="mx-auto w-full max-w-[290px] will-change-transform lg:sticky lg:top-24"
        >
          <div
            className="relative overflow-hidden rounded-[2.2rem] border-[3px] border-fg bg-fg p-2"
            style={{ boxShadow: "10px 10px 0 var(--accent)" }}
          >
            <div className="relative aspect-[1080/2340] overflow-hidden rounded-[1.6rem] bg-surface">
              {GRIT_SHOTS.map((image, i) => (
                <Image
                  key={image.key}
                  src={image.src}
                  alt={`Grit — ${image.key}`}
                  fill
                  sizes="290px"
                  priority={i === 0}
                  className="object-cover transition-opacity duration-700"
                  style={{ opacity: shot === i ? 1 : 0 }}
                />
              ))}
            </div>
          </div>

          {GRIT_SHOTS.length > 1 ? (
            <div className="mt-4 flex justify-center gap-2">
              {GRIT_SHOTS.map((image, i) => (
                <button
                  key={image.key}
                  type="button"
                  onClick={() => setShot(i)}
                  aria-label={`Screen ${i + 1}`}
                  aria-pressed={shot === i}
                  // Padding + negative margin grows the hit area to the WCAG
                  // 24px minimum without enlarging the visible dot.
                  className="group -m-2.5 p-2.5"
                >
                  <span
                    aria-hidden
                    className={`block h-1.5 w-8 border border-fg transition-colors ${
                      shot === i ? "bg-accent" : "bg-transparent group-hover:bg-fg/20"
                    }`}
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* SDD Kit                                                                     */
/* -------------------------------------------------------------------------- */

function KitShowcase({ project }: { project: LabProject }) {
  return (
    <div className="border-t border-line-soft/60 bg-bg py-20 md:py-24">
      <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <h3
            className="display-3 text-fg"
            data-reveal
          >
            {project.title}
          </h3>
          <p
            className="mt-4 max-w-[34ch] text-lg leading-snug text-accent"
            data-reveal
            style={delay(80)}
          >
            {project.tagline}
          </p>

          <ul className="mt-8 divide-y divide-line-soft border-y border-line-soft">
            {project.stats.map((stat) => (
              <li
                key={stat.label}
                className="flex items-baseline justify-between gap-4 py-3"
              >
                <span className="mono text-fg-faint">{stat.label}</span>
                <span className="tnum font-display text-2xl font-bold text-fg">
                  {stat.value}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-7">
            <Tags items={project.stack} />
          </div>
        </div>

        <div className="space-y-5" data-reveal style={delay(120)}>
          {project.body.map((paragraph, i) => (
            <p key={i} className="max-w-[60ch] text-lg leading-relaxed text-fg-dim">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Small projects                                                              */
/* -------------------------------------------------------------------------- */

function SmallCard({ project, index }: { project: SmallProject; index: number }) {
  return (
    <article
      className="group flex flex-col bg-bg p-5 transition-colors duration-200 hover:bg-surface"
      data-reveal
      style={delay(Math.min(index * 60, 300))}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h4 className="text-lg font-medium text-fg transition-colors group-hover:text-accent">
          {project.title}
        </h4>
        <span className="mono tnum shrink-0 text-fg-faint">{project.year}</span>
      </div>

      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-fg-dim">
        {project.description}
      </p>

      <div className="mt-4">
        <Tags items={project.stack} max={4} />
      </div>

      <div className="mono mt-4 flex gap-4">
        {project.repo ? (
          <Link href={project.repo} external>
            repo
          </Link>
        ) : null}
        {project.demo ? (
          <Link href={project.demo} external>
            live
          </Link>
        ) : null}
      </div>
    </article>
  )
}
