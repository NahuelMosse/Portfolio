import { test, expect } from "@playwright/test"

// @PF-1-ASM-35 scene 4, wide: at rest one employer owns the screen and no following one is inside the viewport.
// The scene is scrubbed (smoothed), so each tick waits for it to settle, and the section is measured once the pin exists.
const SIZES = [
  { width: 1910, height: 912 },
  { width: 1440, height: 900 },
  { width: 1280, height: 720 },
] as const
const EMPLOYERS = 5
const SETTLE_MS = 1400

for (const { width, height } of SIZES) {
  test(`${width}x${height} only one employer is on screen at rest, with no neighbour peeking in @PF-1-ASM-35`, async ({ page }) => {
    test.setTimeout(90_000)
    await page.setViewportSize({ width, height })
    await page.goto("/")
    await page.waitForSelector("#experience .pin-spacer")
    const b = await page.evaluate(() => {
      const node = document.querySelector("#experience")!
      return { top: node.getBoundingClientRect().top + scrollY, height: (node as HTMLElement).offsetHeight }
    })
    const owners = new Set<string>()
    const tick = height / 2
    for (let y = b.top; y < b.top + b.height - height; y += tick) {
      await page.evaluate((top) => window.scrollTo(0, top), y)
      await page.waitForTimeout(SETTLE_MS)
      const frame = await page.evaluate(() => {
        const panels = [...document.querySelectorAll<HTMLElement>("#experience [data-employer]")]
        const points = [0.2, 0.5, 0.8].flatMap((fx) => [0.3, 0.6, 0.85].map((fy) => document.elementFromPoint(innerWidth * fx, innerHeight * fy)))
        const owner = (el: Element | null) => panels.findIndex((p) => el !== null && p.contains(el))
        const ids = new Set(points.map(owner).filter((i) => i >= 0))
        const single = ids.size === 1 ? [...ids][0] : -1
        const peeking =
          single < 0
            ? []
            : panels
                .filter((p, i) => {
                  if (i <= single) return false
                  const style = getComputedStyle(p)
                  return style.visibility !== "hidden" && Number(style.opacity) > 0.05
                })
                .map((p) => p.dataset.employer)
        return { single: single >= 0 ? panels[single].dataset.employer! : "", peeking }
      })
      if (frame.single) owners.add(frame.single)
      expect(frame.peeking, `at scrollY ${Math.round(y)} a following employer is shown`).toEqual([])
    }
    expect(owners.size, "every employer owns the screen at some point").toBe(EMPLOYERS)
  })
}
