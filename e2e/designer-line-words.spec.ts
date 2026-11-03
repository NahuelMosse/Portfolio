import { test, expect } from "@playwright/test"

// @PF-1-ASM-21: each chapter word is poster type. Experience sits in the pinned scene header at 8vw, so its desktop share is lower.
const FLOOR_PHONE = 48
const SHARE_DESKTOP = { projects: 0.15, offer: 0.15, contact: 0.15, experience: 0.075 } as const
const LINE_HEIGHT_CEILING = 0.9
const EDGE_TOLERANCE = 2

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`at ${viewport.width} each chapter word is uppercase Boska, large, tight and inside the viewport @PF-1-ASM-21`, async ({ page }) => {
    const phone = viewport.width < 700
    await page.setViewportSize(viewport)
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    await page.evaluate(() => document.fonts.ready)
    const words = await page.evaluate((ids) => {
      return ids.map((id) => {
        const el = document.querySelector(`[data-chapter-word="${id}"]`) as HTMLElement | null
        if (!el) return { id, found: false as const }
        const style = getComputedStyle(el)
        const box = el.getBoundingClientRect()
        return {
          id,
          found: true as const,
          transform: style.textTransform,
          family: style.fontFamily,
          size: parseFloat(style.fontSize),
          lineHeight: parseFloat(style.lineHeight) / parseFloat(style.fontSize),
          left: box.left,
          right: box.right,
        }
      })
    }, Object.keys(SHARE_DESKTOP))

    for (const word of words) {
      expect(word.found, `${word.id} word`).toBe(true)
      if (!word.found) continue
      expect(word.transform, word.id).toBe("uppercase")
      expect(word.family, word.id).toContain("Boska")
      const share = SHARE_DESKTOP[word.id as keyof typeof SHARE_DESKTOP]
      expect(word.size, `${word.id} size`).toBeGreaterThanOrEqual(phone ? FLOOR_PHONE : viewport.width * share)
      expect(word.lineHeight, `${word.id} line height`).toBeLessThan(LINE_HEIGHT_CEILING)
      expect(word.left, `${word.id} inside`).toBeGreaterThanOrEqual(-EDGE_TOLERANCE)
      expect(word.right, `${word.id} inside`).toBeLessThanOrEqual(viewport.width + EDGE_TOLERANCE)
    }
  })
}
