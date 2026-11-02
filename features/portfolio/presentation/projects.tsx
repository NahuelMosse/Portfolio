import { projects } from "./content"
import { ChapterWord } from "./chapter-word"
import { KitScene } from "./kit-scene"
import { ProjectBackdrop, ProjectPlate, TrackPlate } from "./project-backdrop"
import { ProjectShowcase, type IndexEntry } from "./project-showcase"

// The device each project shows its screens in: a phone, or a browser.
const DEVICES = {
  grit: "phone",
  guardia: "browser",
  cebador: "browser",
  club: "phone",
} as const

// The name of each project's art files: bg-<name>-16x9 and bg-<name>-9x16.
const BACKDROPS = { grit: "grit", guardia: "guardia", cebador: "cebador", club: "club" } as const

// The word set at poster scale and shown in the index; a long name has a short word of its own.
const SHORT_NAMES: Record<string, string> = { "dev-kit": "Dev kit", club: "Club" }

const DEV_KIT = "dev-kit"

const shortName = (id: string, name: string) => SHORT_NAMES[id] ?? name

// Each project is a pinned scene of its own, one after the other: the section holds still while the real screens of the
// product change inside one large device standing in the art, and short captions tell it beat by beat. The dev kit is the
// first scene: a card walks the method's stations. The cases alternate their composition.
export function Projects() {
  const entries: IndexEntry[] = projects.map((project) => ({ id: project.id, label: shortName(project.id, project.name) }))

  return (
    <section data-chapter="projects" id="projects" className="projects">
      <ChapterWord id="projects" heading="h2" numeral="01" note={`${projects.length} projects`}>
        Projects
      </ChapterWord>
      {projects.map((project, index) => {
        if (project.id === DEV_KIT)
          return (
            <KitScene
              key={project.id}
              project={project}
              index={index}
              entries={entries}
              art={
                <>
                  <ProjectBackdrop name="kit" />
                  <ProjectPlate name="kit" />
                  <TrackPlate />
                </>
              }
            />
          )
        const kind = DEVICES[project.id as keyof typeof DEVICES]
        const backdrop = BACKDROPS[project.id as keyof typeof BACKDROPS]
        if (!kind || !backdrop) throw new Error(`No device or backdrop is mapped for project ${project.id}`)
        return (
          <ProjectShowcase
            key={project.id}
            project={project}
            index={index}
            kind={kind}
            art={
              <>
                <ProjectBackdrop name={backdrop} />
                <ProjectPlate name={backdrop} />
              </>
            }
            word={shortName(project.id, project.name)}
            composition={index % 2 === 0 ? "a" : "b"}
            entries={entries}
          />
        )
      })}
    </section>
  )
}
