import { test, expect } from "@playwright/test"

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1280, height: 720 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1080 },
] as const

// where the crimson seal sits inside ill-contact-16x9, as a fraction of the image
const SEAL = { x: 0.76, y: 0.7 }
const MAX_ZOOM = 1.03

for (const { width, height } of VIEWPORTS) {
  test(`contact drawing at ${width}x${height}: seen whole, the seal clear of the panels and the band, no vertical seam @PF-1-ASM-29`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto("/")
    await page.locator(".contact-scene").scrollIntoViewIfNeeded()
    await page.waitForFunction(() => {
      const img = document.querySelector<HTMLImageElement>(".contact-scene .scene-art img")
      return !!img && img.complete && img.naturalWidth > 0
    })

    const probe = await page.evaluate((seal) => {
      const art = document.querySelector<HTMLElement>(".contact-scene .scene-art")!
      const img = art.querySelector("img")!
      const scene = document.querySelector(".contact-scene")!.getBoundingClientRect()
      const box = img.getBoundingClientRect()
      const natural = img.naturalWidth / img.naturalHeight
      const fit = box.width / box.height / natural
      const zoom = Math.max(fit, 1 / fit)
      // the part of the image actually shown by object-fit: cover, as a fraction of the image
      const shownW = Math.min(1, 1 / fit)
      const shownH = Math.min(1, fit)
      const shownLeft = (1 - shownW) * parseFloat(getComputedStyle(img).objectPosition.split(" ")[0]) / 100
      const shownTop = (1 - shownH) * parseFloat(getComputedStyle(img).objectPosition.split(" ")[1]) / 100
      const px = box.left + ((seal.x - shownLeft) / shownW) * box.width
      const py = box.top + ((seal.y - shownTop) / shownH) * box.height
      const covers = [...document.querySelectorAll<HTMLElement>("#contact a, #contact button, #contact .band, #contact .band-halves")]
        .map((el) => el.getBoundingClientRect())
        .filter((r) => r.width > 0 && r.height > 0)
        .filter((r) => px >= r.left && px <= r.right && py >= r.top && py <= r.bottom)
        .length
      return {
        zoom,
        shownW,
        shownH,
                covers,
        inScene: px >= scene.left && px <= scene.right && py >= scene.top && py <= scene.bottom,
        inViewportX: px >= 0 && px <= innerWidth,
        boxOverflow: Math.max(0, box.right - scene.right, scene.left - box.left),
        mask: getComputedStyle(art).maskImage + getComputedStyle(art).webkitMaskImage,
      }
    }, SEAL)

    expect(probe.zoom, "the drawing is shown at its own proportion, not cover-zoomed").toBeLessThanOrEqual(MAX_ZOOM)
    expect(probe.shownW, "the whole width of the drawing is shown").toBeGreaterThanOrEqual(0.97)
    expect(probe.shownH, "the whole height of the drawing is shown").toBeGreaterThanOrEqual(0.97)
    expect(probe.inScene, "the seal is inside the section").toBe(true)
    expect(probe.inViewportX, "the seal is inside the viewport").toBe(true)
    expect(probe.boxOverflow, "the drawing stays inside the section").toBeLessThanOrEqual(1)
    expect(probe.covers, "no link, button or band over the seal").toBe(0)
    expect(probe.mask, "a horizontal fade melts the left edge").toMatch(/linear-gradient\((to right|90deg)/)
  })
}
