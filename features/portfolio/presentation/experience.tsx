import { Chapter, Reveal, SeamFigure } from "@/features/film"
import { experience } from "./content"
import { Piece } from "./piece"
import { PieceRow } from "./piece-row"

// Experience is a typed record on the dark: employer, period, then what, problem and role.
export function Experience() {
  return (
    <Chapter
      id="experience"
      label="Experience"
      number="03"
      torn="right"
      seam={<SeamFigure side="left" toward="experience" asset="pf-him-closeup" photo="close-crop" />}
      title={<>Where I <em>served</em></>}
    >
      {experience.map((employer) => (
        <Reveal
          key={employer.id}
          data-employer={employer.id}
          data-current={String(employer.current === true)}
          data-thread-stop={`employer:${employer.id}`}
          className="employer story"
        >
          <header className="story-text">
            <h3>{employer.name}</h3>
            <span className="period">{employer.period}</span>
          </header>
          <div>
            <p data-field="what">{employer.what}</p>
            <p data-field="problem">{employer.problem}</p>
            <p data-field="role">{employer.role}</p>
          </div>
          {employer.pieces.length > 0 && (
            <PieceRow count={employer.pieces.length}>
              {employer.pieces.map((piece) => (
                <Piece key={piece.caption} piece={piece} />
              ))}
            </PieceRow>
          )}
        </Reveal>
      ))}
    </Chapter>
  )
}
