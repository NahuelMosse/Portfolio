import type { CSSProperties } from "react"
import { KitStepIcon, type KitStep } from "./kit-step-icon"

type KitPieceProps = { step: { id: KitStep; word: string }; order: number }

// One step of the path as a close-up: its icon large on an ink plate.
export function KitPiece({ step, order }: KitPieceProps) {
  return (
    <div data-piece="" data-kind="step" className="piece kit-piece" style={{ "--order": order } as CSSProperties}>
      <svg viewBox="-100 -75 200 150" role="img" aria-label={step.word}>
        <KitStepIcon step={step.id} />
      </svg>
    </div>
  )
}
