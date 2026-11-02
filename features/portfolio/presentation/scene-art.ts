import type { CSSProperties } from "react"
import type { Quad } from "../domain/screen-matrix"

// The part of an illustration a panel keeps, as fractions of the image: left, top, right, bottom.
type Crop = readonly [number, number, number, number]

type Ratio = "16x9" | "4x5"

// The illustration a panel prints, its crop at that width and, where it draws a device, the corners of the drawn screen
// as fractions of the whole image (top-left, top-right, bottom-right, bottom-left), measured on the image's pixels.
export type ArtImage = { file: string; ratio: Ratio; crop: Crop; screen: Quad }

export type SceneArt = { desktop: ArtImage; mobile: ArtImage; handHeld?: true }

const PIXELS: Record<Ratio, readonly [number, number]> = { "16x9": [1672, 941], "4x5": [1122, 1402] }

const GRIT_4X5: Quad = [[0.4444, 0.2186], [0.9227, 0.2171], [0.9263, 0.9531], [0.445, 0.9528]]
const CLUB_16X9: Quad = [[0.4314, 0.106], [0.632, 0.08], [0.6631, 0.8216], [0.464, 0.8499]]
const TRIAJE_16X9: Quad = [[0.4762, 0.3655], [0.9659, 0.3656], [0.9659, 0.8051], [0.4769, 0.8015]]
const TRIAJE_4X5: Quad = [[0.0856, 0.4997], [0.9297, 0.499], [0.9343, 0.8169], [0.0856, 0.8162]]
const CEBADOR_16X9: Quad = [[0.4809, 0.4676], [0.9713, 0.4676], [0.9713, 0.8778], [0.4809, 0.8778]]
const CEBADOR_4X5: Quad = [[0.142, 0.5205], [0.9358, 0.5275], [0.9421, 0.8664], [0.1335, 0.8671]]

// Projects whose illustration draws the device that carries their interface. At most two use a hand-held device and never
// two cases in a row (the phone scenes of Grit and ClubNahuelMosse are the second and the fifth).
export const SCENE_ART: Record<string, SceneArt> = {
  grit: {
    handHeld: true,
    desktop: { file: "ill-scene-grit-4x5", ratio: "4x5", crop: [0.22, 0.17, 1, 1], screen: GRIT_4X5 },
    mobile: { file: "ill-scene-grit-4x5", ratio: "4x5", crop: [0.4, 0.17, 0.97, 1], screen: GRIT_4X5 },
  },
  guardia: {
    desktop: { file: "ill-scene-triaje-16x9", ratio: "16x9", crop: [0.44, 0, 1, 0.88], screen: TRIAJE_16X9 },
    mobile: { file: "ill-scene-triaje-4x5", ratio: "4x5", crop: [0.06, 0.17, 0.97, 0.88], screen: TRIAJE_4X5 },
  },
  cebador: {
    desktop: { file: "ill-scene-cebador-16x9", ratio: "16x9", crop: [0.42, 0.03, 1, 0.93], screen: CEBADOR_16X9 },
    mobile: { file: "ill-scene-cebador-4x5", ratio: "4x5", crop: [0.1, 0.15, 0.98, 0.93], screen: CEBADOR_4X5 },
  },
  club: {
    handHeld: true,
    desktop: { file: "ill-scene-club-16x9", ratio: "16x9", crop: [0.36, 0, 0.7, 1], screen: CLUB_16X9 },
    mobile: { file: "ill-scene-club-16x9", ratio: "16x9", crop: [0.415, 0.02, 0.675, 0.93], screen: CLUB_16X9 },
  },
}

// The dev kit's illustration has no device: it is printed behind its diagram.
export const KIT_ART = { desktop: "ill-kit-16x9", mobile: "ill-kit-4x5" } as const

const round = (value: number) => Number(value.toFixed(4))

export const imagePixels = ({ ratio }: ArtImage) => PIXELS[ratio]

// how much of the crop a fade takes, on the side that faces the text and at the top and bottom
const SIDE_FADE = 0.14
const EDGE_FADE = 0.04

// Where the whole image sits inside a panel that keeps only its crop, and where its edges fade: the fades are in the
// image's own percentages, so they land on the panel's edges and not on the edges of the cropped-away image.
export function imageStyle({ crop: [left, top, right, bottom] }: ArtImage): CSSProperties {
  const percent = (fraction: number) => `${round(fraction * 100)}%`
  return {
    "--art-width": percent(1 / (right - left)),
    "--art-left": percent(-left / (right - left)),
    "--art-top": percent(-top / (bottom - top)),
    "--crop-left": percent(left),
    "--crop-right": percent(right),
    "--crop-top": percent(top),
    "--crop-bottom": percent(bottom),
    "--side-fade": percent(SIDE_FADE * (right - left)),
    "--edge-fade": percent(EDGE_FADE * (bottom - top)),
  } as CSSProperties
}

function panelRatios({ ratio, crop: [left, top, right, bottom], screen }: ArtImage) {
  const [width, height] = PIXELS[ratio]
  const xs = screen.map(([x]) => x)
  const ys = screen.map(([, y]) => y)
  return {
    aspect: round(((right - left) * width) / ((bottom - top) * height)),
    // how many times the drawn screen's width and height the panel is
    byWidth: round((right - left) / (Math.max(...xs) - Math.min(...xs))),
    byHeight: round((bottom - top) / (Math.max(...ys) - Math.min(...ys))),
  }
}

// the panel is sized from the screen it must show: a phone by its height on a wide screen, the rest by their width
export function panelStyle({ desktop, mobile }: SceneArt): CSSProperties {
  const wide = panelRatios(desktop)
  const narrow = panelRatios(mobile)
  return {
    "--desktop-aspect": wide.aspect,
    "--desktop-by-width": wide.byWidth,
    "--desktop-by-height": wide.byHeight,
    "--mobile-aspect": narrow.aspect,
  } as CSSProperties
}
