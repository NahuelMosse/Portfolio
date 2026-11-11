import { test, expect, type Page } from "@playwright/test"

const VIEWPORTS = [
  { width: 1910, height: 912 },
  { width: 1920, height: 1080 },
  { width: 1440, height: 900 },
  { width: 1280, height: 720 },
  { width: 2560, height: 1080 },
] as const

const TOP_BAR = 56
const MAX_CARD_ALPHA = 0.5
// points of the drawings, as fractions of the image
const CONTACT_SEAL = { x: 0.76, y: 0.7 }
const OFFER_POINTS = { figure: { x: 0.52, y: 0.45 }, openDoor: { x: 0.32, y: 0.3 }, closedDoor: { x: 0.79, y: 0.3 } }

async function open(page: Page, width: number, height: number, selector: string) {
  await page.setViewportSize({ width, height })
  await page.goto("/")
  await page.locator(selector).scrollIntoViewIfNeeded()
  await page.waitForFunction((sel) => {
    const img = document.querySelector<HTMLImageElement>(`${sel} .scene-art img`)
    return !!img && img.complete && img.naturalWidth > 0
  }, selector)
}

// Maps points of an image to the page through object-fit: cover and reports what covers each of them and how opaque it is.
function probePoints({ selector, coverSelector, points }: { selector: string; coverSelector: string; points: Record<string, { x: number; y: number }> }) {
  const scene = document.querySelector(selector)!
  const img = scene.querySelector<HTMLImageElement>(".scene-art img")!
  const box = img.getBoundingClientRect()
  const sceneBox = scene.getBoundingClientRect()
  const natural = img.naturalWidth / img.naturalHeight
  const fit = box.width / box.height / natural
  const shownW = Math.min(1, 1 / fit)
  const shownH = Math.min(1, fit)
  const [posX, posY] = getComputedStyle(img).objectPosition.split(" ").map((v) => parseFloat(v) / 100)
  const alphaOf = (color: string) => {
    const slash = color.match(/\/\s*([\d.]+)\s*\)/)
    if (slash) return parseFloat(slash[1])
    const parts = color.match(/rgba?\(([^)]+)\)/)?.[1].split(",")
    return parts && parts.length === 4 ? parseFloat(parts[3]) : 1
  }
  const covers = [...scene.querySelectorAll<HTMLElement>(coverSelector)].map((el) => ({ box: el.getBoundingClientRect(), alpha: alphaOf(getComputedStyle(el).backgroundColor) }))
  const out: Record<string, { inViewport: boolean; strongestCover: number }> = {}
  for (const [name, p] of Object.entries(points)) {
    const x = box.left + ((p.x - (1 - shownW) * posX) / shownW) * box.width
    const y = box.top + ((p.y - (1 - shownH) * posY) / shownH) * box.height
    const strongestCover = Math.max(0, ...covers.filter((c) => x >= c.box.left && x <= c.box.right && y >= c.box.top && y <= c.box.bottom).map((c) => c.alpha))
    out[name] = { inViewport: x >= 0 && x <= innerWidth && y >= 0 && y <= innerHeight, strongestCover }
  }
  return {
    out,
    coversSection: Math.max(Math.abs(box.top - sceneBox.top), Math.abs(box.left - sceneBox.left), Math.abs(sceneBox.bottom - box.bottom), Math.abs(sceneBox.right - box.right)),
  }
}

for (const { width, height } of VIEWPORTS) {
  test(`contact at ${width}x${height}: the drawing covers the block, LET'S TALK to the footer fits one screen, the seal shows @PF-1-ASM-29`, async ({ page }) => {
    await open(page, width, height, ".contact-scene")
    const probe = await page.evaluate(probePoints, { selector: ".contact-scene", coverSelector: "#contact a, #contact button, #contact .band, #contact .band-halves", points: { seal: CONTACT_SEAL } })
    expect(probe.coversSection, "the drawing covers the section edge to edge").toBeLessThanOrEqual(1)
    expect(probe.out.seal.inViewport, "the seal is on screen").toBe(true)
    expect(probe.out.seal.strongestCover, "the seal is not under an opaque tile or the band").toBeLessThanOrEqual(MAX_CARD_ALPHA)

    const span = await page.evaluate(() => {
      const contact = document.querySelector("#contact")!.getBoundingClientRect()
      const foot = document.querySelector(".end-of-file")!.getBoundingClientRect()
      const hint = document.querySelector(".band-hint")!.getBoundingClientRect()
      const halves = document.querySelector(".band-halves")!.getBoundingClientRect()
      const roll = document.querySelector(".credits-roll")!.getBoundingClientRect()
      return { height: foot.bottom - contact.top, hintClear: hint.bottom <= halves.top + 1, halvesClear: halves.bottom <= roll.top + 1 }
    })
    expect(span.height, "from LET'S TALK to the end of the page").toBeLessThanOrEqual(height - TOP_BAR + 1)
    expect(span.hintClear, "the hint clears the tiles").toBe(true)
    expect(span.halvesClear, "the tiles clear the roll").toBe(true)
  })

  test(`offer at ${width}x${height}: the whole section fits one screen with the drawing big behind translucent cards @PF-1-ASM-31`, async ({ page }) => {
    await open(page, width, height, ".offer-scene")
    const probe = await page.evaluate(probePoints, { selector: ".offer-scene", coverSelector: ".folder", points: OFFER_POINTS })
    expect(probe.coversSection, "the drawing covers the section edge to edge").toBeLessThanOrEqual(1)
    for (const [name, point] of Object.entries(probe.out)) {
      expect(point.inViewport, `${name} is on screen`).toBe(true)
      expect(point.strongestCover, `${name} is not under an opaque card`).toBeLessThanOrEqual(MAX_CARD_ALPHA)
    }

    const span = await page.evaluate(() => {
      const word = document.querySelector(".offer-scene .chapter-title")!.getBoundingClientRect()
      const scene = document.querySelector(".offer-scene")!.getBoundingClientRect()
      const [a, b] = [...document.querySelectorAll(".folder")].map((el) => el.getBoundingClientRect())
      const door = (el: Element) => el.querySelector(".door")!.getBoundingClientRect()
      const folders = [...document.querySelectorAll(".folder")]
      return {
        height: scene.bottom - word.top,
        cardsInside: a.top >= scene.top - 1 && a.bottom <= scene.bottom + 1 && b.bottom <= scene.bottom + 1,
        side: a.right <= b.left + 1,
        doorsInCards: folders.every((f) => door(f).bottom <= f.getBoundingClientRect().bottom + 1),
      }
    })
    expect(span.height, "from the OFFER word to the end of the illustration").toBeLessThanOrEqual(height - TOP_BAR + 1)
    expect(span.cardsInside, "the cards sit inside the illustration").toBe(true)
    expect(span.side, "the two cards stand side by side").toBe(true)
    expect(span.doorsInCards, "each button is inside its card").toBe(true)
  })
}
