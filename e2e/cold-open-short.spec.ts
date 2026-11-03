import { test, expect } from "@playwright/test"

const VIEWPORTS = [
  { width: 1910, height: 912 },
  { width: 1920, height: 900 },
  { width: 1680, height: 800 },
  { width: 2560, height: 1080 },
  { width: 1440, height: 700 },
] as const

const GAP = 1

for (const { width, height } of VIEWPORTS) {
  test(`cold open at ${width}x${height}: the sheet starts below NAWI's baseline and the corner button clears the hero button @PF-1-ASM-30`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto("/")
    await expect(page.locator("[data-cta]")).toHaveAttribute("data-visible", "true", { timeout: 6000 })

    const m = await page.evaluate(() => {
      const mark = document.querySelector<HTMLElement>("h1.mark")!
      const probe = document.createElement("span")
      probe.style.cssText = "display:inline-block;width:0;height:0"
      mark.append(probe)
      const baseline = probe.getBoundingClientRect().bottom + scrollY
      probe.remove()
      const sheetTop = document.querySelector("[data-id-sheet]")!.getBoundingClientRect().top + scrollY
      const corner = document.querySelector(".corner-cta")!.getBoundingClientRect()
      const door = document.querySelector(".hero-door")!.getBoundingClientRect()
      const doorTopPage = door.top + scrollY
      const cornerPage = { left: corner.left, right: corner.right, top: corner.top + scrollY, bottom: corner.bottom + scrollY }
      const apart =
        cornerPage.right <= door.left || door.right <= cornerPage.left || cornerPage.bottom <= doorTopPage || door.bottom + scrollY <= cornerPage.top
      return { baseline, sheetTop, apart, scrollY }
    })

    expect(m.scrollY, "measured at the top").toBe(0)
    expect(m.sheetTop, "the sheet starts below NAWI's baseline").toBeGreaterThanOrEqual(m.baseline - GAP)
    expect(m.apart, "the corner button does not cover the hero button").toBe(true)
  })
}
