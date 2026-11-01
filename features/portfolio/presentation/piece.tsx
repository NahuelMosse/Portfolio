import { SceneMedia } from "@/features/film"
import type { Piece as PieceData } from "./content"
import { DeviceFrame, type FrameKind } from "./device-frame"

type PieceProps = { piece: PieceData; lead?: boolean; order: number }

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

const frameOf = (piece: PieceData): FrameKind => ("frame" in piece ? piece.frame : "document")

// One real piece in its frame. The lead piece is the first of its case; `order` staggers its entrance.
export function Piece({ piece, lead, order }: PieceProps) {
  return (
    <div data-piece="" data-lead={lead ? "" : undefined} data-kind={piece.kind} data-whole={"whole" in piece ? "" : undefined} className="piece" style={{ "--order": order } as React.CSSProperties}>
      <DeviceFrame kind={frameOf(piece)} label={piece.caption}>
        <PieceBody piece={piece} />
      </DeviceFrame>
    </div>
  )
}
