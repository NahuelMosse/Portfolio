import { test, expect } from "@playwright/test"

const MIN_TEXT = 14
const MIN_HIRE_BAR = 48
const MAX_WORDS = 12
const PROJECTS = ["dev-kit", "grit", "guardia", "cebador", "club"]

test.describe("phone glance", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true })

  test("at 390 the page is one column, the chapter index opens from the top bar menu, each case's pieces swipe sideways with the next one cut at the edge and a counter, each case says what it is in one line of at most 12 words, a fixed Hire me bar at the bottom is at least 48 px tall, no text is under 14 px and only the piece rows scroll sideways @PF-1-ASM-27", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("load")

    const index = page.locator("[data-chapter-index]")
    await expect(index).toBeHidden()
    await page.locator("[data-menu-button]").click()
    await expect(index).toBeVisible()
    await expect(index.locator("[data-index-item]").first()).toBeVisible()
    await page.locator("[data-menu-button]").click()
    await expect(index).toBeHidden()

    for (const id of PROJECTS) {
      const spread = page.locator(`[data-project="${id}"]`)
      await spread.scrollIntoViewIfNeeded()
      const stage = (await spread.locator("[data-stage]").boundingBox())!
      const line = spread.locator('[data-field="line"]')
      await expect(line).toBeVisible()
      expect((await line.boundingBox())!.width, `${id} one column`).toBeGreaterThan(390 * 0.6)
      expect(stage.width, `${id} stage inside the viewport`).toBeLessThanOrEqual(390)
      expect((await line.innerText()).trim().split(/\s+/).length, `${id} line is short`).toBeLessThanOrEqual(MAX_WORDS)
      await expect(spread.locator('[data-field="what"], [data-field="problem"], [data-field="role"], [data-label]')).toHaveCount(0)
    }

    const row = page.locator('[data-project="grit"] [data-pieces]')
    await row.evaluate((el) => el.scrollIntoView({ block: "center" }))
    const geometry = await row.evaluate((el) => {
      const items = [...el.querySelectorAll("[data-piece]")].map((i) => i.getBoundingClientRect())
      const box = el.getBoundingClientRect()
      return { overflows: el.scrollWidth > el.clientWidth + 1, cut: items[1].left < box.right && items[1].right > box.right, snap: getComputedStyle(el).scrollSnapType, count: items.length }
    })
    expect(geometry.overflows).toBe(true)
    expect(geometry.cut).toBe(true)
    expect(geometry.snap).not.toBe("none")
    const counter = page.locator('[data-project="grit"] [data-piece-counter]')
    await expect(counter).toBeVisible()
    await expect(counter).toHaveText(new RegExp(`^1 / ${geometry.count}$`))
    await row.evaluate((el) => el.scrollTo({ left: (el.querySelectorAll("[data-piece]")[1] as HTMLElement).offsetLeft - 16 }))
    await expect(counter).toHaveText(new RegExp(`^2 / ${geometry.count}$`))

    const bar = page.locator("[data-hire-bar]")
    await expect(bar).toBeVisible()
    const barBox = (await bar.boundingBox())!
    expect(barBox.height).toBeGreaterThanOrEqual(MIN_HIRE_BAR)
    expect(await bar.evaluate((el) => getComputedStyle(el).position)).toBe("fixed")
    expect(Math.round(barBox.y + barBox.height)).toBe(844)
    await expect(bar.locator("a", { hasText: "Hire me" })).toHaveCount(1)

    const layout = await page.evaluate((minText) => {
      const small = [...document.querySelectorAll("body *")]
        .filter((el) => {
          const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim())
          const cs = getComputedStyle(el)
          return own && cs.display !== "none" && cs.visibility !== "hidden" && el.getBoundingClientRect().width > 0 && !el.closest(".sr-only, script, style") && parseFloat(cs.fontSize) < minText
        })
        .map((el) => `${el.tagName}.${el.className}: ${el.textContent?.trim().slice(0, 30)}`)
      const sideways = [...document.querySelectorAll("body *")]
        .filter((el) => ["auto", "scroll"].includes(getComputedStyle(el).overflowX) && el.scrollWidth > el.clientWidth + 1 && el !== document.body && el !== document.documentElement)
        .filter((el) => !el.hasAttribute("data-pieces"))
        .map((el) => `${el.tagName}.${el.className}`)
      return { small, sideways, page: document.documentElement.scrollWidth }
    }, MIN_TEXT)
    expect(layout.small).toEqual([])
    expect(layout.sideways).toEqual([])
    expect(layout.page).toBeLessThanOrEqual(390)
  })
})
