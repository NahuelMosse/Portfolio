import { identity } from "./content"

function FourPointStar() {
  return (
    <svg data-star className="star" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" />
    </svg>
  )
}

export function CharacterSheet() {
  return (
    <aside aria-label="Character sheet">
      <div data-frame className="sheet-frame">
        <FourPointStar />
        <dl>
          <dt>Class</dt>
          <dd>{identity.role}</dd>
          <dt>Base</dt>
          <dd>{identity.base}</dd>
          <dt>Guild</dt>
          <dd>{identity.guild}</dd>
          <dt>Skills</dt>
          <dd>{identity.skills.join(", ")}</dd>
        </dl>
        <p data-off-duty>{identity.offDuty}</p>
      </div>
      <span data-leader className="leader" aria-hidden="true" />
    </aside>
  )
}
