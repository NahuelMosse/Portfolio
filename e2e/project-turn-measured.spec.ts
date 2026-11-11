import { test, expect, type Page } from "@playwright/test"
import { BEAT_RUN, BEATS_PER_PROJECT, TURN_RUN } from "../features/portfolio/presentation/use-group-track"

// The turn between two projects of a group, measured as a visitor sees it: the scroll turns the group frame by frame and goes on
// into the next hold. The scroll is set exactly and the page is let paint before each reading; a touch is held down at every step,
// so a narrow screen's settle (which carries a scroll left mid-turn to a project) never moves it.
const SIZES = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]
const HOLD = (BEATS_PER_PROJECT - 1) * BEAT_RUN
const STRIDE = HOLD + TURN_RUN
const FRAMES = 24
// the second after the turn: the frames go on into the next hold for a quarter of a turn
const AFTER = 6
const READ_MS = 1500
const EPSILON = 1.5
const LAYERS = [".show-word", ".plate", ".backdrop", '.show-rig[data-role="main"]', '.show-rig[data-role="second"]']

type Group = { id: string; count: number }

const groupsOf = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("section.group[data-count]")]
      .map((section) => ({ id: section.id, count: Number(section.dataset.count) }))
      .filter((group) => group.count > 1),
  )

async function open(page: Page) {
  await page.goto("/")
  await page.waitForLoadState("load")
  await page.evaluate(() => window.dispatchEvent(new Event("touchstart")))
}

// sets the scroll to a point of a group's timeline (in runs) and waits until it holds still and two frames have painted
async function scrollTo(page: Page, group: Group, runs: number) {
  await page.evaluate(
    async ({ id, progress }) => {
      const section = document.getElementById(id)!
      const pin = section.querySelector<HTMLElement>(".group-pin")!
      const top = section.getBoundingClientRect().top + window.scrollY + (section.offsetHeight - pin.offsetHeight) * progress
      const frame = () => new Promise((resolve) => requestAnimationFrame(resolve))
      window.dispatchEvent(new Event("touchstart"))
      window.scrollTo({ top, behavior: "instant" })
      let still = 0
      let last = -1
      for (let tries = 0; tries < 60 && still < 3; tries++) {
        await frame()
        still = window.scrollY === last ? still + 1 : 0
        last = window.scrollY
      }
      await new Promise((resolve) => setTimeout(resolve, 30))
      await frame()
      await frame()
    },
    { id: group.id, progress: runs / (group.count * HOLD + (group.count - 1) * TURN_RUN) },
  )
}

// every turn of every group as a steady scroll: the first project is read for a moment, then each turn runs frame by frame into
// the next hold with no pause in between; onEnter runs once the group's first project is on screen
async function walk(page: Page, onFrame: (group: Group, turn: number, frame: number) => Promise<void>, onEnter = async () => {}) {
  for (const group of await groupsOf(page)) {
    await scrollTo(page, group, 0)
    await page.waitForTimeout(READ_MS)
    await onEnter()
    for (let turn = 0; turn < group.count - 1; turn++) {
      for (let frame = 0; frame <= FRAMES + AFTER; frame++) {
        await scrollTo(page, group, turn * STRIDE + HOLD + (TURN_RUN * frame) / FRAMES)
        await onFrame(group, turn, frame)
      }
    }
  }
}

// the pictures of a group a visitor can see now: what they show, whether they are drawn, how big their box is
const inView = (page: Page, group: string) =>
  page.evaluate((group) => {
    const cards = [...document.querySelectorAll<HTMLElement>(`#${group} .group-card`)]
    return cards.flatMap((card) =>
      [...card.querySelectorAll<HTMLImageElement>("img")]
        .map((img, order) => ({ img, order }))
        .filter(({ img }) => {
          const box = img.getBoundingClientRect()
          const seen = img.checkVisibility({ opacityProperty: true, visibilityProperty: true })
          return seen && box.width > 0 && box.right > 0 && box.left < innerWidth && box.bottom > 0 && box.top < innerHeight
        })
        .map(({ img, order }) => ({
          key: `${card.id}:${order}`,
          src: img.currentSrc,
          drawn: img.complete && img.naturalWidth > 1 && !img.currentSrc.startsWith("data:"),
          width: img.offsetWidth,
          height: img.offsetHeight,
        })),
    )
  }, group)

