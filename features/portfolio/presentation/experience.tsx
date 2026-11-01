import { Fragment } from "react"
import { sceneAsset } from "@/features/film"
import { ChapterIllustration } from "./chapter-illustration"
import { experience } from "./content"

const WORK_PHOTOS = {
  "work-presenting": "Presenting the warehouse system to the Jüsto team",
  "work-warehouse": "On site in a warehouse, in a hard hat",
  "work-desk-a": "At the desk, building",
  "work-desk-b": "At the desk, reviewing",
} as const

type WorkPhotoId = keyof typeof WORK_PHOTOS

const WORK_STRIP: readonly WorkPhotoId[] = ["work-warehouse", "work-desk-a", "work-desk-b"]
// The strip sits after this employer, between two blocks.
const STRIP_AFTER = "visma"

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
    <li>
      <div data-work-strip="" className="work-strip" aria-label="On the job">
        <p className="work-strip-label">On the job</p>
        {WORK_STRIP.map((id) => (
          <WorkPhoto key={id} id={id} />
        ))}
      </div>
    </li>
  )
}

// Experience: an illustration as a header band, then one block per employer with the illustration of its system in use beside it.
// No real capture of an employer's system is shown (PF-1-ASM-10): the illustrations are drawn, with wordless screens.
export function Experience() {
  return (
    <section data-chapter="experience" id="experience" className="experience">
      <ChapterIllustration asset="ill-experience-16x9" fittedAsset="ill-experience-21x9" className="experience-band">
        <h2 tabIndex={-1} className="chapter-heading">Experience</h2>
      </ChapterIllustration>
      <ul className="employers">
        {experience.map((employer, index) => (
          <Fragment key={employer.id}>
            <li>
              <article data-employer={employer.id} data-current={String(employer.current === true)} data-side={index % 2 === 0 ? "right" : "left"} className="employer">
                <div className="employer-info">
                  {employer.logo && (
                    // eslint-disable-next-line @next/next/no-img-element -- a static brand mark of a few kilobytes
                    <img data-employer-logo="" className="employer-logo" src={employer.logo} alt={`${employer.name} logo`} width={56} height={56} loading="lazy" />
                  )}
                  <div className="employer-head">
                    <h3>{employer.name}</h3>
                    <span data-employer-tag="" className="status-tag">{employer.current ? "CURRENT" : "PAST"}</span>
                  </div>
                  <p data-employer-title="" className="employer-title">{employer.title}</p>
                  <p data-employer-period="" className="employer-period">{employer.period}</p>
                  <p data-field="what">{employer.what}</p>
                  {employer.id === "justo" && <WorkPhoto id="work-presenting" />}
                </div>
                <ChapterIllustration asset={`ill-exp-${employer.id}-4x3`} className="employer-art" />
              </article>
            </li>
            {employer.id === STRIP_AFTER && <WorkStrip />}
          </Fragment>
        ))}
      </ul>
    </section>
  )
}
