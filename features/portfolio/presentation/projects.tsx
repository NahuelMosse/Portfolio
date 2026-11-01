import { Chapter } from "@/features/film/presentation/chapter"
import { projects } from "./content"

export function Projects() {
  return (
    <Chapter id="projects" label="Projects" tone="paper" nextTone="dark" title={<>What I <em>built</em></>}>
      {projects.map((project, index) => (
        <article key={project.id} data-project={project.id} className="project story">
          <div>
            <span className="numeral" aria-hidden="true">{index + 1}</span>
          </div>
          <div>
            <h3>{project.name}</h3>
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
          </div>
        </article>
      ))}
    </Chapter>
  )
}
