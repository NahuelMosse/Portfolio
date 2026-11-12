// kit-boundary: features/film/motion.ts is the film slice's client entry; its index reaches the server-only scene assets
import { DEFERRED_BLANK, mediaUrl } from "@/features/film/motion";
import bars from "./piece-bars.json";
import widths from "./piece-widths.json";

const WIDTHS: Record<string, number[]> = widths;

type Bar = { bg: string; tone: "light" | "dark"; trim?: number };
// a JSON import widens "light" | "dark" to string; scripts/derive-bars.mjs writes only those two tones
const BARS = bars as Record<string, Bar>;

// "/film/pieces/club-sedes.webp?v=1a2b3c4d" → "club-sedes"
const idOf = (src: string) =>
  src
    .replace(/\?.*$/, "")
    .replace(/^\/film\/pieces\//, "")
    .replace(/\.webp$/, "");

// The copies of a piece at the widths a screen asks for (scripts/derive-plates.mjs).
export function pieceSrcSet(src: string): string {
  const id = idOf(src);
  const sizes = WIDTHS[id];
  return sizes
    ? sizes
        .map((w) => `${mediaUrl(`/film/r/${w}/pieces/${id}.webp`)} ${w}w`)
        .join(", ")
    : src;
}

// The status bar of a phone screen: the color of the app's own top edge, light or dark icons, and the share of the image
// to crop when the capture came with a status bar of its own (scripts/derive-bars.mjs).
export function pieceBar(src: string): Bar {
  return BARS[idOf(src)] ?? { bg: "#0b0b0b", tone: "light" };
}

// The smallest copy, for a blurred glow behind a device.
export function pieceThumb(src: string): string {
  const id = idOf(src);
  const sizes = WIDTHS[id];
  return sizes ? mediaUrl(`/film/r/${sizes[0]}/pieces/${id}.webp`) : src;
}

// A piece fetched as the visitor nears it (see PlateLoader): the ink until then, named after its file.
export function deferredPiece(src: string, sizes: string) {
  return {
    src: `${DEFERRED_BLANK}#${src}`,
    "data-srcset": pieceSrcSet(src),
    sizes,
  };
}
