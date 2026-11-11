import { CharacterSheet } from "./character-sheet"
import { ChapterIllustration } from "./chapter-illustration"
import { ColdOpenMotion } from "./cold-open-motion"
import { identity } from "./content"
import { SoundBars } from "@/features/film"

// The cold open: his illustration with the sealed envelope, NAWI over its dark top, the identification sheet,
// and the door. On a phone the sheet and the door follow the illustration in flow.
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
          <p className="professional-name cover-cue" aria-hidden="true">
            <SoundBars />
            <span>Click anywhere — sound on</span>
          </p>
        </div>
      </ChapterIllustration>
      <div className="cover-foot">
        <div className="layer-sheet">
          <CharacterSheet />
        </div>
      </div>
      <ColdOpenMotion />
    </section>
  )
}
