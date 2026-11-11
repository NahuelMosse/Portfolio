import { test, expect } from "@playwright/test"

const WIDTHS = [390, 1440] as const
const EMAIL = "nahuelgamail@gmail.com"
const LINKEDIN = /^https:\/\/(www\.)?linkedin\.com\/in\/nahuelmosse\/?$/
const GITHUB = "https://github.com/NahuelMosse"

for (const width of WIDTHS) {
  test(`contact at ${width}: three real links, a copy action, nothing to type, the drawing covers the section @PF-1-ASM-26`, async ({ page }) => {
    await page.addInitScript(() => {
      const sink = { text: "" }
      Object.defineProperty(window, "__copied", { get: () => sink.text })
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: async (text: string) => void (sink.text = text) },
      })
    })
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/")
    const block = page.locator("#contact [data-tiles]")
    await block.scrollIntoViewIfNeeded()

    await expect(block.locator('a[data-contact="email"]')).toHaveAttribute("href", `mailto:${EMAIL}`)
    await expect(block.locator('a[data-contact="linkedin"]')).toHaveAttribute("href", LINKEDIN)
    await expect(block.locator('a[data-contact="github"]')).toHaveAttribute("href", GITHUB)
    await expect(block.locator('a[href^="tel:"]')).toHaveCount(0)
    await expect(block.locator("input, textarea, select")).toHaveCount(0)
    await expect(block.locator('a[data-contact="linkedin"]')).toBeVisible()
    await expect(block.locator('a[data-contact="github"]')).toBeVisible()

    const copy = block.locator("button[data-copy]")
    await expect(copy).toBeVisible()
    await copy.click()
    await expect(block.locator("[data-copy-status]")).toHaveText(/copied/i)
    expect(await page.evaluate(() => (window as unknown as { __copied: string }).__copied)).toBe(EMAIL)

    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), "no horizontal scroll").toBeLessThanOrEqual(0)

    const edges = await page.evaluate(() => {
      const scene = document.querySelector(".contact-scene")!.getBoundingClientRect()
      const img = document.querySelector(".contact-scene .scene-art img")!.getBoundingClientRect()
      return [img.top - scene.top, img.left - scene.left, scene.bottom - img.bottom, scene.right - img.right]
    })
    for (const edge of edges) expect(Math.abs(edge), "drawing edge against the section").toBeLessThanOrEqual(1)
  })
}

test("contact honors reduced motion: no running animation inside the block @PF-1-ASM-26", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  const running = await page.locator("#contact [data-tiles]").evaluate((el) => el.getAnimations({ subtree: true }).filter((a) => a.playState === "running").length)
  expect(running).toBe(0)
})
