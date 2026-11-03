import { sceneAsset } from "@/features/film"
import { ChapterWord } from "./chapter-word"
import { experience } from "./content"
import { ExperienceMotion } from "./experience-motion"
import "./experience.css"

const PERIOD_SEPARATOR = " – "

// "09/2026 – Present": the start is set as the big numerals, the rest stays beside it in fine type.
function splitPeriod(period: string) {
  const cut = period.indexOf(PERIOD_SEPARATOR)
  return cut < 0 ? { from: period, to: "" } : { from: period.slice(0, cut), to: period.slice(cut) }
}

const pad = (n: number) => String(n).padStart(2, "0")

// Experience as one scene per employer, newest first. Wide, the pinned stage shows one employer at a time (the illustration whole on
// the left, the copy in its own column) and the scroll wipes it away with ink; narrow, each employer sticks and the next slides over
// it. Nothing waits behind a click, and no real capture of an employer's system is shown (PF-1-ASM-10).
export function Experience() {
  return (
    <section data-chapter="experience" id="experience" className="experience xp">
      <div data-experience-stage="" className="xp-stage">
        <div className="xp-head">
          <ChapterWord id="experience" heading="h2" numeral="03" note={`${experience.length} employers`}>Experience</ChapterWord>
        </div>
        <ol className="xp-track">
          {experience.map((employer, index) => {
            const art = sceneAsset(`ill-exp-${employer.id}-4x3`, "webp")
            const { from, to } = splitPeriod(employer.period)
            return (
              <li key={employer.id} className="xp-slot">
                <article data-employer={employer.id} data-current={String(employer.current === true)} className="xp-panel">
                  <div className="xp-art" aria-hidden="true">
                    {art && (
                      // eslint-disable-next-line @next/next/no-img-element -- an ink illustration shown whole at its own 4:3
                      <img data-employer-art="" src={art} alt="" width={1448} height={1086} loading={index < 2 ? "eager" : "lazy"} decoding="async" />
                    )}
                    <span className="xp-ink" />
                  </div>
                  <div className="xp-info">
                    <p data-xp-line="" className="xp-meta">
                      <span aria-hidden="true">{pad(index + 1)} / {pad(experience.length)}</span>
                      <span data-employer-tag="" className="xp-tag">{employer.current ? "CURRENT" : "PAST"}</span>
                    </p>
                    <p data-xp-line="" data-employer-period="" className="xp-period">
                      <span className="xp-from">{from}</span>
                      <span className="xp-to">{to}</span>
                    </p>
                    <div data-xp-line="" className="xp-name">
                      <h3>{employer.name}</h3>
                      {employer.logo && (
                        // eslint-disable-next-line @next/next/no-img-element -- a static brand mark of a few kilobytes
                        <img data-employer-logo="" className="xp-logo" src={employer.logo} alt={`${employer.name} logo`} width={56} height={56} loading="lazy" />
                      )}
                    </div>
                    <p data-xp-line="" data-employer-title="" className="xp-title">{employer.title}</p>
                    <div className="xp-slab">
                      <p data-xp-line="" data-field="what" className="xp-what">{employer.what}</p>
                      <div data-xp-line="" className="xp-line">
                        <span className="xp-label">The problem</span>
                        <p data-field="problem">{employer.problem}</p>
                      </div>
                      <div data-xp-line="" className="xp-line">
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
        <div className="xp-foot" aria-hidden="true">
          <span data-xp-counter="">{pad(1)} / {pad(experience.length)}</span>
          <span className="xp-progress"><i /></span>
        </div>
      </div>
      <ExperienceMotion />
    </section>
  )
}
