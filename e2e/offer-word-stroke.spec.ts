import { test, expect } from "@playwright/test"
import { mkdirSync } from "node:fs"

const SIZES = [
  { width: 390, height: 844 },
  { width: 1280, height: 720 },
  { width: 1440, height: 900 },
  { width: 1668, height: 904 },
  { width: 1910, height: 912 },
] as const

const WORD = ".offer-scene .chapter-word"

test("the OFFER outline is 1.2% of the word and never under 1.5px (the floor below a 125px word) at 390x844, 1280x720, 1440x900, 1668x904 and 1910x912, captured @PF-10-S1 @PF-10-S2 @PF-10-S3 @PF-10-S4 @PF-10-S6 @PF-10-ASM-01", async ({ page }) => {
  mkdirSync(".validation/PF-10", { recursive: true })
  for (const { width, height } of SIZES) {
    await page.setViewportSize({ width, height })
    await page.goto("/")
    const word = page.locator(WORD)
    await word.scrollIntoViewIfNeeded()
    await page.waitForTimeout(1500)
    const m = await word.evaluate((el) => {
      const s = getComputedStyle(el)
      return { size: parseFloat(s.fontSize), stroke: parseFloat(s.webkitTextStrokeWidth) }
    })
    console.log(`PF-10 ${width}x${height} font ${m.size}px stroke ${m.stroke}px ratio ${(m.stroke / m.size).toFixed(4)}`)
    expect(m.stroke, `stroke at ${width}`).toBeGreaterThanOrEqual(1.5)
    if (0.012 * m.size >= 1.5) {
      expect(m.stroke / m.size, `ratio at ${width}`).toBeGreaterThan(0.0115)
      expect(m.stroke / m.size, `ratio at ${width}`).toBeLessThan(0.0125)
    }
    await word.screenshot({ path: `.validation/PF-10/offer-${width}x${height}.png` })
  }
})

test("the OFFER word stays hollow: transparent fill, bone outline @PF-10-S5", async ({ page }) => {
  for (const { width, height } of [SIZES[0], SIZES[2]]) {
    await page.setViewportSize({ width, height })
    await page.goto("/")
    const s = await page.locator(WORD).evaluate((el) => {
      const c = getComputedStyle(el)
      return { fill: c.webkitTextFillColor, color: c.color, stroke: c.webkitTextStrokeColor }
    })
    expect([s.fill, s.color], `fill at ${width}`).toContain("rgba(0, 0, 0, 0)")
    expect(s.stroke, `stroke colour at ${width}`).toBe("rgb(237, 228, 208)")
  }
})
