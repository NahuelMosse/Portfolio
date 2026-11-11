import { test, expect, type Page } from "@playwright/test"

// The Cebador, Sonría and Miga pages are served by the lab. These tests replace the ones that asserted their GitHub Pages
// hrefs (see the Log, "replaces:").
const LAB = {
  cebador: "https://lab.nawi.dev/cebador/",
  sonria: "https://lab.nawi.dev/sonria/",
  miga: "https://lab.nawi.dev/miga/",
}

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
]
const PHONE = { width: 390, height: 844 }

const project = (page: Page, id: string) => page.locator(`article[data-project="${id}"]`)

test.describe("lab links", () => {
  test("each project scene links to its live page or its repository, except Grit, which is private, and Cebador, Sonría and Miga open the lab @PF-1-S5 @PF-8-S1", async ({ page }) => {
    await page.goto("/")
    const expected: Record<string, string | null> = {
      "dev-kit": "github.com/NahuelMosse/motion-audit",
      grit: null,
      guardia: "nahuelmosse.itch.io/triaje",
      cebador: "lab.nawi.dev/cebador",
      club: "github.com/NahuelMosse/ClubNahuelMosse",
    }
    for (const [id, href] of Object.entries(expected)) {
      const links = await project(page, id).locator("a").evaluateAll((all) => all.map((a) => (a as HTMLAnchorElement).href))
      if (href === null) expect(links).toHaveLength(0)
      else expect(links.some((l) => l.includes(href))).toBe(true)
    }
  })

  test("each project holds at least three real pieces and the pieces outnumber the text fields, with Cebador's lab page linked @PF-1-S26 @PF-1-ASM-22 @PF-1-S16 @PF-8-S1", async ({ page }) => {
    await page.goto("/")
    const counts = await page.locator("[data-project]").evaluateAll((all) =>
      all.map((el) => ({ id: el.getAttribute("data-project"), pieces: el.querySelectorAll("[data-piece]").length })),
    )
    expect(counts).toHaveLength(5)
    for (const { id, pieces } of counts) expect(pieces, String(id)).toBeGreaterThanOrEqual(3)
    const total = counts.reduce((sum, c) => sum + c.pieces, 0)
    expect(total).toBeGreaterThan(await page.locator('[data-chapter="projects"] [data-field]').count())
    await expect(page.locator('[data-chapter="projects"] a[href*="lab.nawi.dev/cebador"]').first()).toBeVisible()
  })

  test("each personal project shows at least three real pieces: Cebador a looping capture and a link to lab.nawi.dev/cebador, ClubNahuelMosse its four README screens, Guardia captures of nahuelmosse.itch.io/triaje, Grit screens of its app and design lab, the dev kit a real card, its tests and its pull request; the freelance offer in the end credits recalls a strip of them @PF-1-ASM-22 @PF-8-S1", async ({ page }) => {
    await page.goto("/")
    const count = (id: string) => project(page, id).locator("[data-piece]").count()
    const cebador = project(page, "cebador")
    expect(await cebador.locator("video[data-capture]").count()).toBe(2)
    expect(await cebador.locator(`[data-piece] a[href="${LAB.cebador}"]`).count()).toBe(1)
    expect(await count("club")).toBeGreaterThanOrEqual(4)
    expect(await count("guardia")).toBeGreaterThanOrEqual(3)
    expect(await count("grit")).toBeGreaterThanOrEqual(3)
    const kitKinds = await project(page, "dev-kit").locator("[data-piece]").evaluateAll((all) => all.map((p) => p.getAttribute("data-kind")))
    expect(kitKinds).toEqual(expect.arrayContaining(["card", "tests", "pull-request"]))
    expect(await project(page, "dev-kit").locator('[data-piece="pull-request"] a, [data-kind="pull-request"] a').count()).toBeGreaterThan(0)
    expect(await page.locator('[data-offer-card="freelance"] [data-piece-strip] [data-piece]').count()).toBeGreaterThanOrEqual(4)
  })

  test("Sonría and Miga open their lab page and their repository, and the other projects keep their links @PF-1-ASM-26 @PF-8-ASM-01", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("load")
    const LINKS = [
      { project: "sonria", hrefs: [LAB.sonria, "https://github.com/NahuelMosse/sonria"] },
      { project: "miga", hrefs: [LAB.miga, "https://github.com/NahuelMosse/miga"] },
      { project: "cebador", hrefs: [LAB.cebador] },
      { project: "guardia", hrefs: ["https://nahuelmosse.itch.io/triaje"] },
      { project: "club", hrefs: ["https://github.com/NahuelMosse/ClubNahuelMosse"] },
      {
        project: "dev-kit",
        hrefs: ["https://github.com/NahuelMosse/motion-audit", "https://github.com/NahuelMosse/http-attack", "https://github.com/NahuelMosse/migrations-safe"],
      },
    ]
    for (const viewport of VIEWPORTS) {
      await page.setViewportSize(viewport)
      for (const { project: id, hrefs } of LINKS) {
        for (const href of hrefs) {
          const link = page.locator(`#${id} a[href="${href}"]`)
          await expect(link, `${id} at ${viewport.width} links to ${href}`).toHaveCount(1)
          await expect(link).toHaveAttribute("target", "_blank")
        }
      }
    }
  })

  test("the lab pages and the repositories are linked from their project @PF-1-ASM-26 @PF-8-ASM-01", async ({ page }) => {
    await page.setViewportSize(PHONE)
    await page.goto("/")
    await page.waitForLoadState("load")
    const LINKS: Record<string, string[]> = {
      sonria: [LAB.sonria, "https://github.com/NahuelMosse/sonria"],
      miga: [LAB.miga, "https://github.com/NahuelMosse/miga"],
      club: ["https://github.com/NahuelMosse/ClubNahuelMosse"],
      guardia: ["https://nahuelmosse.itch.io/triaje"],
    }
    for (const [id, hrefs] of Object.entries(LINKS)) {
      for (const href of hrefs) {
        const link = page.locator(`#${id} a[href="${href}"]`)
        await expect(link, `${id} links to ${href}`).toHaveCount(1)
        await expect(link).toHaveAttribute("target", "_blank")
      }
    }
  })

  test("no link of the page points to github.io @PF-8-S2", async ({ page }) => {
    await page.goto("/")
    const hrefs = await page.locator("a[href]").evaluateAll((all) => all.map((a) => a.getAttribute("href") ?? ""))
    expect(hrefs.filter((href) => href.includes("github.io"))).toEqual([])
  })

  test("the machine-readable payload carries the three lab URLs and no github.io one @PF-8-ASM-02", async ({ request }) => {
    const body = await (await request.get("/portfolio.json")).text()
    for (const url of Object.values(LAB)) expect(body, url).toContain(url)
    expect(body).not.toContain("github.io")
  })
})
