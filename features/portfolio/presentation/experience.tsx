import { Chapter, Reveal, SceneMedia, sceneAsset } from "@/features/film"
import { experience } from "./content"
import { Piece } from "./piece"

export function Experience() {
  return (
    <Chapter id="experience" label="Experience" tone="dark" nextTone="dark" seamSide="left" title={<>Where I <em>served</em></>}>
      <SceneMedia
        asset="pf-world-16x9"
        poster={sceneAsset("pf-world-16x9", "webp")}
        tallPoster={sceneAsset("pf-world-9x16", "webp")}
        className="world-media"
      />
      {experience.map((employer) => (
        <Reveal
          key={employer.id}
          data-employer={employer.id}
          data-current={String(employer.current === true)}
          data-thread-stop={`employer:${employer.id}`}
          className="employer story"
        >
          <header className="story-text">
            <h3>{employer.name}</h3>
            <span className="period">{employer.period}</span>
            <SceneMedia
              asset={`pf-exp-${employer.id}-16x9`}
              poster={sceneAsset(`pf-exp-${employer.id}-16x9`, "webp")}
              alt={`${employer.name}, painted`}
              className="scene-wide"
            />
          </header>
          <div>
            <p data-field="what">{employer.what}</p>
            <p data-field="problem">{employer.problem}</p>
            <p data-field="role">{employer.role}</p>
          </div>
          {employer.pieces.length > 0 && (
            <div className="pieces">
              {employer.pieces.map((piece) => (
                <Piece key={piece.caption} piece={piece} />
              ))}
            </div>
          )}
        </Reveal>
      ))}
    </Chapter>
  )
}
