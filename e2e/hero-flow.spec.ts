import { test, expect } from "@playwright/test"

for (const width of [320, 390]) {
  test.describe(`hero flow at ${width}`, () => {
    test.use({ viewport: { width, height: 844 } })

    test(`the id sheet, the line and the button stack in order without overlap while scrolling @PF-1-ASM-27 (${width})`, async ({ page }) => {
      await page.goto("/")
      await page.waitForLoadState("load")
      for (const scrollY of [0, 300, 844]) {
        await page.evaluate((y) => window.scrollTo(0, y), scrollY)
        await page.waitForTimeout(400)
        const boxes = await page.evaluate(() => {
          const box = (selector: string) => {
            const r = document.querySelector(selector)!.getBoundingClientRect()
            return { top: r.top, bottom: r.bottom }
          }
          return { mark: box(".mark"), sheet: box(".layer-sheet"), line: box(".hero-line"), door: box(".hero-door") }
        })
        expect(boxes.sheet.top, `sheet below the cover at scroll ${scrollY}`).toBeGreaterThanOrEqual(boxes.mark.bottom - 1)
        expect(boxes.line.top, `line below the sheet at scroll ${scrollY}`).toBeGreaterThanOrEqual(boxes.sheet.bottom - 1)
        expect(boxes.door.top, `door below the line at scroll ${scrollY}`).toBeGreaterThanOrEqual(boxes.line.bottom - 1)
      }
    })
  })
}
