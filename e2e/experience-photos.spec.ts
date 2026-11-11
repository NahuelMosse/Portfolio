import { expect, test } from "@playwright/test"

// @PF-1-ASM-26: the experience rows keep his face in view without growing the chapter, and no slide text can be read.
const CAPS = [
  { width: 1440, height: 900, maxChapter: 1170 },
  { width: 390, height: 844, maxChapter: 1350 },
]

for (const { width, height, maxChapter } of CAPS) {
  test(`@PF-1-ASM-26 experience photos at ${width}: chapter cap and Jüsto zoom on him`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto("/")
    const chapter = await page.locator("#experience").evaluate((node) => (node as HTMLElement).offsetHeight)
    expect(chapter).toBeLessThanOrEqual(maxChapter)
    const justo = page.locator('[data-employer="justo"] [data-work-photo]')
    await expect(justo).toHaveAttribute("data-crop", "face")
    const imageWidth = await justo.locator("img").evaluate((img) => img.getBoundingClientRect().width)
    const figureWidth = await justo.evaluate((figure) => figure.getBoundingClientRect().width)
    expect(imageWidth / figureWidth).toBeGreaterThan(3)
  })
}
