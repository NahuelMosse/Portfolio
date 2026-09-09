import { chromium } from "@playwright/test"
import { mkdirSync } from "node:fs"

const BASE = process.env.BASE ?? "http://localhost:8701"
const OUT = process.env.OUT ?? "./out"
const PATHNAME = process.env.PATHNAME ?? "/"
const TAG = process.env.TAG ?? "en"

mkdirSync(OUT, { recursive: true })

const SECTIONS = [
  "hero",
  "telemetry",
  "work",
  "lab",
  "grit",
  "method",
  "arsenal",
  "origins",
  "proof",
  "contact",
]

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
})
const page = await context.newPage()

const errors = []
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`[console] ${msg.text()}`)
})
page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`))

await page.goto(BASE + PATHNAME, { waitUntil: "networkidle", timeout: 60000 })

// Skip the boot overlay if it is showing.
await page.waitForTimeout(2600)
await page.mouse.click(720, 450).catch(() => {})
await page.waitForTimeout(900)

// Reveal everything: the IntersectionObserver only fires on real scroll.
for (let y = 0; y < 12; y++) {
  await page.mouse.wheel(0, 900)
  await page.waitForTimeout(260)
}
await page.waitForTimeout(1200)
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }))
await page.waitForTimeout(1400)

await page.screenshot({ path: `${OUT}/${TAG}-00-hero.png` })

for (const [i, id] of SECTIONS.entries()) {
  const found = await page.evaluate((sectionId) => {
    const el = document.getElementById(sectionId)
    if (!el) return false
    el.scrollIntoView({ behavior: "instant", block: "start" })
    return true
  }, id)

  if (!found) {
    errors.push(`[missing] #${id}`)
    continue
  }

  await page.waitForTimeout(1500)
  await page.screenshot({
    path: `${OUT}/${TAG}-${String(i + 1).padStart(2, "0")}-${id}.png`,
  })
}

// Narrow viewport, for layout sanity.
const mobile = await context.newPage()
await mobile.setViewportSize({ width: 390, height: 844 })
await mobile.goto(BASE + PATHNAME, { waitUntil: "networkidle", timeout: 60000 })
await mobile.waitForTimeout(3000)
await mobile.mouse.click(195, 400).catch(() => {})
await mobile.waitForTimeout(1200)
await mobile.screenshot({ path: `${OUT}/${TAG}-m-hero.png` })

for (const id of ["telemetry", "work", "lab", "proof"]) {
  const ok = await mobile.evaluate((sectionId) => {
    const el = document.getElementById(sectionId)
    if (!el) return false
    el.scrollIntoView({ behavior: "instant", block: "start" })
    return true
  }, id)
  if (!ok) continue
  await mobile.waitForTimeout(1400)
  await mobile.screenshot({ path: `${OUT}/${TAG}-m-${id}.png` })
}

await browser.close()

console.log(JSON.stringify({ errors }, null, 2))
