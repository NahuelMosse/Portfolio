import { CharacterSheet } from "./character-sheet"
import { ChapterIllustration } from "./chapter-illustration"
import { ColdOpenMotion } from "./cold-open-motion"
import { identity } from "./content"

// The cold open: his illustration with the sealed envelope, NAWI over its dark top, the identification sheet,
// who he is and the door. On a phone the sheet, the line and the door follow the illustration in flow.
export function HeroPoster() {
  return (
    <section data-chapter="cold-open" id="cold-open" className="cold-open">
      <ChapterIllustration asset="ill-cover-16x9" tallAsset="ill-cover-9x16" eager className="cover-scene">
        <div className="cover-title">
          <h1 data-layer="mark" tabIndex={-1} className="mark">{identity.mark}</h1>
          <p data-name="professional" className="professional-name">
            <span>{identity.professionalName}</span>
            <i />
            <span>{identity.base}</span>
          </p>
        </div>
      </ChapterIllustration>
      <div className="cover-foot">
        <div className="layer-sheet">
          <CharacterSheet />
        </div>
        <p className="hero-line">
          <strong>{identity.greeting}</strong>
          {identity.promise}
        </p>
      </div>
      <ColdOpenMotion />
    </section>
  )
}
