import { test, expect } from "@playwright/test"

// @PF-1-ASM-27 @PF-1-S9: the phone contract that survives the poster redesign. Dropped with their subjects: [data-him] (the cover is
// an illustration), the per-project spreads and the swipeable piece rows (projects are pinned scenes whose screens change in place).
const MIN_TEXT = 14
const MIN_HIRE_BAR = 48
const VIEWPORT = { width: 390, height: 844 }

test.describe("phone 390", () => {
  test.use({ viewport: VIEWPORT, hasTouch: true })

  test("at 390 only the hire bar is fixed, NAWI sits inside the first screen, no text leaves the viewport and no asset box is taller than a screen @PF-1-ASM-27 @PF-1-S9", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("load")

    const fixed = await page.evaluate(() =>
      [...document.querySelectorAll("body *")]
        .filter((el) => getComputedStyle(el).position === "fixed" && getComputedStyle(el).display !== "none")
        .filter((el) => el.getBoundingClientRect().height > 1 && !el.hasAttribute("data-grain") && !el.classList.contains("lamp-light"))
        .map((el) => el.className.toString()),
    )
    expect(fixed.filter((c) => !c.includes("hire-bar") && !c.includes("scroll-progress") && !c.includes("pointer-events"))).toEqual([])

    const mark = await page.evaluate(() => {
      const box = document.querySelector(".mark")?.getBoundingClientRect()
      return box && { top: box.top, bottom: box.bottom, left: box.left, right: box.right, vh: innerHeight }
    })
    expect(mark, "NAWI is on the page").toBeTruthy()
    expect(mark!.top).toBeGreaterThanOrEqual(0)
    expect(mark!.bottom).toBeLessThanOrEqual(mark!.vh)
    expect(mark!.left).toBeGreaterThanOrEqual(0)
    expect(mark!.right).toBeLessThanOrEqual(VIEWPORT.width)

    const leaks = await page.evaluate(() =>
      [...document.querySelectorAll("main h1, main h2, main h3, main p, main a, main dd")]
        .filter((el) => !el.closest("[aria-hidden='true']"))
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

  test("at 390 the chapter index opens from the top bar menu, a fixed Hire me bar of at least 48 px sits at the bottom, no text is under 14 px and nothing scrolls sideways @PF-1-ASM-27", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("load")

    const index = page.locator("[data-chapter-index]")
    await expect(index).toBeHidden()
    await page.locator("[data-menu-button]").click()
    await expect(index).toBeVisible()
    await expect(index.locator("[data-index-item]").first()).toBeVisible()
    await page.locator("[data-menu-button]").click()
    await expect(index).toBeHidden()

    const bar = page.locator("[data-hire-bar]")
    await expect(bar).toBeVisible()
    const barBox = (await bar.boundingBox())!
    expect(barBox.height).toBeGreaterThanOrEqual(MIN_HIRE_BAR)
    expect(await bar.evaluate((el) => getComputedStyle(el).position)).toBe("fixed")
    expect(Math.round(barBox.y + barBox.height)).toBe(VIEWPORT.height)
    await expect(bar.locator("a", { hasText: "Hire me" })).toHaveCount(1)

    const layout = await page.evaluate((minText) => {
      const small = [...document.querySelectorAll("body *")]
        .filter((el) => {
          const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim())
          const cs = getComputedStyle(el)
          return own && cs.display !== "none" && cs.visibility !== "hidden" && el.getBoundingClientRect().width > 0 && !el.closest(".sr-only, .terminal-screen, script, style") && parseFloat(cs.fontSize) < minText
        })
        .map((el) => `${el.tagName}.${el.className}: ${el.textContent?.trim().slice(0, 30)}`)
      const sideways = [...document.querySelectorAll("body *")]
        .filter((el) => ["auto", "scroll"].includes(getComputedStyle(el).overflowX) && el.scrollWidth > el.clientWidth + 1 && el !== document.body && el !== document.documentElement)
        .map((el) => `${el.tagName}.${el.className}`)
      return { small, sideways, page: document.documentElement.scrollWidth }
    }, MIN_TEXT)
    expect(layout.small).toEqual([])
    expect(layout.sideways).toEqual([])
    expect(layout.page).toBeLessThanOrEqual(VIEWPORT.width)
  })
})
