"use client"

import { useRef, useSyncExternalStore, type CSSProperties } from "react"
import { useInView } from "motion/react"
import { KIT_STEPS, KitStepIcon } from "./kit-step-icon"

type Point = readonly [number, number]

type Layout = { viewBox: string; stations: readonly Point[]; path: string; ring: number; icon: number; label: number }

// On a wide screen the path is one line of six stops; on a phone it turns back on itself in two rows of three.
const WIDE: Layout = {
  viewBox: "0 0 1000 270",
  stations: [[90, 105], [254, 105], [418, 105], [582, 105], [746, 105], [910, 105]],
  path: "M90 105 H910",
  ring: 72,
  icon: 1.3,
  label: 106,
}

const NARROW: Layout = {
  viewBox: "0 0 400 360",
  stations: [[70, 80], [200, 80], [330, 80], [70, 240], [200, 240], [330, 240]],
  path: "M70 80 H330 M70 240 H330",
  ring: 58,
  icon: 1,
  label: 90,
}

const NARROW_QUERY = "(max-width: 1279px)"

const subscribe = (notify: () => void) => {
  const query = window.matchMedia(NARROW_QUERY)
  query.addEventListener("change", notify)
  return () => query.removeEventListener("change", notify)
}

// The kit's lead: the path a requirement walks, drawn by code straight on the section's backdrop, from the card frozen to
// the pull request. Each shape draws itself as it comes into view; with reduced motion it simply stands drawn.
export function KitDiagram() {
  const plate = useRef<SVGSVGElement>(null)
  const seen = useInView(plate, { once: true, amount: 0.4 })
  const narrow = useSyncExternalStore(subscribe, () => window.matchMedia(NARROW_QUERY).matches, () => false)
  const { viewBox, stations, path, ring, icon, label } = narrow ? NARROW : WIDE

  return (
    <div data-scene-screen="" className="spread-stage kit-stage">
      <svg
        ref={plate}
        data-kit-diagram=""
        data-drawn={seen}
        className="kit-diagram"
        viewBox={viewBox}
        role="img"
        aria-label="A requirement card walks to questions, tests that fail, the build, the gate and the pull request"
      >
        <path data-draw="stroke" pathLength="1" className="kit-path" style={{ "--n": 0 } as CSSProperties} d={path} />
        {KIT_STEPS.map((step, index) => {
          const [x, y] = stations[index]
          return (
            <g key={step.id} data-kit-step={step.id} transform={`translate(${x} ${y})`}>
              <g data-draw="pop" style={{ "--n": index + 1 } as CSSProperties}>
                <ellipse className="kit-disc" rx={ring} ry={ring} />
                <g transform={`scale(${icon})`}>
                  <KitStepIcon step={step.id} />
                </g>
                <circle className="kit-ring" r={ring} />
                <text className="kit-word" y={label} textAnchor="middle">
                  {step.word}
                </text>
              </g>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
