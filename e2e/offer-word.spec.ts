import { test, expect } from "@playwright/test"

// @PF-1-ASM-38 the OFFER word is at least the EXPERIENCE word's size and the Offer, cards included, still fits one screen.
const SIZES = [
  { width: 1910, height: 912 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1080 },
  { width: 1440, height: 900 },
  { width: 1280, height: 720 },
] as const

for (const { width, height } of SIZES) {
  test(`the OFFER word is not smaller than EXPERIENCE and the Offer is one screen at ${width}x${height} @PF-1-ASM-38`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto("/")
    const m = await page.evaluate(() => {
      const size = (s: string) => parseFloat(getComputedStyle(document.querySelector(s)!).fontSize)
      const top = document.querySelector(".offer-scene .chapter-word")!.getBoundingClientRect().top + scrollY
      window.scrollTo(0, top)
      const boxes = [".offer-scene .chapter-word", ".offer-scene .folder", ".offer-scene .scene-art"].flatMap((s) =>
        [...document.querySelectorAll(s)].map((n) => n.getBoundingClientRect()),
      )
      return {
        offer: size(".offer-scene .chapter-word"),
        experience: size(".xp .chapter-word"),
        span: Math.max(...boxes.map((b) => b.bottom)) - Math.min(...boxes.map((b) => b.top)),
        cardsBottom: Math.max(...[...document.querySelectorAll(".offer-scene .folder")].map((n) => n.getBoundingClientRect().bottom)),
        innerHeight,
      }
    })
    expect(m.offer, "OFFER is not smaller than EXPERIENCE").toBeGreaterThanOrEqual(m.experience - 0.5)
    expect(m.span, "word, art and cards are one screen").toBeLessThanOrEqual(m.innerHeight + 1)
    expect(m.cardsBottom, "both cards end inside the screen").toBeLessThanOrEqual(m.innerHeight + 1)
  })
}
