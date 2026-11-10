// The status bar of every phone screen. A screenshot of a phone app either starts with its own status bar baked in (the Android
// capture of ClubNahuelMosse: TRIM_BAKED of its height) or starts with the app. The device draws one bar for all of them, so a baked
// one is cropped by CSS (its `trim`) and each bar takes the color of the app's own top edge, with light or dark icons by its luminance.
// Written to features/portfolio/presentation/piece-bars.json. Run: node scripts/derive-bars.mjs
import { writeFileSync } from "node:fs"
import { join } from "node:path"
import sharp from "sharp"

const PIECES = join(process.cwd(), "public", "film", "pieces")
const OUT = join(process.cwd(), "features", "portfolio", "presentation", "piece-bars.json")
const TRIM_BAKED = 0.04
const BAKED = new Set(["club-login", "club-sedes", "club-horarios", "club-listo"])
const PHONE_PIECES = [
  "grit-hoy", "grit-serie", "grit-descanso", "grit-completado", "grit-ejercicio",
  "club-login", "club-sedes", "club-horarios", "club-listo",
  "cebador-390-poster", "cebador-s2-390",
  "sonria-hero-390", "sonria-tratamientos-390", "sonria-turno-390",
  "miga-hero-390", "miga-lista-390", "miga-pedir-390",
  "triaje-mobile",
]

const hex = (n) => Math.round(n).toString(16).padStart(2, "0")
const bars = {}
for (const id of PHONE_PIECES) {
  const file = join(PIECES, `${id}.webp`)
  const { width, height } = await sharp(file).metadata()
  const trim = BAKED.has(id) ? TRIM_BAKED : 0
  const top = Math.round(height * trim)
  const band = Math.max(2, Math.round(height * 0.012))
  const { data } = await sharp(file).extract({ left: 0, top, width, height: band }).resize(1, 1, { fit: "fill" }).raw().toBuffer({ resolveWithObject: true })
  const [r, g, b] = data
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  bars[id] = { bg: `#${hex(r)}${hex(g)}${hex(b)}`, tone: luminance > 0.55 ? "dark" : "light", ...(trim ? { trim } : {}) }
}
writeFileSync(OUT, `${JSON.stringify(bars, null, 1)}\n`)
console.log(`${Object.keys(bars).length} bars -> ${OUT}`)
