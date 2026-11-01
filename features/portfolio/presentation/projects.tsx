import { SceneMedia } from "@/features/film";
import { projects, type Project } from "./content";
import { ChapterWord } from "./chapter-word";
import { Piece } from "./piece";
import { PieceRow } from "./piece-row";
import { PosterDevice, type DeviceKind } from "./poster-device";
import { ProjectSpread } from "./project-spread";

// The device each project's lead interface sits in: a phone for an app, a browser for a page or a game.
const DEVICES: Record<string, DeviceKind> = {
  "dev-kit": "wide",
  grit: "phone",
  guardia: "wide",
  cebador: "wide",
  club: "phone",
};

// The word set at poster scale; the kit's title is a sentence, so it has a short word of its own.
const POSTER_WORDS: Record<string, string> = { "dev-kit": "Dev kit" };

// What the frame shows: the kit's typed documents, or the project's lead piece.
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

// The camel-case words of a name are stacked, one per line, as on a poster.
function PosterWord({ word }: { word: string }) {
  return (
    <p data-poster-word="" className="poster-word" aria-hidden="true">
      {word.split(/(?<=[a-z])(?=[A-Z])/).map((part) => (
        <span key={part}>{part}</span>
      ))}
    </p>
  );
}

// Fine small type along the top of the poster: the maker, the case number, a hairline and a four-point star.
function PosterDetail({ numeral, total }: { numeral: string; total: number }) {
  return (
    <p data-poster-detail="" className="poster-strip" aria-hidden="true">
      <span>NAWI</span>
      <span>
        Case {numeral} / {String(total).padStart(2, "0")}
      </span>
      <i />
      <span>Case file 001</span>
      <b />
    </p>
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

// Each project is a type poster: a field of the product's own color, its real interface large in a plain frame, its case
// numeral and word at poster scale crossing the frame, then its title, line, stack and link and its other pieces in view
// with it. The cases alternate their composition.
export function Projects() {
  return (
    <section data-chapter="projects" id="projects" className="projects">
      <ChapterWord
        id="projects"
        heading="h2"
        numeral="01"
        note={`${projects.length} projects`}
      >
        Projects
      </ChapterWord>
      {projects.map((project, index) => {
        const device = DEVICES[project.id];
        if (!device)
          throw new Error(`No device is mapped for project ${project.id}`);
        const numeral = String(index + 1).padStart(2, "0");
        const others = project.pieces.slice(project.documents ? 0 : 1);
        return (
          <ProjectSpread
            key={project.id}
            id={project.id}
            composition={index % 2 === 0 ? "a" : "b"}
          >
            <PosterDetail numeral={numeral} total={projects.length} />
            <p data-poster-numeral="" className="poster-numeral" aria-hidden="true">
              {numeral}
            </p>
            <PosterWord word={POSTER_WORDS[project.id] ?? project.name} />
            <div className="spread-main" data-device={device}>
              <ProjectText project={project} />
              <PosterDevice device={device}>
                <ScreenContent project={project} />
              </PosterDevice>
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
