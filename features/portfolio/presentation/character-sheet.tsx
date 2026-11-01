import { SceneMedia, sceneAsset } from "@/features/film"
import { identity } from "./content"

function FourPointStar() {
  return (
    <svg data-star className="star" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" />
    </svg>
  )
}

const PHOTOS = [
  { asset: "pf-id-front", alt: "Nahuel Mosse, front" },
  { asset: "pf-id-profile", alt: "Nahuel Mosse, profile" },
] as const

// The identification sheet clipped beside him: two small photos of him and the typed fields of the file.
export function CharacterSheet() {
  return (
    <aside data-id-sheet="" data-paper="id-sheet" aria-label="Identification sheet">
      <div data-frame className="sheet-frame">
        <FourPointStar />
        <div className="sheet-photos">
          {PHOTOS.map(({ asset, alt }) => (
            <SceneMedia key={asset} asset={asset} poster={sceneAsset(asset, "webp")} alt={alt} className="sheet-photo" />
          ))}
        </div>
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
        <span data-stamp="" className="stamp">Active</span>
      </div>
      <span data-leader className="leader" aria-hidden="true" />
    </aside>
  )
}
