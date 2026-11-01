import { SceneMedia, sceneAsset } from "@/features/film"
import { offer, projects, type Piece as PieceData } from "./content"
import { Piece } from "./piece"

// One still of each personal project that has a screen: the freelance offer recalls the volume of real work.
const strip: readonly PieceData[] = projects.flatMap((project) => {
  const first = project.pieces.find((piece) => piece.kind === "screen" || piece.kind === "capture")
  if (!first) return []
  if (first.kind !== "capture") return [first]
  return [{ kind: "screen" as const, src: first.poster, alt: first.alt, caption: `${project.name}, ${first.caption}` }]
})

export function Offer() {
  return (
    <div data-offer="" data-thread-stop="offer" className="offer">
      <section data-offer-card="freelance">
        <SceneMedia
          asset="pf-offer-freelance-4x5"
          poster={sceneAsset("pf-offer-freelance-4x5", "webp")}
          alt="The freelance workshop, painted"
          className="arch-media"
        />
        <h3>{offer.freelance.title}</h3>
        <p>{offer.freelance.line}</p>
        <p>{offer.freelance.detail}</p>
        <div data-piece-strip="" className="piece-strip">
          {strip.map((piece) => (
            <Piece key={piece.caption} piece={piece} />
          ))}
        </div>
      </section>
      <section data-offer-card="tpm">
        <SceneMedia
          asset="pf-offer-tpm-4x5"
          poster={sceneAsset("pf-offer-tpm-4x5", "webp")}
          alt="The command bridge, painted"
          className="arch-media"
        />
        <h3>{offer.tpm.title}</h3>
        <p>{offer.tpm.line}</p>
        <p>{offer.tpm.detail}</p>
        <a href="#dev-kit">See the proof: the dev kit</a>
      </section>
    </div>
  )
}
