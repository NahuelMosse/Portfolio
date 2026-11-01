import { SceneMedia, sceneAsset } from "@/features/film"
import { identity } from "./content"

const PHOTOS = [
  { asset: "pf-id-front", alt: "Nahuel Mosse, front" },
  { asset: "pf-id-profile", alt: "Nahuel Mosse, profile" },
] as const

// The identification sheet: the delivered photos of him (an undelivered one leaves no element) and the typed fields of the file.
export function CharacterSheet() {
  const delivered = PHOTOS.filter(({ asset }) => sceneAsset(asset, "webp"))
  return (
    <aside data-id-sheet="" aria-label="Identification sheet" className="id-sheet">
      <p className="sheet-title">Identification sheet</p>
      {delivered.length > 0 && (
        <div className="sheet-photos">
          {delivered.map(({ asset, alt }) => (
            <SceneMedia key={asset} asset={asset} poster={sceneAsset(asset, "webp")} alt={alt} className="sheet-photo" />
          ))}
        </div>
      )}
      <dl>
        <dt>Subject</dt>
        <dd>{identity.mark}</dd>
        <dt>Name</dt>
        <dd>{identity.professionalName}</dd>
        <dt>Role</dt>
        <dd>{identity.role}</dd>
        <dt>Base</dt>
        <dd>{identity.base}</dd>
        <dt>Known for</dt>
        <dd>{identity.knownFor}</dd>
      </dl>
    </aside>
  )
}
