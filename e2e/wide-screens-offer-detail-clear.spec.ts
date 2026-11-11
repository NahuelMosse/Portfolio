import { test, expect } from "@playwright/test"

// The chapter titles do not take the pointer (ASM-26), so the hit test turns them back on for the measure.
// The word's own line box is taller than its glyphs (tight poster leading), so a hit on the word is fine when the two boxes are apart:
// what must not happen is another element, or the word's ink, sitting on the detail line.
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
    const m = await page.evaluate(async () => {
      const title = document.querySelector<HTMLElement>('[data-chapter-title="offer"]')!
      const detail = title.querySelector(".chapter-detail")!
      const word = title.querySelector(".chapter-word")!
      title.style.pointerEvents = "auto"
      detail.scrollIntoView({ block: "center" })
      await new Promise((done) => setTimeout(done, 250))
      const box = detail.getBoundingClientRect()
      const top = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2)
      return {
        foreign: !!top && !title.contains(top),
        wordOverlaps: box.bottom > word.getBoundingClientRect().top + 1,
      }
    })
    expect(m.foreign, "another element covers the detail line").toBe(false)
    expect(m.wordOverlaps, "the word's box starts below the detail line").toBe(false)
  })
}
