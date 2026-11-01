import { SceneMedia, sceneAsset } from "@/features/film";
import { projects, type Project } from "./content";
import { Piece } from "./piece";
import { PieceRow } from "./piece-row";
import { ProjectScene, type DeviceKind } from "./project-scene";
import { ProjectSpread } from "./project-spread";

// The scene illustration of each project (ill-scene-<name>-16x9 and -4x5) and the device drawn in it, by project id.
const SCENES: Record<string, { name: string; device: DeviceKind }> = {
  "dev-kit": { name: "kit", device: "wide" },
  grit: { name: "grit", device: "phone" },
  guardia: { name: "triaje", device: "wide" },
  cebador: { name: "cebador", device: "wide" },
  club: { name: "club", device: "phone" },
};

const FIELDS = [
  { key: "what", label: "What" },
  { key: "problem", label: "Problem" },
  { key: "role", label: "My role" },
] as const;

// What the drawn screen shows: the lead piece, or for the kit the card and its tests as typed documents.
function ScreenContent({ project }: { project: Project }) {
  const [lead, second] = project.pieces;
  if ("lines" in lead) {
    const documents = [lead, second].filter(
      (piece) => piece && "lines" in piece,
    );
    return (
      <div data-document="" className="scene-document">
        {documents.map((piece) => (
          <div key={piece.caption}>
            <p>{piece.caption}</p>
            {"lines" in piece &&
              piece.lines.map((line) => <span key={line}>{line}</span>)}
          </div>
        ))}
      </div>
    );
  }
  if ("video" in lead)
    return (
      <SceneMedia
        capture
        poster={lead.poster}
        video={lead.video}
        alt={lead.alt}
      />
    );
  return <SceneMedia poster={lead.src} alt={lead.alt} />;
}

function Title({ project }: { project: Project }) {
  // a camel-case name may break only between its words, never inside one
  const words = project.name.split(/(?<=[a-z])(?=[A-Z])/);
  return (
    <h3 tabIndex={-1}>
      {words.map((word, index) => (
        <span key={word}>
          {index > 0 && <wbr />}
          {word}
        </span>
      ))}
    </h3>
  );
}

function ProjectText({ project }: { project: Project }) {
  return (
    <div data-project-text="" className="project-text">
      <Title project={project} />
      <div className="project-details">
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
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Each project is its real interface, large, framed by the illustration cropped around the device drawn for it,
// with its words beside it. An undelivered scene falls back to the lead piece in a device frame at the same size.
export function Projects() {
  return (
    <section data-chapter="projects" id="projects" className="projects">
      <h2 tabIndex={-1} className="chapter-heading">
        Projects
      </h2>
      {projects.map((project) => {
        const scene = SCENES[project.id];
        if (!scene)
          throw new Error(`No scene is mapped for project ${project.id}`);
        const asset = `ill-scene-${scene.name}`;
        const wide = sceneAsset(`${asset}-16x9`, "webp");
        const tall = sceneAsset(`${asset}-4x5`, "webp");
        const delivered = wide && tall;
        const onScreen = delivered && "lines" in project.pieces[0] ? 2 : 1;
        const beneath = project.pieces.slice(onScreen);
        return (
          <ProjectSpread key={project.id} id={project.id}>
            <div className="spread-main">
              <ProjectText project={project} />
              {delivered ? (
                <ProjectScene
                  asset={asset}
                  wide={wide}
                  tall={tall}
                  device={scene.device}
                >
                  <ScreenContent project={project} />
                </ProjectScene>
              ) : (
                <div data-device={scene.device} className="stage-fallback">
                  <Piece piece={project.pieces[0]} lead order={0} />
                </div>
              )}
            </div>
            {beneath.length > 0 && (
              <div className="scene-pieces" data-has-scene="">
                <PieceRow count={beneath.length}>
                  {beneath.map((piece, order) => (
                    <Piece
                      key={piece.caption}
                      piece={piece}
                      order={order + 1}
                    />
                  ))}
                </PieceRow>
              </div>
            )}
          </ProjectSpread>
        );
      })}
    </section>
  );
}
