import { SceneMedia } from "@/features/film"
import type { Piece as PieceData } from "./content"

function PieceBody({ piece }: { piece: PieceData }) {
  if ("video" in piece) return <SceneMedia capture poster={piece.poster} video={piece.video} alt={piece.alt} />
  if ("src" in piece) return <SceneMedia poster={piece.src} alt={piece.alt} />
  return (
    <span className="piece-text">
      {piece.lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
      {piece.href && (
        <a href={piece.href} target="_blank" rel="noreferrer">
          Open
        </a>
      )}
    </span>
  )
}

// Every real piece is printed the same way: cut by a clip-path, graded, and under the grain.
export function Piece({ piece }: { piece: PieceData }) {
  return (
    <figure data-piece="" data-kind={piece.kind} className="piece">
      <PieceBody piece={piece} />
      <span data-grain="" className="grain" aria-hidden="true" />
      <figcaption>{piece.caption}</figcaption>
    </figure>
  )
}
