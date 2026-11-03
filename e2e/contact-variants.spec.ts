import { test, expect } from "@playwright/test"

const VARIANTS = ["a", "b", "c"] as const
const WIDTHS = [390, 1440] as const
const EMAIL = "nahuelgamail@gmail.com"
const LINKEDIN = /^https:\/\/(www\.)?linkedin\.com\/in\/nahuelmosse\/?$/
const GITHUB = "https://github.com/NahuelMosse"

for (const variant of VARIANTS) {
  for (const width of WIDTHS) {
    test(`contact variant ${variant} at ${width}: three real links, a copy action, nothing to type, no sideways scroll @PF-1-ASM-26`, async ({ page }) => {
      await page.addInitScript(() => {
        const sink = { text: "" }
        Object.defineProperty(window, "__copied", { get: () => sink.text })
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: { writeText: async (text: string) => void (sink.text = text) },
        })
      })
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`/?contact=${variant}`)
      const block = page.locator("#contact [data-tiles]")
      await expect(block).toHaveAttribute("data-variant", variant)
      await block.scrollIntoViewIfNeeded()

      await expect(block.locator('a[data-contact="email"]')).toHaveAttribute("href", `mailto:${EMAIL}`)
      await expect(block.locator('a[data-contact="linkedin"]')).toHaveAttribute("href", LINKEDIN)
      await expect(block.locator('[data-secondary] a[data-contact="github"], a[data-contact="github"]').first()).toHaveAttribute("href", GITHUB)
      await expect(block.locator('a[href^="tel:"]')).toHaveCount(0)
      await expect(block.locator("input, textarea, select")).toHaveCount(0)
      await expect(block.locator('a[data-contact="linkedin"]')).toBeVisible()
      await expect(block.locator('a[data-contact="github"]')).toBeVisible()

      const copy = block.locator("button[data-copy]")
      await expect(copy).toBeVisible()
      await expect(copy).toContainText(EMAIL.split("@")[0])
      await copy.click()
      await expect(block.locator("[data-copy-status]")).toHaveText(/copied/i)
      expect(await page.evaluate(() => (window as unknown as { __copied: string }).__copied)).toBe(EMAIL)

      const sideways = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
      expect(sideways, "no horizontal scroll").toBeLessThanOrEqual(0)
    })
  }
}

test("contact variants honor reduced motion: no running animation inside the block @PF-1-ASM-26", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  for (const variant of VARIANTS) {
    await page.goto(`/?contact=${variant}`)
    const block = page.locator("#contact [data-tiles]")
    await expect(block).toHaveAttribute("data-variant", variant)
    const running = await block.evaluate((el) => el.getAnimations({ subtree: true }).filter((a) => a.playState === "running").length)
    expect(running, `variant ${variant} animations`).toBe(0)
  }
})
