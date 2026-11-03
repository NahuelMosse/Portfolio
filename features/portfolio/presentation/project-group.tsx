"use client"

import type { CSSProperties, ReactNode } from "react"
import type { Piece, Project, ScreenFrame } from "./content"
import { ShowcaseDevice } from "./showcase-device"
import { useGroupTrack } from "./use-group-track"

// One project of a group: its content, the device its screens sit in, and the art drawn on the server where the files are known.
export type GroupItem = { project: Project; kind: ScreenFrame; art: ReactNode }

type GroupSceneProps = {
  id: string
  label: string
  noun: string
  line: string
  composition: "a" | "b"
  items: readonly GroupItem[]
}

// The screens of the beside device: the pieces of the other frame, or the next screen of the same one when there are none.
function companion(pieces: readonly Piece[], kind: ScreenFrame) {
  const others = pieces.filter((piece) => piece.frame !== kind)
  if (others.length > 0) return { kind: others[0].frame, screens: others, active: 0 }
  const same = pieces.filter((piece) => piece.frame === kind)
  return { kind, screens: same, active: same.length > 1 ? 1 : 0 }
}

type CardProps = { item: GroupItem; order: number; composition: "a" | "b"; reachable: boolean }

// A project as a poster: its field, its art, its name, its real screens, one line and its links. In the pinned group it is one stop
// of the track; stacked, it is a poster of its own.
function ProjectCard({ item, order, composition, reachable }: CardProps) {
  const { project, kind, art } = item
  const own = project.pieces.filter((piece) => piece.frame === kind)
  const beside = companion(project.pieces, kind)

  return (
    <article
      id={project.id}
      data-project={project.id}
      data-kind={kind}
      data-composition={composition}
      data-reachable={reachable ? "" : undefined}
      className="show group-card"
      style={{ "--beats": 1, "--chars": project.name.length, "--i": order } as CSSProperties}
    >
      <div data-scene-screen="" className="show-stage">
        <div className="show-art">{art}</div>
        <span className="show-light" aria-hidden="true" />
        <p data-poster-word="" className="show-word" aria-hidden="true">
          {project.name}
        </p>
        <ShowcaseDevice kind={beside.kind} screens={beside.screens} active={beside.active} role="second" />
        <ShowcaseDevice kind={kind} screens={own} active={0} role="main" />
        <div className="show-copy">
          <h4>{project.name}</h4>
          <div className="show-beats">
            <div className="show-beat" data-on="">
              <p className="show-text">{project.what}</p>
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
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

// A chapter of projects of one kind. Wide, it is one pinned scene: the headline stays on one side while the scroll carries the
// projects across the device showcase, one stop each. Narrow, or with reduced motion, it is the headline and then each project
// stacked as a poster. The index of the pinned scene is a shortcut; the scroll alone shows every project.
export function ProjectGroupScene({ id, label, noun, line, composition, items }: GroupSceneProps) {
  const count = items.length
  const { scene, nearest } = useGroupTrack(count)

  const goTo = (position: number) => {
    const node = scene.current
    if (!node) return
    const top = node.getBoundingClientRect().top + window.scrollY
    const run = node.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + (run * position) / Math.max(1, count - 1) })
  }

  return (
    <section
      ref={scene}
      id={id}
      data-group={id}
      data-count={count}
      data-composition={composition}
      className="group"
      style={{ "--count": count, "--chars": label.length } as CSSProperties}
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
                <li key={item.project.id} aria-current={order === nearest ? "step" : undefined}>
                  <button type="button" onClick={() => goTo(order)}>
                    <b>{String(order + 1).padStart(2, "0")}</b>
                    <span>{item.project.name}</span>
                  </button>
                </li>
              ))}
            </ol>
          )}
        </header>
        <div className="group-track">
          {items.map((item, order) => (
            <ProjectCard key={item.project.id} item={item} order={order} composition={composition} reachable={Math.abs(order - nearest) <= 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
