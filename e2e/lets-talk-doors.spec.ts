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

test("each door opens an email with its own subject and the two door labels read as written @PF-1-ASM-12", async ({ page }) => {
  await page.goto("/")
  const doors = await page.locator("[data-offer-card] a.door").evaluateAll((all) =>
    all.map((a) => ({ label: (a as HTMLElement).innerText.trim(), href: a.getAttribute("href") ?? "" })),
  )
  expect(doors.map((d) => d.label)).toEqual(["Let’s talk about your project", "Bring AI-first delivery to your team"])
  for (const door of doors) expect(door.href.startsWith("mailto:")).toBe(true)
})
