import { test, expect } from "@playwright/test"

const WIDTHS = [390, 1440] as const
const EMAIL = "contact@nahuelmosse.com"
const LINKEDIN = /^https:\/\/(www\.)?linkedin\.com\/in\/nahuelmosse\/?$/
const GITHUB = "https://github.com/NahuelMosse"

for (const width of WIDTHS) {
  test(`contact at ${width}: three real links, a copy action, nothing to type @PF-1-ASM-26`, async ({ page }) => {
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
  })
}

test("the end credits offer email and LinkedIn, and GitHub as a secondary link after the two doors @PF-1-ASM-04", async ({ page }) => {
  await page.goto("/")
  const section = page.locator('section[data-chapter="end-credits"]')
  await expect(section.locator(`a[data-contact="email"][href="mailto:${EMAIL}"]`)).toHaveCount(1)
  await expect(section.locator('a[href^="https://linkedin.com/in/nahuelmosse"]')).toHaveCount(1)
  await expect(section.locator('[data-secondary] a[href="https://github.com/NahuelMosse"]')).toHaveCount(1)
  const afterDoors = await section.evaluate(
    (el) =>
      !!(el.querySelector("[data-doors]")!.compareDocumentPosition(el.querySelector("[data-secondary]")!) & Node.DOCUMENT_POSITION_FOLLOWING),
  )
  expect(afterDoors).toBe(true)
})

test("the copy button says Copied in a live region and goes back @PF-1-ASM-26", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.goto("/")
  const button = page.locator("#contact button[data-copy]")
  await button.scrollIntoViewIfNeeded()
  await expect(page.locator("#contact [aria-live]")).toHaveCount(1)
  await button.click()
  await expect(page.locator("#contact [aria-live]")).toHaveText(/Copied/)
  await expect(button).toHaveAttribute("data-copied", "")
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(EMAIL)
  await expect(button).not.toHaveAttribute("data-copied", "", { timeout: 4000 })
})
