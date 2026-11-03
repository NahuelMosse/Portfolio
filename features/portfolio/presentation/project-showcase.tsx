"use client"

import { useState } from "react"
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

// One project of a group: its content, the device its screens sit in, and the art drawn on the server where the files are known.
export type GroupItem = { project: Project; kind: ScreenFrame; word: string; art: ReactNode }

type GroupSceneProps = {
  id: string
  label: string
  composition: "a" | "b"
  items: readonly GroupItem[]
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

type TabsProps = { label: string; names: readonly string[]; current: number; onPick?: (position: number) => void }

// The strip of a chapter: its kind, and one tab per project in it. Only clicks pick a project.
export function ProjectTabs({ label, names, current, onPick }: TabsProps) {
  return (
    <ol className="show-index" aria-label={`${label} projects`}>
      <li className="show-kind" aria-hidden="true">
        {label}
      </li>
      {names.map((name, order) => (
        <li key={name} aria-current={order === current ? "step" : undefined}>
          <button type="button" aria-pressed={order === current} onClick={() => onPick?.(order)}>
            <b>{numeral(order + 1)}</b>
            <span>{name}</span>
          </button>
        </li>
      ))}
    </ol>
  )
}

// A chapter of projects of one kind as one pinned scene: the section is short, its stage sticks, and the scroll walks the beats of the
// project on show while its real screens change inside one large device standing in the art. A click on a tab swaps the project.
export function ProjectGroupScene({ id, label, composition, items }: GroupSceneProps) {
  const [picked, setPicked] = useState(0)
  const { scene, beat } = useScrollBeat(BEATS.length)
  const { project, kind, word, art } = items[picked]
  const own = project.pieces.filter((piece) => piece.frame === kind)
  const active = screenAt(beat, BEATS.length, own.length)
  const beside = companion(project.pieces, kind, active, beat)

  return (
    <section
      ref={scene}
      id={id}
      data-group={id}
      data-project={project.id}
      data-composition={composition}
      data-kind={kind}
      data-beat={beat}
      className="show"
      style={{ "--beats": BEATS.length, "--chars": word.length } as CSSProperties}
    >
      <div data-scene-screen="" className="show-stage">
        <div key={project.id} className="show-art">
          {art}
        </div>
        <span className="show-light" aria-hidden="true" />
        <p data-poster-word="" className="show-word" aria-hidden="true">
          {word}
        </p>
        <ProjectTabs label={label} names={items.map((item) => item.word)} current={picked} onPick={setPicked} />
        <ShowcaseDevice key={`${project.id}-second`} kind={beside.kind} screens={beside.screens} active={beside.active} role="second" />
        <ShowcaseDevice key={`${project.id}-main`} kind={kind} screens={own} active={active} role="main" />
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
