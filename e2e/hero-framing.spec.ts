import { test, expect } from "@playwright/test"

const viewports = [
  { width: 320, height: 640 },
  { width: 390, height: 844 },
  { width: 390, height: 664 },
]

for (const viewport of viewports) {
  test.describe(`cold open framing at ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport })

    test(`the id sheet starts below the first screen's face and envelope @PF-1-ASM-26 (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.goto("/")
      await page.waitForLoadState("load")
      await page.waitForTimeout(400)
      const sheetTop = await page.evaluate(() => document.querySelector(".layer-sheet")!.getBoundingClientRect().top)
      expect(sheetTop).toBeGreaterThanOrEqual(viewport.height * 0.8)
    })
  })
}
