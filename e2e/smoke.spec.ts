import { test, expect, webkit, type Page } from "@playwright/test"

// @PF-8-ASM-04: the smoke suite that stands in for the retired PF-1 suite. It walks the real page at three viewports and checks the
// rules that make it look broken when they fail: sections fit the screen, nothing overflows, every media loads, links are real, the
// console is clean, and the phone bar is 56 px.
const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
  { width: 1910, height: 912 },
] as const

async function walk(page: Page, onStep?: () => Promise<void>) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight)
  const step = await page.evaluate(() => Math.round(innerHeight * 0.7))
  for (let y = 0; y <= total + step; y += step) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y)
    await page.waitForTimeout(120)
    if (onStep) await onStep()
  }
}

async function open(page: Page) {
  await page.goto("/")
  await page.waitForLoadState("load")
  await page.waitForTimeout(1500)
}

for (const viewport of VIEWPORTS) {
  const phone = viewport.width === 390
  test.describe(`at ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport, hasTouch: phone, isMobile: phone })

    test(`at ${viewport.width}x${viewport.height} the cover, the offer, every project scene and let's talk each fit in 100svh @PF-8-ASM-04`, async ({ page }) => {
      test.setTimeout(120_000)
      await open(page)
      const selectors = [".cold-open", ".offer-scene", "article.show.group-card", ".contact"]
      const found = await page.evaluate((list) => list.map((s) => [s, document.querySelectorAll(s).length]), selectors)
      for (const [selector, count] of found) expect(count, `${selector} exists`).toBeGreaterThan(0)
      const names = await page.evaluate(() => [...document.querySelectorAll("article.show.group-card")].map((a) => a.id))
      expect(names.length, "project scenes").toBeGreaterThanOrEqual(6)
      const sizes: string[] = []
      for (const selector of selectors) {
        const count = await page.locator(selector).count()
        for (let index = 0; index < count; index++) {
          const target = page.locator(selector).nth(index)
          await target.scrollIntoViewIfNeeded()
          await page.waitForTimeout(150)
          const box = await target.evaluate((el) => {
            const rect = el.getBoundingClientRect()
            return { height: rect.height, id: el.id || el.className }
          })
          const limit = viewport.height + 1
          if (box.height > limit) sizes.push(`${selector}#${box.id}: ${box.height} > ${viewport.height}`)
        }
      }
      expect(sizes, "sections taller than 100svh").toEqual([])
    })

    test(`at ${viewport.width}x${viewport.height} nothing overflows the page sideways @PF-8-ASM-04`, async ({ page }) => {
      test.setTimeout(120_000)
      await open(page)
      const worst: string[] = []
      await walk(page, async () => {
        const overflow = await page.evaluate(() => ({
          scroll: document.documentElement.scrollWidth,
          width: document.documentElement.clientWidth,
          y: Math.round(scrollY),
        }))
        if (overflow.scroll > overflow.width) worst.push(`y=${overflow.y}: scrollWidth ${overflow.scroll} > ${overflow.width}`)
      })
      expect(worst.slice(0, 5), "horizontal overflow").toEqual([])
    })

    test(`at ${viewport.width}x${viewport.height} every visible image and video loads and no request answers 404 @PF-8-ASM-04`, async ({ page }) => {
      test.setTimeout(180_000)
      const failures: string[] = []
      page.on("response", (response) => {
        if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`)
      })
      await open(page)
      const unloaded = (page: Page) =>
        page.evaluate(() => {
          const out: string[] = []
          const visible = (el: Element) => {
            const rect = el.getBoundingClientRect()
            const style = getComputedStyle(el)
            return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden" && rect.bottom > 0 && rect.top < innerHeight && rect.left >= 0 && rect.right <= innerWidth
          }
          for (const img of document.querySelectorAll("img")) {
            if (visible(img) && img.naturalWidth === 0) out.push(`img ${img.currentSrc || img.src}`)
          }
          for (const video of document.querySelectorAll("video")) {
            if (visible(video) && video.readyState < 2) out.push(`video ${video.currentSrc || video.src} readyState ${video.readyState}`)
          }
          return out
        })
      const stillBroken = new Set<string>()
      await walk(page, async () => {
        // A lazy image gets up to 3 s to arrive once it is on screen.
        let bad = await unloaded(page)
        for (let retry = 0; retry < 6 && bad.length > 0; retry++) {
          await page.waitForTimeout(500)
          bad = await unloaded(page)
        }
        bad.forEach((entry) => stillBroken.add(entry))
      })
      expect([...stillBroken], "media that never loaded").toEqual([])
      expect(failures, "requests that failed").toEqual([])
    })

    test(`at ${viewport.width}x${viewport.height} the page logs no console error @PF-8-ASM-04`, async ({ page }) => {
      test.setTimeout(120_000)
      const errors: string[] = []
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text())
      })
      page.on("pageerror", (error) => errors.push(error.message))
      await open(page)
      await walk(page)
      expect(errors).toEqual([])
    })
  })
}

test("the contact and project links carry a valid href @PF-8-ASM-04", async ({ page }) => {
  await open(page)
  const links = await page.evaluate(() => {
    const read = (selector: string) => [...document.querySelectorAll<HTMLAnchorElement>(selector)].map((a) => a.getAttribute("href") ?? "")
    return { contact: read(".contact a, .contact-scene a"), project: read("article.show a") }
  })
  expect(links.contact.length, "contact links").toBeGreaterThan(0)
  expect(links.project.length, "project links").toBeGreaterThan(0)
  const valid = /^(https:\/\/[^\s/]+\.[^\s]+|mailto:[^\s@]+@[^\s@]+\.[^\s@]+|tel:\+?[\d\s-]+|#[\w-]+|\/[^\s]*)$/
  const bad = [...links.contact, ...links.project].filter((href) => !valid.test(href))
  expect(bad, "invalid hrefs").toEqual([])
  const hrefs = links.contact.join(" ")
  expect(hrefs, "an email link").toMatch(/mailto:/)
  expect(hrefs, "a LinkedIn link").toMatch(/linkedin\.com/)
  expect(hrefs, "a GitHub link").toMatch(/github\.com/)
})

for (const engine of ["chromium", "webkit"] as const) {
  test(`on a 390x844 phone in ${engine} the bottom bar is 56 px tall @PF-8-ASM-04`, async ({ baseURL, browser }) => {
    test.setTimeout(60_000)
    const launched = engine === "webkit" ? await webkit.launch() : browser
    try {
      const context = await launched.newContext({ baseURL, viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
      const page = await context.newPage()
      await open(page)
      for (const y of [0, 1500, 6000]) {
        await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y)
        await page.waitForTimeout(250)
        const height = await page.evaluate(() => document.querySelector(".hire-bar")!.getBoundingClientRect().height)
        expect(height, `bar height at y=${y}`).toBeCloseTo(56, 0)
      }
      await context.close()
    } finally {
      if (engine === "webkit") await launched.close()
    }
  })
}
