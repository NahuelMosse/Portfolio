import { test, expect, type Page } from "@playwright/test"

// @PF-1-ASM-35 scene 4: each employer is one full scene; the art is whole, the copy beside or under it, one employer at a time.
const SIZES = [
  { width: 1910, height: 912 },
  { width: 1440, height: 900 },
  { width: 1280, height: 720 },
  { width: 390, height: 844 },
] as const
const EMPLOYERS = 5
const NATURAL_RATIO = 4 / 3

async function bounds(page: Page) {
  return page.evaluate(() => {
    const node = document.querySelector("#experience")!
    return { top: node.getBoundingClientRect().top + scrollY, height: (node as HTMLElement).offsetHeight }
  })
}

for (const { width, height } of SIZES) {
  test.describe(`${width}x${height}`, () => {
    test.use({ viewport: { width, height } })

    test(`each art is whole at 4:3 and no copy touches its art @PF-1-ASM-35`, async ({ page }) => {
      await page.goto("/")
      await page.evaluate(() => document.querySelector("#experience")!.scrollIntoView())
      const rows = await page.evaluate(() =>
        [...document.querySelectorAll("#experience [data-employer]")].map((panel) => {
          const art = panel.querySelector("img[data-employer-art]")!.getBoundingClientRect()
          const info = panel.querySelector(".xp-info")!.getBoundingClientRect()
          const copyBoxes = [...panel.querySelectorAll(".xp-info > *")].map((n) => n.getBoundingClientRect())
          const hits = (a: DOMRect, b: DOMRect) => a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5
          return { ratio: art.width / art.height, infoHits: hits(art, info), copyHits: copyBoxes.some((c) => c.width > 0 && hits(art, c)) }
        }),
      )
      expect(rows).toHaveLength(EMPLOYERS)
      for (const row of rows) {
        expect(row.ratio).toBeGreaterThan(NATURAL_RATIO - 0.02)
        expect(row.ratio).toBeLessThan(NATURAL_RATIO + 0.02)
        expect(row.infoHits, "the copy column is apart from the art").toBe(false)
        expect(row.copyHits).toBe(false)
      }
    })

    test(`only one employer is on screen at rest, with no neighbour peeking in @PF-1-ASM-35`, async ({ page }) => {
      await page.goto("/")
      const b = await bounds(page)
      const owners = new Set<string>()
      const tick = height / 4
      for (let y = b.top - height * 0.2; y < b.top + b.height; y += tick) {
        await page.evaluate((top) => window.scrollTo(0, top), y)
        await page.waitForTimeout(150)
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
                    const r = p.getBoundingClientRect()
                    const style = getComputedStyle(p)
                    const hidden = style.visibility === "hidden" || Number(style.opacity) < 0.05
                    return !hidden && r.top < innerHeight - 1 && r.bottom > 1 && r.left < innerWidth && r.right > 0
                  })
                  .map((p) => p.dataset.employer)
          return { single: single >= 0 ? panels[single].dataset.employer! : "", peeking }
        })
        if (frame.single) owners.add(frame.single)
        expect(frame.peeking, `at scrollY ${Math.round(y)} a following employer is inside the viewport`).toEqual([])
      }
      expect(owners.size, "every employer owns the screen at some point").toBe(EMPLOYERS)
    })
  })
}

test.describe("reduced motion", () => {
  test.use({ viewport: { width: 1910, height: 912 }, reducedMotion: "reduce" })

  test("the scenes are stacked and static, all text visible @PF-1-ASM-35", async ({ page }) => {
    await page.goto("/")
    const r = await page.evaluate(() => {
      const panels = [...document.querySelectorAll<HTMLElement>("#experience [data-employer]")]
      return panels.map((p) => {
        const style = getComputedStyle(p)
        const text = p.querySelector<HTMLElement>('[data-field="problem"]')!
        const textStyle = getComputedStyle(text)
        return {
          visible: style.visibility !== "hidden" && Number(style.opacity) === 1,
          top: p.getBoundingClientRect().top + scrollY,
          textVisible: textStyle.visibility !== "hidden" && Number(textStyle.opacity) === 1,
          transform: style.transform,
        }
      })
    })
    expect(r).toHaveLength(EMPLOYERS)
    for (const p of r) {
      expect(p.visible && p.textVisible).toBe(true)
      expect(p.transform).toBe("none")
    }
    const tops = r.map((p) => p.top)
    expect([...tops].sort((a, b) => a - b)).toEqual(tops)
    expect(new Set(tops).size, "stacked, not overlapping").toBe(EMPLOYERS)
  })
})
