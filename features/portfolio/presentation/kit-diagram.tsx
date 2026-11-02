"use client"

import { useRef } from "react"
import { useInView } from "motion/react"
import { KIT_STEPS, KitStepIcon } from "./kit-step-icon"

const STATION_X = [100, 300, 500, 700, 900]
const STATION_Y = 240

// The kit's lead: the path a card walks, drawn by code on an ink plate, from the requirement frozen to the merged pull
// request. Each shape draws itself as the plate comes into view; with reduced motion it simply stands drawn.
export function KitDiagram() {
  const plate = useRef<SVGSVGElement>(null)
  const seen = useInView(plate, { once: true, amount: 0.4 })

  return (
    <div data-scene-screen="" className="spread-stage kit-plate">
      <svg
        ref={plate}
        data-kit-diagram=""
        data-drawn={seen}
        className="kit-diagram"
        viewBox="0 0 1000 560"
        role="img"
        aria-label="A card walks from the requirement frozen, through tests that fail, agents that build and checks that pass, to the merged pull request"
      >
        <path data-draw="stroke" pathLength="1" className="kit-path" style={{ "--n": 0 } as React.CSSProperties} d={`M${STATION_X[0] + 90} ${STATION_Y} H${STATION_X[4] - 90}`} />
        {KIT_STEPS.map((step, index) => (
          <g key={step.id} data-kit-step={step.id} transform={`translate(${STATION_X[index]} ${STATION_Y})`}>
            <g data-draw="pop" style={{ "--n": index + 1 } as React.CSSProperties}>
              <circle className="kit-ring" r="84" />
              <KitStepIcon step={step.id} />
            </g>
            <text data-draw="pop" style={{ "--n": index + 1 } as React.CSSProperties} className="kit-word" y="160" textAnchor="middle">
              {step.word}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
