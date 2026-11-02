"use client"

import type { CSSProperties, ReactNode } from "react"
import type { Piece, Project, ScreenFrame } from "./content"
import { ShowcaseDevice } from "./showcase-device"
import { screenAt, useScrollBeat } from "./use-scroll-beat"

// The four beats of a project's story, one per stretch of the pin: what it is, the problem, how it was built, his part.
const BEATS = [
  { label: "What it is", text: (project: Project) => project.what },
  { label: "The problem", text: (project: Project) => project.problem },
  { label: "How it was built", text: (project: Project) => project.line },
  { label: "My role", text: (project: Project) => project.role },
] as const

type ShowcaseProps = {
  project: Project
  index: number
  kind: ScreenFrame
  // the backdrop and plate, drawn on the server where the delivered files are known
  art: ReactNode
  word: string
  composition: "a" | "b"
  entries: readonly IndexEntry[]
}

const numeral = (position: number) => String(position).padStart(2, "0")

// The screens of the beside device: the pieces of the other frame, or the same screens one step ahead when there are none.
function companion(pieces: readonly Piece[], kind: ScreenFrame, active: number, beat: number) {
  const others = pieces.filter((piece) => piece.frame !== kind)
  if (others.length > 0) {
    return { kind: others[0].frame, screens: others, active: screenAt(beat, BEATS.length, others.length) }
  }
  const same = pieces.filter((piece) => piece.frame === kind)
  return { kind, screens: same, active: (active + 1) % same.length }
}

// The project index: where the visitor is among the five.
export type IndexEntry = { id: string; label: string }

export function ProjectIndex({ entries, current }: { entries: readonly IndexEntry[]; current: number }) {
  return (
    <ol className="show-index" aria-label="Projects">
      {entries.map((entry, order) => (
        <li key={entry.id} aria-current={order === current ? "step" : undefined}>
          <a href={`#${entry.id}`}>
            <b>{numeral(order + 1)}</b>
            <span>{entry.label}</span>
          </a>
        </li>
      ))}
    </ol>
  )
}

// One project as a pinned scene: the section is tall, its stage sticks, and as the page scrolls the real screens change inside
// one large device standing in the art, while short captions tell the product beat by beat.
export function ProjectShowcase({ project, index, kind, art, word, composition, entries }: ShowcaseProps) {
  const { scene, beat } = useScrollBeat(BEATS.length)
  const own = project.pieces.filter((piece) => piece.frame === kind)
  const active = screenAt(beat, BEATS.length, own.length)
  const beside = companion(project.pieces, kind, active, beat)

  return (
    <section
      ref={scene}
      id={project.id}
      data-project={project.id}
      data-composition={composition}
      data-kind={kind}
      data-beat={beat}
      className="show"
      style={{ "--beats": BEATS.length, "--chars": word.length } as CSSProperties}
    >
      <div data-scene-screen="" className="show-stage">
        {art}
        <span className="show-light" aria-hidden="true" />
        <p data-poster-word="" className="show-word" aria-hidden="true">
          {word}
        </p>
        <ProjectIndex entries={entries} current={index} />
        <ShowcaseDevice kind={beside.kind} screens={beside.screens} active={beside.active} role="second" />
        <ShowcaseDevice kind={kind} screens={own} active={active} role="main" />
        <div className="show-copy">
          <h3 tabIndex={-1}>{project.name}</h3>
          <div className="show-beats">
            {BEATS.map((entry, order) => (
              <div key={entry.label} className="show-beat" data-on={order === beat ? "" : undefined}>
                <p className="show-label">
                  {numeral(order + 1)} · {entry.label}
                </p>
                <p data-field={order === 2 ? "line" : undefined} className="show-text">
                  {entry.text(project)}
                </p>
                {order === BEATS.length - 1 && (
                  <div className="show-meta">
                    <ul data-stack="" className="stack" aria-label="Stack">
                      {project.stack.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    {project.links.map((link) => (
                      <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="show-ticks" aria-hidden="true">
            {BEATS.map((entry, order) => (
              <i key={entry.label} data-on={order <= beat ? "" : undefined} />
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}
