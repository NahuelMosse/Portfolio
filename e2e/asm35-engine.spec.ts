import { test, expect } from "@playwright/test"

// @PF-1-ASM-35: Lenis drives the scroll on desktop, and is off for reduced motion and on touch.
test.describe("desktop", () => {
  test.use({ viewport: { width: 1910, height: 912 } })

  test("lenis is active on desktop and the page still scrolls natively @PF-1-ASM-35", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("html")).toHaveClass(/\blenis\b/)
    await expect(page.locator("html")).toHaveClass(/\bhas-motion\b/)
    await page.evaluate(() => window.scrollTo(0, 1500))
    await expect.poll(() => page.evaluate(() => Math.round(scrollY))).toBeGreaterThan(1000)
  })

  test("a chapter link scrolls to its chapter through lenis @PF-1-ASM-35", async ({ page }) => {
    await page.goto("/")
    await page.locator('.top-bar a[href="#experience"]').first().click()
    await expect
      .poll(async () => page.evaluate(() => Math.abs(document.querySelector("#experience")!.getBoundingClientRect().top)), { timeout: 8000 })
      .toBeLessThan(80)
  })
})

test.describe("reduced motion", () => {
  test.use({ viewport: { width: 1910, height: 912 }, reducedMotion: "reduce" })

  test("lenis and has-motion are off @PF-1-ASM-35", async ({ page }) => {
    await page.goto("/")
    await page.waitForTimeout(800)
    const classes = await page.evaluate(() => document.documentElement.className)
    expect(classes).not.toMatch(/lenis/)
    expect(classes).not.toMatch(/has-motion/)
  })
})

test.describe("phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test("lenis is off on touch: native scroll @PF-1-ASM-35", async ({ page }) => {
    await page.goto("/")
    await page.waitForTimeout(800)
    expect(await page.evaluate(() => document.documentElement.className)).not.toMatch(/lenis/)
  })

  test("the sticky HIRE ME bar does not cover the footer at the end of the page @PF-1-ASM-35", async ({ page }) => {
    await page.goto("/")
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await page.waitForTimeout(600)
    const r = await page.evaluate(() => {
      const footer = document.querySelector("footer.end-of-file")!.getBoundingClientRect()
      const bar = document.querySelector("[data-hire-bar]")!
      const barBox = bar.getBoundingClientRect()
      const barShown = getComputedStyle(bar).display !== "none" && getComputedStyle(bar).visibility !== "hidden" && barBox.height > 0
      return { footerBottom: footer.bottom, footerTop: footer.top, barTop: barBox.top, barShown, innerHeight }
    })
    expect(r.footerTop).toBeGreaterThanOrEqual(0)
    expect(r.footerBottom, "the footer ends above the bar").toBeLessThanOrEqual(r.barShown ? r.barTop + 1 : r.innerHeight)
  })
})
