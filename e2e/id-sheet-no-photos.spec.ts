import { test, expect } from "@playwright/test"

const VIEWPORTS = [
  { width: 1910, height: 912 },
  { width: 390, height: 844 },
] as const

for (const { width, height } of VIEWPORTS) {
  test(`the identification sheet at ${width}x${height} shows no portrait and still sits below NAWI's baseline @PF-1-ASM-34`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto("/")
    await expect(page.locator("[data-id-sheet]")).toHaveCount(1)
    await expect(page.locator("[data-id-sheet] img, [data-id-sheet] picture, [data-id-sheet] video"), "no portrait in the sheet").toHaveCount(0)
    await expect(page.locator("[data-id-sheet] .sheet-photos, [data-id-sheet] .sheet-photo"), "no empty frame left").toHaveCount(0)
    await expect(page.locator("[data-id-sheet] .sheet-row"), "the fields stay").toHaveCount(5)

    const m = await page.evaluate(() => {
      const mark = document.querySelector<HTMLElement>("h1.mark")!
      const probe = document.createElement("span")
      probe.style.cssText = "display:inline-block;width:0;height:0"
      mark.append(probe)
      const baseline = probe.getBoundingClientRect().bottom + scrollY
      probe.remove()
      return { baseline, sheetTop: document.querySelector("[data-id-sheet]")!.getBoundingClientRect().top + scrollY }
    })
    expect(m.sheetTop, "the sheet starts below NAWI's baseline").toBeGreaterThanOrEqual(m.baseline - 1)
  })
}
