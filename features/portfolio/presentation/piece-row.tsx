"use client"

import { useRef, useState, type ReactNode } from "react"

type PieceRowProps = { count: number; className?: string; children: ReactNode }

// The real pieces of one case, rendered by the server and passed in. On a phone they are one row that swipes,
// the next piece cut at the edge, with a counter.
export function PieceRow({ count, className, children }: PieceRowProps) {
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
    <div className={`piece-row ${className ?? ""}`}>
      <div ref={row} data-pieces="" className="pieces" onScroll={follow}>
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
