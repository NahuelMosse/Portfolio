import { test, expect, type Page } from "@playwright/test"
import { BEAT_RUN, BEATS_PER_PROJECT, TURN_RUN } from "../features/portfolio/presentation/use-group-track"

// @PF-1-ASM-26: a project title is never cropped and never covered: at every beat its text box is inside the viewport, below the
// group strip and clear of the device; the terminal window is as tall as its output, with no dead black half.
const GROUPS = [
  { id: "apps", projects: ["grit", "club"] },
  { id: "landings", projects: ["cebador", "sonria", "miga"] },
  { id: "game", projects: ["guardia"] },
  { id: "tools", projects: ["motion-audit", "http-attack", "migrations-safe"] },
] as const
const SIZES = [
  { name: "390", width: 390, height: 844 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1920", width: 1920, height: 1080 },
  { name: "360", width: 360, height: 740 },
] as const
const HOLD = (BEATS_PER_PROJECT - 1) * BEAT_RUN
const STRIDE = HOLD + TURN_RUN
const totalRuns = (count: number) => count * HOLD + (count - 1) * TURN_RUN

async function scrollToRun(page: Page, group: string, count: number, project: number, beat: number) {
  const progress = count > 1 ? (project * STRIDE + beat * BEAT_RUN) / totalRuns(count) : (beat * BEAT_RUN) / HOLD
  await page.evaluate(
    ({ group, progress }) => {
      const section = document.getElementById(group)!
      window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY + (section.offsetHeight - window.innerHeight) * progress)
    },
    { group, progress },
  )
  await page.waitForTimeout(250)
}

for (const size of SIZES) {
  test(`at ${size.name} every project title is whole, below the strip and clear of the device @PF-1-ASM-26`, async ({ page }) => {
    await page.setViewportSize(size)
    await page.goto("/")
    await page.waitForLoadState("load")
    for (const { id, projects } of GROUPS) {
      for (const [order, project] of projects.entries()) {
        for (let beat = 0; beat < BEATS_PER_PROJECT; beat++) {
          await scrollToRun(page, id, projects.length, order, beat)
          const seen = await page.evaluate((project) => {
            const card = document.getElementById(project)!
            const range = document.createRange()
            range.selectNodeContents(card.querySelector(".show-word")!)
            const text = range.getBoundingClientRect()
            const line = card.querySelector(".show-word")!.getBoundingClientRect()
            const rig = card.querySelector('.show-rig[data-role="main"]')!.getBoundingClientRect()
            const tab = card.querySelector('.show-rig[data-role="main"] .show-tab')?.getBoundingClientRect()
            const strip = card.querySelector(".show-index")?.getBoundingClientRect().bottom ?? 0
            return { left: text.left, right: text.right, top: line.top, bottom: line.bottom, device: { left: rig.left, right: rig.right, top: Math.min(rig.top, tab?.top ?? rig.top), bottom: rig.bottom }, strip }
          }, project)
          const label = `${project} beat ${beat}`
          expect(seen.left, `${label} starts inside`).toBeGreaterThanOrEqual(0)
          expect(seen.right, `${label} ends inside`).toBeLessThanOrEqual(size.width)
          expect(seen.top, `${label} is below the strip`).toBeGreaterThanOrEqual(seen.strip - 1)
          const d = seen.device
          const covered = seen.left < d.right - 1 && seen.right > d.left + 1 && seen.top < d.bottom - 1 && seen.bottom > d.top + 1
          expect(covered, `${label} is not covered by the device`).toBe(false)
        }
      }
    }
  })
}

for (const size of SIZES.slice(0, 2)) {
  test(`at ${size.name} a terminal is as tall as its output, with no dead black half @PF-1-ASM-26`, async ({ page }) => {
    await page.setViewportSize(size)
    await page.goto("/")
    await page.waitForLoadState("load")
    for (const [order, project] of GROUPS[3].projects.entries()) {
      await scrollToRun(page, "tools", 3, order, 1)
      const fill = await page.evaluate((project) => {
        const card = document.getElementById(project)!
        const glass = card.querySelector('.show-rig[data-role="main"] .show-glass')!.getBoundingClientRect()
        const screen = card.querySelector('.show-rig[data-role="main"] .terminal-screen')!
        const last = [...screen.querySelectorAll(".terminal-line")].at(-1)!.getBoundingClientRect()
        return { empty: glass.bottom - last.bottom, height: glass.height }
      }, project)
      expect(fill.empty, `${project} leaves under a third of the window empty`).toBeLessThan(fill.height / 3)
    }
  })
}
