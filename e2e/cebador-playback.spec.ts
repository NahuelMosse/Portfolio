import { test, expect, type Page } from "@playwright/test"

// Headless Chromium rasterizes in software unless told otherwise, which caps the page below what a real browser presents.
test.use({ launchOptions: { args: ["--enable-gpu-rasterization", "--ignore-gpu-blocklist"] } })

const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]
const MAIN = 'article[data-project="cebador"] .show-rig[data-role="main"] .show-screen[data-on] video'
const SECOND = 'article[data-project="cebador"] .show-rig[data-role="second"] .show-screen[data-on] video'

async function opened(page: Page) {
  await page.waitForLoadState("load")
  await page.waitForFunction(() => !document.documentElement.classList.contains("is-preloading"), undefined, { timeout: 30_000 })
}

// Jumps near the landings group and wheels until the Cebador card is the current one at its first beat.
async function reachCebador(page: Page) {
  await expect
    .poll(
      async () => {
        await page.evaluate(() => {
          const section = document.getElementById("landings")!
          window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.5)
        })
        await page.waitForTimeout(400)
        return page.evaluate(() => Math.abs(document.getElementById("landings")!.getBoundingClientRect().top - window.innerHeight * 0.5))
      },
      { message: "the page jumps to landings", timeout: 15_000 },
    )
    .toBeLessThan(400)
  for (let k = 0; k < 200; k++) {
    const at = await page.locator("section#landings").evaluate((el) => {
      const node = el.querySelector("article[data-current]")
      return node ? `${node.getAttribute("data-project")}:${node.getAttribute("data-beat")}` : ""
    })
    if (at === "cebador:0") break
    await page.mouse.wheel(0, 80)
    await page.waitForTimeout(250)
  }
  await expect(page.locator('article[data-project="cebador"][data-current]')).toHaveAttribute("data-beat", "0")
  await expect.poll(() => page.evaluate((sel) => (document.querySelector<HTMLVideoElement>(sel)?.readyState ?? 0) >= 2, MAIN), { timeout: 20_000 }).toBe(true)
}

// A 3 s window holds 90 frames of a 30 fps file, give or take the one cut by the window's edge, so the floor is 89/90 of 30.
const FLOOR = 30 * (89 / 90)

// Counts the callbacks of requestVideoFrameCallback with a new mediaTime over a window, per video.
function presentedRates(page: Page, ms: number) {
  return page.evaluate(
    ({ selectors, ms }) =>
      Promise.all(
        selectors.map(
          (sel) =>
            new Promise<number>((resolve) => {
              const video = document.querySelector<HTMLVideoElement>(sel)!
              let last = -1
              let count = 0
              const start = performance.now()
              const tick = (_now: number, meta: VideoFrameCallbackMetadata) => {
                if (meta.mediaTime !== last) count++
                last = meta.mediaTime
                if (performance.now() - start < ms) video.requestVideoFrameCallback(tick)
                else resolve((count * 1000) / (performance.now() - start))
              }
              void video.play().catch(() => undefined)
              video.requestVideoFrameCallback(tick)
            }),
        ),
      ),
    { selectors: [MAIN, SECOND], ms },
  )
}

test("with the Cebador stage in view at 1440x900 and 390x844 the browser presents at least 30 new frames a second of each capture @PF-6-S1 @PF-6-S2 @PF-6-ASM-02", async ({ page }) => {
  test.setTimeout(240_000)
  for (const viewport of VIEWPORTS) {
    await page.setViewportSize(viewport)
    await page.goto("/")
    await opened(page)
    await reachCebador(page)
    await page.waitForTimeout(1500)
    const [main, second] = await presentedRates(page, 3000)
    console.log(`presented fps at ${viewport.width}: main ${main.toFixed(1)}, phone ${second.toFixed(1)}`)
    expect(main, `main capture at ${viewport.width}`).toBeGreaterThanOrEqual(FLOOR)
    expect(second, `phone capture at ${viewport.width}`).toBeGreaterThanOrEqual(FLOOR)
  }
})

test("the phone follows the main capture's clock within 0.2 s by its speed and never seeks after the first catch-up @PF-6-S2 @PF-6-ASM-03", async ({ page }) => {
  test.setTimeout(240_000)
  await page.setViewportSize(VIEWPORTS[0])
  await page.goto("/")
  await opened(page)
  await reachCebador(page)
  await page.waitForTimeout(3000)
  const result = await page.evaluate(
    ({ main, second }) =>
      new Promise<{ seeks: number; maxDrift: number; loops: number }>((resolve) => {
        const lead = document.querySelector<HTMLVideoElement>(main)!
        const own = document.querySelector<HTMLVideoElement>(second)!
        let seeks = 0
        let maxDrift = 0
        let loops = 0
        let previous = lead.currentTime
        // the browser itself fires a seeking when a looping video wraps from its end to its start: that one is not a correction
        let before = own.currentTime
        own.addEventListener("timeupdate", () => {
          if (own.currentTime > 1) before = own.currentTime
        })
        own.addEventListener("seeking", () => {
          const wrap = own.currentTime < 1 && before > own.duration - 1.5
          if (!wrap) seeks++
        })
        const start = performance.now()
        const timer = window.setInterval(() => {
          if (lead.currentTime < previous - 1) loops++
          previous = lead.currentTime
          const d = Math.abs(lead.currentTime - own.currentTime)
          maxDrift = Math.max(maxDrift, Math.min(d, lead.duration - d))
          if (performance.now() - start > 24_000 && loops >= 2) {
            window.clearInterval(timer)
            resolve({ seeks, maxDrift, loops })
          }
        }, 250)
      }),
    { main: MAIN, second: SECOND },
  )
  console.log(`phone seeks ${result.seeks}, max drift ${result.maxDrift.toFixed(3)}, loops ${result.loops}`)
  expect(result.loops).toBeGreaterThanOrEqual(2)
  expect(result.seeks, "seeks after the first catch-up").toBe(0)
  expect(result.maxDrift, "cyclic drift").toBeLessThanOrEqual(0.2)
})
