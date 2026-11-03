import { test, expect } from "@playwright/test"

// The ending is one red block: the footer sits inside the Let's talk scene, on its red ground, with no band or seam between them.
const VIEWPORTS = [
  { width: 1910, height: 912 },
  { width: 1920, height: 1080 },
  { width: 1440, height: 900 },
  { width: 1280, height: 720 },
  { width: 2560, height: 1080 },
  { width: 390, height: 844 },
] as const

for (const { width, height } of VIEWPORTS) {
  test(`footer at ${width}x${height} is inside the contact scene on its red ground @PF-1-ASM-33`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto("/")
    await page.locator(".end-of-file").scrollIntoViewIfNeeded()

    const m = await page.evaluate(() => {
      const scene = document.querySelector<HTMLElement>(".contact-scene")!
      const footer = document.querySelector<HTMLElement>(".end-of-file")!
      const own = (el: Element) => getComputedStyle(el).backgroundColor
      // the colour under the footer is the first opaque background up its ancestors
      let ground: Element | null = footer
      while (ground && /rgba\(.*,\s*0\)|transparent/.test(own(ground))) ground = ground.parentElement
      const sceneBox = scene.getBoundingClientRect()
      const footBox = footer.getBoundingClientRect()
      return {
        inside: scene.contains(footer),
        groundIsScene: ground === scene,
        groundColor: ground ? own(ground) : "",
        sceneColor: own(scene),
        seamAbove: footBox.top < sceneBox.top,
        gapBelow: Math.abs(sceneBox.bottom - footBox.bottom),
        pageEnd: Math.abs(document.documentElement.scrollHeight - (footBox.bottom + scrollY)),
      }
    })

    expect(m.inside, "the footer is a descendant of the contact scene").toBe(true)
    expect(m.groundIsScene, "the colour under the footer comes from the contact scene").toBe(true)
    expect(m.groundColor, "the ground under the footer is the contact red").toBe(m.sceneColor)
    expect(m.seamAbove, "the footer starts inside the scene").toBe(false)
    expect(m.gapBelow, "the scene ends at the footer's padding, with no band below").toBeLessThanOrEqual(64)
    expect(m.pageEnd, "the page ends with the scene").toBeLessThanOrEqual(2)
  })
}
