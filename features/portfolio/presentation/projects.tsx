import { groups, projects, type Project } from "./content"
import { ChapterWord } from "./chapter-word"
import { ProjectBackdrop, ProjectPlate } from "./project-backdrop"
import { ProjectGroupScene, type GroupItem } from "./project-group"

// The device each project shows its screens in: a phone, a browser or, for a command-line tool, a terminal window.
const DEVICES = {
  grit: "phone",
  club: "phone",
  cebador: "browser",
  sonria: "browser",
  miga: "browser",
  guardia: "browser",
  "motion-audit": "terminal",
  "http-attack": "terminal",
  "migrations-safe": "terminal",
} as const

// The backdrop each project draws on, named after a world. The landings share the backdrop of the first one; the tools are
// a field of color and their own plate, with no backdrop.
const BACKDROPS = { grit: "grit", club: "club", cebador: "cebador", sonria: "cebador", miga: "cebador", guardia: "guardia" } as const

function projectNamed(id: string): Project {
  const project = projects.find((entry) => entry.id === id)
  if (!project) throw new Error(`The group names a project that does not exist: ${id}`)
  return project
}

function groupItem(project: Project): GroupItem {
  const kind = DEVICES[project.id as keyof typeof DEVICES]
  if (!kind) throw new Error(`No device is mapped for project ${project.id}`)
  const backdrop = BACKDROPS[project.id as keyof typeof BACKDROPS]
  if (!backdrop && kind !== "terminal") throw new Error(`No backdrop is mapped for project ${project.id}`)
  return {
    project,
    kind,
    art: (
      <>
        {backdrop && <ProjectBackdrop name={backdrop} />}
        <ProjectPlate name={project.id} />
      </>
    ),
  }
}

// The projects are four chapters by kind, one pinned scene each: the apps, the landings, the game and the tools. Inside a
// chapter the scroll walks each project's beats and then turns to the next; the chapters alternate their composition.
export function Projects() {
  return (
    <section data-chapter="projects" id="projects" className="projects">
      <ChapterWord id="projects" heading="h2" numeral="02" note={`${projects.length} projects`}>
        Projects
      </ChapterWord>
      {groups.map((group, order) => (
        <ProjectGroupScene
          key={group.id}
          id={group.id}
          label={group.label}
          noun={group.noun}
          line={group.line}
          composition={order % 2 === 0 ? "a" : "b"}
          items={group.projects.map((id) => groupItem(projectNamed(id)))}
        />
      ))}
    </section>
  )
}
