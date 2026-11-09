import { test, expect, type Page } from "@playwright/test"

// Every project tells its story in three beats, and its stack and links stay on show through all three, as the tools do.
const GROUPS = [
  { id: "apps", projects: ["grit", "club"] },
  { id: "landings", projects: ["cebador", "sonria", "miga"] },
  { id: "game", projects: ["guardia"] },
  { id: "tools", projects: ["motion-audit", "http-attack", "migrations-safe"] },
]
const VIEWPORTS = [
  { width: 1910, height: 912 },
  { width: 390, height: 844 },
]
const BEATS = 3

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

test.describe("three beats per project", () => {
  test("at 1910 and 390 every project has three beats and three ticks, the scroll walks all three, and its stack and links are visible on each of them @PF-1-ASM-43", async ({ page }) => {
    test.setTimeout(300_000)
    for (const viewport of VIEWPORTS) {
      await page.setViewportSize(viewport)
      await page.goto("/")
      await page.waitForLoadState("load")
      for (const { id, projects } of GROUPS) {
        const section = page.locator(`section#${id}`)
        for (const project of projects) {
          const card = section.locator(`article[data-project="${project}"]`)
          await expect(card.locator(".show-beat"), `${project} at ${viewport.width} has three beats`).toHaveCount(BEATS)
          await expect(card.locator(".show-ticks i"), `${project} at ${viewport.width} has three ticks`).toHaveCount(BEATS)
        }
        const seen = new Map<string, Set<string>>()
        for (let step = 0; step <= 60; step++) {
          await scrollThrough(page, id, step / 60)
          await page.waitForTimeout(150)
          const current = await section.evaluate((el) => {
            const node = el.querySelector("article[data-current]")
            return node ? { project: node.getAttribute("data-project"), beat: node.getAttribute("data-beat") } : null
          })
          if (!current?.project || current.beat === null) continue
          const { project, beat } = current
          const card = section.locator(`article[data-project="${project}"]`)
          if (!seen.has(project)) seen.set(project, new Set())
          if (seen.get(project)!.has(beat)) continue
          seen.get(project)!.add(beat)
          const label = `${project} beat ${beat} at ${viewport.width}`
          await expect(card.locator(".show-beat[data-on]"), `${label} one beat on`).toHaveCount(1)
          await expect(card.locator(".show-meta .stack"), `${label} stack`).toBeVisible()
          for (const link of await card.locator(".show-meta a").all()) await expect(link, `${label} link`).toBeVisible()
        }
        for (const project of projects) {
          expect([...(seen.get(project) ?? [])].sort(), `${project} at ${viewport.width} walks its three beats`).toEqual(["0", "1", "2"])
        }
      }
    }
  })
})
