import { sceneAsset } from "@/features/film"
import { ChapterIllustration } from "./chapter-illustration"
import { ChapterWord } from "./chapter-word"
import { experience } from "./content"

const WORK_PHOTOS = {
  "work-presenting": "Presenting the warehouse system to the Jüsto team",
  "work-warehouse": "On site in a warehouse, in a hard hat",
  "work-desk-a": "At the desk, building",
  "work-desk-b": "At the desk, reviewing",
} as const

type WorkPhotoId = keyof typeof WORK_PHOTOS

const WORK_STRIP = Object.keys(WORK_PHOTOS) as WorkPhotoId[]

// One photo of him at work, already cropped and graded: it fades into the page and carries grain, never a bare rectangle.
function WorkPhoto({ id }: { id: WorkPhotoId }) {
  const src = sceneAsset(id, "webp")
  if (!src) return null
  return (
    <figure data-work-photo={id} className="work-photo">
      {/* eslint-disable-next-line @next/next/no-img-element -- a graded still of a few hundred kilobytes */}
      <img src={src} alt={WORK_PHOTOS[id]} loading="lazy" decoding="async" />
      <span data-grain="" className="grain" aria-hidden="true" />
    </figure>
  )
}

function WorkStrip() {
  if (!WORK_STRIP.some((id) => sceneAsset(id, "webp"))) return null
  return (
    <div data-work-strip="" className="work-strip" aria-label="On the job">
      {WORK_STRIP.map((id) => (
        <WorkPhoto key={id} id={id} />
      ))}
    </div>
  )
}

// Experience as one compact timeline: an illustration as a header band, then the five employers side by side (a column each on a
// wide screen, a row each on a phone) with logo, role, period and one line, and the illustration of its system beside the text.
// The problem and his role wait behind a click. No real capture of an employer's system is shown (PF-1-ASM-10).
export function Experience() {
  return (
    <section data-chapter="experience" id="experience" className="experience">
      <ChapterIllustration asset="ill-experience-16x9" fittedAsset="ill-experience-21x9" className="experience-band">
        <ChapterWord id="experience" heading="h2" numeral="02" note={`${experience.length} employers`}>Experience</ChapterWord>
      </ChapterIllustration>
      <ol className="employers">
        {experience.map((employer, index) => (
          <li key={employer.id}>
            <article data-employer={employer.id} data-current={String(employer.current === true)} className="employer">
              <ChapterIllustration asset={`ill-exp-${employer.id}-4x3`} className="employer-art" />
              <div className="employer-info">
                <span className="employer-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div className="employer-head">
                  {employer.logo && (
                    // eslint-disable-next-line @next/next/no-img-element -- a static brand mark of a few kilobytes
                    <img data-employer-logo="" className="employer-logo" src={employer.logo} alt={`${employer.name} logo`} width={56} height={56} loading="lazy" />
                  )}
                  <h3>{employer.name}</h3>
                  <span data-employer-tag="" className="status-tag">{employer.current ? "CURRENT" : "PAST"}</span>
                </div>
                <p data-employer-title="" className="employer-title">{employer.title}</p>
                <p data-employer-period="" className="employer-period">{employer.period}</p>
                <p data-field="what" className="employer-line">{employer.what}</p>
                <details className="employer-more">
                  <summary>The problem and my role</summary>
                  <p data-field="problem">{employer.problem}</p>
                  <p data-field="role">{employer.role}</p>
                </details>
              </div>
            </article>
          </li>
        ))}
      </ol>
      <WorkStrip />
    </section>
  )
}
