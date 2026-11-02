import { test, expect, type Page } from "@playwright/test"

const PROJECTS = [
  { id: "dev-kit", beats: 6 },
  { id: "grit", beats: 4 },
  { id: "guardia", beats: 4 },
  { id: "cebador", beats: 4 },
  { id: "club", beats: 4 },
]
const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
]
const MIN_TAP = 44

// Scrolls so the section's pinned stage is `progress` (0 to 1) of the way through its run.
async function scrollThrough(page: Page, id: string, progress: number) {
  await page.evaluate(
    ({ id, progress }) => {
      const section = document.getElementById(id)!
      const top = section.getBoundingClientRect().top + window.scrollY
      window.scrollTo(0, top + (section.offsetHeight - window.innerHeight) * progress)
    },
    { id, progress },
  )
}

test.describe("pinned project showcase", () => {
  test("at 390 and 1440 each project is a tall section with a sticky stage whose beats follow the scroll, one caption at a time, and the index marks where the visitor is @PF-1-ASM-26", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("load")

    for (const viewport of VIEWPORTS) {
      await page.setViewportSize(viewport)
      for (const [position, { id, beats }] of PROJECTS.entries()) {
        const label = `${id} at ${viewport.width}`
        const section = page.locator(`section#${id}`)
        const height = (await section.boundingBox())!.height
        expect(height, `${label} is taller than a screen per beat`).toBeGreaterThan(viewport.height * 2)
        const stage = section.locator("[data-scene-screen]")
        expect(await stage.evaluate((el) => getComputedStyle(el).position), `${label} stage sticks`).toBe("sticky")

        await scrollThrough(page, id, 0)
        await expect(section, `${label} starts on the first beat`).toHaveAttribute("data-beat", "0")
        expect(Number(await section.evaluate((el) => el.style.getPropertyValue("--p"))), `${label} progress at the start`).toBeLessThan(0.05)

        await scrollThrough(page, id, 0.99)
        await expect(section, `${label} ends on the last beat`).toHaveAttribute("data-beat", String(beats - 1))
        expect(Number(await section.evaluate((el) => el.style.getPropertyValue("--p"))), `${label} progress at the end`).toBeGreaterThan(0.9)
        await expect(section.locator(".show-beat[data-on]"), `${label} one caption on`).toHaveCount(1)
        await expect(section.locator(".show-beat[data-on]"), `${label} the caption on is shown`).toBeVisible()
        await expect(section.locator(".show-beat:not([data-on])").first(), `${label} the others are hidden`).toBeHidden()

        const index = section.locator(".show-index li")
        await expect(index, `${label} index lists the five projects`).toHaveCount(PROJECTS.length)
        await expect(section.locator('.show-index li[aria-current="step"]'), `${label} index marks this project`).toHaveCount(1)
        await expect(index.nth(position), `${label} index current item`).toHaveAttribute("aria-current", "step")
        for (const [other, entry] of PROJECTS.entries()) {
          await expect(index.nth(other).locator("a"), `${label} index link ${other + 1}`).toHaveAttribute("href", `#${entry.id}`)
        }
        if (viewport.width === 390) {
          for (const box of await index.locator("a").evaluateAll((links) => links.map((a) => a.getBoundingClientRect()))) {
            expect(box.width, `${label} index tap width`).toBeGreaterThanOrEqual(MIN_TAP)
            expect(box.height, `${label} index tap height`).toBeGreaterThanOrEqual(MIN_TAP)
          }
        }
      }
    }
  })

  test("under reduced motion each showcase is a still: the stage does not stick, every caption is on the page and nothing is tilted or moved @PF-1-ASM-26", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    for (const viewport of VIEWPORTS) {
      await page.setViewportSize(viewport)
      await page.goto("/")
      await page.waitForLoadState("load")

      for (const { id, beats } of PROJECTS) {
        const label = `${id} at ${viewport.width}`
        const section = page.locator(`section#${id}`)
        await section.evaluate((el) => el.scrollIntoView())
        const stage = section.locator("[data-scene-screen]")
        await expect(stage, `${label} stage is not pinned`).toHaveCSS("position", "relative")
        const heights = { section: (await section.boundingBox())!.height, stage: (await stage.boundingBox())!.height }
        expect(heights.section, `${label} the section is as tall as its stage`).toBeLessThanOrEqual(heights.stage + 1)

        const shown = await section.locator(".show-beat").evaluateAll((items) => items.filter((el) => getComputedStyle(el).visibility === "visible").length)
        expect(shown, `${label} every caption is on the page`).toBe(beats)

        const moved = await section.evaluate((el) =>
          [...el.querySelectorAll(".show-device, .kit-card, .show-sheen")]
            .map((node) => getComputedStyle(node).transform)
            .filter((transform) => transform !== "none"),
        )
        expect(moved, `${label} nothing is transformed`).toEqual([])
      }
    }
  })
})
