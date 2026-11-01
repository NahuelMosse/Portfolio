import { test, expect } from "@playwright/test"

test.describe("phone layout", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test("at 390 only the hire bar is fixed, the controls scroll away, the cold open shows the title and the subject in the first screen, no text leaves the viewport outside the piece rows and no asset box is taller than a screen @PF-1-ASM-27 @PF-1-S9", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("load")

    const fixed = await page.evaluate(() =>
      [...document.querySelectorAll("body *")]
        .filter((el) => getComputedStyle(el).position === "fixed" && getComputedStyle(el).display !== "none")
        .filter((el) => el.getBoundingClientRect().height > 1 && !el.hasAttribute("data-grain") && !el.classList.contains("lamp-light"))
        .map((el) => el.className.toString()),
    )
    expect(fixed.filter((c) => !c.includes("hire-bar") && !c.includes("scroll-progress") && !c.includes("pointer-events"))).toEqual([])

    const first = await page.evaluate(() => {
      const box = (selector: string) => document.querySelector(selector)?.getBoundingClientRect()
      return { mark: box(".mark"), him: box("[data-him]"), vh: innerHeight }
    })
    expect(first.mark && first.mark.top >= 0 && first.mark.bottom <= first.vh).toBe(true)
    expect(first.mark && first.mark.left >= 0 && first.mark.right <= 390).toBe(true)
    expect(first.him && first.him.top < first.vh - 100).toBe(true)

    const leaks = await page.evaluate(() =>
      [...document.querySelectorAll("main h1, main h2, main h3, main p, main a, main dd")]
        .filter((el) => !el.closest(".piece-row") && !el.closest("[aria-hidden='true']"))
        .map((el) => ({ text: (el.textContent ?? "").slice(0, 30), r: el.getBoundingClientRect() }))
        .filter(({ r }) => r.width > 0 && (r.left < -1 || r.right > 391))
        .map(({ text }) => text),
    )
    expect(leaks).toEqual([])

    const tall = await page.evaluate(() =>
      [...document.querySelectorAll(".scene-media")]
        .filter((el) => !el.classList.contains("fresco-media") && !el.classList.contains("grain-texture"))
        .filter((el) => el.getBoundingClientRect().height > innerHeight)
        .map((el) => el.className.toString()),
    )
    expect(tall).toEqual([])
  })
})
