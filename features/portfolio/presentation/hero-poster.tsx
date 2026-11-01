import { CharacterSheet } from "./character-sheet"
import { ChapterIllustration } from "./chapter-illustration"
import { identity } from "./content"

// The cold open: his illustration with the sealed envelope, NAWI over its dark top, the identification sheet,
// who he is and the door. On a phone the sheet, the line and the door follow the illustration in flow.
export function HeroPoster() {
  return (
    <section data-chapter="cold-open" className="cold-open">
      <ChapterIllustration asset="ill-cover-16x9" tallAsset="ill-cover-9x16" eager className="cover-scene">
        <h1 data-layer="mark" tabIndex={-1} className="mark">{identity.mark}</h1>
        <p data-name="professional" className="professional-name">{identity.professionalName}</p>
      </ChapterIllustration>
      <div className="cover-foot">
        <div className="layer-sheet">
          <CharacterSheet />
        </div>
        <p className="hero-line">
          <strong>{identity.greeting}</strong>
          {identity.promise}
        </p>
        <a data-door="" className="door hero-door" href="#end-credits">
          Hire me for a project
        </a>
      </div>
    </section>
  )
}
