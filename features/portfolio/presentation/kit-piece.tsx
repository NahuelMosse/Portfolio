import type { CSSProperties } from "react"
import { KitStepIcon, type KitStep } from "./kit-step-icon"

type KitPieceProps = { step: { id: KitStep; word: string }; order: number }

// One step of the path as a close-up: its icon large on an ink plate, with its word.
export function KitPiece({ step, order }: KitPieceProps) {
  return (
    <div data-piece="" data-kind="step" className="piece kit-piece" style={{ "--order": order } as CSSProperties}>
      <svg viewBox="-100 -80 200 170" role="img" aria-label={step.word}>
        <KitStepIcon step={step.id} />
        <text className="kit-word" y="78" textAnchor="middle">
          {step.word}
        </text>
      </svg>
    </div>
  )
}
