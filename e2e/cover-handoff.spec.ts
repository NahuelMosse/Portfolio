import { test, expect, type Page } from "@playwright/test"
import sharp from "sharp"

// @PF-1-ASM-40 the cover: no empty black band on the way to PROJECTS, his whole head below the top bar, NAWI at its big size.
const SIZES = [
  { width: 1910, height: 912 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1080 },
  { width: 1440, height: 900 },
  { width: 1280, height: 720 },
]
const TICK = 300
const FLAT_SHARE = 0.15
const COLOR_STEP = 8
const NAWI_SHARE = 0.41

async function open(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height })
  await page.goto("/")
  await page.locator(".pin-spacer").first().waitFor({ state: "attached" })
  await page.waitForTimeout(1200)
}

// the tallest run of rows under the bar that are one flat color from edge to edge
async function tallestFlatBand(page: Page, barHeight: number) {
  const { data, info } = await sharp(await page.screenshot()).raw().toBuffer({ resolveWithObject: true })
  const row = (y: number) => {
    let low = 255
    let high = 0
    for (let x = 0; x < info.width; x++) {
      const at = (y * info.width + x) * info.channels
      for (let c = 0; c < 3; c++) {
        low = Math.min(low, data[at + c])
        high = Math.max(high, data[at + c])
      }
    }
    return high - low <= COLOR_STEP ? low : -1
  }
  let best = 0
  let run = 0
  let previous = -2
  for (let y = barHeight; y < info.height; y++) {
    const flat = row(y)
    run = flat !== -1 && Math.abs(flat - previous) <= COLOR_STEP ? run + 1 : flat === -1 ? 0 : 1
    previous = flat
    best = Math.max(best, run)
  }
  return best
}

for (const { width, height } of SIZES) {
  test(`walking by ${TICK}px ticks to PROJECTS at ${width}x${height} shows no empty flat band @PF-1-ASM-40`, async ({ page }) => {
    await open(page, width, height)
    const bar = await page.evaluate(() => document.querySelector("header")!.getBoundingClientRect().bottom)
    const stop = await page.evaluate(() => document.querySelector('[data-chapter="projects"]')!.getBoundingClientRect().top + scrollY)
    await page.mouse.move(width / 2, height / 2)
    const bands: string[] = []
    let y = 0
    for (let tick = 0; tick < 30 && y < stop + TICK; tick++) {
      await page.mouse.wheel(0, TICK)
      await page.waitForTimeout(700)
      y = await page.evaluate(() => scrollY)
      const band = await tallestFlatBand(page, Math.round(bar))
      if (band >= height * FLAT_SHARE) bands.push(`scrollY ${Math.round(y)}: ${band}px flat`)
    }
    expect(bands).toEqual([])
  })

  test(`the cover shows his whole head below the top bar at ${width}x${height} @PF-1-ASM-40`, async ({ page }) => {
    await open(page, width, height)
    const meta = await sharp("public/film/ill-cover-16x9.webp").metadata()
    const { data, info } = await sharp("public/film/ill-cover-16x9.webp").raw().toBuffer({ resolveWithObject: true })
    // the first row of the drawing, across his head's columns, that holds a lit pixel: the top of his hair
    let hairRow = 0
    scan: for (let y = 0; y < info.height; y++) {
      for (let x = Math.round(info.width * 0.16); x < info.width * 0.39; x++) {
        const at = (y * info.width + x) * info.channels
        if (data[at] + data[at + 1] + data[at + 2] > 180) {
          hairRow = y
          break scan
        }
      }
    }
    const geometry = await page.evaluate(() => {
      const image = document.querySelector<HTMLImageElement>(".cover-scene .scene-art img")!
      const box = image.getBoundingClientRect()
      const style = getComputedStyle(image)
      return { top: box.top, left: box.left, width: box.width, height: box.height, position: style.objectPosition, bar: document.querySelector("header")!.getBoundingClientRect().bottom }
    })
    const scale = Math.max(geometry.width / meta.width!, geometry.height / meta.height!)
    const verticalShare = parseFloat(geometry.position.split(" ")[1]) / 100
    const drawnTop = geometry.top + (geometry.height - meta.height! * scale) * verticalShare
    expect(drawnTop + hairRow * scale, `the top of his hair sits below the bar (${geometry.bar}px)`).toBeGreaterThanOrEqual(geometry.bar)
  })

  test(`NAWI on the cover is at least ${NAWI_SHARE * 100}vw at ${width}x${height} @PF-1-ASM-40`, async ({ page }) => {
    await open(page, width, height)
    const size = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector(".cover-title .mark")!).fontSize))
    expect(size).toBeGreaterThanOrEqual(width * NAWI_SHARE - 1)
  })
}
