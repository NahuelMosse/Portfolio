import { test, expect } from "@playwright/test"

// @PF-1-ASM-35 scene 1: the cold open is a dolly out; the cover illustration scales from above 1.05 to about 1 across its pin.
const SIZES = [
  { width: 1910, height: 912 },
  { width: 1440, height: 900 },
] as const

for (const { width, height } of SIZES) {
  test(`${width}x${height} the cover scale goes from above 1.05 to about 1 across the cold-open pin @PF-1-ASM-35`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto("/")
    await page.waitForSelector("#cold-open.pin-spacer, .pin-spacer #cold-open")
    const scale = () =>
      page.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector("#cold-open .scene-art img")!).transform).a)
    expect(await scale()).toBeGreaterThan(1.05)
    const pinEnd = await page.evaluate(() => {
      const spacer = document.querySelector("#cold-open")!.parentElement!
      return spacer.getBoundingClientRect().top + scrollY + spacer.offsetHeight - innerHeight
    })
    await page.evaluate((y) => window.scrollTo(0, y), pinEnd)
    await page.waitForTimeout(1800)
    const end = await scale()
    expect(end).toBeGreaterThan(0.98)
    expect(end).toBeLessThan(1.03)
  })
}

test.describe("reduced motion", () => {
  test.use({ viewport: { width: 1910, height: 912 }, reducedMotion: "reduce" })

  test("the cold open has no pin and no transform @PF-1-ASM-35", async ({ page }) => {
    await page.goto("/")
    const r = await page.evaluate(() => ({
      pinned: !!document.querySelector(".pin-spacer"),
      transform: getComputedStyle(document.querySelector("#cold-open .scene-art img")!).transform,
    }))
    expect(r.pinned).toBe(false)
    expect(r.transform).toBe("none")
  })
})
