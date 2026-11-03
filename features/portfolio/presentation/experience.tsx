import type { CSSProperties } from "react"
import { sceneAsset } from "@/features/film"
import { ChapterWord } from "./chapter-word"
import { experience } from "./content"
import { ExperienceScene } from "./experience-scene"
import "./experience.css"

const PERIOD_SEPARATOR = " – "

// "09/2026 – Present": the start is set as the big numerals, the rest stays beside it in fine type.
function splitPeriod(period: string) {
  const cut = period.indexOf(PERIOD_SEPARATOR)
  return cut < 0 ? { from: period, to: "" } : { from: period.slice(0, cut), to: period.slice(cut) }
}

const pad = (n: number) => String(n).padStart(2, "0")

// Experience as one scrubbed scene: five employer posters, newest first, each built around its ink illustration. Wide, a pinned track
// carries them sideways with the scroll; narrow, each poster sticks and the next slides up over it. Nothing waits behind a click, and
// no real capture of an employer's system is shown (PF-1-ASM-10).
export function Experience() {
  return (
    <ExperienceScene count={experience.length}>
      <div data-experience-stage="" className="xp-stage">
        <div className="xp-head">
          <ChapterWord id="experience" heading="h2" numeral="03" note={`${experience.length} employers`}>Experience</ChapterWord>
          <span className="xp-progress" aria-hidden="true" />
        </div>
        <ol data-experience-track="" className="xp-track">
          {experience.map((employer, index) => {
            const art = sceneAsset(`ill-exp-${employer.id}-4x3`, "webp")
            const { from, to } = splitPeriod(employer.period)
            return (
              <li key={employer.id} className="xp-slot" style={{ "--i": index } as CSSProperties}>
                <article data-employer={employer.id} data-current={String(employer.current === true)} className="xp-panel">
                  <div className="xp-art" aria-hidden="true">
                    {art && (
                      // eslint-disable-next-line @next/next/no-img-element -- an ink illustration moved by transform inside its frame
                      <img data-employer-art="" src={art} alt="" width={1448} height={1086} loading={index < 2 ? "eager" : "lazy"} decoding="async" />
                    )}
                  </div>
                  <div className="xp-info">
                    <p className="xp-meta">
                      <span aria-hidden="true">{pad(index + 1)} / {pad(experience.length)}</span>
                      <span data-employer-tag="" className="xp-tag">{employer.current ? "CURRENT" : "PAST"}</span>
                    </p>
                    <p data-employer-period="" className="xp-period">
                      <span className="xp-from">{from}</span>
                      <span className="xp-to">{to}</span>
                    </p>
                    <div className="xp-name">
                      <h3>{employer.name}</h3>
                      {employer.logo && (
                        // eslint-disable-next-line @next/next/no-img-element -- a static brand mark of a few kilobytes
                        <img data-employer-logo="" className="xp-logo" src={employer.logo} alt={`${employer.name} logo`} width={56} height={56} loading="lazy" />
                      )}
                    </div>
                    <p data-employer-title="" className="xp-title">{employer.title}</p>
                    <div className="xp-slab">
                      <p data-field="what" className="xp-what">{employer.what}</p>
                      <div className="xp-line">
                        <span className="xp-label">The problem</span>
                        <p data-field="problem">{employer.problem}</p>
                      </div>
                      <div className="xp-line">
                        <span className="xp-label">My role</span>
                        <p data-field="role">{employer.role}</p>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ol>
      </div>
    </ExperienceScene>
  )
}
