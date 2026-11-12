"use client"

import { useEffect } from "react"
import { BEAT_RUN, TURN_RUN, startOf, useGroupTrack } from "./use-group-track"

// An employer holds for three beats (the employer, the problem, the role) of the Projects track, then the stage turns to the next.
export const BEATS_PER_EMPLOYER = 3
const HOST = "#experience-scene"

// The employers are driven by the Projects track: the section is as tall as the scroll it needs, the stage is pinned and --track
// goes to the section, where group.css turns the stage. Only the employer and the beat on show are state; they land on each
// scene's attributes and on the index the way ProjectGroupScene renders them. The index is a shortcut to an employer's hold.
export function ExperienceMotion({ count }: { count: number }) {
  useEffect(() => {
    const node = document.querySelector<HTMLElement>(HOST)
    if (!node) return
    node.style.setProperty("--beat-step", `calc(${BEAT_RUN} * var(--screen-unit))`)
    node.style.setProperty("--turn-step", `calc(${TURN_RUN} * var(--screen-unit))`)
    node.style.setProperty("--steps", String(BEATS_PER_EMPLOYER - 1))

    const jump = (event: Event) => {
      const button = (event.target as HTMLElement).closest<HTMLElement>("[data-employer-jump]")
      if (!button) return
      const top = node.getBoundingClientRect().top + window.scrollY
      const run = node.offsetHeight - window.innerHeight
      window.scrollTo({ top: top + run * startOf(Number(button.dataset.employerJump), count, BEATS_PER_EMPLOYER) })
    }
    node.addEventListener("click", jump)
    return () => node.removeEventListener("click", jump)
  }, [count])

  const { project, beat } = useGroupTrack(count, { beats: BEATS_PER_EMPLOYER, host: HOST })

  useEffect(() => {
    const node = document.querySelector<HTMLElement>(HOST)
    if (!node) return
    node.querySelectorAll<HTMLElement>("[data-employer]").forEach((card, order) => {
      const own = order === project ? beat : order < project ? BEATS_PER_EMPLOYER - 1 : 0
      card.toggleAttribute("data-current", order === project)
      card.toggleAttribute("data-reachable", Math.abs(order - project) <= 1)
      card.style.setProperty("--cur", order === project ? "1" : "0")
      card.dataset.beat = String(own)
      card.querySelectorAll<HTMLElement>(".show-beat").forEach((el, step) => el.toggleAttribute("data-on", step === own))
      card.querySelectorAll<HTMLElement>(".show-ticks i").forEach((el, step) => el.toggleAttribute("data-on", step <= own))
    })
    node.querySelectorAll<HTMLElement>(".group-index li").forEach((item, order) => {
      if (order === project) item.setAttribute("aria-current", "step")
      else item.removeAttribute("aria-current")
    })
  }, [project, beat])

  return null
}
