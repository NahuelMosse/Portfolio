import { Chapter, Reveal } from "@/features/film"
import { CaseDetails } from "./case-details"
import { projects } from "./content"
import { Piece } from "./piece"
import { PieceRow } from "./piece-row"

// Each case is one compact row typed on the dark: its tag and title, what / problem / role, its real pieces in frames, its links.
export function Projects() {
  return (
    <Chapter id="projects" label="02 · PROJECTS" subtitle="EVIDENCE // WHAT I BUILT" title="Projects">
      {projects.map((project, index) => (
        <Reveal
          key={project.id}
          id={project.id}
          data-project={project.id}
          data-thread-stop={`project:${project.id}`}
          className="project"
        >
          <header data-case-text="" className="case-head" data-pin="">
            <span data-case-tag="" className="case-tag">CASE {String(index + 1).padStart(2, "0")}</span>
            <h3 tabIndex={-1}>{project.name}</h3>
          </header>
          <PieceRow count={project.pieces.length}>
            {project.pieces.map((piece) => (
              <Piece key={piece.caption} piece={piece} />
            ))}
          </PieceRow>
          <CaseDetails defaultOpen={index === 0}>
            <p data-field="what">{project.what}</p>
            <p data-field="problem">{project.problem}</p>
            <p data-field="role">{project.role}</p>
          </CaseDetails>
          {project.links.length > 0 && (
            <div className="links">
              {project.links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </Reveal>
      ))}
    </Chapter>
  )
}
