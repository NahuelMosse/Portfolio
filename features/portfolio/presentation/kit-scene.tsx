"use client"

import type { CSSProperties, ReactNode } from "react"
import type { Project } from "./content"
import { ProjectTabs } from "./project-showcase"
import { useScrollBeat } from "./use-scroll-beat"

// The six stations a requirement walks, and the hook that stands guard at each one.
const STATIONS = [
  { id: "card", word: "Card", note: "The request is frozen word for word as a card.", hook: "The card and its log only grow." },
  { id: "questions", word: "Questions", note: "Each doubt is asked once, on the card.", hook: "A second round of questions is refused." },
  { id: "red", word: "Red tests", note: "One failing test per behavior, committed before any code.", hook: "A committed test cannot be edited." },
  { id: "build", word: "Build", note: "Agents write the code until every test passes.", hook: "Production code is written by the builder only." },
  { id: "gate", word: "Gate", note: "The checks run. What did not run is never passed.", hook: "No close without the gate." },
  { id: "pr", word: "PR", note: "The pull request carries the result, and a person reviews it.", hook: "The merge waits for the checks." },
] as const

const TESTS = ["Test 1", "Test 2", "Test 3"]

const numeral = (position: number) => String(position).padStart(2, "0")

// What a test row of the card shows at a station: nothing before the tests exist, failing when they are written,
// passing one by one while the code is built, all passing from the gate on.
function rowState(station: number, row: number) {
  if (station < 2) return "none"
  if (station === 2) return "red"
  if (station === 3) return row < 2 ? "green" : "red"
  return "green"
}

// The card the story follows. It is drawn in code as a UI object on the page, and its content changes at each station.
function TravelCard({ station }: { station: number }) {
  return (
    <div className="kit-card" data-station={STATIONS[station].id}>
      <p className="kit-card-head">
        <span>Card</span>
        <b>PF-1</b>
      </p>
      <p className="kit-card-title" />
      <p className="kit-card-line" />
      <p className="kit-card-line" />
      <span className="kit-ask" data-on={station === 1 ? "" : undefined} aria-hidden="true">
        ?
      </span>
      <ul className="kit-tests" aria-hidden="true">
        {TESTS.map((test, order) => (
          <li key={test} data-state={rowState(station, order)}>
            <i />
            <span>{test}</span>
          </li>
        ))}
      </ul>
      <span className="kit-stamp" data-on={station === 5 ? "" : undefined} aria-hidden="true">
        PR
      </span>
    </div>
  )
}

// The track under the card: the six stations with a hook between each one, and the card's token riding it as the page scrolls.
function Track({ station }: { station: number }) {
  return (
    <ol className="kit-track" aria-label="The path of a requirement">
      {STATIONS.map((entry, order) => (
        <li key={entry.id} data-done={order < station ? "" : undefined} aria-current={order === station ? "step" : undefined}>
          <b>{numeral(order + 1)}</b>
          <span>{entry.word}</span>
        </li>
      ))}
      <i className="kit-token" aria-hidden="true" />
    </ol>
  )
}

type KitSceneProps = { id: string; label: string; project: Project; art: ReactNode }

// The dev kit as a pinned scene: one card travels through the six stations as the page scrolls, and each station shows what the
// method does there and the hook that keeps the agents honest.
export function KitScene({ id, label, project, art }: KitSceneProps) {
  const { scene, beat } = useScrollBeat(STATIONS.length)

  return (
    <section
      ref={scene}
      id={id}
      data-group={id}
      data-project={project.id}
      data-composition="a"
      data-beat={beat}
      className="show kit-show"
      style={{ "--beats": STATIONS.length, "--chars": 7, "--station": beat } as CSSProperties}
    >
      <div data-scene-screen="" className="show-stage">
        {art}
        <span className="show-light" aria-hidden="true" />
        <p data-poster-word="" className="show-word" aria-hidden="true">
          Dev kit
        </p>
        <ProjectTabs label={label} names={["Dev kit"]} current={0} />
        <div className="kit-rig">
          <TravelCard station={beat} />
        </div>
        <Track station={beat} />
        <div className="show-copy">
          <h3 tabIndex={-1}>{project.name}</h3>
          <p className="show-lead">{project.what}</p>
          <div className="show-beats">
            {STATIONS.map((entry, order) => (
              <div key={entry.id} className="show-beat" data-on={order === beat ? "" : undefined}>
                <p className="show-label">
                  {numeral(order + 1)} · {entry.word}
                </p>
                <p data-field={order === 0 ? "line" : undefined} className="show-text">
                  {entry.note}
                </p>
                {order === 0 && <p className="show-text">{project.problem}</p>}
                {order === STATIONS.length - 1 && <p className="show-text">{project.role}</p>}
                <p className="show-hook">
                  <b>Hook</b> {entry.hook}
                </p>
              </div>
            ))}
          </div>
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
        </div>
      </div>
    </section>
  )
}
