import type { CSSProperties } from "react";
import { SceneMedia, sceneAsset } from "@/features/film";
import { projects, type Project } from "./content";
import { ChapterWord } from "./chapter-word";
import { DrawnScene } from "./drawn-scene";
import { KitArt } from "./kit-art";
import { KitDiagram } from "./kit-diagram";
import { KitPiece } from "./kit-piece";
import { KIT_STEPS } from "./kit-step-icon";
import { Piece } from "./piece";
import { PieceRow } from "./piece-row";
import { ProjectSpread } from "./project-spread";
import { KIT_ART, SCENE_ART, type SceneArt } from "./scene-art";

// The device the illustration of each project draws, which sizes the poster around it: a phone, or a wide screen.
// The kit draws no device: its lead is a diagram and its illustration is printed behind it.
const DEVICES: Record<string, "phone" | "wide"> = {
  "dev-kit": "wide",
  grit: "phone",
  guardia: "wide",
  cebador: "wide",
  club: "phone",
};

// The word set at poster scale; the kit's title is a sentence, so it has a short word of its own.
const POSTER_WORDS: Record<string, string> = { "dev-kit": "Dev kit", club: "Club" };

const DEV_KIT = "dev-kit";

// The image files of an illustration at both widths; an undelivered file is an error, not a poster without its art.
function printed(files: { desktop: string; mobile: string }) {
  const sources = { desktop: sceneAsset(files.desktop, "webp"), mobile: sceneAsset(files.mobile, "webp") };
  if (!sources.desktop || !sources.mobile)
    throw new Error(`The illustration ${files.desktop} or ${files.mobile} is not delivered`);
  return { desktop: sources.desktop, mobile: sources.mobile };
}

// The lead piece of a project: the real interface that goes inside the drawn screen.
function LeadMedia({ project }: { project: Project }) {
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

// The word is one line; its length sizes it to the width of the viewport.
function PosterWord({ word }: { word: string }) {
  return (
    <p
      data-poster-word=""
      className="poster-word"
      aria-hidden="true"
      style={{ "--chars": word.length } as CSSProperties}
    >
      {word}
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

// The stage of a project: the dev kit's diagram, or the real interface set in the screen its illustration draws.
function Stage({
  project,
  art,
  composition,
}: {
  project: Project;
  art: SceneArt | undefined;
  composition: "a" | "b";
}) {
  if (project.id === DEV_KIT) return <KitDiagram />;
  if (!art) throw new Error(`No illustration is mapped for project ${project.id}`);
  const sources = printed({ desktop: art.desktop.file, mobile: art.mobile.file });
  return (
    <DrawnScene art={art} sources={sources} composition={composition}>
      <LeadMedia project={project} />
    </DrawnScene>
  );
}

// The pieces beside the lead: real screens for a project with an interface, close-ups of the path's steps for the kit.
function Others({ project }: { project: Project }) {
  if (project.id === DEV_KIT)
    return (
      <PieceRow count={KIT_STEPS.length}>
        {KIT_STEPS.map((step, order) => (
          <KitPiece key={step.id} step={step} order={order + 1} />
        ))}
      </PieceRow>
    );
  const others = project.pieces.slice(1);
  return (
    <PieceRow count={others.length}>
      {others.map((piece, order) => (
        <Piece key={piece.caption} piece={piece} order={order + 1} />
      ))}
    </PieceRow>
  );
}

// Each project is a type poster: a field of the product's own color with its ink illustration printed on it, its real
// interface large inside the screen that illustration draws, its case numeral and word at poster scale crossing it, then
// its title, line, stack and link and its other pieces in view with it. The cases alternate their composition.
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
        const composition = index % 2 === 0 ? "a" : "b";
        const art = SCENE_ART[project.id];
        return (
          <ProjectSpread key={project.id} id={project.id} composition={composition}>
            {project.id === DEV_KIT && <KitArt sources={printed(KIT_ART)} />}
            <PosterDetail numeral={numeral} total={projects.length} />
            <p data-poster-numeral="" className="poster-numeral" aria-hidden="true">
              {numeral}
            </p>
            <PosterWord word={POSTER_WORDS[project.id] ?? project.name} />
            <div className="spread-main" data-device={device} data-hand-held={art?.handHeld ? "" : undefined}>
              <ProjectText project={project} />
              <Stage project={project} art={art} composition={composition} />
              <div className="scene-pieces" data-has-scene="">
                <Others project={project} />
              </div>
            </div>
          </ProjectSpread>
        );
      })}
    </section>
  );
}
