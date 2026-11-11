import { expect, test } from "@playwright/test"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import sharp from "sharp"

// @PF-7-S1 @PF-7-S2 @PF-7-ASM-01: Triaje's phone opens on the game's own phone layout (the shift map with its
// Start the shift button, captured live at 390x844), not on itch.io's page, which shows the desktop cover cropped.
const FILE = join(process.cwd(), "public", "film", "pieces", "triaje-mobile.webp")
const CONTENT = readFileSync(join(process.cwd(), "features", "portfolio", "presentation", "content.ts"), "utf8")
const ASSETS = readFileSync(join(process.cwd(), "public", "ASSETS.md"), "utf8")

// The mean color of a horizontal band of the capture, between two fractions of its height, across its middle 80 %.
async function bandColor(top: number, bottom: number) {
  const { width, height } = await sharp(FILE).metadata()
  const { data } = await sharp(FILE)
    .extract({ left: Math.round(width! * 0.1), top: Math.round(height! * top), width: Math.round(width! * 0.8), height: Math.round(height! * (bottom - top)) })
    .resize(1, 1, { fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true })
  return { r: data[0], g: data[1], b: data[2] }
}

test("Triaje's first phone screen is the game's own phone layout at 390x844: its top is the game's dark ground and its Start the shift band the game's mint, not the itch.io cover @PF-7-S1 @PF-7-S2 @PF-7-ASM-01", async () => {
  const { width, height } = await sharp(FILE).metadata()
  expect({ width, height }, "a 390x844 capture at twice the density").toEqual({ width: 780, height: 1688 })
  const top = await bandColor(0, 0.03)
  expect((0.2126 * top.r + 0.7152 * top.g + 0.0722 * top.b) / 255, "the game's dark ground at the top").toBeLessThan(0.12)
  const button = await bandColor(0.85, 0.87)
  expect(button.g, "the Start the shift button's mint").toBeGreaterThan(180)
  expect(button.r, "the Start the shift button's mint").toBeLessThan(60)
})

test("on the page Triaje's phone opens on triaje-mobile, its alt names the game's first screen on a phone and ASSETS.md names the game at 390x844 @PF-7-S2 @PF-7-ASM-01", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  const first = await page
    .locator('article[data-project="guardia"] .show-rig[data-role="second"] .show-screen')
    .first()
    .evaluate((el) => el.innerHTML)
  expect(first, "the phone's first screen is triaje-mobile").toMatch(/pieces\/triaje-mobile\.webp/)

  const entry = CONTENT.split("\n").find((line) => line.includes('"triaje-mobile"'))
  expect(entry, "content.ts lists triaje-mobile").toBeTruthy()
  expect(entry).toMatch(/first screen/i)
  expect(entry).not.toMatch(/itch\.io on a phone"/)
  expect(entry).toContain('"Triaje on itch.io, on a phone"')

  const line = ASSETS.split("\n").find((l) => /\btriaje-mobile\.webp/.test(l))
  expect(line, "ASSETS.md has a line for triaje-mobile").toBeTruthy()
  expect(line).toContain("html-classic.itch.zone/html/19771092/index.html")
  expect(line).toContain("390x844")
})
