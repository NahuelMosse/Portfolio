import { ChapterIllustration } from "./chapter-illustration"
import { CaseDetails } from "./case-details"
import { projects } from "./content"
import { Piece } from "./piece"
import { PieceRow } from "./piece-row"

// The illustration of each project, by project id.
const ILLUSTRATIONS: Record<string, string> = {
  "dev-kit": "ill-kit-16x9",
  grit: "ill-grit-16x9",
  guardia: "ill-triaje-16x9",
  cebador: "ill-cebador-16x9",
  club: "ill-club-16x9",
}

// Each project is one scene: its illustration edge to edge with the title and one line over it, then its real pieces in a row.
export function Projects() {
  return (
    <section data-chapter="projects" id="projects" className="projects">
      <h2 tabIndex={-1} className="chapter-heading">Projects</h2>
      {projects.map((project) => {
        const asset = ILLUSTRATIONS[project.id]
        if (!asset) throw new Error(`No illustration is mapped for project ${project.id}`)
        return (
          <article key={project.id} id={project.id} data-project={project.id} className="project">
            <ChapterIllustration asset={asset} className="project-scene">
              <h3 tabIndex={-1}>{project.name}</h3>
              <p data-field="what">{project.what}</p>
              {project.links.length > 0 && (
                <div className="links">
                  {project.links.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </ChapterIllustration>
            <div className="project-body">
              <PieceRow count={project.pieces.length}>
                {project.pieces.map((piece) => (
                  <Piece key={piece.caption} piece={piece} />
                ))}
              </PieceRow>
              <CaseDetails>
                <p data-field="problem">{project.problem}</p>
                <p data-field="role">{project.role}</p>
              </CaseDetails>
            </div>
          </article>
        )
      })}
    </section>
  )
}
