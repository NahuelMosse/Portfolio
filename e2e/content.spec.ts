import { test, expect } from "@playwright/test"

const EMPLOYERS = ["Grupo ST", "Smart Warehousing", "Visma", "Frávega", "Jüsto"]
const PROJECTS = ["The card is the specification", "Grit", "Guardia", "Cebador", "ClubNahuelMosse"]

test.beforeEach(async ({ page }) => {
  await page.goto("/")
})

test("the page has only cold open, projects, experience and end credits @PF-1-S4", async ({ page }) => {
  const chapters = await page.locator("main > section[data-chapter]").evaluateAll((els) => els.map((e) => e.getAttribute("data-chapter")))
  expect(chapters).toEqual(["cold-open", "projects", "experience", "end-credits"])
})

test("experience and projects are the body of the page @PF-1-S5", async ({ page }) => {
  await expect(page.locator('section[data-chapter="projects"] article[data-project]')).toHaveCount(5)
  await expect(page.locator('section[data-chapter="experience"] article[data-employer]')).toHaveCount(5)
})

test("experience shows Grupo ST, Smart Warehousing, Visma, Frávega and Jüsto, each with what it was, the problem and his role @PF-1-ASM-05", async ({ page }) => {
  const cards = page.locator("article[data-employer]")
  await expect(cards).toHaveCount(5)
  for (const name of EMPLOYERS) {
    const card = page.locator("article[data-employer]", { hasText: name })
    await expect(card).toHaveCount(1)
    for (const field of ["what", "problem", "role"]) {
      await expect(card.locator(`[data-field="${field}"]`)).not.toBeEmpty()
    }
  }
})

test("experience and projects carry the most screen time of the page @PF-1-S13", async ({ page }) => {
  const heights = await page.locator("main > section[data-chapter]").evaluateAll((els) =>
    Object.fromEntries(els.map((e) => [e.getAttribute("data-chapter"), e.getBoundingClientRect().height])),
  )
  expect(heights["projects"] + heights["experience"]).toBeGreaterThan(heights["cold-open"] + heights["end-credits"])
})

test("no percentage, multiplier or before-after figure appears in experience or projects @PF-1-S14", async ({ page }) => {
  const text = await page.locator('section[data-chapter="projects"], section[data-chapter="experience"]').evaluateAll((els) =>
    els.map((e) => Array.from(e.querySelectorAll("[data-field]")).map((f) => f.textContent).join(" ")).join(" "),
  )
  expect(text).not.toMatch(/\d+\s*%|\b\d+\s*x\b|\bfrom \d|\b\d+\s*(million|thousand|hours|min)/i)
})

test("each project has what it is, the problem and his role, and nothing else @PF-1-S15", async ({ page }) => {
  const cards = page.locator("article[data-project]")
  for (let i = 0; i < 5; i++) {
    const fields = await cards.nth(i).locator("[data-field]").evaluateAll((els) => els.map((e) => e.getAttribute("data-field")))
    expect(fields).toEqual(["what", "problem", "role"])
  }
})

test("the personal projects are The card is the specification, Grit, Guardia, Cebador and ClubNahuelMosse in that order, the kit links to motion-audit, http-attack and migrations-safe, Guardia links to nahuelmosse.itch.io/triaje, Grit has no link, and NASA Calendar, Compound Interest Calculator and Gym App are gone @PF-1-ASM-06", async ({ page }) => {
  const names = await page.locator("article[data-project] h3").allTextContents()
  expect(names.map((n) => n.trim())).toEqual(PROJECTS)
  const hrefs = async (id: string) => page.locator(`article[data-project="${id}"] a`).evaluateAll((a) => a.map((x) => (x as HTMLAnchorElement).href))
  const kit = (await hrefs("dev-kit")).join(" ")
  for (const skill of ["motion-audit", "http-attack", "migrations-safe"]) expect(kit).toContain(`github.com/NahuelMosse/${skill}`)
  expect((await hrefs("guardia")).join(" ")).toContain("nahuelmosse.itch.io/triaje")
  expect(await hrefs("grit")).toHaveLength(0)
  const body = await page.locator("body").innerText()
  for (const gone of ["NASA Calendar", "Compound Interest", "Gym App"]) expect(body).not.toContain(gone)
})

test("the personal projects shown are public or private repositories of github.com/NahuelMosse @PF-1-S25", async ({ page }) => {
  const external = await page
    .locator("article[data-project] a")
    .evaluateAll((a) => a.map((x) => (x as HTMLAnchorElement).href).filter((h) => h.includes("github.com")))
  for (const href of external) expect(href).toMatch(/^https:\/\/github\.com\/NahuelMosse\//)
})

test("the four chapters come in the order cold open, projects, experience, end credits, the offer sits inside the end credits before the doors, and projects take more screen height than experience @PF-1-ASM-01", async ({ page }) => {
  const tops = await page.locator("main > section[data-chapter]").evaluateAll((els) => els.map((e) => e.getBoundingClientRect().top + scrollY))
  expect([...tops].sort((a, b) => a - b)).toEqual(tops)
  const credits = page.locator('section[data-chapter="end-credits"]')
  const offer = await credits.locator("[data-offer]").boundingBox()
  const doors = await credits.locator("[data-doors]").boundingBox()
  expect(offer && doors && offer.y < doors.y).toBe(true)
  const h = async (c: string) => (await page.locator(`section[data-chapter="${c}"]`).boundingBox())!.height
  expect(await h("projects")).toBeGreaterThan(await h("experience"))
})
