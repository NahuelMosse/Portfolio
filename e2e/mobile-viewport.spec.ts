import { test, expect, chromium, webkit, type Page } from "@playwright/test"

// @PF-3-S2 @PF-3-S3 @PF-3-S6: on a phone Safari collapses its bar only when the document itself scrolls, and the pinned stages must
// fill the screen once it has. The bar showing and hiding is emulated by resizing the viewport between the small and the large height.
const WIDTH = 390
const BARS_SHOWN = 664
const BARS_HIDDEN = 844

test.use({ viewport: { width: WIDTH, height: BARS_HIDDEN }, hasTouch: true, isMobile: true })

async function settledPage(page: Page) {
  await page.goto("/")
  await page.waitForLoadState("load")
  await page.waitForTimeout(1200)
}

test("on a phone the document is the only thing that scrolls and the body is not locked to the screen @PF-3-S2 @PF-3-ASM-02", async ({ page }) => {
  await settledPage(page)
  const state = await page.evaluate(() => {
    const clipped = (value: string) => ["hidden", "scroll", "auto"].includes(value)
    const root = getComputedStyle(document.documentElement)
    const body = getComputedStyle(document.body)
    const scrollers = [...document.querySelectorAll<HTMLElement>("body *")]
      .filter((el) => {
        const style = getComputedStyle(el)
        return (style.overflowY === "auto" || style.overflowY === "scroll") && el.scrollHeight > el.clientHeight + 1
      })
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)}`)
    return {
      rootLocked: clipped(root.overflowY),
      bodyLocked: clipped(body.overflowY),
      bodyHeight: document.body.getBoundingClientRect().height,
      innerHeight,
      scrollers,
    }
  })
  expect(state.rootLocked, "html does not clip its own height").toBe(false)
  expect(state.bodyLocked, "body does not clip its own height").toBe(false)
  expect(state.bodyHeight, "body is the whole page, not one screen").toBeGreaterThan(state.innerHeight * 3)
  expect(state.scrollers).toEqual([])
})

test("on a phone the pinned full-screen stages are sized by the dynamic viewport and fill the screen after the bar hides @PF-3-S3 @PF-3-ASM-03", async ({ page }) => {
  await settledPage(page)

  const rules = await page.evaluate(() => {
    const heights: { selector: string; height: string }[] = []
    const walk = (list: CSSRuleList) => {
      for (const rule of list) {
        if (rule instanceof CSSStyleRule && /\.group-pin(\s|,|$)|\.group-card\s+\.show-stage/.test(rule.selectorText) && rule.style.height) {
          heights.push({ selector: rule.selectorText, height: rule.style.height })
        }
        if ("cssRules" in rule && (rule as CSSGroupingRule).cssRules) walk((rule as CSSGroupingRule).cssRules)
      }
    }
    for (const sheet of document.styleSheets) {
      try {
        walk(sheet.cssRules)
      } catch {
        // a cross-origin sheet has no readable rules
      }
    }
    return heights
  })
  const pin = rules.filter((rule) => rule.selector.includes(".group-pin"))
  expect(pin.length, "the pin's height is declared").toBeGreaterThan(0)
  expect(pin.every((rule) => rule.height.includes("dvh") && !rule.height.includes("svh"))).toBe(true)

  for (const height of [BARS_SHOWN, BARS_HIDDEN]) {
    await page.setViewportSize({ width: WIDTH, height })
    await page.waitForTimeout(300)
    const fits = await page.evaluate(async () => {
      const group = document.querySelector<HTMLElement>(".group")!
      scrollTo(0, group.getBoundingClientRect().top + scrollY + 40)
      await new Promise((resolve) => setTimeout(resolve, 300))
      const pinBox = group.querySelector(".group-pin")!.getBoundingClientRect()
      const stage = group.querySelector(".group-card[data-current] .show-stage")!.getBoundingClientRect()
      return { innerHeight, pinTop: pinBox.top, pinBottom: pinBox.bottom, stageTop: stage.top, stageBottom: stage.bottom }
    })
    expect(fits.pinTop, `pin top at ${height}`).toBeCloseTo(0, 0)
    expect(fits.pinBottom, `pin bottom at ${height}`).toBeCloseTo(fits.innerHeight, 0)
    expect(fits.stageTop, `stage top at ${height}`).toBeCloseTo(0, 0)
    expect(fits.stageBottom, `stage bottom at ${height}`).toBeCloseTo(fits.innerHeight, 0)
  }
})

test("the Let's talk bar keeps 56 px on the bottom edge on a 390x664 and a 390x844 phone @PF-3-S2 @PF-3-ASM-04", async ({ page }) => {
  await settledPage(page)
  for (const height of [BARS_SHOWN, BARS_HIDDEN]) {
    await page.setViewportSize({ width: WIDTH, height })
    await page.waitForTimeout(300)
    const bar = await page.evaluate(() => {
      const box = document.querySelector(".hire-bar")!.getBoundingClientRect()
      return { height: box.height, bottom: box.bottom, innerHeight }
    })
    expect(bar.height, `bar height at ${height}`).toBeCloseTo(56, 0)
    expect(bar.bottom, `bar bottom at ${height}`).toBeCloseTo(bar.innerHeight, 0)
  }
})

const engines = { chromium, webkit }

for (const engine of ["chromium", "webkit"] as const) {
  // the engine is launched here: a describe group cannot switch the browser the fixtures use
  test(`walking down a phone in Chromium and WebKit while the browser bar shows and hides, the page loads once and the scroll never goes back (${engine}) @PF-3-S6 @PF-3-ASM-07`, async ({ baseURL }) => {
    test.setTimeout(240_000)
    const browser = await engines[engine].launch()
    try {
      const context = await browser.newContext({ baseURL, viewport: { width: WIDTH, height: BARS_HIDDEN }, hasTouch: true, isMobile: true })
      const page = await context.newPage()
      let navigations = 0
      page.on("load", () => navigations++)
      await settledPage(page)
      await page.evaluate(() => ((window as unknown as { loadedOnce: boolean }).loadedOnce = true))

      let last = 0
      let worstBack = 0
      let height = BARS_HIDDEN
      for (let step = 0; step < 400; step++) {
        height = step % 3 === 0 ? (height === BARS_HIDDEN ? BARS_SHOWN : BARS_HIDDEN) : height
        await page.setViewportSize({ width: WIDTH, height })
        await page.evaluate((by) => window.scrollBy(0, by), 360)
        await page.waitForTimeout(40)
        const y = await page.evaluate(() => Math.round(scrollY))
        worstBack = Math.max(worstBack, last - y)
        last = Math.max(last, y)
        const end = await page.evaluate(() => scrollY + innerHeight >= document.documentElement.scrollHeight - 2)
        if (end) break
      }
      const survived = await page.evaluate(() => (window as unknown as { loadedOnce?: boolean }).loadedOnce === true)
      expect(survived, "the page was never reloaded").toBe(true)
      expect(navigations, "the page loaded once").toBe(1)
      expect(worstBack, "the scroll never goes back by more than a settling step").toBeLessThanOrEqual(Math.round(BARS_HIDDEN * 0.25))
    } finally {
      await browser.close()
    }
  })
}
