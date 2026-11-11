import { test, expect, type Page } from "@playwright/test"

const SIZES = [
  { width: 1910, height: 912 },
  { width: 1920, height: 1080 },
  { width: 1440, height: 900 },
  { width: 1280, height: 720 },
  { width: 2560, height: 1080 },
] as const

const TOLERANCE = 1

// The union of the boxes of what a section shows, once its top is brought to the top of the screen.
async function contentBox(page: Page, selectors: string[], anchor: string) {
  return page.evaluate(
    ({ selectors, anchor }) => {
      const top = document.querySelector(anchor)!.getBoundingClientRect().top + scrollY
      window.scrollTo(0, top)
      const boxes = selectors.flatMap((s) => [...document.querySelectorAll(s)].map((n) => n.getBoundingClientRect()))
      const visible = boxes.filter((b) => b.width > 0 && b.height > 0)
      return {
        top: Math.min(...visible.map((b) => b.top)),
        bottom: Math.max(...visible.map((b) => b.bottom)),
        innerHeight,
        count: visible.length,
      }
    },
    { selectors, anchor },
  )
}

for (const { width, height } of SIZES) {
  test.describe(`${width}x${height}`, () => {
    test.use({ viewport: { width, height } })

    test(`the cold open is one screen: its section is 100svh and everything it shows is inside @PF-1-ASM-37`, async ({ page }) => {
      await page.goto("/")
      const section = await page.evaluate(() => document.querySelector("#cold-open")!.getBoundingClientRect().height)
      expect(section, "the cold open is as tall as the screen").toBeLessThanOrEqual(height + TOLERANCE)
      const box = await contentBox(
        page,
        ["h1.mark", ".professional-name", "[data-id-sheet]", ".hero-line", ".hero-door"],
        "#cold-open",
      )
      expect(box.count).toBeGreaterThanOrEqual(5)
      expect(box.top).toBeGreaterThanOrEqual(-TOLERANCE)
      expect(box.bottom).toBeLessThanOrEqual(height + TOLERANCE)
    })

    test(`the identification sheet does not touch NAWI and the hero button does not touch the corner button @PF-1-ASM-37`, async ({ page }) => {
      await page.goto("/")
      await expect(page.locator("[data-cta]")).toHaveAttribute("data-visible", "true", { timeout: 6000 })
      const r = await page.evaluate(() => {
        const box = (s: string) => document.querySelector(s)!.getBoundingClientRect()
        const apart = (a: DOMRect, b: DOMRect) => a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top
        const mark = box("h1.mark")
        const sheet = box("[data-id-sheet]")
        const door = box(".hero-door")
        const corner = box(".corner-cta")
        return { sheetClear: apart(sheet, mark), doorClear: apart(door, corner), scrollY }
      })
      expect(r.scrollY).toBe(0)
      expect(r.sheetClear, "the sheet does not overlap NAWI").toBe(true)
      expect(r.doorClear, "the hero button does not overlap the corner button").toBe(true)
    })

    test(`each project group is one pinned screen @PF-1-ASM-37`, async ({ page }) => {
      await page.goto("/")
      const heights = await page.evaluate(() => [...document.querySelectorAll(".group-pin")].map((n) => n.getBoundingClientRect().height))
      expect(heights.length).toBeGreaterThan(0)
      for (const h of heights) expect(h).toBeLessThanOrEqual(height + TOLERANCE)
    })

    test(`the experience stage is one screen @PF-1-ASM-37`, async ({ page }) => {
      await page.goto("/")
      const h = await page.evaluate(() => document.querySelector("[data-experience-stage]")!.getBoundingClientRect().height)
      expect(h).toBeLessThanOrEqual(height + TOLERANCE)
    })

    test(`the offer is one screen @PF-1-ASM-37`, async ({ page }) => {
      await page.goto("/")
      const box = await contentBox(page, [".offer-scene .chapter-title", ".offer-scene .folder", ".offer-scene .scene-art"], ".offer-scene .chapter-title")
      expect(box.bottom - box.top).toBeLessThanOrEqual(height + TOLERANCE)
    })
  })
}

for (const { width, height } of SIZES.filter((s) => s.width >= 1910)) {
  test(`the Let's talk ending block is one screen at ${width}x${height} @PF-1-ASM-37`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto("/")
    const h = await page.evaluate(() => document.querySelector(".contact-scene")!.getBoundingClientRect().height)
    expect(h).toBeLessThanOrEqual(height + TOLERANCE)
  })
}
