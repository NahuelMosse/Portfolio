import { test, expect, type Page } from "@playwright/test"

// @PF-1-ASM-39 arriving by the chapter links: the whole OFFER word is below the top bar and nothing of Let's talk shows;
// Let's talk is exactly one screen with its content spread over the whole height.
const SIZES = [
  { width: 1910, height: 912 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1080 },
  { width: 1440, height: 900 },
  { width: 1280, height: 720 },
] as const

async function arrive(page: Page, id: "offer" | "contact") {
  await page.goto("/")
  await page.locator(".pin-spacer").first().waitFor({ state: "attached" })
  await page.waitForTimeout(800)
  await page.locator(`[data-index-item="${id === "offer" ? "end-credits" : id}"]`).click()
  let last = -1
  let still = 0
  for (let i = 0; i < 120 && still < 4; i++) {
    await page.waitForTimeout(250)
    const y = await page.evaluate(() => scrollY)
    still = y === last ? still + 1 : 0
    last = y
  }
  expect(last, "the link scrolled").toBeGreaterThan(0)
}

for (const { width, height } of SIZES) {
  test(`at ${width}x${height} the Offer word clears the top bar and Let's talk is out of sight @PF-1-ASM-39`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await arrive(page, "offer")
    const m = await page.evaluate(() => {
      const word = document.querySelector(".offer-scene .chapter-word")!.getBoundingClientRect()
      return {
        wordTop: word.top,
        barBottom: document.querySelector("[data-top-bar]")!.getBoundingClientRect().bottom,
        contactTop: document.querySelector(".contact-scene")!.getBoundingClientRect().top,
        innerHeight,
      }
    })
    expect(m.wordTop, "the whole word is under the top bar").toBeGreaterThanOrEqual(m.barBottom - 1)
    expect(m.contactTop, "no part of Let's talk shows").toBeGreaterThanOrEqual(m.innerHeight - 1)
  })

  test(`at ${width}x${height} Let's talk is one screen with its content spread over it @PF-1-ASM-39`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await arrive(page, "contact")
    const m = await page.evaluate(() => {
      const scene = document.querySelector(".contact-scene")!.getBoundingClientRect()
      const parts = [".contact-scene .chapter-title", ".contact-tiles", ".credits-roll", ".end-of-file"].map((s) =>
        document.querySelector(s)!.getBoundingClientRect(),
      )
      return {
        top: scene.top,
        bottom: scene.bottom,
        barBottom: document.querySelector("[data-top-bar]")!.getBoundingClientRect().bottom,
        footerBottom: document.querySelector(".end-of-file")!.getBoundingClientRect().bottom,
        extent: Math.max(...parts.map((p) => p.bottom)) - Math.min(...parts.map((p) => p.top)),
        wordSize: parseFloat(getComputedStyle(document.querySelector(".contact-scene .chapter-word")!).fontSize),
        innerHeight,
      }
    })
    expect(Math.min(Math.abs(m.top), Math.abs(m.top - m.barBottom)), "the red block starts at the top").toBeLessThanOrEqual(2)
    expect(Math.abs(m.bottom - m.innerHeight), "and ends at the bottom of the screen").toBeLessThanOrEqual(2)
    expect(m.footerBottom, "the © line is last and inside the screen").toBeLessThanOrEqual(m.innerHeight)
    expect(m.extent, "the content spans at least 80% of the block").toBeGreaterThanOrEqual((m.bottom - m.top) * 0.8)
    expect(m.wordSize).toBeGreaterThanOrEqual((width * 16) / 100)
  })
}
