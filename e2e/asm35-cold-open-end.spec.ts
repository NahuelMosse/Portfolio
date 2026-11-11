import { test, expect } from "@playwright/test"

// @PF-1-ASM-35 scene 1: at the end of the pin the identification sheet and the corner button are shown.
for (const { width, height } of [
  { width: 1910, height: 912 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1080 },
]) {
  test(`${width}x${height} the sheet and the corner button are visible at the end of the cold-open pin @PF-1-ASM-35`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto("/")
    await page.waitForSelector(".pin-spacer #cold-open")
    const pinEnd = await page.evaluate(() => {
      const spacer = document.querySelector("#cold-open")!.parentElement!
      return spacer.getBoundingClientRect().top + scrollY + spacer.offsetHeight - innerHeight
    })
    await page.evaluate((y) => window.scrollTo(0, y - 2), pinEnd)
    await page.waitForTimeout(1800)
    await expect(page.locator("[data-cta]")).toHaveAttribute("data-visible", "true", { timeout: 6000 })
    const sheet = await page.evaluate(() => {
      const el = document.querySelector("[data-id-sheet]")!
      const b = el.getBoundingClientRect()
      return { opacity: Number(getComputedStyle(el.closest(".layer-sheet")!).opacity), inside: b.top >= 0 && b.bottom <= innerHeight }
    })
    expect(sheet.opacity).toBeGreaterThan(0.95)
    expect(sheet.inside).toBe(true)
  })
}
