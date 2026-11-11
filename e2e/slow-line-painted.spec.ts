import { test, expect } from "@playwright/test"

// @PF-1-ASM-44 every image a section shows is painted, not blank, once the visitor is there. The cover's address carries the
// plate's version (`?v=`), which keeps a browser from showing a cached plate after it is redrawn.
const SIZES = [
  { width: 1910, height: 912 },
  { width: 390, height: 844 },
] as const

for (const size of SIZES) {
  test(`@PF-1-ASM-44 at ${size.width} every image a section shows is painted once the visitor is there`, async ({ page }) => {
    test.setTimeout(120_000)
    await page.setViewportSize(size)
    await page.goto("/")
    const cover = page.locator("#cold-open .scene-art img")
    await expect
      .poll(() => cover.evaluate((img: HTMLImageElement) => img.currentSrc))
      .toMatch(/\/film\/r\/\d+\/ill-cover-(16x9|9x16)\.(avif|webp)(\?v=[\w-]+)?$/)
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < height; y += size.height) {
      await page.evaluate((top) => window.scrollTo(0, top), y)
      await expect
        .poll(
          () =>
            page.evaluate(() =>
              [...document.images]
                .filter((img) => {
                  const box = img.getBoundingClientRect()
                  if (box.width < 40 || box.height < 40 || box.bottom <= 0 || box.top >= innerHeight) return false
                  return img.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && !img.closest("[data-preloader]")
                })
                .filter((img) => !(img.complete && img.naturalWidth > 1 && !img.currentSrc.startsWith("data:")))
                .map((img) => img.getAttribute("data-srcset") ?? img.getAttribute("data-src") ?? img.src),
            ),
          { message: `blank images at scroll ${y}`, timeout: 15_000 },
        )
        .toEqual([])
    }
  })
}
