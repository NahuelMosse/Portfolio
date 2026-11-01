"use client"

import { useRef, useState, type ReactNode } from "react"

type PieceRowProps = { count: number; children: ReactNode }

// The work of one case on its stage, rendered by the server and passed in. On a phone the pieces are one row that swipes,
// the next piece cut at the edge, with a counter; on a wide screen they are composed, the others overlapping the lead.
export function PieceRow({ count, children }: PieceRowProps) {
  const row = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(1)

  // the piece whose left edge is nearest to the row's scroll position is the one being read
  const follow = () => {
    const node = row.current
    if (!node) return
    const lefts = [...node.querySelectorAll<HTMLElement>("[data-piece]")].map((piece) => Math.abs(piece.offsetLeft - node.scrollLeft))
    setCurrent(lefts.indexOf(Math.min(...lefts)) + 1)
  }

  return (
    <div data-stage="" className="stage">
      <div ref={row} data-pieces="" role="group" aria-label="Pieces of this case" tabIndex={0} className="pieces" onScroll={follow}>
        {children}
      </div>
      {count > 1 && (
        <p data-piece-counter="" className="piece-counter">
          {current} / {count}
        </p>
      )}
    </div>
  )
}
