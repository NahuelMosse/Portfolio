import { Chapter, Reveal, SceneMedia, sceneAsset } from "@/features/film"
import { projects } from "./content"
import { Piece } from "./piece"

export function Projects() {
  return (
    <Chapter id="projects" label="Projects" tone="paper" nextTone="dark" seamSide="right" title={<>What I <em>built</em></>}>
      {projects.map((project, index) => (
        <Reveal
          key={project.id}
          id={project.id}
          data-project={project.id}
          data-thread-stop={`project:${project.id}`}
          className="project story"
        >
          <div>
            <span className="numeral" aria-hidden="true">{index + 1}</span>
            <SceneMedia
              asset={`pf-proj-${project.id}-4x5`}
              poster={sceneAsset(`pf-proj-${project.id}-4x5`, "webp")}
              alt={`${project.name}, painted`}
              className="arch-media"
            />
          </div>
          <header className="story-text">
            <h3 tabIndex={-1}>{project.name}</h3>
            <p data-field="what">{project.what}</p>
            <p data-field="problem">{project.problem}</p>
            <p data-field="role">{project.role}</p>
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
          <div className="pieces">
            {project.pieces.map((piece) => (
              <Piece key={piece.caption} piece={piece} />
            ))}
          </div>
        </Reveal>
      ))}
    </Chapter>
  )
}
