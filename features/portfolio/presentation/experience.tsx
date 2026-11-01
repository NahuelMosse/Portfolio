import { Chapter, Reveal } from "@/features/film"
import { experience } from "./content"
import { Piece } from "./piece"
import { PieceRow } from "./piece-row"

// Experience is a typed record on the dark: one row per employer with its status tag, then what, problem and role.
export function Experience() {
  return (
    <Chapter id="experience" label="03 · EXPERIENCE" subtitle="RECORD // WHERE I LEAD" title="Experience">
      {experience.map((employer) => (
        <Reveal
          key={employer.id}
          data-employer={employer.id}
          data-current={String(employer.current === true)}
          data-thread-stop={`employer:${employer.id}`}
          className="employer"
        >
          <header className="employer-head" data-pin="">
            <h3>{employer.name}</h3>
            <span data-employer-tag="" className="status-tag">{employer.current ? "CURRENT" : "PAST"}</span>
          </header>
          <div className="employer-lines">
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
