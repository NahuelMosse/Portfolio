import { test, expect, type Page } from "@playwright/test"
import { BEAT_RUN, BEATS_PER_PROJECT, TURN_RUN } from "../features/portfolio/presentation/use-group-track"

// Each group is one pinned scene scrubbed by the scroll. Between two projects the next one wipes in over the one on show, which
// stays opaque under it: two compositions are never ghosted on top of each other and two texts are never on screen together.
const GROUPS = [
  { id: "apps", projects: ["grit", "club"] },
  { id: "landings", projects: ["cebador", "sonria", "miga"] },
  { id: "game", projects: ["guardia"] },
]
const SIZES = [
  { name: "390", width: 390, height: 844 },
  { name: "1440", width: 1440, height: 900 },
]
const HOLD = (BEATS_PER_PROJECT - 1) * BEAT_RUN
const STRIDE = HOLD + TURN_RUN
const TEXT_GHOST = 0.04
const FRAMES_PER_TURN = 12

const totalRuns = (count: number) => count * HOLD + (count - 1) * TURN_RUN

async function scrollToProgress(page: Page, group: string, progress: number) {
  await page.evaluate(
    ({ group, progress }) => {
      const section = document.getElementById(group)!
      const top = section.getBoundingClientRect().top + window.scrollY
      window.scrollTo(0, top + (section.offsetHeight - window.innerHeight) * progress)
    },
    { group, progress },
  )
  await page.waitForTimeout(120)
}

async function copiesOnScreen(page: Page, group: string) {
  return page.evaluate((group) => {
    const cards = [...document.querySelectorAll(`#${group} .group-card`)] as HTMLElement[]
    return cards
      .filter((card) => getComputedStyle(card).visibility === "visible")
      .map((card) => {
        const copy = card.querySelector(".show-copy") as HTMLElement
        const field = card.querySelector(".group-field") as HTMLElement
        return { id: card.id, copy: Number(getComputedStyle(copy).opacity), field: Number(getComputedStyle(field).opacity) }
      })
  }, group)
}

test.describe("projects wipe in over each other", () => {
  for (const size of SIZES) {
    test(`at ${size.name} every project of every group is reached by scrolling alone @PF-1-ASM-26`, async ({ page }) => {
      await page.setViewportSize(size)
      await page.goto("/")
      await page.waitForLoadState("load")
      for (const { id, projects } of GROUPS) {
        expect(await page.locator(`#${id} .group-pin`).evaluate((el) => getComputedStyle(el).position), `${id} is pinned`).toBe("sticky")
        for (const [order, project] of projects.entries()) {
          const progress = projects.length > 1 ? (order * STRIDE) / totalRuns(projects.length) : 0
          await scrollToProgress(page, id, progress)
          const box = (await page.locator(`#${project} .show-rig[data-role="main"]`).boundingBox())!
          expect(box, `${project} device has a box`).not.toBeNull()
          expect(box.x + box.width, `${project} device reaches the screen`).toBeGreaterThan(0)
          expect(box.x, `${project} device starts inside the screen`).toBeLessThan(size.width)
          expect(box.y, `${project} device is above the bottom`).toBeLessThan(size.height)
          await expect(page.locator(`#${project} .show-copy h4`), `${project} is named`).toHaveText(/\S/)
          const visible = (await copiesOnScreen(page, id)).filter((entry) => entry.copy > TEXT_GHOST)
          expect(visible.map((entry) => entry.id), `${project} alone has its text at rest`).toEqual([project])
        }
      }
    })

    test(`at ${size.name} a turn never shows two texts nor a ghosted field @PF-1-ASM-26`, async ({ page }) => {
      await page.setViewportSize(size)
      await page.goto("/")
      await page.waitForLoadState("load")
      for (const { id, projects } of GROUPS.filter((group) => group.projects.length > 1)) {
        const total = totalRuns(projects.length)
        for (let project = 0; project < projects.length - 1; project++) {
          for (let frame = 0; frame <= FRAMES_PER_TURN; frame++) {
            const at = project * STRIDE + HOLD + (TURN_RUN * frame) / FRAMES_PER_TURN
            await scrollToProgress(page, id, at / total)
            const cards = await copiesOnScreen(page, id)
            const texts = cards.filter((entry) => entry.copy > TEXT_GHOST)
            expect(texts.length, `${id} turn ${project} frame ${frame}: texts on screen ${JSON.stringify(texts)}`).toBeLessThanOrEqual(1)
            for (const card of cards) expect(card.field, `${card.id} field stays opaque`).toBe(1)
          }
        }
      }
    })
  }

  test("with reduced motion each project is a still with its text and no transform @PF-1-ASM-26", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.setViewportSize(SIZES[1])
    await page.goto("/")
    await page.waitForLoadState("load")
    for (const { id, projects } of GROUPS) {
      expect(await page.locator(`#${id} .group-pin`).evaluate((el) => getComputedStyle(el).position), `${id} is not pinned`).not.toBe("sticky")
      for (const project of projects) {
        const card = page.locator(`article#${project}`)
        await expect.poll(() => card.evaluate((el) => getComputedStyle(el).transform), `${project} does not move`).toBe("none")
        await expect
          .poll(() => card.locator(".show-copy").evaluate((el) => getComputedStyle(el).opacity), `${project} text is whole`)
          .toBe("1")
      }
    }
  })
})
