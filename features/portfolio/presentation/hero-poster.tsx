import { ColdOpenBackdrop, DepthLayer, DepthStage } from "@/features/film"
import { CharacterSheet } from "./character-sheet"
import { identity } from "./content"

// The subject of the file: the desk under the lamp with height lines, NAWI huge over it, the typed file label, the
// identification sheet clipped over the photo's edge, then who he is and the door. The thread starts at the first ring.
export function HeroPoster() {
  return (
    <section data-chapter="cold-open" className="chapter cold-open">
      <div data-media className="chapter-media" aria-hidden="true" />
      <span data-thread-start="" className="chapter-ring" aria-hidden="true" />
      <DepthStage className="stage">
        <DepthLayer name="backdrop" pointerDepth={24} scrollLag={0.1} className="layer-backdrop">
          <ColdOpenBackdrop />
          <div data-height-lines="" className="height-lines" aria-hidden="true" />
        </DepthLayer>
        <p data-case-file-label="" className="case-file-label">CASE FILE 001 — CLASSIFIED</p>
        <DepthLayer name="mark" pointerDepth={60} scrollLag={0.2} className="layer layer-mark">
          <h1 tabIndex={-1} className="mark">{identity.mark}</h1>
        </DepthLayer>
        <p data-name="professional" className="professional-name">
          {identity.professionalName}
        </p>
        <DepthLayer name="sheet" pointerDepth={160} scrollLag={0.5} className="layer-sheet">
          <CharacterSheet />
        </DepthLayer>
        <p className="hero-line">
          <strong>{identity.greeting}</strong>
          {identity.promise}
        </p>
        <a data-door="" className="door hero-door" href="#end-credits">
          Hire me for a project
        </a>
      </DepthStage>
    </section>
  )
}
