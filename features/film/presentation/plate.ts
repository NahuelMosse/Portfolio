import plates from "./plates.json"
import { DEFERRED_BLANK } from "./deferred"
import { mediaUrl } from "./media-url"

type Plate = { width: number; height: number; widths: number[]; avif?: boolean; lqip: string }

const PLATES: Record<string, Plate> = plates

// The copies of a plate at the widths a screen asks for (scripts/derive-plates.mjs), as a srcset; the version keeps a
// redrawn plate from being served out of a cache under its unchanged file name.
export function plateSrcSet(id: string, format: "webp" | "avif" = "webp"): string | undefined {
  const plate = PLATES[id]
  if (!plate || (format === "avif" && !plate.avif)) return undefined
  return plate.widths.map((w) => `${mediaUrl(`/film/r/${w}/${id}.${format}`)} ${w}w`).join(", ")
}

// What an image shows until its plate is fetched: the plate's own blurred proof, inlined, named after its file so the element
// says what it will show.
export function platePlaceholder(id: string): string {
  return `${PLATES[id]?.lqip ?? DEFERRED_BLANK}#/film/${id}.webp`
}

// The attributes of a plate fetched as the visitor nears it (see PlateLoader): the placeholder now, the copies later.
export function deferredPlate(id: string, sizes: string) {
  return { src: platePlaceholder(id), "data-srcset": plateSrcSet(id) ?? mediaUrl(`/film/${id}.webp`), sizes }
}
