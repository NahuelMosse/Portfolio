// Captures Triaje's first screen on a phone (public/film/pieces/triaje-mobile.webp) from the live game, at 390x844 and
// twice the density, on a fresh visit: the shift map with its Start the shift button. The URL is the page the itch.io page
// runs in its frame; itch.io's own page on a phone shows the desktop cover banner cropped, not the game's phone layout.
// Run: node scripts/capture-triaje-mobile.mjs, then node scripts/derive-plates.mjs and node scripts/derive-bars.mjs
import { join } from "node:path"
import { chromium } from "playwright"
import sharp from "sharp"

const URL = "https://html-classic.itch.zone/html/19771092/index.html"
const SETTLE_MS = 4000
const OUT = join(process.cwd(), "public", "film", "pieces", "triaje-mobile.webp")

const browser = await chromium.launch()
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  const page = await context.newPage()
  await page.goto(URL, { waitUntil: "networkidle", timeout: 60_000 })
  await page.getByText("START THE SHIFT", { exact: false }).first().waitFor({ timeout: 30_000 })
  await page.waitForTimeout(SETTLE_MS)
  const png = await page.screenshot()
  await sharp(png).webp({ quality: 82 }).toFile(OUT)
  console.log(`triaje-mobile -> ${OUT}`)
} finally {
  await browser.close()
}
