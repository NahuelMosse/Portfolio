import { test, expect, type Page } from "@playwright/test"

// @PF-1-ASM-44 on a slow line the opening title covers the whole cold load and the images below the cover arrive as the
// visitor nears them: the title stays until Boska is loaded, the cover decoded and the page hydrated, and starts its way out
// the moment they are, never later; while it waits the stamp's loop keeps running; its counter never reads 000; the n5 stamp
// inks only forward, strikes once and lands as the top bar's mark; once gone it never comes back; nothing below the cover is
// fetched while it plays; every image a section shows is painted, not blank, once the visitor is there.
const SIZES = [
  { width: 1910, height: 912 },
  { width: 390, height: 844 },
] as const

// the frame everything the title waits for was in
type Boot = { font: number; cover: number; hydrated: number }

// what the page was when the title gave way, every reading of the counter while it played, the stamp's loop while it waited
// and the steps of its way out
const WATCH = () => {
  const record = {
    counts: [] as string[],
    ink: [] as number[],
    atExit: null as null | { boska: boolean; cover: boolean },
    returned: false,
    imagesBeforeExit: [] as string[],
    poses: [] as string[],
    looping: [] as boolean[],
    states: [] as string[],
    readyAt: 0,
    exitAt: 0,
  }
  ;(window as unknown as { __slowLine: typeof record }).__slowLine = record
  let gone = false
  // counted in frames, not milliseconds: a long task on the main thread delays both alike
  let frame = 0
  const read = () => {
    // read on every frame: an init script can run before the document has its <html>
    const html = document.documentElement
    if (!html) return void requestAnimationFrame(read)
    const now = ++frame
    const boot = (window as unknown as { __nawiBoot?: Boot }).__nawiBoot
    if (!record.readyAt && boot?.font && boot.cover && boot.hydrated) record.readyAt = now
    const state = document.querySelector("[data-preloader]")?.getAttribute("data-state")
    if (state && record.states[record.states.length - 1] !== state) record.states.push(state)
    if (state && !record.exitAt) record.exitAt = now
    const stamp = document.querySelector<HTMLElement>(".preloader-stamp")
    if (html.classList.contains("is-preloading") && !state && stamp) {
      record.poses.push(getComputedStyle(stamp).transform)
      record.looping.push(stamp.getAnimations().some((a) => a.effect?.getComputedTiming().iterations === Infinity && a.playState === "running"))
    }
    const count = document.querySelector("[data-preloader-count]")?.textContent
    const ink = document.getElementById("n5-ink-a")?.getAttribute("intercept")
    if (html.classList.contains("is-preloading") && count) record.counts.push(count)
    if (html.classList.contains("is-preloading") && ink) record.ink.push(Number(ink))
    if (!gone && !html.classList.contains("is-preloading") && record.counts.length) {
      gone = true
      const img = document.querySelector<HTMLImageElement>("#cold-open .scene-art img")
      record.atExit = { boska: document.fonts.check('700 16px "Boska"'), cover: Boolean(img?.complete && img.naturalWidth > 0) }
      record.imagesBeforeExit = performance
        .getEntriesByType("resource")
        .map((entry) => entry.name)
        .filter((name) => /\/film\/|\/logos\//.test(name) && !/ill-cover-/.test(name))
    }
    if (gone && html.classList.contains("is-preloading")) record.returned = true
    requestAnimationFrame(read)
  }
  requestAnimationFrame(read)
}

async function slowLine(page: Page) {
  const cdp = await page.context().newCDPSession(page)
  await cdp.send("Network.enable")
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true })
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 300, downloadThroughput: 400_000, uploadThroughput: 400_000 })
}

type Record = {
  counts: string[]
  ink: number[]
  atExit: null | { boska: boolean; cover: boolean }
  returned: boolean
  imagesBeforeExit: string[]
  poses: string[]
  looping: boolean[]
  states: string[]
  readyAt: number
  exitAt: number
}
const record = (page: Page) => page.evaluate(() => (window as unknown as { __slowLine: Record }).__slowLine)

