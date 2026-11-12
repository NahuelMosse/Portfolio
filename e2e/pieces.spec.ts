import { test, expect } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/")
})

const project = (page: import("@playwright/test").Page, id: string) => page.locator(`article[data-project="${id}"]`)

test("the freelance offer and the project scenes show more real pieces than text blocks @PF-1-S26", async ({ page }) => {
  const pieces = await page.locator('section[data-chapter="projects"] [data-piece], [data-offer-card="freelance"] [data-piece-strip] [data-piece]').count()
  const text = await page.locator('section[data-chapter="projects"] [data-field], [data-offer-card] p').count()
  expect(pieces).toBeGreaterThan(text)
})

test("the Jüsto scene shows the team presentation photo, treated @PF-1-S12", async ({ page }) => {
  const photo = page.locator('article[data-employer="justo"] [data-piece] img[src*="justo-team"]')
  await expect(photo).toHaveCount(1)
  await expect(photo.locator("xpath=ancestor::*[@data-piece][1]")).toBeVisible()
})

test("every real screen and photo sits under a mask or clip-path with a grade filter and the grain overlay, never a bare rectangular img @PF-1-ASM-10", async ({ page }) => {
  const pieces = page.locator("[data-piece]")
  expect(await pieces.count()).toBeGreaterThan(20)
  const bare = await pieces.evaluateAll((all) =>
    all
      .filter((piece) => piece.querySelector("img, video"))
      .filter((piece) => {
        const style = getComputedStyle(piece)
        const shaped = style.clipPath !== "none" || (style.maskImage && style.maskImage !== "none")
        const media = getComputedStyle(piece.querySelector("img, video")!)
        const graded = style.filter !== "none" || media.filter !== "none"
        return !(shaped && graded && piece.querySelector("[data-grain]"))
      })
      .map((piece) => piece.outerHTML.slice(0, 80)),
  )
  expect(bare).toEqual([])
  await expect(page.locator("main > section img:not([data-piece] img):not([data-scene-media] img)")).toHaveCount(0)
})

test("each project scene has a generated visual reference beside its explanation @PF-1-S16", async ({ page }) => {
  for (const id of ["dev-kit", "grit", "guardia", "cebador", "club"]) {
    const reference = project(page, id).locator(`[data-scene-media][data-asset^="pf-proj-${id}-"]`)
    await expect(reference).toHaveCount(1)
  }
})
