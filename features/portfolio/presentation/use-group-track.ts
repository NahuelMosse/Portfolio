"use client"

import { useEffect, useRef, useState } from "react"
import { smoothScroll } from "@/features/film/presentation/motion-engine"

// The scroll through a group is one timeline in "runs": each project holds for HOLD_BEATS steps of one run (its beats, its screens
// swapping) and then the group turns to the next project over TURN runs. The CSS height of the section is built from the same
// numbers, so the progress maps onto the timeline exactly.
export const BEATS_PER_PROJECT = 3
export const BEAT_RUN = 18
export const TURN_RUN = 34

const holdOf = (beats: number) => (beats - 1) * BEAT_RUN
const strideOf = (beats: number) => holdOf(beats) + TURN_RUN

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

const totalRuns = (count: number, beats: number) => count * holdOf(beats) + (count - 1) * TURN_RUN

// The progress (0 to 1) of the scroll at which a project starts its hold.
export function startOf(project: number, count: number, beats = BEATS_PER_PROJECT) {
  return count < 2 ? 0 : (project * strideOf(beats)) / totalRuns(count, beats)
}

export function momentAt(progress: number, count: number, beats = BEATS_PER_PROJECT): GroupMoment {
  const hold = holdOf(beats)
  const stride = strideOf(beats)
  const at = Math.min(1, Math.max(0, progress)) * totalRuns(count, beats)
  const project = Math.min(count - 1, Math.floor(at / stride))
  const within = at - project * stride
  if (within <= hold || project === count - 1) {
    const held = Math.min(within, hold)
    return { track: project, project, beat: Math.round(held / BEAT_RUN), hold: held / hold }
  }
  const turn = (within - hold) / TURN_RUN
  const handed = turn >= 0.5
  return {
    track: project + smooth(turn),
    project: handed ? project + 1 : project,
    beat: handed ? 0 : beats - 1,
    hold: handed ? 0 : 1,
  }
}

// Where a narrow screen comes to rest: a scroll that stops in the middle of a turn goes on to the nearer project, so the screen
// never holds two. Returns the progress to settle at, or null when the group is on a hold or out of view.
export function settleAt(progress: number, count: number, beats = BEATS_PER_PROJECT): number | null {
  if (progress <= 0 || progress >= 1) return null
  const stride = strideOf(beats)
  const total = totalRuns(count, beats)
  const at = progress * total
  const project = Math.min(count - 1, Math.floor(at / stride))
  const within = at - project * stride
  if (project === count - 1 || within <= holdOf(beats)) return null
  const edge = (within - holdOf(beats)) / TURN_RUN < 0.5 ? project * stride + holdOf(beats) : (project + 1) * stride
  return edge / total
}

const NARROW = "(max-width: 1099px)"
const IDLE_MS = 140

// A group is a tall section with one pinned stage. The track and the hold go to the section as the CSS variables --track and --hold,
// so every layer moves with the scroll without a render per frame; only the project and the beat on show are state.
// A section rendered on the server has no ref to hand over: it passes the selector of its host and the beats it holds for.
export function useGroupTrack(count: number, { beats = BEATS_PER_PROJECT, host }: { beats?: number; host?: string } = {}) {
  const scene = useRef<HTMLElement>(null)
  const [shown, setShown] = useState({ project: 0, beat: 0 })

  useEffect(() => {
    const node = scene.current ?? (host ? document.querySelector<HTMLElement>(host) : null)
    if (!node) return
    let frame = 0

    const measure = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      const run = rect.height - window.innerHeight
      const progress = run > 0 ? -rect.top / run : 0
      const moment = momentAt(progress, count, beats)
      node.style.setProperty("--track", moment.track.toFixed(4))
      node.style.setProperty("--hold", moment.hold.toFixed(4))
      setShown((last) => (last.project === moment.project && last.beat === moment.beat ? last : { project: moment.project, beat: moment.beat }))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    // the device stands in what the caption leaves: each card gets the height of its own caption (the tallest of its beats)
    const sizer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const card = entry.target.closest<HTMLElement>(".group-card")
        card?.style.setProperty("--copy-h", `${Math.ceil(entry.target.getBoundingClientRect().height)}px`)
      }
    })
    node.querySelectorAll<HTMLElement>(".show-copy").forEach((copy) => sizer.observe(copy))

    let idle = 0
    let touching = false
    const settle = () => {
      if (touching || !window.matchMedia(NARROW).matches) return
      const rect = node.getBoundingClientRect()
      const run = rect.height - window.innerHeight
      if (run <= 0) return
      const target = settleAt(-rect.top / run, count, beats)
      if (target === null) return
      const y = Math.round(window.scrollY + rect.top + run * target)
      const engine = smoothScroll()
      if (engine) engine.scrollTo(y, { force: true })
      else window.scrollTo({ top: y, behavior: "smooth" })
    }
    const rest = () => {
      window.clearTimeout(idle)
      idle = window.setTimeout(settle, IDLE_MS)
    }
    const press = () => {
      touching = true
    }
    const release = () => {
      touching = false
      rest()
    }

    measure()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("scroll", rest, { passive: true })
    window.addEventListener("resize", schedule)
    window.addEventListener("touchstart", press, { passive: true })
    window.addEventListener("touchend", release, { passive: true })
    window.addEventListener("touchcancel", release, { passive: true })
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("scroll", rest)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("touchstart", press)
      window.removeEventListener("touchend", release)
      window.removeEventListener("touchcancel", release)
      window.clearTimeout(idle)
      sizer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [count, beats, host])

  return { scene, project: shown.project, beat: shown.beat }
}
