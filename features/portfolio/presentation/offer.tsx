import { doorHref, offer } from "./content"

type Door = typeof offer.freelance | typeof offer.tpm

function Folder({ id, tab, card }: { id: "freelance" | "tpm"; tab: string; card: Door }) {
  return (
    <section data-offer-card={id} data-paper="folder" className="paper folder">
      <p className="folder-tab">{tab}</p>
      <h3>{card.title}</h3>
      <p>{card.line}</p>
      <p>{card.detail}</p>
      {id === "tpm" && <a href="#dev-kit" className="proof-link">See the proof: the dev kit</a>}
      <a className="door" href={doorHref(card)}>{card.door}</a>
    </section>
  )
}

// The offer is two open folders on paper, each with its door button.
export function Offer() {
  return (
    <div data-offer="" data-doors="" className="offer">
      <Folder id="freelance" tab="OPEN CASE — FREELANCE" card={offer.freelance} />
      <Folder id="tpm" tab="OPEN CASE — COMPANIES" card={offer.tpm} />
    </div>
  )
}