for (const size of SIZES) {
  test(`@PF-1-ASM-44 at ${size.width} on a slow line the title covers the cold load, counts from 001, leaves once and holds back the rest`, async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "the slow line is emulated through the Chrome DevTools Protocol")
    test.setTimeout(90_000)
    await page.setViewportSize(size)
    await page.addInitScript(WATCH)
    await slowLine(page)
    await page.goto("/?preloader", { waitUntil: "commit" })
    // the title first has to be there, or the empty document at commit already reads as "gone"
    await expect(page.locator("html")).toHaveClass(/is-preloading/, { timeout: 30_000 })
    await expect(page.locator("html")).not.toHaveClass(/is-preloading/, { timeout: 60_000 })
    await page.waitForTimeout(1500)
    const seen = await record(page)
    expect(seen.counts.length, "the counter was read while the title played").toBeGreaterThan(0)
    expect(seen.counts.filter((count) => count === "000"), "the counter never reads 000").toEqual([])
    const numbers = seen.counts.map(Number)
    expect(numbers.every((n, k) => k === 0 || n >= numbers[k - 1]), "the counter never goes back").toBe(true)
    expect(seen.atExit, "Boska loaded and the cover decoded when the title gave way").toEqual({ boska: true, cover: true })
    expect(seen.returned, "the title never comes back").toBe(false)
    expect(seen.imagesBeforeExit, "nothing below the cover was fetched while the title played").toEqual([])
    await expect(page.locator("[data-preloader]")).toBeHidden()
    expect(seen.ink.length, "the stamp was inked while the title played").toBeGreaterThan(1)
    expect(seen.ink.every((v, k) => k === 0 || v >= seen.ink[k - 1]), "the ink only ever comes through, never back").toBe(true)
    expect(seen.ink[seen.ink.length - 1], "the stamp left fully inked").toBeGreaterThan(seen.ink[0])
    // the loop runs for as long as the load does, and the way out starts the moment it is done
    expect(seen.looping.length, "the stamp was watched while the page loaded").toBeGreaterThan(10)
    expect(seen.looping.every(Boolean), "the stamp's loop ran on every frame the title waited").toBe(true)
    expect(new Set(seen.poses).size, "the stamp kept moving while it waited").toBeGreaterThan(10)
    expect(seen.readyAt, "the load completed").toBeGreaterThan(0)
    expect(seen.exitAt - seen.readyAt, "the way out starts within two frames of the load being done, never later").toBeLessThanOrEqual(2)
    expect(seen.exitAt, "and never before").toBeGreaterThanOrEqual(seen.readyAt)
    expect(seen.states, "the way out plays once: the strike, then the landing").toEqual(["striking", "landing"])
    // the stamp that played the title is now the bar's mark, drawn where it landed
    const mark = page.locator("[data-wordmark] [data-brand-mark]")
    await expect(mark).toHaveCSS("opacity", "1")
    expect(await mark.locator("svg").evaluate((svg) => svg.getBoundingClientRect().width)).toBeGreaterThan(30)
  })

  test(`@PF-1-ASM-44 at ${size.width} every image a section shows is painted once the visitor is there`, async ({ page }) => {
    test.setTimeout(120_000)
    await page.setViewportSize(size)
    await page.goto("/")
    const cover = page.locator("#cold-open .scene-art img")
    await expect.poll(() => cover.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(/\/film\/r\/\d+\/ill-cover-(16x9|9x16)\.(avif|webp)$/)
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < height; y += size.height) {
      await page.evaluate((top) => window.scrollTo(0, top), y)
      await expect
        .poll(
          () =>
            page.evaluate(() =>
              [...document.images]
                .filter((img) => {
                  const box = img.getBoundingClientRect()
                  if (box.width < 40 || box.height < 40 || box.bottom <= 0 || box.top >= innerHeight) return false
                  return img.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && !img.closest("[data-preloader]")
                })
                .filter((img) => !(img.complete && img.naturalWidth > 1 && !img.currentSrc.startsWith("data:")))
                .map((img) => img.getAttribute("data-srcset") ?? img.getAttribute("data-src") ?? img.src),
            ),
          { message: `blank images at scroll ${y}`, timeout: 15_000 },
        )
        .toEqual([])
    }
  })
}
