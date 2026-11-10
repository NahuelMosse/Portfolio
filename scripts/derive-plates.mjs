// The film's images as served. Every webp in public/film (and public/film/pieces) gets copies at the widths a screen asks for,
// in public/film/r/<width>/ under the same file name, plus a tiny blurred proof the server pages inline as the placeholder,
// listed in features/film/presentation/plates.json (the pieces' widths in piece-widths.json). Only the cover also gets AVIF: it is the one image on the critical path.
// A tall plate is held near 70 KB at 480 px. The sources are never touched; a copy newer than its
// source is kept, so a rerun only does what changed. Run: node scripts/derive-plates.mjs
import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import sharp from "sharp"

const ROOT = join(process.cwd(), "public", "film")
const OUT = join(ROOT, "r")
const MANIFEST = join(process.cwd(), "features", "film", "presentation", "plates.json")
// the pieces are shown by client components: their list carries only the widths, so no placeholder reaches the bundle
const PIECES = join(process.cwd(), "features", "portfolio", "presentation", "piece-widths.json")
// a full-bleed plate is never drawn wider than 1920 css px; a phone plate never wider than a phone at 2x
const WIDE = [640, 960, 1280, 1920]
const TALL = [480, 720, 960]
const PIECE = [480, 800, 1200]
const WEBP_QUALITY = 68
const TALL_BUDGET = 70 * 1024
const AVIF = { quality: 42, effort: 4 }
const AVIF_IDS = new Set(["ill-cover-16x9", "ill-cover-9x16"])

const sources = [
  ...readdirSync(ROOT).filter((f) => f.endsWith(".webp")).map((f) => f.slice(0, -5)),
  ...readdirSync(join(ROOT, "pieces")).filter((f) => f.endsWith(".webp")).map((f) => `pieces/${f.slice(0, -5)}`),
]

const widthsFor = (id, width, height) => {
  const set = id.startsWith("pieces/") ? PIECE : height > width ? TALL : WIDE
  const fit = set.filter((w) => w < width)
  return [...fit, Math.min(width, set[set.length - 1])].filter((w, n, all) => all.indexOf(w) === n)
}

const fresh = (file, source) => existsSync(file) && statSync(file).mtimeMs >= statSync(source).mtimeMs
const write = async (file, buffer) => {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, buffer)
}

// the gentlest encoding that keeps a tall plate inside the budget at its smallest width: lower quality first, then a slight
// softening of the halftone dots, which is what the encoder spends its bytes on
const TALL_STEPS = [[0, 68], [0, 56], [0.6, 44], [0.6, 40], [0.6, 34], [0.7, 30]]
async function tallEncoding(source, width) {
  for (const [blur, quality] of TALL_STEPS) {
    const image = sharp(source).resize({ width })
    const size = (await (blur ? image.blur(blur) : image).webp({ quality, effort: 6 }).toBuffer()).length
    if (size <= TALL_BUDGET) return [blur, quality]
  }
  return TALL_STEPS[TALL_STEPS.length - 1]
}

const manifest = {}
const pieces = {}
for (const id of sources) {
  const source = join(ROOT, `${id}.webp`)
  const { width, height } = await sharp(source).metadata()
  const widths = widthsFor(id, width, height)
  const tall = height > width && !id.startsWith("pieces/")
  let [blur, quality] = [0, WEBP_QUALITY]
  if (tall && !widths.every((w) => fresh(join(OUT, String(w), `${id}.webp`), source))) [blur, quality] = await tallEncoding(source, widths[0])
  for (const w of widths) {
    const webp = join(OUT, String(w), `${id}.webp`)
    if (!fresh(webp, source)) {
      const image = sharp(source).resize({ width: w })
      await write(webp, await (blur ? image.blur(blur) : image).webp({ quality, effort: 6 }).toBuffer())
    }
    const avif = join(OUT, String(w), `${id}.avif`)
    if (AVIF_IDS.has(id) && !fresh(avif, source)) await write(avif, await sharp(source).resize({ width: w }).avif(AVIF).toBuffer())
  }
  if (id.startsWith("pieces/")) {
    pieces[id.slice(7)] = widths
    continue
  }
  // the copies keep the source's file name, so the address carries a fingerprint of its pixels: a redrawn plate is never served from a cache
  const v = createHash("sha1").update(readFileSync(source)).digest("hex").slice(0, 8)
  const entry = { width, height, widths, v }
  if (AVIF_IDS.has(id)) entry.avif = true
  entry.lqip = `data:image/webp;base64,${(await sharp(source).resize({ width: 16 }).webp({ quality: 40 }).toBuffer()).toString("base64")}`
  manifest[id] = entry
}

writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 1)}\n`)
writeFileSync(PIECES, `${JSON.stringify(pieces, null, 1)}\n`)
console.log(`plates: ${sources.length} sources`)
