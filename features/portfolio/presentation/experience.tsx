import { ChapterIllustration } from "./chapter-illustration"
import { experience } from "./content"
import { Piece } from "./piece"
import { PieceRow } from "./piece-row"

// Experience: one illustration with the employers as a short list over its dark side; the pieces of an employer follow beneath.
export function Experience() {
  const withPieces = experience.filter((employer) => employer.pieces.length > 0)
  return (
    <section data-chapter="experience" id="experience" className="experience">
      <ChapterIllustration asset="ill-experience-16x9" className="experience-scene">
        <h2 tabIndex={-1} className="chapter-heading">Experience</h2>
        <ul className="employers">
          {experience.map((employer) => (
            <li key={employer.id}>
              <article data-employer={employer.id} data-current={String(employer.current === true)} className="employer">
                <div className="employer-head">
                  <h3>{employer.name}</h3>
                  <span data-employer-tag="" className="status-tag">{employer.current ? "CURRENT" : "PAST"}</span>
                </div>
                <p data-field="what">{employer.what}</p>
              </article>
            </li>
          ))}
        </ul>
      </ChapterIllustration>
      {withPieces.map((employer) => (
        <div key={employer.id} className="project-body">
          <PieceRow count={employer.pieces.length}>
            {employer.pieces.map((piece) => (
              <Piece key={piece.caption} piece={piece} />
            ))}
          </PieceRow>
        </div>
      ))}
    </section>
  )
}
