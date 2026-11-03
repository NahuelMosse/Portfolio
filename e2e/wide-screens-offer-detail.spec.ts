import { test, expect } from "@playwright/test"

// The chapter titles do not take the pointer (ASM-26), so the hit test turns them back on for the measure.
const SIZES = [
  { width: 1280, height: 720 },
  { width: 1536, height: 864 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
  { width: 3440, height: 1440 },
]

for (const size of SIZES) {
  test(`at ${size.width}x${size.height} the Offer detail line is not covered by the experience cards @PF-1-ASM-28`, async ({ page }) => {
    await page.setViewportSize(size)
    await page.goto("/")
    await page.waitForLoadState("load")
    const covered = await page.evaluate(async () => {
      const title = document.querySelector<HTMLElement>('[data-chapter-title="offer"]')!
      const detail = title.querySelector(".chapter-detail")!
      title.style.pointerEvents = "auto"
      detail.scrollIntoView({ block: "center" })
      await new Promise((done) => setTimeout(done, 250))
      const box = detail.getBoundingClientRect()
      const top = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2)
      return !(top && (top === detail || detail.contains(top)))
    })
    expect(covered, "something covers the detail line").toBe(false)
  })
}
