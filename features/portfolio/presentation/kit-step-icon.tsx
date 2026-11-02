// The six stops of the path a requirement walks in the dev kit, each with one short word and its own drawn shape.
export const KIT_STEPS = [
  { id: "card", word: "Card" },
  { id: "questions", word: "Questions" },
  { id: "red", word: "Red" },
  { id: "build", word: "Build" },
  { id: "gate", word: "Gate" },
  { id: "pr", word: "PR" },
] as const

export type KitStep = (typeof KIT_STEPS)[number]["id"]

type IconProps = { step: KitStep }

// Each icon is drawn in a 100 x 100 box around the origin, so a diagram station and a close-up share one drawing.
export function KitStepIcon({ step }: IconProps) {
  switch (step) {
    case "card":
      return (
        <g className="kit-stroke" fill="none">
          <rect x="-30" y="-40" width="60" height="80" rx="5" />
          <path d="M-16 -8 H16 M-16 10 H16 M-16 28 H2" />
          <rect className="kit-fill-red" x="-30" y="-40" width="60" height="16" rx="5" stroke="none" />
        </g>
      )
    case "questions":
      return (
        <g className="kit-stroke" fill="none">
          <path d="M-42 -34 H42 V16 H0 L-20 38 V16 H-42 Z" />
          <path className="kit-stroke-red" d="M-11 -20 C-11 -30 11 -30 11 -18 C11 -10 0 -10 0 0" />
          <circle className="kit-fill-red" cx="0" cy="9" r="3.5" stroke="none" />
        </g>
      )
    case "red":
      return (
        <g>
          <path className="kit-fill-red" d="M-14 -40 H14 V-12 L38 34 Q42 42 33 42 H-33 Q-42 42 -38 34 L-14 -12 Z" />
          <path className="kit-stroke-bone" d="M-12 14 H12 M-6 26 H6" />
        </g>
      )
    case "build":
      return (
        <g className="kit-stroke" fill="none">
          <path d="M-18 -30 L-44 0 L-18 30" />
          <path d="M18 -30 L44 0 L18 30" />
          <path className="kit-stroke-red" d="M8 -38 L-8 38" />
        </g>
      )
    case "gate":
      return (
        <g className="kit-stroke" fill="none">
          <path d="M-38 42 V-34 M38 42 V-34 M-38 -34 H38" />
          <path d="M-38 -10 H38 M-38 14 H38" />
          <path className="kit-stroke-green" d="M-18 4 L-4 18 L20 -14" />
        </g>
      )
    case "pr":
      return (
        <g>
          <path className="kit-stroke" fill="none" d="M-30 -34 V-10 C-30 14 0 10 0 30 M30 -34 V-10 C30 14 0 10 0 30 M0 30 V46" />
          <circle className="kit-fill-red" cx="-30" cy="-34" r="9" />
          <circle className="kit-fill-red" cx="30" cy="-34" r="9" />
          <circle className="kit-fill-red" cx="0" cy="46" r="9" />
        </g>
      )
  }
}
