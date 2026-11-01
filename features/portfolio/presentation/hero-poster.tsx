import { DepthLayer, DepthStage } from "@/features/film/presentation/depth-stage"
import { CharacterSheet } from "./character-sheet"
import { identity } from "./content"

export function HeroPoster() {
  return (
    <section data-chapter="cold-open" data-tone="dark" className="chapter cold-open">
      <div data-media className="chapter-media" aria-hidden="true" />
      <DepthStage className="stage">
        <DepthLayer name="backdrop" pointerDepth={24} scrollLag={0.1} className="layer-backdrop" />
        <DepthLayer name="mark" pointerDepth={60} scrollLag={0.2} className="layer layer-mark">
          <h1 className="mark">{identity.mark}</h1>
        </DepthLayer>
        <p data-name="professional" className="professional-name">
          {identity.professionalName}
        </p>
        <DepthLayer name="cutout" pointerDepth={110} scrollLag={0.35} className="layer-cutout" >
          <div className="cutout-disc" aria-hidden="true" />
          <div data-arch className="arch" style={{ height: "100%" }} aria-hidden="true" />
        </DepthLayer>
        <DepthLayer name="sheet" pointerDepth={160} scrollLag={0.5} className="layer-sheet">
          <CharacterSheet />
        </DepthLayer>
        <p className="hero-line">
          <strong>{identity.greeting}</strong>
          {identity.promise}
        </p>
      </DepthStage>
      <div data-transition className="chapter-transition" style={{ ["--next-tone" as string]: "var(--bone)" }} aria-hidden="true" />
    </section>
  )
}
