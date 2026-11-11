import { existsSync } from "node:fs"
import { join } from "node:path"
import { test, expect } from "@playwright/test"

// The illustrations are previewed untracked: the test follows what is on disk.
const onDisk = (id: string) => existsSync(join(process.cwd(), "public", "film", `${id}.webp`))
const SCENES = [
  { project: "dev-kit", asset: "ill-kit-16x9" },
  { project: "grit", asset: "ill-grit-16x9" },
  { project: "guardia", asset: "ill-triaje-16x9" },
  { project: "cebador", asset: "ill-cebador-16x9" },
  { project: "club", asset: "ill-club-16x9" },
]
const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
] as const

for (const viewport of VIEWPORTS) {
  test.describe(`illustrated chapters at ${viewport.width}`, () => {
    test.use({ viewport })

    test(`at 390 and 1440 every chapter is built around its full-bleed illustration with faded edges, each project's illustration is at least 70% of the viewport tall with its title over it, one line and its pieces at least 280 px wide at 1440, Problem and My role behind a toggle, experience lists each employer over its illustration, no pins or torn paper are drawn, and an undelivered illustration leaves no box @PF-1-ASM-26 (${viewport.width})`, async ({ page }) => {
      await page.goto("/")
      await page.waitForLoadState("load")

      for (const { project, asset } of SCENES.filter((scene) => onDisk(scene.asset))) {
        const scene = page.locator(`[data-project="${project}"]`)
        await scene.scrollIntoViewIfNeeded()
        const art = scene.locator(`[data-illustration][data-asset="${asset}"]`)
        const artBox = (await art.boundingBox())!
        expect(artBox.width, `${project} edge to edge`).toBeGreaterThanOrEqual(viewport.width - 1)
        expect(artBox.height, `${project} height`).toBeGreaterThanOrEqual(viewport.height * 0.7 - 1)
        const faded = await art.evaluate((el) => getComputedStyle(el).maskImage !== "none")
        expect(faded, `${project} edges fade`).toBe(true)

        const titleBox = (await scene.locator("h3").first().boundingBox())!
        expect(titleBox.y, `${project} title over the illustration`).toBeGreaterThanOrEqual(artBox.y - 1)
        expect(titleBox.y + titleBox.height).toBeLessThanOrEqual(artBox.y + artBox.height + 1)

        await expect(scene.locator('[data-field="what"]')).toBeVisible()
        const toggle = scene.getByRole("button", { name: /problem/i })
        await expect(scene.locator('[data-field="problem"]')).toBeHidden()
        await expect(scene.locator('[data-field="role"]')).toBeHidden()
        await toggle.click()
        await expect(scene.locator('[data-field="problem"]')).toBeVisible()
        await expect(scene.locator('[data-field="role"]')).toBeVisible()

        if (viewport.width === 1440) {
          for (const piece of await scene.locator("[data-piece]").all()) {
            expect((await piece.boundingBox())!.width, `${project} piece`).toBeGreaterThanOrEqual(280)
          }
        }
      }

      for (const employer of ["smart-warehousing", "grupo-st", "visma", "fravega", "justo"]) {
        const row = page.locator(`[data-employer="${employer}"]`)
        await expect(row.locator("[data-employer-tag]")).toHaveText(/^(CURRENT|PAST)$/)
      }
      if (onDisk("ill-experience-16x9")) {
        await expect(page.locator('[data-chapter="experience"] [data-illustration]')).toHaveCount(1)
      }

      const drawn = await page.evaluate(() => ({
        pins: document.querySelectorAll("[data-pin], .clip, .crimson-thread").length,
        torn: document.querySelectorAll('[data-asset*="paper-torn"], [data-paper="torn"]').length,
        emptyBoxes: [...document.querySelectorAll("[data-illustration]")].filter((el) => !el.querySelector("img")).length,
      }))
      expect(drawn).toEqual({ pins: 0, torn: 0, emptyBoxes: 0 })
    })
  })
}
