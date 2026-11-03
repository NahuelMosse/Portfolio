import { expect, test, type Page } from "@playwright/test"

// @PF-1-ASM-26: experience is one pinned, scroll-scrubbed scene of five employer posters, each carrying its own ink illustration.
const EMPLOYERS = ["smart-warehousing", "grupo-st", "visma", "fravega", "justo"] as const
const FIELDS = ["[data-employer-period]", "h3", "[data-employer-title]", '[data-field="problem"]', '[data-field="role"]']

type Seen = Record<string, string[]>

// Walks the scroll through the chapter in quarter-viewport ticks and records which fields of each employer are wholly on screen.
async function walk(page: Page): Promise<{ seen: Seen; track: number[]; stageTops: number[]; height: number; viewport: number }> {
  const bounds = await page.evaluate(() => {
    const node = document.querySelector("#experience") as HTMLElement
    return { top: node.getBoundingClientRect().top + scrollY, height: node.offsetHeight, viewport: innerHeight }
  })
  const seen: Seen = Object.fromEntries(EMPLOYERS.map((id) => [id, []]))
  const track: number[] = []
  const stageTops: number[] = []
  const step = bounds.viewport / 4
  for (let y = bounds.top - bounds.viewport * 0.2; y < bounds.top + bounds.height; y += step) {
    await page.evaluate((top) => window.scrollTo(0, top), y)
    await page.waitForTimeout(60)
    const frame = await page.evaluate(
      ({ ids, fields }) => {
        const inView = (el: Element) => {
          const r = el.getBoundingClientRect()
          return r.width > 0 && r.height > 0 && r.top >= -1 && r.bottom <= innerHeight + 1 && r.left >= -1 && r.right <= innerWidth + 1 && getComputedStyle(el).visibility !== "hidden"
        }
        const found: Record<string, string[]> = {}
        for (const id of ids) {
          const panel = document.querySelector(`[data-employer="${id}"]`)
          found[id] = panel ? fields.filter((selector) => { const el = panel.querySelector(selector); return !!el && (el.textContent ?? "").trim() !== "" && inView(el) }) : []
        }
        const trackNode = document.querySelector("#experience [data-experience-track]")
        const stage = document.querySelector("#experience [data-experience-stage]")
        return {
          found,
          track: trackNode ? new DOMMatrix(getComputedStyle(trackNode).transform).m41 : 0,
          stageTop: stage ? stage.getBoundingClientRect().top : 0,
        }
      },
      { ids: [...EMPLOYERS], fields: FIELDS },
    )
    for (const id of EMPLOYERS) for (const field of frame.found[id]) if (!seen[id].includes(field)) seen[id].push(field)
    track.push(frame.track)
    stageTops.push(frame.stageTop)
  }
  return { seen, track, stageTops, height: bounds.height, viewport: bounds.viewport }
}

for (const [width, height] of [
  [390, 844],
  [1440, 900],
] as const) {
  test(`@PF-1-ASM-26 at ${width} five posters each with its illustration, all text visible while scrolling, no click`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto("/")
    const panels = page.locator("#experience [data-employer]")
    await expect(panels).toHaveCount(5)
    for (const id of EMPLOYERS) {
      const art = page.locator(`[data-employer="${id}"] img[data-employer-art]`)
      await expect(art).toHaveAttribute("src", new RegExp(`ill-exp-${id}-4x3`))
    }
    await expect(page.locator("#experience details, #experience summary, #experience button")).toHaveCount(0)

    const { seen, height: sectionHeight, viewport } = await walk(page)
    for (const id of EMPLOYERS) expect(seen[id], `${id} fields wholly on screen at some tick`).toHaveLength(FIELDS.length)
    expect(sectionHeight).toBeLessThanOrEqual(viewport * (width < 700 ? 5.4 : 4.6))
  })

  test(`@PF-1-ASM-26 at ${width} the experience shows no photo of him, no image gap under the illustrations`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto("/")
    await expect(page.locator("#experience [data-work-photo]")).toHaveCount(0)
    const sources = await page.locator("#experience img").evaluateAll((nodes) => nodes.map((n) => (n as HTMLImageElement).getAttribute("src") ?? ""))
    expect(sources.some((src) => /work-|pf-.*profile|pf-cover/.test(src))).toBe(false)
    const gaps = await page.locator("#experience [data-employer]").evaluateAll((nodes) =>
      nodes.map((node) => {
        const img = node.querySelector("img[data-employer-art]") as HTMLImageElement
        const frame = img.parentElement as HTMLElement
        const a = img.getBoundingClientRect()
        const f = frame.getBoundingClientRect()
        return { left: a.left - f.left, right: f.right - a.right, top: a.top - f.top, bottom: f.bottom - a.bottom, covered: getComputedStyle(frame).overflow }
      }),
    )
    for (const gap of gaps) {
      expect(gap.covered).toBe("hidden")
      for (const side of [gap.left, gap.right, gap.top, gap.bottom]) expect(side).toBeLessThanOrEqual(1)
    }
  })
}

test("@PF-1-ASM-26 at 1440 the vertical scroll carries a pinned track sideways by transform alone", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  const lefts = await page.locator("#experience [data-experience-track]").evaluate((node) => getComputedStyle(node).position)
  expect(lefts).not.toBe("absolute")
  const { track, stageTops } = await walk(page)
  const moving = track.filter((x) => x !== 0)
  expect(moving.length).toBeGreaterThan(6)
  expect(Math.min(...track)).toBeLessThan(-1440)
  for (let i = 1; i < track.length; i++) expect(track[i]).toBeLessThanOrEqual(track[i - 1] + 0.5)
  expect(stageTops.filter((top) => Math.abs(top) < 1).length).toBeGreaterThan(5)
})

test("@PF-1-ASM-26 at 390 each poster sticks and the next slides over it", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")
  const sticky = await page.locator("#experience [data-employer]").evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).position))
  expect(sticky).toEqual(Array(5).fill("sticky"))
})

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" })
  test("@PF-1-ASM-26 under reduced motion the posters are static and stacked, all text in the flow", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/")
    const state = await page.evaluate(() => {
      const track = document.querySelector("#experience [data-experience-track]") as HTMLElement
      const tops = [...document.querySelectorAll("#experience [data-employer]")].map((n) => n.getBoundingClientRect().top)
      return { transform: getComputedStyle(track).transform, positions: [...document.querySelectorAll("#experience [data-employer]")].map((n) => getComputedStyle(n).position), tops }
    })
    expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(state.transform)
    expect(state.positions.every((p) => p === "static" || p === "relative")).toBe(true)
    for (let i = 1; i < state.tops.length; i++) expect(state.tops[i]).toBeGreaterThan(state.tops[i - 1] + 100)
  })
})
