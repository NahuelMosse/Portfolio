import { test, expect } from "@playwright/test"

// @PF-1-ASM-39 at 1910x912 the LinkedIn and GitHub tiles are taller and the studies and certifications rows are closer together and smaller.
// Reference values measured before the change: roll font 31px, tiles 61px tall, 32px between the rows' text boxes.
const BEFORE = { rollFont: 31, tile: 61 }

test("at 1910x912 the tiles are at least 1.8x taller and the roll rows are closer and smaller @PF-1-ASM-39", async ({ page }) => {
  await page.setViewportSize({ width: 1910, height: 912 })
  await page.goto("/")
  await page.locator(".pin-spacer").first().waitFor({ state: "attached" })
  await page.locator(".contact-scene").scrollIntoViewIfNeeded()
  const m = await page.evaluate(() => {
    const items = [...document.querySelectorAll<HTMLElement>(".credits-roll .roll-band")].map((band) => band.querySelector(".roll-item")!.getBoundingClientRect())
    const scene = document.querySelector(".contact-scene")!.getBoundingClientRect()
    const tiles = [...document.querySelectorAll(".band-half")]
    return {
      font: parseFloat(getComputedStyle(document.querySelector(".roll-item")!).fontSize),
      gap: items[1].top - items[0].bottom,
      tiles: tiles.map((t) => t.getBoundingClientRect().height),
      tileLinks: tiles.map((t) => t.closest("a") === t || t.tagName === "A" || !!t.querySelector("a") || t.getAttribute("href") !== null),
      sceneHeight: scene.height,
      innerHeight,
    }
  })
  expect(m.font).toBeLessThan(BEFORE.rollFont)
  expect(m.gap).toBeLessThanOrEqual(16)
  expect(m.tiles).toHaveLength(2)
  for (const h of m.tiles) expect(h).toBeGreaterThanOrEqual(BEFORE.tile * 1.8)
  expect(m.tileLinks.every(Boolean), "the whole tile stays the link").toBe(true)
  expect(Math.abs(m.sceneHeight - m.innerHeight)).toBeLessThanOrEqual(2)
})
