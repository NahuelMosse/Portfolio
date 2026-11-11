import { test, expect, chromium, webkit } from "@playwright/test"

// @PF-4-S4 @PF-4-S5 @PF-4-ASM-03: the line above each chapter word stays on one line and inside the screen on a phone.
const PHONES = [
  { width: 390, height: 844 },
  { width: 375, height: 667 },
  { width: 320, height: 568 },
] as const
const engines = { chromium, webkit }

for (const engine of ["chromium", "webkit"] as const) {
  test(`on a 390x844, a 375x667 and a 320x568 phone in ${engine} Two doors, Buenos Aires and every chapter note sit on one line inside the screen @PF-4-S4 @PF-4-S5 @PF-4-ASM-03`, async ({ baseURL }) => {
    test.setTimeout(180_000)
    const browser = await engines[engine].launch()
    try {
      for (const { width, height } of PHONES) {
        const context = await browser.newContext({ baseURL, viewport: { width, height }, hasTouch: true, isMobile: true })
        const page = await context.newPage()
        await page.goto("/")
        await page.waitForLoadState("load")
        await page.waitForTimeout(1200)
        const count = await page.locator(".chapter-detail").count()
        expect(count, "chapter notes exist").toBeGreaterThanOrEqual(4)
        for (let index = 0; index < count; index++) {
          const detail = page.locator(".chapter-detail").nth(index)
          await detail.evaluate((el) => el.scrollIntoView({ block: "center" }))
          // real scroll steps so the reveal runs
          for (let step = 0; step < 3; step++) {
            await page.mouse.wheel(0, 40)
            await page.waitForTimeout(150)
          }
          const state = await detail.evaluate((el) => {
            const spans = [...el.querySelectorAll("span")]
            const tops = spans.map((span) => Math.round(span.getBoundingClientRect().top))
            const box = el.getBoundingClientRect()
            const lastRight = Math.max(...[...el.children].map((child) => child.getBoundingClientRect().right))
            const lineHeight = parseFloat(getComputedStyle(spans[1]).lineHeight) || spans[1].getBoundingClientRect().height
            return {
              text: spans.map((span) => span.textContent).join(" "),
              spread: Math.max(...tops) - Math.min(...tops),
              noteHeight: spans[1].getBoundingClientRect().height,
              lineHeight,
              left: box.left,
              right: lastRight,
              innerWidth,
            }
          })
          const label = `${state.text} at ${width} in ${engine}`
          expect(state.spread, `${label}: spans share one row`).toBeLessThanOrEqual(2)
          expect(state.noteHeight, `${label}: the note is one line`).toBeLessThanOrEqual(state.lineHeight * 1.5)
          expect(state.left, label).toBeGreaterThanOrEqual(0)
          expect(state.right, `${label}: inside the screen`).toBeLessThanOrEqual(state.innerWidth)
        }
        await context.close()
      }
    } finally {
      await browser.close()
    }
  })
}
