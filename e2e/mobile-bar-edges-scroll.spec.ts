import { test, expect, chromium, webkit } from "@playwright/test"

// @PF-4-S1 @PF-4-S2 @PF-4-S3: the phone's bottom bar. Let's talk and the arrow square line up edge to edge, and nothing on the
// bottom edge of the screen has a bone background color (Safari tints its toolbar strip with it).
const PHONES = [
  { width: 390, height: 844 },
  { width: 375, height: 667 },
] as const
const engines = { chromium, webkit }

for (const engine of ["chromium", "webkit"] as const) {
  test(`on a 390x844 and a 375x667 phone in ${engine} the Let's talk face and the arrow square share their top, bottom and 56 px height while scrolling @PF-4-S1 @PF-4-ASM-01`, async ({ baseURL }) => {
    test.setTimeout(180_000)
    const browser = await engines[engine].launch()
    try {
      for (const { width, height } of PHONES) {
        const context = await browser.newContext({ baseURL, viewport: { width, height }, hasTouch: true, isMobile: true })
        const page = await context.newPage()
        await page.goto("/")
        await page.waitForLoadState("load")
        await page.waitForTimeout(1200)
        for (let step = 0; step < 14; step++) {
          await page.evaluate((by) => window.scrollBy(0, by), height * 0.6)
          await page.waitForTimeout(250)
          const edges = await page.evaluate(() => {
            const face = document.querySelector(".hire-bar a:first-child")!
            const arrow = document.querySelector(".bar-top")!
            const f = face.getBoundingClientRect()
            const a = arrow.getBoundingClientRect()
            const bar = document.querySelector(".hire-bar")!.getBoundingClientRect()
            const barTop = getComputedStyle(document.querySelector(".hire-bar")!).borderTopWidth
            return { f: [f.top, f.bottom, f.height], a: [a.top, a.bottom, a.height], barTop, barHeight: bar.height }
          })
          const label = `${engine} ${width}x${height} step ${step}`
          expect(edges.barTop, `${label}: no line above the face`).toBe("0px")
          expect(edges.f[2], `${label}: face height`).toBeCloseTo(56, 0)
          expect(edges.a[2], `${label}: arrow height`).toBeCloseTo(56, 0)
          expect(edges.f[0], `${label}: top`).toBeCloseTo(edges.a[0], 0)
          expect(edges.f[1], `${label}: bottom`).toBeCloseTo(edges.a[1], 0)
        }
        await context.close()
      }
    } finally {
      await browser.close()
    }
  })

  test(`on a phone in ${engine} every element on the bottom edge of the screen has the ink background color, and Let's talk still shows bone @PF-4-S2 @PF-4-S3 @PF-4-ASM-02`, async ({ baseURL }) => {
    test.setTimeout(180_000)
    const browser = await engines[engine].launch()
    try {
      for (const { width, height } of PHONES) {
        const context = await browser.newContext({ baseURL, viewport: { width, height }, hasTouch: true, isMobile: true })
        const page = await context.newPage()
        await page.goto("/")
        await page.waitForLoadState("load")
        await page.waitForTimeout(1200)
        for (let step = 0; step < 10; step++) {
          await page.evaluate((by) => window.scrollBy(0, by), height * 0.8)
          await page.waitForTimeout(300)
          const state = await page.evaluate(() => {
            const rgb = (value: string) => value.replace(/\s/g, "")
            const ink = rgb(getComputedStyle(document.querySelector(".bar-top")!).backgroundColor)
            const bottomEdge = [...document.querySelectorAll<HTMLElement>("body *")].filter((el) => {
              const style = getComputedStyle(el)
              if (style.position !== "fixed" && style.position !== "sticky") return false
              const box = el.getBoundingClientRect()
              return box.width > 0 && box.height > 0 && Math.abs(box.bottom - innerHeight) <= 1
            })
            const face = document.querySelector(".hire-bar a:first-child")!
            const faceStyle = getComputedStyle(face)
            return {
              ink,
              wrong: bottomEdge
                .filter((el) => getComputedStyle(el).backgroundColor !== "rgba(0, 0, 0, 0)" && rgb(getComputedStyle(el).backgroundColor) !== ink)
                .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 30)}`),
              faceImage: faceStyle.backgroundImage,
              faceColor: rgb(faceStyle.backgroundColor),
            }
          })
          const label = `${engine} ${width}x${height} step ${step}`
          expect(state.wrong, `${label}: bottom-edge elements with another background color`).toEqual([])
          expect(state.faceColor, `${label}: face color is ink`).toBe(state.ink)
          expect(state.faceImage, `${label}: bone is an image`).not.toBe("none")
        }
        await context.close()
      }
    } finally {
      await browser.close()
    }
  })
}
