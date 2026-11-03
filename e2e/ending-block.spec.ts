import { test, expect } from "@playwright/test"

// @PF-1-ASM-36 the ending is one red block: LET'S TALK, the contact tiles, the credits roll (studies and certifications) and the footer as the last line,
// all on one red ground and inside one screen; the word is at least 16vw wide (back at its pre-cap 16.5vw).
const SIZES = [
  { width: 1910, height: 912 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1080 },
  { width: 1440, height: 900 },
  { width: 1280, height: 720 },
] as const

const FOOTER_TEXT = "© Nahuel Mosse — NAWI · END OF FILE"
const AA_TEXT = 4.5

for (const { width, height } of SIZES) {
  test(`the ending block at ${width}x${height} holds word, tiles, roll and footer in one red screen @PF-1-ASM-36`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto("/")
    await page.locator(".contact-scene").scrollIntoViewIfNeeded()
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))

    const m = await page.evaluate(() => {
      const scene = document.querySelector<HTMLElement>(".contact-scene")!
      const box = (s: string) => document.querySelector(s)!.getBoundingClientRect()
      const channels = (css: string) => (css.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number)
      const light = (c: number[]) => {
        const [r, g, b] = c.map((v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
      }
      const ground = getComputedStyle(scene).backgroundColor
      const items = [...scene.querySelectorAll<HTMLElement>(".credits-roll .roll-item")].filter((n) => n.getClientRects().length)
      const [hi, lo] = [light(items[0] ? channels(getComputedStyle(items[0]).color) : [0, 0, 0]), light(channels(ground))].sort((a, b) => b - a)
      const owner = (s: string) => document.querySelector(s)?.closest(".contact-scene") === scene
      const footer = box(".end-of-file")
      const word = box(".contact-scene .chapter-word")
      return {
        rollsInScene: document.querySelectorAll(".contact-scene .credits-roll").length,
        rollsTotal: document.querySelectorAll(".credits-roll").length,
        bands: [...scene.querySelectorAll("[data-band]")].map((n) => n.getAttribute("data-band")),
        owners: ["#contact", ".contact-tiles", ".credits-roll", ".end-of-file"].map(owner),
        order: { word: word.top, tilesBottom: box(".contact-tiles").bottom, rollTop: box(".credits-roll").top, rollBottom: box(".credits-roll").bottom, footerTop: footer.top },
        footerText: document.querySelector(".end-of-file")!.textContent!.trim(),
        footerLast: scene.querySelector(".scene-copy")!.lastElementChild === document.querySelector(".end-of-file"),
        span: footer.bottom - word.top,
        sceneBox: { top: scene.getBoundingClientRect().top, bottom: scene.getBoundingClientRect().bottom },
        innerHeight,
        contrast: (hi + 0.05) / (lo + 0.05),
        wordSize: parseFloat(getComputedStyle(document.querySelector(".contact-scene .chapter-word")!).fontSize),
        experienceSize: parseFloat(getComputedStyle(document.querySelector(".xp .chapter-word")!).fontSize),
        groundOpaque: !/rgba\(.*,\s*0\)|transparent/.test(ground),
      }
    })

    expect(m.rollsTotal, "there is one roll and it is inside the ending block").toBe(1)
    expect(m.rollsInScene).toBe(1)
    expect(m.bands).toEqual(["studies", "certifications"])
    expect(m.owners, "word, tiles, roll and footer share the red scene").toEqual([true, true, true, true])
    expect(m.groundOpaque, "the scene is the one red ground").toBe(true)
    expect(m.order.tilesBottom, "the roll is below the tiles").toBeLessThanOrEqual(m.order.rollTop + 1)
    expect(m.order.rollBottom, "the footer is below the roll").toBeLessThanOrEqual(m.order.footerTop + 1)
    expect(m.footerLast, "the footer is the last line").toBe(true)
    expect(m.footerText).toBe(FOOTER_TEXT)
    expect(m.span, "from LET'S TALK to the footer is one screen").toBeLessThanOrEqual(m.innerHeight + 1)
    expect(m.sceneBox.top, "the block starts on screen").toBeGreaterThanOrEqual(-1)
    expect(m.sceneBox.bottom, "the block ends on screen").toBeLessThanOrEqual(m.innerHeight + 1)
    expect(m.contrast, "the roll reads on the red").toBeGreaterThanOrEqual(AA_TEXT)
    expect(m.wordSize, "LET'S TALK is at least 16vw").toBeGreaterThanOrEqual((width * 16) / 100)
  })
}
