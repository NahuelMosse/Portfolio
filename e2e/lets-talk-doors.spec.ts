import { test, expect } from "@playwright/test"

// Let's talk is the one open invitation: the corner call to action carries it on desktop and the phone bar on a phone, the cover has no hire door,
// and the freelance door of the offer reads "Let's talk about your project" (PF-1-ASM-44).

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1280, height: 720 },
] as const

for (const { width, height } of VIEWPORTS) {
  test(`the cold open shows the desk edge to edge, the name and the identification sheet by second 5, with no hire door, at ${width} @PF-1-S8 @PF-1-S19`, async ({ browser }) => {
    const page = await browser.newPage({ viewport: { width, height } })
    await page.goto("/")
    await page.waitForTimeout(5000)
    const cover = page.locator('section[data-chapter="cold-open"]')
    await expect(cover.locator(".hero-door")).toHaveCount(0)
    await expect(cover.getByText("Hire me", { exact: false })).toHaveCount(0)
    for (const selector of ['[data-layer="mark"]', '[data-name="professional"]', "[data-id-sheet]"]) {
      const box = await cover.locator(selector).first().boundingBox()
      expect(box, selector).not.toBeNull()
      expect(box!.y + box!.height, selector).toBeLessThanOrEqual(height)
    }
    await page.close()
  })
}

test("desktop has one Let's talk, the corner, with none in the top bar, and the phone bar carries the same link @PF-1-ASM-26 @PF-1-ASM-27", async ({ browser }) => {
  const desktop = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  await desktop.goto("/")
  await expect(desktop.locator("[data-top-bar] [data-top-hire]")).toHaveCount(0)
  await expect(desktop.locator("[data-top-bar]").getByText(/let.s talk/i)).toHaveCount(0)
  const corner = desktop.locator("[data-cta]")
  await expect(corner).toHaveCount(1)
  await expect(corner).toHaveText(/let.s talk/i)
  await expect(corner).toHaveAttribute("href", "#contact")
  await expect(desktop.locator("main").getByText("Hire me", { exact: false })).toHaveCount(0)
  await desktop.close()

  const phone = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await phone.goto("/")
  const bar = phone.locator("[data-hire-bar]")
  await expect(bar).toBeVisible()
  await expect(bar.locator("a", { hasText: /let.s talk/i })).toHaveAttribute("href", "#contact")
  await expect(bar.locator("a", { hasText: "Hire me" })).toHaveCount(0)
  await phone.close()
})

test("a Top button sits beside Let's talk once the cover is out of view, stays at the contact scene, and returns to the top with focus on the heading @PF-1-ASM-48", async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 1910, height: 912 } })
  await page.goto("/")
  await page.locator(".pin-spacer").first().waitFor({ state: "attached" })
  const top = page.locator('[data-back-to-top="corner"]')
  await expect(top).toHaveAttribute("data-visible", "false")
  await expect(top).toBeHidden()
  await page.evaluate(() => window.scrollTo(0, 2000))
  await expect(top).toBeVisible()
  const cta = page.locator("[data-cta]")
  await expect(cta).toHaveAttribute("data-visible", "true", { timeout: 6000 })
  const [t, c] = await Promise.all([top.boundingBox(), cta.boundingBox()])
  expect(t!.x + t!.width).toBeLessThanOrEqual(c!.x)
  expect(c!.x - (t!.x + t!.width)).toBeLessThan(40)
  await page.evaluate(() => document.querySelector(".contact-scene")!.scrollIntoView())
  await expect(top).toBeVisible()
  await expect(cta).toHaveAttribute("data-visible", "false")
  const edge = await top.boundingBox()
  expect(Math.round(edge!.x + edge!.width)).toBe(1910 - 32)
  await top.click()
  await expect.poll(() => page.evaluate(() => Math.round(scrollY)), { timeout: 15_000 }).toBe(0)
  expect(await page.evaluate(() => document.activeElement?.matches("h1.mark"))).toBe(true)
  await page.close()
})

test("on a phone the hire bar ends in a Top square of at least 48px that returns to the top, hidden on the cover @PF-1-ASM-48", async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  await page.goto("/")
  await page.locator(".pin-spacer").first().waitFor({ state: "attached" })
  const top = page.locator('[data-hire-bar] [data-back-to-top="bar"]')
  await expect(top).toBeHidden()
  await page.evaluate(() => window.scrollTo(0, 2000))
  await expect(top).toBeVisible()
  await expect(top).toHaveAttribute("aria-label", "Back to top")
  const box = await top.boundingBox()
  expect(box!.width).toBeGreaterThanOrEqual(48)
  expect(box!.height).toBeGreaterThanOrEqual(48)
  expect(Math.round(box!.x + box!.width)).toBe(390)
  await top.click()
  await expect.poll(() => page.evaluate(() => Math.round(scrollY)), { timeout: 15_000 }).toBe(0)
  expect(await page.evaluate(() => document.activeElement?.matches("h1.mark"))).toBe(true)
  await page.close()
})

test("each door opens an email with its own subject and the two door labels read as written @PF-1-ASM-12", async ({ page }) => {
  await page.goto("/")
  const doors = await page.locator("[data-offer-card] a.door").evaluateAll((all) =>
    all.map((a) => ({ label: (a as HTMLElement).innerText.trim(), href: a.getAttribute("href") ?? "" })),
  )
  expect(doors.map((d) => d.label)).toEqual(["Let’s talk about your project", "Bring AI-first delivery to your team"])
  for (const door of doors) expect(door.href.startsWith("mailto:")).toBe(true)
})
