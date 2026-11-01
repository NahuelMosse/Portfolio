import { SceneMedia, sceneAsset } from "@/features/film"
import { offer, projects, type Piece as PieceData } from "./content"
import { Piece } from "./piece"
import { PieceRow } from "./piece-row"

// One still of each personal project that has a screen: the freelance offer recalls the volume of real work.
const strip: readonly PieceData[] = projects.flatMap((project) => {
  const first = project.pieces.find((piece) => piece.kind === "screen" || piece.kind === "capture")
  if (!first) return []
  if (first.kind !== "capture") return [first]
  return [{ kind: "screen" as const, src: first.poster, alt: first.alt, caption: `${project.name}, ${first.caption}` }]
})

function FolderImage() {
  return <SceneMedia asset="pf-folder-open-4x5" poster={sceneAsset("pf-folder-open-4x5", "webp")} className="folder-media" />
}

// The offer is two open folders, each on paper under the lamp.
export function Offer() {
  return (
    <div data-offer="" data-thread-stop="offer" className="offer">
      <section data-offer-card="freelance" data-paper="folder" data-lamp-target="" className="folder">
        <FolderImage />
        <h3>{offer.freelance.title}</h3>
        <p>{offer.freelance.line}</p>
        <p>{offer.freelance.detail}</p>
        <PieceRow count={strip.length} className="piece-strip">
          {strip.map((piece) => (
            <Piece key={piece.caption} piece={piece} />
          ))}
        </PieceRow>
      </section>
      <section data-offer-card="tpm" data-paper="folder" data-lamp-target="" className="folder">
        <FolderImage />
        <h3>{offer.tpm.title}</h3>
        <p>{offer.tpm.line}</p>
        <p>{offer.tpm.detail}</p>
        <a href="#dev-kit">See the proof: the dev kit</a>
      </section>
    </div>
  )
}
