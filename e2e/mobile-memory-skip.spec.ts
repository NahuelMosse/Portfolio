import { test, expect } from "@playwright/test"

// @PF-3-S1 @PF-3-ASM-01: on a phone a project group or the experience scene farther than a screen from the view skips rendering
// (content-visibility: auto, observed by its contentvisibilityautostatechange event) and the page keeps its height while walking.
test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

test("walking a 390x844 phone, every project group and the experience scene farther than a screen from the view is skipped and the page height holds @PF-3-S1 @PF-3-ASM-01", async ({ page }) => {
  test.setTimeout(120_000)
  await page.addInitScript(() => {
    const skipped: Record<string, boolean> = {}
    ;(window as unknown as { skipped: typeof skipped }).skipped = skipped
    document.addEventListener(
      "contentvisibilityautostatechange",
      (event) => {
        const target = event.target as HTMLElement
        skipped[target.id || target.className] = (event as unknown as { skipped: boolean }).skipped
      },
      true,
    )
  })
  await page.goto("/")
  await page.waitForLoadState("load")
  await page.waitForTimeout(1500)
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  const wrong = new Set<string>()
  let checked = 0
  for (let y = 0; y < height; y += 640) {
    await page.evaluate((top) => window.scrollTo(0, top), y)
    await page.waitForTimeout(150)
    const report = await page.evaluate(() => {
      const skipped = (window as unknown as { skipped: Record<string, boolean> }).skipped
      const out: string[] = []
      let count = 0
      for (const el of document.querySelectorAll<HTMLElement>("section.group")) {
        const box = el.getBoundingClientRect()
        if (box.bottom >= -innerHeight && box.top <= innerHeight * 2) continue
        count++
        if (skipped[el.id] !== true) out.push(`${el.id} rendered while far`)
      }
      return { out, count, height: document.documentElement.scrollHeight }
    })
    checked += report.count
    report.out.forEach((line) => wrong.add(line))
    if (report.height !== height) wrong.add(`page height ${height} became ${report.height}`)
  }
  expect(checked).toBeGreaterThan(0)
  expect([...wrong]).toEqual([])
})
