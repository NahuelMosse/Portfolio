import type { CSSProperties } from "react"
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

// The photo of him at work that belongs to each employer's row; the desk photo serves two rows, cropped to its other half. focusY is the
// object-position that keeps his face inside the low strip. The "face" crop zooms on him alone: the slide he presents beside is never legible.
const EMPLOYER_PHOTO: Record<string, { id: WorkPhotoId; crop: "left" | "right" | "face"; focusY: number }> = {
  "smart-warehousing": { id: "work-desk-b", crop: "left", focusY: 28 },
  "grupo-st": { id: "work-desk-a", crop: "left", focusY: 30 },
  visma: { id: "work-desk-a", crop: "right", focusY: 30 },
  fravega: { id: "work-warehouse", crop: "left", focusY: 14 },
  justo: { id: "work-presenting", crop: "face", focusY: 0 },
}

// One photo of him at work as the right side of its employer's row: printed in the page's ink (grey, then red and black by the
// blend), screened with a halftone and faded out toward the text, so it bleeds off the edge and is never a bare rectangle.
function RowPhoto({ employerId }: { employerId: string }) {
  const photo = EMPLOYER_PHOTO[employerId]
  const src = photo && sceneAsset(photo.id, "webp")
  if (!photo || !src) return null
  return (
    <figure data-work-photo={photo.id} data-crop={photo.crop} className="employer-photo" style={{ "--photo-y": `${photo.focusY}%` } as CSSProperties}>
      {/* eslint-disable-next-line @next/next/no-img-element -- a graded still of a few hundred kilobytes */}
      <img src={src} alt={WORK_PHOTOS[photo.id]} loading="lazy" decoding="async" />
      <span data-grain="" className="grain" aria-hidden="true" />
    </figure>
  )
}

// Experience as one compact ledger: an illustration as the header band, then a ruled row per employer with its number, logo, role,
// period and one line, and a photo of him at work printed in the page's ink bleeding in from the right edge of the row.
// The problem and his role wait behind a click. No real capture of an employer's system is shown (PF-1-ASM-10).
export function Experience() {
  return (
    <section data-chapter="experience" id="experience" className="experience">
      {/* the duotone of the row photos: ink in the shadows, crimson in the mid tones, bone in the highlights */}
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
        <filter id="work-duotone" colorInterpolationFilters="sRGB">
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.05 0.62 0.93" />
            <feFuncG type="table" tableValues="0.05 0.07 0.88" />
            <feFuncB type="table" tableValues="0.04 0.09 0.8" />
          </feComponentTransfer>
        </filter>
      </svg>
      <ChapterIllustration asset="ill-experience-16x9" fittedAsset="ill-experience-21x9" className="experience-band">
        <ChapterWord id="experience" heading="h2" numeral="03" note={`${experience.length} employers`}>Experience</ChapterWord>
      </ChapterIllustration>
      <ol className="employers">
        {experience.map((employer, index) => (
          <li key={employer.id}>
            <article data-employer={employer.id} data-current={String(employer.current === true)} className="employer">
              <RowPhoto employerId={employer.id} />
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
    </section>
  )
}
