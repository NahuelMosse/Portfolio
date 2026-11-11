import { test, expect } from "@playwright/test"

const BANNED_FONTS = /inter|geist|roboto|montserrat|bebas|anton/i
const FAMILIES = ["Boska", "Courier Prime"]

for (const width of [390, 1280]) {
  test(`Boska and Courier Prime load from the site itself, no element falls back to a system font or uses Inter, Geist, Roboto, Montserrat, Bebas Neue or Anton, and NAWI in Boska spans the viewport width (90% on a phone, 55% beside the id sheet on a wide screen) without leaving it at ${width} @PF-1-ASM-15`, async ({ browser, baseURL }) => {
    const page = await browser.newPage({ viewport: { width, height: 800 } })
    const external: string[] = []
    const origin = new URL(baseURL!).origin
    page.on("request", (r) => {
      if (/\.(woff2?|ttf)(\?|$)/.test(r.url()) && new URL(r.url()).origin !== origin) external.push(r.url())
    })
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    expect(external).toEqual([])
    const report = await page.evaluate(async () => {
      await document.fonts.ready
      const loaded = [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/"/g, ""))
      const families = new Set<string>()
      document.querySelectorAll("body *").forEach((el) => {
        if ([...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim()))
          families.add(getComputedStyle(el).fontFamily.split(",")[0].replace(/"/g, "").trim())
      })
      const mark = document.querySelector('[data-layer="mark"]') as HTMLElement
      const range = document.createRange()
      range.selectNodeContents(mark)
      const text = range.getBoundingClientRect()
      return { loaded, families: [...families], left: text.left, right: text.right, width: text.width, markFont: getComputedStyle(mark).fontFamily, viewport: innerWidth }
    })
    expect(report.loaded).toEqual(expect.arrayContaining(FAMILIES))
    for (const family of report.families) {
      expect(FAMILIES).toContain(family)
      expect(family).not.toMatch(BANNED_FONTS)
    }
    expect(report.markFont).toContain("Boska")
    expect(report.width).toBeGreaterThanOrEqual(report.viewport * (width < 700 ? 0.9 : 0.55))
    expect(report.left).toBeGreaterThanOrEqual(0)
    expect(report.right).toBeLessThanOrEqual(report.viewport)
    await page.close()
  })
}

test("NAWI in Boska is the largest text of the site with Nahuel Mosse beneath it in Courier Prime, the hero says I'm Nawi, and the page title, metadata, llms.txt, portfolio.json and both email doors say Nahuel Mosse @PF-1-ASM-19", async ({ page, request }) => {
  await page.goto("/")
  const sizes = await page.evaluate(() => {
    const out: { text: string; size: number }[] = []
    document.querySelectorAll("body *").forEach((el) => {
      const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent?.trim()).join("")
      if (own) out.push({ text: own, size: parseFloat(getComputedStyle(el).fontSize) })
    })
    return out
  })
  const largest = sizes.sort((a, b) => b.size - a.size)[0]
  expect(largest.text).toBe("NAWI")
  const name = page.locator('[data-name="professional"]')
  const [markBox, nameBox] = [await page.locator('[data-layer="mark"]').boundingBox(), await name.boundingBox()]
  expect(nameBox!.y).toBeGreaterThanOrEqual(markBox!.y + markBox!.height - 2)
  expect(await name.evaluate((e) => getComputedStyle(e).fontFamily)).toContain("Courier Prime")
  await expect(page.locator('section[data-chapter="cold-open"]')).toContainText("I'm Nawi")
  expect(await page.title()).toContain("Nahuel Mosse")
  expect(await page.locator('meta[name="description"], meta[property="og:title"]').evaluateAll((m) => m.map((x) => x.getAttribute("content")).join(" "))).toContain("Nahuel Mosse")
  expect(await (await request.get("/llms.txt")).text()).toContain("Nahuel Mosse")
  expect(JSON.stringify(await (await request.get("/portfolio.json")).json())).toContain("Nahuel Mosse")
  const doors = page.locator("[data-doors] a[href^='mailto:']")
  await expect(doors).toHaveCount(2)
  for (const href of await doors.evaluateAll((a) => a.map((x) => decodeURIComponent((x as HTMLAnchorElement).href)))) {
    expect(href).toContain("Nahuel Mosse")
  }
})
