import type { CSSProperties } from "react"
import { sceneAsset } from "@/features/film"
import { DEFERRED_BLANK } from "@/features/film/presentation/deferred"
import { deferredPlate, plateSrcSet } from "@/features/film/presentation/plate"
import { experience } from "./content"
import { ChapterWord } from "./chapter-word"
import { BEATS_PER_EMPLOYER, ExperienceMotion } from "./experience-motion"
import "./experience.css"
import { Button } from "@/components/ui/button"

const pad = (n: number) => String(n).padStart(2, "0")

// The three beats of an employer's story, one per step of its hold.
const BEATS = [
  { label: "The employer", field: "what" },
  { label: "The problem", field: "problem" },
  { label: "My role", field: "role" },
] as const

// Experience is one group of the Projects kind: the same pinned scene, markup and stylesheet (group.css, showcase.css); each
// employer is a scene with its plate behind everything, its name as the poster word, its logo and its beats. The scroll turns the
// scene exactly as it turns projects (ExperienceMotion). No real capture of an employer's system is shown (PF-1-ASM-10).
export function Experience() {
  const count = experience.length
  return (
    <section data-chapter="experience" id="experience" className="xp">
      <ChapterWord id="experience" heading="h2" headingId="experience-title" numeral="03" note={`${count} employers`}>
        Experience
      </ChapterWord>
      <div
        id="experience-scene"
        data-group="experience"
        data-count={count}
        data-composition="a"
        className="group"
        style={{ "--count": count } as CSSProperties}
      >
        <div className="group-pin">
          <header className="group-head">
            <h3 className="group-word">Employers</h3>
            <p className="group-count">{count} employers</p>
            <p className="group-line">Where I built, led and coached engineering teams.</p>
            <ol className="group-index" aria-label="Employers">
              {experience.map((employer, index) => (
                <li key={employer.id} data-project={employer.id} aria-current={index === 0 ? "step" : undefined}>
                  <Button type="button" variant="ghost" size={null} className="whitespace-normal shrink rounded-none focus-visible:ring-0 justify-normal" data-employer-jump={index}>
                    <b>{pad(index + 1)}</b>
                    <span>{employer.name}</span>
                  </Button>
                </li>
              ))}
            </ol>
          </header>
          <div className="group-track">
            {experience.map((employer, index) => {
              const wide = `ill-exp-${employer.id}-16x9`
              const tall = `ill-exp-${employer.id}-9x16`
              const drawn = Boolean(sceneAsset(wide, "webp") && sceneAsset(tall, "webp"))
              return (
                <article
                  key={employer.id}
                  id={`employer-${employer.id}`}
                  data-employer={employer.id}
                  data-project={employer.id}
                  data-kind="tool"
                  data-composition="a"
                  data-tag={employer.current ? "current" : "past"}
                  data-beat={0}
                  data-current={index === 0 ? "" : undefined}
                  data-reachable={index <= 1 ? "" : undefined}
                  className="show group-card"
                  style={
                    {
                      "--beats": 1,
                      "--chars": employer.name.length,
                      "--i": index,
                      "--cur": index === 0 ? 1 : 0,
                    } as CSSProperties
                  }
                >
                  <div data-scene-screen="" className="show-stage">
                    <span className="group-field" aria-hidden="true" />
                    <div className="show-art">
                      {drawn && (
                        <picture data-plate={employer.id} className="plate">
                          <source media="(min-width: 1280px)" data-srcset={plateSrcSet(wide)} sizes="100vw" />
                          <img {...deferredPlate(tall, "100vw")} alt="" decoding="async" />
                        </picture>
                      )}
                    </div>
                    <span className="show-light" aria-hidden="true" />
                    <p data-poster-word="" className="show-word" aria-hidden="true">
                      {employer.name}
                    </p>
                    <div className="show-copy">
                      <h4>{employer.name}</h4>
                      {/* eslint-disable-next-line @next/next/no-img-element -- fetched by PlateLoader as the visitor nears it */}
                      <img
                        data-employer-logo=""
                        className="xp-mark"
                        src={`${DEFERRED_BLANK}#/logos/${employer.id}.png`}
                        data-src={`/logos/${employer.id}.png`}
                        alt={`${employer.name} logo`}
                        decoding="async"
                      />
                      <p data-employer-title="" className="show-lead">
                        {/* each separator travels with the item before it, so a wrapped line never opens on one */}
                        {employer.title} · <span><span data-employer-period="">{employer.period}</span> ·</span>
                        <span data-employer-tag="">{employer.current ? "CURRENT" : "PAST"}</span>
                      </p>
                      <div className="show-beats">
                        {BEATS.map((entry, step) => (
                          <div key={entry.label} className="show-beat" data-on={step === 0 ? "" : undefined}>
                            <p className="show-label">
                              {pad(step + 1)} · {entry.label}
                            </p>
                            <p data-field={entry.field} className="show-text">
                              {employer[entry.field]}
                            </p>
                          </div>
                        ))}
                      </div>
                      <p className="show-ticks" aria-hidden="true">
                        {BEATS.map((entry, step) => (
                          <i key={entry.label} data-on={step === 0 ? "" : undefined} />
                        ))}
                      </p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
        <ExperienceMotion count={count} />
      </div>
    </section>
  )
}

export { BEATS_PER_EMPLOYER }
