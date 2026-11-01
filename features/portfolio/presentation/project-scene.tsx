import type { CSSProperties, ReactNode } from "react"
import { SCENE_SCREENS, SCENE_SIZES } from "./scene-screens"

export type DeviceKind = "phone" | "wide"

type ProjectSceneProps = {
  // asset id without its aspect, and the files of the two cuts it resolves to
  asset: string
  wide: string
  tall: string
  device: DeviceKind
  children: ReactNode
}

// How much of the illustration shows around the drawn screen, as a share of the screen: sideways and up/down.
// The sideways share of a phone is large (the hand), of a laptop small (the page holds the text beside it).
const MARGIN = {
  "16x9": { phone: { x: 0.45, y: 0.15 }, wide: { x: 0.1, y: 0.08 } },
  "4x5": { phone: { x: 0.12, y: 0.15 }, wide: { x: 0.04, y: 0.15 } },
} as const

const PHONE_WIDTH = "(max-width: 1279px)"

// Percent of the image that the visible crop covers around the screen, kept inside the image.
function crop(asset: string, aspect: "16x9" | "4x5", device: DeviceKind) {
  const box = SCENE_SCREENS[`${asset}-${aspect}`]
  if (!box) throw new Error(`No screen box is declared for ${asset}-${aspect}`)
  const size = SCENE_SIZES[aspect]
  const margin = MARGIN[aspect][device]
  const left = Math.max(0, box.left - margin.x * box.width)
  const right = Math.min(100, box.left + box.width * (1 + margin.x))
  const top = Math.max(0, box.top - margin.y * box.height)
  const bottom = Math.min(100, box.top + box.height * (1 + margin.y))
  const ratio = size.height / size.width
  return {
    bw: box.width,
    bh: box.height,
    ox: box.left - left,
    oy: box.top - top,
    "win-w": right - left,
    "win-h": bottom - top,
    "win-l": left,
    "win-t": top,
    r: ratio,
    // width over height of the screen itself
    ar: box.width / (box.height * ratio),
  }
}

const prefixed = (prefix: string, values: Record<string, number>) =>
  Object.fromEntries(Object.entries(values).map(([key, value]) => [`--${prefix}${key}`, value]))

// One project's focal point: its real interface, large, in the screen drawn in its illustration, cropped to the nearest surroundings.
export function ProjectScene({ asset, wide, tall, device, children }: ProjectSceneProps) {
  const style = { ...prefixed("w", crop(asset, "16x9", device)), ...prefixed("t", crop(asset, "4x5", device)) } as CSSProperties

  return (
    <div data-device={device} className="project-stage" style={style}>
      <div data-illustration="" data-asset={`${asset}-16x9`} className="stage-art">
        <picture>
          <source media={PHONE_WIDTH} srcSet={tall} />
          <img src={wide} alt="" loading="lazy" decoding="async" />
        </picture>
      </div>
      <div data-scene-screen="" className="stage-screen">
        {children}
      </div>
    </div>
  )
}
