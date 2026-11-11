import { test, expect, type Page } from "@playwright/test"
import { BEAT_RUN, BEATS_PER_PROJECT, TURN_RUN } from "../features/portfolio/presentation/use-group-track"

// The turn between two projects of a group runs without a picture that pops (placeholder, source swap, box change) or a layer that
// jumps, and without a layout shift or a fetch for an image already in view.
const GROUPS = [
  { id: "apps", count: 2 },
  { id: "landings", count: 3 },
]
const SIZES = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]
const HOLD = (BEATS_PER_PROJECT - 1) * BEAT_RUN
const STRIDE = HOLD + TURN_RUN
const FRAMES = 24
const SETTLE_MS = 90
const EPSILON = 1.5
const LAYERS = [".show-word", ".plate", ".backdrop", '.show-rig[data-role="main"]', '.show-rig[data-role="second"]']

const totalRuns = (count: number) => count * HOLD + (count - 1) * TURN_RUN

async function scrollTo(page: Page, group: string, runs: number, count: number) {
  await page.evaluate(
    ({ group, progress }) => {
      const section = document.getElementById(group)!
      const top = section.getBoundingClientRect().top + window.scrollY
      window.scrollTo(0, top + (section.offsetHeight - window.innerHeight) * progress)
    },
    { group, progress: runs / totalRuns(count) },
  )
  await page.waitForTimeout(SETTLE_MS)
}

// every turn of every group, frame by frame, from the start of the turn to its end
async function walk(page: Page, onFrame: (group: string, turn: number, frame: number) => Promise<void>) {
  for (const { id, count } of GROUPS) {
    await scrollTo(page, id, 0, count)
    await page.waitForTimeout(1500)
    for (let turn = 0; turn < count - 1; turn++) {
      for (let frame = 0; frame <= FRAMES; frame++) {
        await scrollTo(page, id, turn * STRIDE + HOLD + (TURN_RUN * frame) / FRAMES, count)
        await onFrame(id, turn, frame)
      }
    }
  }
}

// the images of a group that are in the view now: what they show, how big their layout box is
const inView = (page: Page, group: string) =>
  page.evaluate((group) => {
    const imgs = [...document.querySelectorAll<HTMLImageElement>(`#${group} .group-card img`)]
    return imgs
      .filter((img) => {
        const box = img.getBoundingClientRect()
        const card = img.closest<HTMLElement>(".group-card")!
        const clear = getComputedStyle(card).visibility === "visible" && getComputedStyle(img).visibility === "visible"
        return clear && box.width > 0 && box.right > 0 && box.left < innerWidth && box.bottom > 0 && box.top < innerHeight
      })
      .map((img) => ({
        key: `${img.closest("article")!.id}:${[...img.closest("article")!.querySelectorAll("img")].indexOf(img)}`,
        src: img.currentSrc,
        loaded: img.hasAttribute("data-loaded"),
        width: img.offsetWidth,
        height: img.offsetHeight,
      }))
  }, group)

