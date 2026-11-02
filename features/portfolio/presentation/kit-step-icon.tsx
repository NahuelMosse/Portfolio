// The five steps a card walks in the dev kit, each one a single word and a bold drawn icon.
export const KIT_STEPS = [
  { id: "card", word: "Card" },
  { id: "red", word: "Red" },
  { id: "build", word: "Build" },
  { id: "pass", word: "Pass" },
  { id: "merge", word: "Merge" },
] as const

export type KitStep = (typeof KIT_STEPS)[number]["id"]

type IconProps = { step: KitStep }

// Each icon is drawn in a 120 x 120 box around the origin, so a diagram station and a close-up share one drawing.
export function KitStepIcon({ step }: IconProps) {
  switch (step) {
    case "card":
      return (
        <g className="kit-stroke" fill="none">
          <rect x="-34" y="-44" width="68" height="88" rx="6" />
          <path d="M-18 -22 H18 M-18 0 H18 M-18 22 H4" />
          <rect className="kit-fill-red" x="-34" y="-44" width="68" height="16" rx="6" stroke="none" />
        </g>
      )
    case "red":
      return (
        <g>
          <circle className="kit-fill-red" r="36" />
          <path className="kit-stroke" d="M-16 -16 L16 16 M16 -16 L-16 16" fill="none" />
        </g>
      )
    case "build":
      return (
        <g className="kit-stroke" fill="none">
          <path d="M-16 -30 L-42 0 L-16 30" />
          <path d="M16 -30 L42 0 L16 30" />
          <path className="kit-stroke-red" d="M7 -38 L-7 38" />
        </g>
      )
    case "pass":
      return (
        <g className="kit-stroke-green" fill="none">
          <circle r="38" />
          <path d="M-19 2 L-5 17 L21 -15" />
        </g>
      )
    case "merge":
      return (
        <g>
          <path className="kit-stroke" fill="none" d="M-34 -36 V-12 C-34 12 0 8 0 30 M34 -36 V-12 C34 12 0 8 0 30 M0 30 V46" />
          <circle className="kit-fill-red" cx="-34" cy="-36" r="9" />
          <circle className="kit-fill-red" cx="34" cy="-36" r="9" />
          <circle className="kit-fill-red" cx="0" cy="46" r="9" />
        </g>
      )
  }
}
