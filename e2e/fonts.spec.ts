import { test, expect } from "@playwright/test"

const BANNED_FONTS = /inter|geist|roboto|montserrat|bebas|anton/i
const FAMILIES = ["Boska", "General Sans", "Courier Prime"]

for (const width of [390, 1280]) {
  test(`Boska, General Sans and Courier Prime load from the site itself, no element falls back to a system font or uses Inter, Geist, Roboto, Montserrat, Bebas Neue or Anton, and NAWI in Boska spans at least 90% of the viewport width without leaving it at ${width} @PF-1-ASM-15`, async ({ browser }) => {
    const page = await browser.newPage({ viewport: { width, height: 800 } })
    const external: string[] = []
    page.on("request", (r) => {
      if (/\.(woff2?|ttf)(\?|$)/.test(r.url()) && !r.url().startsWith("http://localhost")) external.push(r.url())
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
    expect(report.loaded).toEqual(expect.arrayContaining(["Boska", "General Sans"]))
    for (const family of report.families) {
      expect(FAMILIES).toContain(family)
      expect(family).not.toMatch(BANNED_FONTS)
    }
    expect(report.markFont).toContain("Boska")
    expect(report.width).toBeGreaterThanOrEqual(report.viewport * 0.9)
    expect(report.left).toBeGreaterThanOrEqual(0)
    expect(report.right).toBeLessThanOrEqual(report.viewport)
    await page.close()
  })
}
