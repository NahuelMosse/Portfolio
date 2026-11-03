import { expect, test, type Page } from "@playwright/test"

// @PF-1-ASM-26: while the page scrolls, no image that fills its clipped container leaves an uncovered strip of more than 1px.
const STEP = 50
const TOLERANCE = 1

type Gap = { layer: string; container: string; side: string; size: number; y: number }

async function measure(page: Page, y: number): Promise<Gap[]> {
  await page.evaluate((top) => window.scrollTo(0, top), y)
  await page.waitForTimeout(50)
  return page.evaluate((scrollY) => {
    const found: Gap[] = []
    const viewW = innerWidth
    const viewH = innerHeight
    for (const el of document.querySelectorAll("img,picture,video,canvas")) {
      let hidden = false
      for (let n: Element | null = el; n && n !== document.body; n = n.parentElement) {
        const style = getComputedStyle(n)
        if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) < 0.05) hidden = true
      }
      if (hidden) continue
      let box = el.parentElement
      while (box && box !== document.body) {
        const style = getComputedStyle(box)
        if (style.overflowX !== "visible" || style.overflowY !== "visible") break
        box = box.parentElement
      }
      if (!box || box === document.body) continue
      const art = el.getBoundingClientRect()
      const area = box.getBoundingClientRect()
      const left = Math.max(area.left, 0)
      const right = Math.min(area.right, viewW)
      const top = Math.max(area.top, 0)
      const bottom = Math.min(area.bottom, viewH)
      if (right - left < 50 || bottom - top < 50) continue
      if (art.width < area.width * 0.8 || art.height < area.height * 0.5) continue
      const sides = {
        bottom: bottom - Math.min(art.bottom, bottom),
        top: Math.max(art.top, top) - top,
        left: Math.max(art.left, left) - left,
        right: right - Math.min(art.right, right),
      }
      for (const [side, size] of Object.entries(sides)) {
        if (size > 1) {
          const layer = (el.closest("[class]")?.className ?? "").toString().split(" ")[0]
          found.push({ layer, container: box.className.toString().split(" ")[0], side, size: Math.round(size), y: scrollY })
        }
      }
    }
    return found
  }, y)
}

for (const [width, height] of [
  [1440, 900],
  [390, 844],
] as const) {
  test(`@PF-1-ASM-26 no moving image leaves a gap inside its container at ${width}x${height}`, async ({ page }) => {
    test.setTimeout(300_000)
    await page.setViewportSize({ width, height })
    await page.goto("/")
    await page.waitForTimeout(1500)
    const total = await page.evaluate(() => document.documentElement.scrollHeight)
    const worst = new Map<string, Gap>()
    for (let y = 0; y < total; y += STEP) {
      for (const gap of await measure(page, y)) {
        const key = `${gap.layer}|${gap.container}|${gap.side}`
        if (gap.size > (worst.get(key)?.size ?? 0)) worst.set(key, gap)
      }
    }
    expect(
      [...worst.values()].filter((gap) => gap.size > TOLERANCE),
      "images with a gap in their container",
    ).toEqual([])
  })
}
