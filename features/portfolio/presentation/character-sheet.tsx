import { identity } from "./content"

const FIELDS = [
  ["Subject", identity.mark],
  ["Name", identity.professionalName],
  ["Role", identity.role],
  ["Base", identity.base],
  ["Known for", identity.knownFor],
] as const

// The identification sheet: the typed fields of the file, with no portrait.
export function CharacterSheet() {
  return (
    <aside data-id-sheet="" aria-label="Identification sheet" className="id-sheet">
      <div className="sheet-head">
        <p className="sheet-title">Identification sheet</p>
      </div>
      <dl>
        {FIELDS.map(([label, value]) => (
          <div key={label} className="sheet-row">
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}
