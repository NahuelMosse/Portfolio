import { SceneMedia, sceneAsset } from "@/features/film";
import { projects, type Project } from "./content";
import { ChapterWord } from "./chapter-word";
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

// What the drawn screen shows: the kit's typed documents, or the project's lead piece.
function ScreenContent({ project }: { project: Project }) {
  if (project.documents) {
    return (
      <div data-document="" className="scene-document">
        {project.documents.map((document) => (
          <div key={document.caption}>
            <p>{document.caption}</p>
            {document.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        ))}
      </div>
    );
  }
  const [lead] = project.pieces;
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
        <p data-field="line" className="project-line">
          {project.line}
        </p>
        <div className="spread-meta">
          <ul data-stack="" className="stack" aria-label="Stack">
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
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
// with its title, line, stack and link beside or above it and its other pieces in view with it. An undelivered scene
// falls back to the lead piece in a device frame at the same size.
export function Projects() {
  return (
    <section data-chapter="projects" id="projects" className="projects">
      <ChapterWord id="projects" heading="h2" numeral="01" note={`${projects.length} projects`}>
        Projects
      </ChapterWord>
      {projects.map((project) => {
        const scene = SCENES[project.id];
        if (!scene)
          throw new Error(`No scene is mapped for project ${project.id}`);
        const asset = `ill-scene-${scene.name}`;
        const wide = sceneAsset(`${asset}-16x9`, "webp");
        const tall = sceneAsset(`${asset}-4x5`, "webp");
        const delivered = wide && tall;
        const onScreen = delivered && project.documents ? 0 : 1;
        const others = project.pieces.slice(onScreen);
        return (
          <ProjectSpread key={project.id} id={project.id}>
            <div className="spread-main" data-device={scene.device}>
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
              <div className="scene-pieces" data-has-scene="">
                <PieceRow count={others.length}>
                  {others.map((piece, order) => (
                    <Piece
                      key={piece.caption}
                      piece={piece}
                      order={order + 1}
                    />
                  ))}
                </PieceRow>
              </div>
            </div>
          </ProjectSpread>
        );
      })}
    </section>
  );
}
