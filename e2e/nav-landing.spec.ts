import { test, expect, type Page } from "@playwright/test"

// @PF-1-ASM-43 every top link lands its chapter in its first beat, from the top, the middle and the foot of the page:
// a chapter's top just under the bar, a scene that fills the screen at the top of the screen (under the bar or behind it),
// and on wide screens Offer ending where Let's talk begins. On a phone the links are reached through the menu.
const SIZES = [
  { width: 1910, height: 912 },
  { width: 1440, height: 900 },
  { width: 1280, height: 720 },
  { width: 390, height: 844 },
] as const

type Expect = { target: string; edge: "bar" | "fill" | "end" }
type Link = { name: string; selector: string; wide: Expect; narrow: Expect }

const LINKS: readonly Link[] = [
  { name: "01 Subject", selector: '[data-index-item="cold-open"]', wide: { target: "#cold-open", edge: "fill" }, narrow: { target: "#cold-open", edge: "fill" } },
  { name: "02 Projects", selector: '[data-index-item="projects"]', wide: { target: "#projects", edge: "bar" }, narrow: { target: "#projects", edge: "bar" } },
  { name: "03 Experience", selector: '[data-index-item="experience"]', wide: { target: "#experience", edge: "bar" }, narrow: { target: "#experience", edge: "bar" } },
  { name: "04 Offer", selector: '[data-index-item="end-credits"]', wide: { target: ".contact-scene", edge: "end" }, narrow: { target: "#end-credits", edge: "bar" } },
  { name: "05 Contact", selector: '[data-index-item="contact"]', wide: { target: ".contact-scene", edge: "fill" }, narrow: { target: "#contact", edge: "bar" } },
]

const STARTS = ["top", "middle", "foot"] as const
const TOLERANCE = 8

async function settle(page: Page) {
  let last = -1
  let still = 0
  for (let i = 0; i < 120 && still < 4; i++) {
    await page.waitForTimeout(200)
    const y = await page.evaluate(() => Math.round(scrollY))
    still = y === last ? still + 1 : 0
    last = y
  }
}

async function startAt(page: Page, start: (typeof STARTS)[number]) {
  await page.evaluate((where) => {
    const end = document.documentElement.scrollHeight
    window.scrollTo(0, where === "top" ? 0 : where === "middle" ? end / 2 : end)
  }, start)
  await settle(page)
}

async function landed(page: Page, { target, edge }: Expect) {
  const m = await page.evaluate((selector) => {
    const box = document.querySelector(selector)!.getBoundingClientRect()
    return { top: box.top, bar: document.querySelector("[data-top-bar]")!.getBoundingClientRect().bottom, innerHeight }
  }, target)
  const off =
    edge === "bar" ? Math.abs(m.top - m.bar) : edge === "fill" ? Math.min(Math.abs(m.top), Math.abs(m.top - m.bar)) : Math.abs(m.top - m.innerHeight)
  return { ...m, off }
}

for (const { width, height } of SIZES) {
  const phone = width <= 700
  const wide = width >= 1100

  test(`at ${width}x${height} every top link lands its chapter in its first beat from anywhere on the page @PF-1-ASM-43`, async ({ page }) => {
    test.setTimeout(240_000)
    await page.setViewportSize({ width, height })
    await page.goto("/")
    await page.locator(".pin-spacer").first().waitFor({ state: "attached" })
    await page.waitForTimeout(800)

    const misses: string[] = []
    for (const start of STARTS) {
      for (const link of LINKS) {
        await startAt(page, start)
        if (phone) {
          await page.locator("[data-menu-button]").click()
          await expect(page.locator(link.selector)).toBeVisible()
        }
        await page.locator(link.selector).click()
        await settle(page)
        const expected = wide ? link.wide : link.narrow
        const m = await landed(page, expected)
        if (m.off > TOLERANCE) misses.push(`${link.name} from the ${start}: ${expected.target} top ${Math.round(m.top)}, bar ${Math.round(m.bar)}`)
        if (phone) await expect(page.locator("[data-top-bar]")).toHaveAttribute("data-menu-open", "false")
      }
    }
    expect(misses, "links that missed their landing").toEqual([])
  })
}

test("Back to top lands at the very top from the middle and the foot of the page @PF-1-ASM-48", async ({ page }) => {
  await page.setViewportSize({ width: 1910, height: 912 })
  await page.goto("/")
  await page.locator(".pin-spacer").first().waitFor({ state: "attached" })
  expect(await page.locator('[data-index-item="cold-open"]').count()).toBe(1)
  expect(await page.getByText("Skip intro").count()).toBe(0)
  for (const start of ["middle", "foot"] as const) {
    await startAt(page, start)
    await page.locator('[data-back-to-top="corner"]').click()
    await settle(page)
    expect(await page.evaluate(() => Math.round(scrollY)), `from the ${start}`).toBe(0)
  }
})

test("Let's talk in the corner lands on Let's talk from the cover and from the middle @PF-1-ASM-43", async ({ page }) => {
  await page.setViewportSize({ width: 1910, height: 912 })
  await page.goto("/")
  await page.locator(".pin-spacer").first().waitFor({ state: "attached" })
  for (const start of ["top", "middle"] as const) {
    await startAt(page, start)
    const cta = page.locator("[data-cta]")
    await expect(cta).toHaveAttribute("data-visible", "true", { timeout: 6000 })
    await cta.click()
    await settle(page)
    const m = await landed(page, { target: ".contact-scene", edge: "fill" })
    expect(m.off, `from the ${start}`).toBeLessThanOrEqual(TOLERANCE)
  }
})