for (const size of SIZES) {
  test.describe(`at ${size.width}x${size.height}`, () => {
    test.use({ viewport: size })
    test.setTimeout(300_000)

    test(`walking every turn and the moment after it, no picture in view shows its placeholder, swaps its source or changes its size @PF-5-S2 @PF-5-ASM-01`, async ({
      page,
    }) => {
      await open(page)
      const seen = new Map<string, { src: string; width: number; height: number }>()
      const problems: string[] = []
      await walk(page, async (group, turn, frame) => {
        for (const img of await inView(page, group.id)) {
          const at = `${group.id} turn ${turn} frame ${frame} ${img.key}`
          if (img.src.startsWith("data:")) problems.push(`${at} shows the placeholder`)
          const before = seen.get(`${group.id}:${turn}:${img.key}`)
          if (before && before.src !== img.src) problems.push(`${at} swapped its source`)
          if (before && (before.width !== img.width || before.height !== img.height)) problems.push(`${at} changed its size`)
          seen.set(`${group.id}:${turn}:${img.key}`, img)
        }
      })
      expect(problems).toEqual([])
    })

    test(`frame by frame through every turn and into the next hold, no layer of the two projects steps back or jumps, the handoff included @PF-5-S3 @PF-5-ASM-02`, async ({
      page,
    }) => {
      await open(page)
      const problems: string[] = []
      for (const group of await groupsOf(page)) {
        const ids = await page.evaluate((id) => [...document.querySelectorAll(`#${id} .group-card`)].map((card) => card.id), group.id)
        for (let turn = 0; turn < group.count - 1; turn++) {
          const track = new Map<string, { x: number; y: number }[]>()
          await scrollTo(page, group, turn * STRIDE)
          await page.waitForTimeout(READ_MS)
          for (let frame = 0; frame <= FRAMES; frame++) {
            await scrollTo(page, group, turn * STRIDE + HOLD + (TURN_RUN * frame) / FRAMES)
            const boxes = await page.evaluate(
              ({ id, ids, layers }) =>
                ids.flatMap((project) =>
                  layers.flatMap((layer) => {
                    const node = document.querySelector(`#${id} #${project} ${layer}`)
                    if (!node) return []
                    const box = node.getBoundingClientRect()
                    return [{ key: `${project} ${layer}`, x: box.left + box.width / 2, y: box.top + box.height / 2 }]
                  }),
                ),
              { id: group.id, ids: [ids[turn], ids[turn + 1]], layers: LAYERS },
            )
            for (const box of boxes) track.set(box.key, [...(track.get(box.key) ?? []), { x: box.x, y: box.y }])
          }
          for (const [key, points] of track) {
            for (const axis of ["x", "y"] as const) {
              const steps = points.slice(1).map((point, order) => point[axis] - points[order][axis])
              const total = points[points.length - 1][axis] - points[0][axis]
              const sign = Math.abs(total) > EPSILON ? Math.sign(total) : 0
              steps.forEach((step, order) => {
                const at = `${group.id} turn ${turn} ${key} ${axis} step ${order} (${step.toFixed(1)})`
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

    test(`walking every turn there is no layout shift and every picture in view is already drawn @PF-5-S1 @PF-5-ASM-03`, async ({ page }) => {
      await page.addInitScript(() => {
        const shifts: { value: number; at: number }[] = []
        ;(window as unknown as { __shifts: typeof shifts }).__shifts = shifts
        new PerformanceObserver((list) =>
          list.getEntries().forEach((entry) => shifts.push({ value: (entry as PerformanceEntry & { value: number }).value, at: entry.startTime })),
        ).observe({ type: "layout-shift", buffered: false })
      })
      await open(page)
      const late: string[] = []
      const shifted: string[] = []
      await walk(page, async (group, turn, frame) => {
        for (const img of await inView(page, group.id)) if (!img.drawn) late.push(`${group.id} turn ${turn} frame ${frame} ${img.key} is not drawn yet`)
        const shifts = await page.evaluate(() => (window as unknown as { __shifts: { value: number }[] }).__shifts.splice(0))
        const sum = shifts.reduce((total, shift) => total + shift.value, 0)
        if (sum > 0.001) shifted.push(`${group.id} turn ${turn} frame ${frame} shifts ${sum.toFixed(4)}`)
      }, async () => {
        // the shifts of arriving at the group belong to the scroll that brought it, not to its turns
        await page.evaluate(() => (window as unknown as { __shifts: unknown[] }).__shifts.splice(0))
      })
      expect(late).toEqual([])
      expect(shifted).toEqual([])
    })
  })
}
