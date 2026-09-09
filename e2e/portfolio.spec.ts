import { expect, test, type Page } from "@playwright/test"

const SECTIONS = [
  "hero",
  "telemetry",
  "work",
  "lab",
  "grit",
  "method",
  "arsenal",
  "origins",
  "proof",
  "contact",
] as const

/**
 * Scrolls the page in steps. `mouse.wheel` does nothing on a touch-enabled
 * emulated device, so drive the window directly — this exercises the same
 * scroll listeners a real finger would.
 */
async function scrollThrough(page: Page, distance = 700) {
  // Step until the bottom instead of a fixed count: the mobile layout is far
  // taller than the desktop one, and a fixed loop silently stops short.
  for (let i = 0; i < 200; i++) {
    const atBottom = await page.evaluate((d) => {
      window.scrollBy(0, d)
      return (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2
      )
    }, distance)
    await page.waitForTimeout(70)
    if (atBottom) break
  }
  await page.waitForTimeout(1600)
}

/** Dismisses the first-visit boot overlay and settles the page. */
async function enter(page: Page, path = "/") {
  const errors: string[] = []
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text())
  })
  page.on("pageerror", (err) => errors.push(err.message))

  await page.goto(path, { waitUntil: "domcontentloaded" })
  await page.waitForTimeout(2600)
  await page.mouse.click(400, 400).catch(() => {})
  await page.waitForTimeout(600)

  return errors
}

test.describe("portfolio", () => {
  test("every section renders in both locales", async ({ page }) => {
    for (const path of ["/", "/es"]) {
      await enter(page, path)

      for (const id of SECTIONS) {
        await expect(
          page.locator(`#${id}`),
          `#${id} missing on ${path}`,
        ).toHaveCount(1)
      }
    }
  })

  test("html lang matches the route", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("html")).toHaveAttribute("lang", "en")

    await page.goto("/es")
    await expect(page.locator("html")).toHaveAttribute("lang", "es")
  })

  test("no console errors on a full scroll-through", async ({ page }) => {
    const errors = await enter(page)

    await scrollThrough(page)

    expect(errors, `console errors:\n${errors.join("\n")}`).toEqual([])
  })

  test("content reveals instead of staying hidden", async ({ page }) => {
    await enter(page)

    // Reveal is animation, but a reveal that never fires hides real content.
    // Scroll the whole page, then assert nothing is left unrevealed.
    await scrollThrough(page)

    // Polled: reveals are driven by observers, and under parallel workers the
    // last few can land a beat after the scroll settles.
    await expect
      .poll(
        () =>
          page.evaluate(
            () =>
              document.querySelectorAll("[data-reveal]:not([data-shown])").length,
          ),
        { timeout: 15_000 },
      )
      .toBe(0)
  })

  test("telemetry counters reach their real values", async ({ page }) => {
    await enter(page)

    // Counters start when their cell enters the viewport. On desktop the grid
    // fits in one screen; on mobile it is a six-cell column, so scroll each
    // cell into view before reading — otherwise the test measures a counter
    // that was correctly still waiting.
    const cells = page.locator("#telemetry [data-reveal]")
    const count = await cells.count()
    for (let i = 0; i < count; i++) {
      await cells.nth(i).scrollIntoViewIfNeeded()
      await page.waitForTimeout(300)
    }
    await page.waitForTimeout(2200)

    const values = await page
      .locator("#telemetry .font-display")
      .allTextContents()

    expect(values.length).toBeGreaterThan(0)
    // A stuck counter renders "0" — the bug this test exists to catch.
    expect(values.some((v) => v.trim() === "0")).toBe(false)
    expect(values.join(" ")).toContain("40M+")
  })

  test("the palette inverts on Grit and comes back", async ({ page }) => {
    await enter(page)

    await page.evaluate(() => {
      const grit = document.getElementById("grit")
      if (!grit) return
      const rect = grit.getBoundingClientRect()
      window.scrollTo({
        top: window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2,
        behavior: "instant",
      })
    })
    await page.waitForTimeout(1200)
    await expect(page.locator("html")).toHaveAttribute("data-palette", "grit")

    await page.locator("#proof").scrollIntoViewIfNeeded()
    await page.waitForTimeout(1200)
    await expect(page.locator("html")).not.toHaveAttribute("data-palette", "grit")
  })

  test("language switch reaches the other locale", async ({ page }) => {
    await enter(page)
    await page.getByRole("link", { name: /español|spanish/i }).first().click()
    await page.waitForURL("**/es")
    await expect(page.locator("html")).toHaveAttribute("lang", "es")
  })

  test("machine-readable endpoints stay in sync", async ({ request }) => {
    const json = await request.get("/portfolio.json")
    expect(json.ok()).toBe(true)
    const payload = await json.json()
    expect(payload.person.name).toBe("Nahuel Mosse")
    expect(payload.experience.length).toBeGreaterThanOrEqual(5)
    expect(payload.skills.length).toBeGreaterThan(20)

    const llms = await request.get("/llms.txt")
    expect(llms.ok()).toBe(true)
    expect(await llms.text()).toContain("Nahuel Mosse")
  })

  test("no client system screenshots are served", async ({ request }) => {
    // The site deliberately publishes no client UI. If one of these comes
    // back, someone re-added an asset that should not ship.
    for (const path of [
      "/fravega-1.webp",
      "/fravega-2.webp",
      "/justo-1.webp",
      "/justo-2.webp",
    ]) {
      const res = await request.get(path, { maxRedirects: 0 })
      expect(res.status(), `${path} must not be served`).toBe(404)
    }
  })
})

test.describe("command palette", () => {
  test.skip(({ isMobile }) => Boolean(isMobile), "keyboard-only affordance")

  test("opens with the keyboard and navigates", async ({ page }) => {
    await enter(page)

    await page.keyboard.press("ControlOrMeta+k")
    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()

    await page.keyboard.type("proof")
    await page.keyboard.press("Enter")
    await expect(dialog).toBeHidden()

    // Lenis animates the scroll, so poll rather than sampling one frame.
    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const el = document.getElementById("proof")
            if (!el) return false
            const rect = el.getBoundingClientRect()
            return rect.top < window.innerHeight && rect.bottom > 0
          }),
        { timeout: 15_000 },
      )
      .toBe(true)
  })

  test("escape closes it", async ({ page }) => {
    await enter(page)
    await page.keyboard.press("ControlOrMeta+k")
    await expect(page.getByRole("dialog")).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(page.getByRole("dialog")).toBeHidden()
  })
})

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" })

  test("everything is visible without animation", async ({ page }) => {
    await page.goto("/")
    await page.waitForTimeout(1500)

    // No boot overlay, and nothing waiting on a reveal that will never run.
    const hidden = await page.evaluate(
      () => document.querySelectorAll("[data-reveal]:not([data-shown])").length,
    )
    expect(hidden).toBe(0)

    await expect(page.locator("#hero h1")).toBeVisible()
    await expect(page.locator("canvas")).toHaveCount(0)
  })
})
