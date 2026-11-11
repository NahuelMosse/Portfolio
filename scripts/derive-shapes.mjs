// The shape (width over height) of every piece, so a browser screen is drawn in its capture's own shape and never cropped by a box of
// another one. Written to features/portfolio/presentation/piece-shapes.json. Run: node scripts/derive-shapes.mjs
import { readdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import sharp from "sharp"

const PIECES = join(process.cwd(), "public", "film", "pieces")
const OUT = join(process.cwd(), "features", "portfolio", "presentation", "piece-shapes.json")
const DECIMALS = 1000

const shapes = {}
for (const file of readdirSync(PIECES).filter((name) => name.endsWith(".webp")).sort()) {
  const { width, height } = await sharp(join(PIECES, file)).metadata()
  shapes[file.replace(/\.webp$/, "")] = Math.round((width / height) * DECIMALS) / DECIMALS
}
writeFileSync(OUT, `${JSON.stringify(shapes, null, 1)}\n`)
console.log(`${Object.keys(shapes).length} shapes -> ${OUT}`)
