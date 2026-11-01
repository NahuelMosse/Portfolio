import { ChapterIllustration } from "./chapter-illustration"
import { experience } from "./content"
import { Piece } from "./piece"
import { PieceRow } from "./piece-row"

// Experience: one illustration as a header band, then one block per employer; where public/ has its screens or photo they are large in a browser frame.
export function Experience() {
  return (
    <section data-chapter="experience" id="experience" className="experience">
      <ChapterIllustration asset="ill-experience-16x9" fittedAsset="ill-experience-21x9" className="experience-band">
        <h2 tabIndex={-1} className="chapter-heading">Experience</h2>
      </ChapterIllustration>
      <ul className="employers">
        {experience.map((employer) => (
          <li key={employer.id}>
              <article data-employer={employer.id} data-current={String(employer.current === true)} className="employer">
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
                </div>
                {employer.pieces.length > 0 && (
                  <PieceRow count={employer.pieces.length}>
                    {employer.pieces.map((piece, order) => (
                      <Piece key={piece.caption} piece={piece} lead={order === 0} order={order} />
                    ))}
                  </PieceRow>
                )}
              </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
