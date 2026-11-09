"use client"

import { useEffect, useRef, useState } from "react"

// The scroll through a group is one timeline in "runs": each project holds for HOLD_BEATS steps of one run (its beats, its screens
// swapping) and then the group turns to the next project over TURN runs. The CSS height of the section is built from the same
// numbers, so the progress maps onto the timeline exactly.
export const BEATS_PER_PROJECT = 3
export const BEAT_RUN = 18
export const TURN_RUN = 34

const HOLD = (BEATS_PER_PROJECT - 1) * BEAT_RUN
const STRIDE = HOLD + TURN_RUN

const smooth = (x: number) => x * x * (3 - 2 * x)

export type GroupMoment = {
  // Where the track stands, in projects: whole numbers rest on a project, in between the group is turning.
  track: number
  // The project on show and the beat of its story that is on; the turn hands both over halfway.
  project: number
  beat: number
  // How far through its hold the project on show is (0 to 1); a turn is held at its edge.
  hold: number
}

const totalRuns = (count: number) => count * HOLD + (count - 1) * TURN_RUN

// The progress (0 to 1) of the scroll at which a project starts its hold.
export function startOf(project: number, count: number) {
  return count < 2 ? 0 : (project * STRIDE) / totalRuns(count)
}

export function momentAt(progress: number, count: number): GroupMoment {
  const at = Math.min(1, Math.max(0, progress)) * totalRuns(count)
  const project = Math.min(count - 1, Math.floor(at / STRIDE))
  const within = at - project * STRIDE
  if (within <= HOLD || project === count - 1) {
    const held = Math.min(within, HOLD)
    return { track: project, project, beat: Math.round(held / BEAT_RUN), hold: held / HOLD }
  }
  const turn = (within - HOLD) / TURN_RUN
  const handed = turn >= 0.5
  return {
    track: project + smooth(turn),
    project: handed ? project + 1 : project,
    beat: handed ? 0 : BEATS_PER_PROJECT - 1,
    hold: handed ? 0 : 1,
  }
}

// A group is a tall section with one pinned stage. The track and the hold go to the section as the CSS variables --track and --hold,
// so every layer moves with the scroll without a render per frame; only the project and the beat on show are state.
export function useGroupTrack(count: number) {
  const scene = useRef<HTMLElement>(null)
  const [shown, setShown] = useState({ project: 0, beat: 0 })

  useEffect(() => {
    const node = scene.current
    if (!node) return
    let frame = 0

    const measure = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      const run = rect.height - window.innerHeight
      const progress = run > 0 ? -rect.top / run : 0
      const moment = momentAt(progress, count)
      node.style.setProperty("--track", moment.track.toFixed(4))
      node.style.setProperty("--hold", moment.hold.toFixed(4))
      setShown((last) => (last.project === moment.project && last.beat === moment.beat ? last : { project: moment.project, beat: moment.beat }))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [count])

  return { scene, project: shown.project, beat: shown.beat }
}
