import { doorHref, offer } from "./content"

type Door = typeof offer.freelance | typeof offer.tpm

function Folder({ id, tab, card }: { id: "freelance" | "tpm"; tab: string; card: Door }) {
  return (
    <article data-offer-card={id} className="folder">
      <p className="folder-tab">{tab}</p>
      <h3>{card.title}</h3>
      <p>{card.line}</p>
      <p>{card.detail}</p>
      {id === "tpm" && <a href="#tools" className="proof-link">See the proof: my tools</a>}
      <a className="door" href={doorHref(card)}>{card.door}</a>
    </article>
  )
}

// The offer is two folders over the two-doors illustration, each with its door button.
export function Offer() {
  return (
    <div data-offer="" data-doors="" className="offer">
      <Folder id="freelance" tab="Freelance" card={offer.freelance} />
      <Folder id="tpm" tab="Companies" card={offer.tpm} />
    </div>
  )
}
