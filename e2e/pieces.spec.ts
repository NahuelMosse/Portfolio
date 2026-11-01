import { test, expect } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/")
})

const project = (page: import("@playwright/test").Page, id: string) => page.locator(`article[data-project="${id}"]`)

test("each project scene links to its live page or its repository, except Grit, which is private @PF-1-S5", async ({ page }) => {
  const expected: Record<string, string | null> = {
    "dev-kit": "github.com/NahuelMosse/motion-audit",
    grit: null,
    guardia: "nahuelmosse.itch.io/triaje",
    cebador: "nahuelmosse.github.io/cebador-landing",
    club: "github.com/NahuelMosse/ClubNahuelMosse",
  }
  for (const [id, href] of Object.entries(expected)) {
    const links = await project(page, id).locator("a").evaluateAll((all) => all.map((a) => (a as HTMLAnchorElement).href))
    if (href === null) expect(links).toHaveLength(0)
    else expect(links.some((l) => l.includes(href))).toBe(true)
  }
})

test("the freelance offer and the project scenes show more real pieces than text blocks @PF-1-S26", async ({ page }) => {
  const pieces = await page.locator('section[data-chapter="projects"] [data-piece], [data-offer-card="freelance"] [data-piece-strip] [data-piece]').count()
  const text = await page.locator('section[data-chapter="projects"] [data-field], [data-offer-card] p').count()
  expect(pieces).toBeGreaterThan(text)
})

test("each personal project shows at least three real pieces: Cebador a looping capture of nahuelmosse.github.io/cebador-landing at 390 and 1280 and a link to it, ClubNahuelMosse its four README screens, Guardia captures of nahuelmosse.itch.io/triaje, Grit screens of its app and design lab, the dev kit a real card, its tests and its pull request; the freelance offer in the end credits recalls a strip of them @PF-1-ASM-22", async ({ page }) => {
  const count = (id: string) => project(page, id).locator("[data-piece]").count()
  const cebador = project(page, "cebador")
  expect(await cebador.locator("video[data-capture]").count()).toBe(2)
  expect(await cebador.locator('[data-piece] a[href="https://nahuelmosse.github.io/cebador-landing/"]').count()).toBe(1)
  expect(await count("club")).toBeGreaterThanOrEqual(4)
  expect(await count("guardia")).toBeGreaterThanOrEqual(3)
  expect(await count("grit")).toBeGreaterThanOrEqual(3)
  const kitKinds = await project(page, "dev-kit").locator("[data-piece]").evaluateAll((all) => all.map((p) => p.getAttribute("data-kind")))
  expect(kitKinds).toEqual(expect.arrayContaining(["card", "tests", "pull-request"]))
  expect(await project(page, "dev-kit").locator('[data-piece="pull-request"] a, [data-kind="pull-request"] a').count()).toBeGreaterThan(0)
  expect(await page.locator('[data-offer-card="freelance"] [data-piece-strip] [data-piece]').count()).toBeGreaterThanOrEqual(4)
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
