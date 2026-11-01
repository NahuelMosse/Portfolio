import { SceneMedia, sceneAsset } from "@/features/film"
import { projects, type Project } from "./content"
import { Piece } from "./piece"
import { PieceRow } from "./piece-row"
import { ProjectScene } from "./project-scene"
import { ProjectSpread } from "./project-spread"

// The scene illustration of each project, by project id: ill-scene-<name>-16x9 and -4x5.
const SCENE_NAMES: Record<string, string> = {
  "dev-kit": "kit",
  grit: "grit",
  guardia: "triaje",
  cebador: "cebador",
  club: "club",
}

const FIELDS = [
  { key: "what", label: "What" },
  { key: "problem", label: "Problem" },
  { key: "role", label: "My role" },
] as const

// What the drawn screen shows: the lead piece, or for the kit the card and its tests as typed documents.
function ScreenContent({ project }: { project: Project }) {
  const [lead, second] = project.pieces
  if ("lines" in lead) {
    const documents = [lead, second].filter((piece) => piece && "lines" in piece)
    return (
      <div data-document="" className="scene-document">
        {documents.map((piece) => (
          <div key={piece.caption}>
            <p>{piece.caption}</p>
            {"lines" in piece && piece.lines.map((line) => <span key={line}>{line}</span>)}
          </div>
        ))}
      </div>
    )
  }
  if ("video" in lead) return <SceneMedia capture poster={lead.poster} video={lead.video} alt={lead.alt} />
  return <SceneMedia poster={lead.src} alt={lead.alt} />
}

function Title({ project }: { project: Project }) {
  return <h3 tabIndex={-1}>{project.name}</h3>
}

// Each project is one scene where he holds or sits at a drawn device and the real interface is its screen.
// An undelivered scene falls back to the lead piece in a device frame.
export function Projects() {
  return (
    <section data-chapter="projects" id="projects" className="projects">
      <h2 tabIndex={-1} className="chapter-heading">Projects</h2>
      {projects.map((project) => {
        const name = SCENE_NAMES[project.id]
        if (!name) throw new Error(`No scene is mapped for project ${project.id}`)
        const asset = `ill-scene-${name}`
        const wide = sceneAsset(`${asset}-16x9`, "webp")
        const tall = sceneAsset(`${asset}-4x5`, "webp")
        const scene = wide && tall
        const onScreen = scene && "lines" in project.pieces[0] ? 2 : 1
        const beneath = scene ? project.pieces.slice(onScreen) : project.pieces
        return (
          <ProjectSpread key={project.id} id={project.id}>
            {scene ? (
              <ProjectScene asset={asset} wide={wide} tall={tall} title={<Title project={project} />}>
                <ScreenContent project={project} />
              </ProjectScene>
            ) : (
              <div className="spread-heading">
                <Title project={project} />
              </div>
            )}
            <div className="spread-body">
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
            </div>
            {beneath.length > 0 && (
              <div className="scene-pieces" data-has-scene={scene ? "" : undefined}>
                <PieceRow count={beneath.length}>
                  {beneath.map((piece, order) => (
                    <Piece key={piece.caption} piece={piece} lead={!scene && order === 0} order={order} />
                  ))}
                </PieceRow>
              </div>
            )}
          </ProjectSpread>
        )
      })}
    </section>
  )
}
