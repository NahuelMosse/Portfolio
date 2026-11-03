"use client"

import type { CSSProperties, ReactNode } from "react"
import type { DeviceKind, Piece, Project } from "./content"
import { ShowcaseDevice } from "./showcase-device"
import { BEAT_RUN, BEATS_PER_PROJECT, TURN_RUN, startOf, useGroupTrack } from "./use-group-track"

// The four beats of a project's story, one per step of its hold: what it is, the problem, how it was built, his part.
const BEATS = [
  { label: "What it is", text: (project: Project) => project.what },
  { label: "The problem", text: (project: Project) => project.problem },
  { label: "How it was built", text: (project: Project) => project.line },
  { label: "My role", text: (project: Project) => project.role },
] as const

// One project of a group: its content, the device its screens sit in, and the art drawn on the server where the files are known.
export type GroupItem = { project: Project; kind: DeviceKind; art: ReactNode }

type GroupSceneProps = {
  id: string
  label: string
  noun: string
  line: string
  composition: "a" | "b"
  items: readonly GroupItem[]
}

const numeral = (position: number) => String(position).padStart(2, "0")

// The screen a beat shows: the list walks one step per beat and starts over when it runs out.
const screenAt = (beat: number, count: number) => beat % count

// The device beside the lead one: the pieces of the other frame, or the same screens one step ahead when there are none.
function companion(pieces: readonly Piece[], kind: Piece["frame"], beat: number) {
  const others = pieces.filter((piece) => piece.frame !== kind)
  if (others.length > 0) return { kind: others[0].frame, screens: others, active: screenAt(beat, others.length) }
  const same = pieces.filter((piece) => piece.frame === kind)
  return { kind, screens: same, active: (screenAt(beat, same.length) + 1) % same.length }
}

// A browser project whose phone screens are real ones: on a phone the phone is the hero and the page peeks behind it.
const hasPhoneScreens = (pieces: readonly Piece[]) => pieces.filter((piece) => piece.frame === "phone").length >= 2

type CardProps = { item: GroupItem; order: number; composition: "a" | "b"; current: boolean; reachable: boolean; beat: number }

// A project as one scene of the group: its field, art, word, devices and captions. Its place on the track (--i against --track)
// is what the stylesheet moves; a project that is not the one on show keeps the beat it left at or will open on.
function ProjectCard({ item, order, composition, current, reachable, beat }: CardProps) {
  const { project, kind, art } = item
  const own = project.pieces.filter((piece) => piece.frame === kind)
  const terminal = kind === "terminal"
  const beside = kind === "terminal" ? null : companion(project.pieces, kind, beat)
  const layers = kind === "browser" && hasPhoneScreens(project.pieces) ? "both" : "single"

  return (
    <article
      id={project.id}
      data-project={project.id}
      data-kind={kind}
      data-layers={layers}
      data-composition={composition}
      data-beat={beat}
      data-current={current ? "" : undefined}
      data-reachable={reachable ? "" : undefined}
      className="show group-card"
      style={{ "--beats": 1, "--chars": project.name.length, "--i": order, "--cur": current ? 1 : 0 } as CSSProperties}
    >
      <div data-scene-screen="" className="show-stage">
        <span className="group-field" aria-hidden="true" />
        <div className="show-art">{art}</div>
        <span className="show-light" aria-hidden="true" />
        <p data-poster-word="" className="show-word" aria-hidden="true">
          {project.name}
        </p>
        {beside && <ShowcaseDevice kind={beside.kind} screens={beside.screens} active={beside.active} role="second" />}
        {terminal ? (
          <ShowcaseDevice kind="terminal" panes={project.terminal ?? []} name={project.id} active={screenAt(beat, project.terminal?.length || 1)} role="main" />
        ) : (
          <ShowcaseDevice kind={kind} screens={own} active={screenAt(beat, own.length)} role="main" />
        )}
        <div className="show-copy">
          <h4>{project.name}</h4>
          <div className="show-beats">
            {BEATS.map((entry, step) => (
              <div key={entry.label} className="show-beat" data-on={step === beat ? "" : undefined}>
                <p className="show-label">
                  {numeral(step + 1)} · {entry.label}
                </p>
                <p className="show-text">{entry.text(project)}</p>
                {step === BEATS.length - 1 && (
                  <div className="show-meta">
                    <ul data-stack="" className="stack" aria-label="Stack">
                      {project.stack.map((entry) => (
                        <li key={entry}>{entry}</li>
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
            {BEATS.map((entry, step) => (
              <i key={entry.label} data-on={step <= beat ? "" : undefined} />
            ))}
          </p>
        </div>
      </div>
    </article>
  )
}

// A chapter of projects of one kind as one continuous pinned scene. Each project holds for its four beats, its screens swapping in
// its device; between two projects the scroll turns the scene: the field morphs to the next color, the art crosses over, the word
// and the devices slide out and the next ones come in. The index in the top band follows; it is a shortcut, the scroll alone shows
// every project. With reduced motion the group is its band and then each project as a still.
export function ProjectGroupScene({ id, label, noun, line, composition, items }: GroupSceneProps) {
  const count = items.length
  const { scene, project: current, beat } = useGroupTrack(count)

  const goTo = (position: number) => {
    const node = scene.current
    if (!node) return
    const top = node.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + (node.offsetHeight - window.innerHeight) * startOf(position, count) })
  }

  return (
    <section
      ref={scene}
      id={id}
      data-group={id}
      data-count={count}
      data-composition={composition}
      className="group"
      style={{ "--count": count, "--beat-step": `${BEAT_RUN}svh`, "--turn-step": `${TURN_RUN}svh`, "--steps": BEATS_PER_PROJECT - 1 } as CSSProperties}
    >
      <div className="group-pin">
        <header className="group-head">
          <h3 className="group-word">{label}</h3>
          <p className="group-count">
            {count} {noun}
            {count === 1 ? "" : "s"}
          </p>
          <p className="group-line">{line}</p>
          {count > 1 && (
            <ol className="group-index" aria-label={`${label} projects`}>
              {items.map((item, order) => (
                <li key={item.project.id} data-project={item.project.id} aria-current={order === current ? "step" : undefined}>
                  <button type="button" onClick={() => goTo(order)}>
                    <b>{numeral(order + 1)}</b>
                    <span>{item.project.name}</span>
                  </button>
                </li>
              ))}
            </ol>
          )}
        </header>
        <div className="group-track">
          {items.map((item, order) => {
            const isCurrent = order === current
            const cardBeat = isCurrent ? beat : order < current ? BEATS_PER_PROJECT - 1 : 0
            return (
              <ProjectCard
                key={item.project.id}
                item={item}
                order={order}
                composition={composition}
                current={isCurrent}
                reachable={Math.abs(order - current) <= 1}
                beat={cardBeat}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
