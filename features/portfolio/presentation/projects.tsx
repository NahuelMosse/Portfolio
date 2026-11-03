import { groups, projects, type Project } from "./content"
import { ChapterWord } from "./chapter-word"
import { KitScene } from "./kit-scene"
import { ProjectBackdrop, ProjectPlate, TrackPlate } from "./project-backdrop"
import { ProjectGroupScene, type GroupItem } from "./project-group"

// The device each project shows its screens in: a phone, or a browser.
const DEVICES = {
  grit: "phone",
  club: "phone",
  cebador: "browser",
  sonria: "browser",
  miga: "browser",
  guardia: "browser",
} as const

// The art files each project draws on: the backdrop and the plate are named after a world. The landings share the backdrop of
// the first one; each of them has its own plate when it is delivered.
const BACKDROPS = { grit: "grit", club: "club", cebador: "cebador", sonria: "cebador", miga: "cebador", guardia: "guardia" } as const

const DEV_KIT = "dev-kit"

function projectNamed(id: string): Project {
  const project = projects.find((entry) => entry.id === id)
  if (!project) throw new Error(`The group names a project that does not exist: ${id}`)
  return project
}

function groupItem(project: Project): GroupItem {
  const kind = DEVICES[project.id as keyof typeof DEVICES]
  const backdrop = BACKDROPS[project.id as keyof typeof BACKDROPS]
  if (!kind || !backdrop) throw new Error(`No device or backdrop is mapped for project ${project.id}`)
  return {
    project,
    kind,
    art: (
      <>
        <ProjectBackdrop name={backdrop} />
        <ProjectPlate name={project.id} />
      </>
    ),
  }
}

// The projects are four chapters by kind, one pinned scene each: the apps, the landings, the game and the dev kit. Inside a chapter the
// visitor picks the project with a click; the scroll only walks the beats of the one on show. The dev kit is the last chapter:
// a card walks the method's stations. The chapters alternate their composition.
export function Projects() {
  return (
    <section data-chapter="projects" id="projects" className="projects">
      <ChapterWord id="projects" heading="h2" numeral="02" note={`${projects.length} projects`}>
        Projects
      </ChapterWord>
      {groups.map((group, order) => {
        if (group.id === DEV_KIT)
          return (
            <KitScene
              key={group.id}
              id={group.id}
              label={group.label}
              project={projectNamed(DEV_KIT)}
              art={
                <>
                  <ProjectBackdrop name="kit" />
                  <ProjectPlate name="kit" />
                  <TrackPlate />
                </>
              }
            />
          )
        return (
          <ProjectGroupScene
            key={group.id}
            id={group.id}
            label={group.label}
            noun={group.noun}
            line={group.line}
            composition={order % 2 === 0 ? "a" : "b"}
            items={group.projects.map((id) => groupItem(projectNamed(id)))}
          />
        )
      })}
    </section>
  )
}