for (const size of SIZES) {
  test.describe(`at ${size.width}x${size.height}`, () => {
    test.use({ viewport: size })
    test.setTimeout(240_000)

    test(`walking every turn, no image in view shows its placeholder, swaps its source or changes its size @PF-5-S2 @PF-5-ASM-01`, async ({ page }) => {
      await page.goto("/")
      await page.waitForLoadState("load")
      const seen = new Map<string, { src: string; width: number; height: number }>()
      const problems: string[] = []
      await walk(page, async (group, turn, frame) => {
        for (const img of await inView(page, group)) {
          const at = `${group} turn ${turn} frame ${frame} ${img.key}`
          if (img.src.startsWith("data:")) problems.push(`${at} shows the placeholder`)
          const before = seen.get(img.key)
          if (before && before.src !== img.src) problems.push(`${at} swapped its source`)
          if (before && (before.width !== img.width || before.height !== img.height)) problems.push(`${at} changed its size`)
          seen.set(img.key, img)
        }
      })
      expect(problems).toEqual([])
    })

    test(`frame by frame through a turn, no layer of the two projects steps back or jumps, the handoff included @PF-5-S3 @PF-5-ASM-02`, async ({ page }) => {
      await page.goto("/")
      await page.waitForLoadState("load")
      const problems: string[] = []
      for (const { id, count } of GROUPS) {
        await scrollTo(page, id, 0, count)
        for (let turn = 0; turn < count - 1; turn++) {
          const track = new Map<string, { x: number; y: number }[]>()
          for (let frame = 0; frame <= FRAMES; frame++) {
            await scrollTo(page, id, turn * STRIDE + HOLD + (TURN_RUN * frame) / FRAMES, count)
            const boxes = await page.evaluate(
              ({ id, ids, layers }) =>
                ids.flatMap((project) =>
                  layers.flatMap((layer) => {
                    const node = document.querySelector(`#${id} #${project} ${layer}`)
                    if (!node) return []
                    const box = node.getBoundingClientRect()
                    return [{ key: `${project} ${layer}`, x: box.left, y: box.top }]
                  }),
                ),
              { id, ids: await page.evaluate((id) => [...document.querySelectorAll(`#${id} .group-card`)].map((card) => card.id), id), layers: LAYERS },
            )
            for (const box of boxes) track.set(box.key, [...(track.get(box.key) ?? []), { x: box.x, y: box.y }])
          }
          for (const [key, points] of track) {
            for (const axis of ["x", "y"] as const) {
              const steps = points.slice(1).map((point, order) => point[axis] - points[order][axis])
              const moving = steps.filter((step) => Math.abs(step) > EPSILON)
              const sign = Math.sign(moving[0] ?? 0)
              steps.forEach((step, order) => {
                const at = `${id} turn ${turn} ${key} ${axis} step ${order} (${step.toFixed(1)})`
                if (sign && step * sign < -EPSILON) problems.push(`${at} steps back`)
                const around = Math.max(Math.abs(steps[order - 1] ?? 0), Math.abs(steps[order + 1] ?? 0))
                if (Math.abs(step) > 2 * around + EPSILON) problems.push(`${at} jumps`)
              })
            }
          }
        }
      }
      expect(problems).toEqual([])
    })

    test(`walking the turns there is no layout shift and no image starts loading while in view @PF-5-S1 @PF-5-ASM-03`, async ({ page }) => {
      await page.addInitScript(() => {
        const shifts: number[] = []
        ;(window as unknown as { __shifts: number[] }).__shifts = shifts
        new PerformanceObserver((list) => list.getEntries().forEach((entry) => shifts.push((entry as PerformanceEntry & { value: number }).value))).observe({
          type: "layout-shift",
          buffered: false,
        })
      })
      await page.goto("/")
      await page.waitForLoadState("load")
      const late: string[] = []
      await page.evaluate(() => ((window as unknown as { __shifts: number[] }).__shifts.length = 0))
      await walk(page, async (group, turn, frame) => {
        for (const img of await inView(page, group)) if (!img.loaded) late.push(`${group} turn ${turn} frame ${frame} ${img.key} is in view and not fetched`)
      })
      const shifts = await page.evaluate(() => (window as unknown as { __shifts: number[] }).__shifts)
      expect(late).toEqual([])
      expect(shifts.reduce((sum, value) => sum + value, 0)).toBeLessThan(0.001)
    })
  })
}

test.describe("phone budget", () => {
  test.use({ viewport: SIZES[1] })
  test.setTimeout(240_000)

  test("on a phone the far groups stay skipped and nothing keeps will-change or a 3D transform after the walk @PF-5-ASM-04", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("load")
    await walk(page, async () => {})
    const state = await page.evaluate(() => {
      const kept = [...document.querySelectorAll<HTMLElement>(".group, .group *")]
        .filter((node) => {
          const style = getComputedStyle(node)
          return style.willChange !== "auto" || style.transform.startsWith("matrix3d")
        })
        .map((node) => `${node.tagName.toLowerCase()}.${node.className}`)
      const skipped = [...document.querySelectorAll<HTMLElement>("section.group")].map((section) => ({
        id: section.id,
        skipped: getComputedStyle(section).contentVisibility,
        near: Math.abs(section.getBoundingClientRect().top) < innerHeight * 2,
      }))
      return { kept, skipped }
    })
    expect(state.kept).toEqual([])
    for (const group of state.skipped) expect(group.skipped, `${group.id} keeps content-visibility`).toBe("auto")
  })
})
