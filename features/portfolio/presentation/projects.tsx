import { ChapterIllustration } from "./chapter-illustration"
import { projects } from "./content"
import { Piece } from "./piece"
import { PieceRow } from "./piece-row"
import { ProjectSpread } from "./project-spread"

// The illustration of each project, by project id.
const ILLUSTRATIONS: Record<string, string> = {
  "dev-kit": "ill-kit-16x9",
  grit: "ill-grit-16x9",
  guardia: "ill-triaje-16x9",
  cebador: "ill-cebador-16x9",
  club: "ill-club-16x9",
}

const FIELDS = [
  { key: "what", label: "What" },
  { key: "problem", label: "Problem" },
  { key: "role", label: "My role" },
] as const

// Each project is a spread: the illustration on a side panel that alternates, the work on a stage beside it.
export function Projects() {
  return (
    <section data-chapter="projects" id="projects" className="projects">
      <h2 tabIndex={-1} className="chapter-heading">Projects</h2>
      {projects.map((project, index) => {
        const asset = ILLUSTRATIONS[project.id]
        if (!asset) throw new Error(`No illustration is mapped for project ${project.id}`)
        return (
          <ProjectSpread key={project.id} id={project.id} side={index % 2 === 0 ? "left" : "right"}>
            <ChapterIllustration asset={asset} fittedAsset={asset.replace("16x9", "4x5")} className="spread-art" />
            <div className="spread-body">
              <h3 tabIndex={-1}>{project.name}</h3>
              <div className="spread-fields">
                {FIELDS.map(({ key, label }) => (
                  <p key={key} data-field={key}>
                    <span data-label="">{label}</span>
                    {project[key]}
                  </p>
                ))}
              </div>
              <div className="spread-meta">
                <p data-stack="">{project.stack}</p>
                {project.links.length > 0 && (
                  <div className="links">
                    {project.links.map((link) => (
                      <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <PieceRow count={project.pieces.length}>
                {project.pieces.map((piece, order) => (
                  <Piece key={piece.caption} piece={piece} lead={order === 0} order={order} />
                ))}
              </PieceRow>
            </div>
          </ProjectSpread>
        )
      })}
    </section>
  )
}
