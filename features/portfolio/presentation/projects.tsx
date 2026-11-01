import { Chapter, Reveal, SceneMedia, SeamFigure, sceneAsset } from "@/features/film"
import { CaseDetails } from "./case-details"
import { projects } from "./content"
import { Piece } from "./piece"
import { PieceRow } from "./piece-row"

// The first and the fourth case are the larger exhibits.
const LARGE_CASES = [0, 3]

export function Projects() {
  return (
    <Chapter
      id="projects"
      label="Projects"
      number="02"
      torn="left"
      seam={<SeamFigure side="right" toward="projects" asset="pf-him-front" />}
      title={<>What I <em>built</em></>}
    >
      {projects.map((project, index) => (
        <Reveal
          key={project.id}
          id={project.id}
          data-project={project.id}
          data-case-side={index % 2 === 0 ? "left" : "right"}
          data-thread-stop={`project:${project.id}`}
          className="project story"
        >
          <div data-exhibit="" data-lamp-target="" data-size={LARGE_CASES.includes(index) ? "large" : "small"} className="exhibit">
            <span className="numeral" aria-hidden="true">{index + 1}</span>
            <SceneMedia
              asset={`pf-exhibit-${project.id}-4x5`}
              poster={sceneAsset(`pf-exhibit-${project.id}-4x5`, "webp")}
              alt={`${project.name}, evidence photograph`}
              className="arch-media"
            />
          </div>
          <header data-case-text="" className="story-text">
            <h3 tabIndex={-1}>{project.name}</h3>
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
          </header>
          <PieceRow count={project.pieces.length}>
            {project.pieces.map((piece) => (
              <Piece key={piece.caption} piece={piece} />
            ))}
          </PieceRow>
        </Reveal>
      ))}
    </Chapter>
  )
}
