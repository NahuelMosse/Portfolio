import { test, expect, type Page } from "@playwright/test"

// Each group of projects is a headline and then all of its projects, shown by scrolling alone: wide, a pinned scene whose track
// carries the projects across; narrow or with reduced motion, the projects stacked as posters. No click is needed to see one.
const GROUPS = [
  { id: "apps", word: "Apps", count: "2 apps", projects: [{ id: "grit", name: "Grit" }, { id: "club", name: "ClubNahuelMosse" }] },
  {
    id: "landings",
    word: "Landings",
    count: "3 landings",
    projects: [{ id: "cebador", name: "Cebador" }, { id: "sonria", name: "Sonría" }, { id: "miga", name: "Miga" }],
  },
  { id: "game", word: "Game", count: "1 game", projects: [{ id: "guardia", name: "Guardia" }] },
]
const WIDE = { width: 1440, height: 900 }
const PHONE = { width: 390, height: 844 }
const WIDE_ROOM = 3.2

async function scrollToStop(page: Page, group: string, stop: number, stops: number) {
  await page.evaluate(
    ({ group, stop, stops }) => {
      const section = document.getElementById(group)!
      const top = section.getBoundingClientRect().top + window.scrollY
      window.scrollTo(0, top + (section.offsetHeight - window.innerHeight) * (stops > 1 ? stop / (stops - 1) : 0))
    },
    { group, stop, stops },
  )
  await page.waitForTimeout(300)
}

async function scrollToCard(page: Page, project: string) {
  await page.evaluate((project) => {
    const card = document.getElementById(project)!
    window.scrollTo(0, card.getBoundingClientRect().top + window.scrollY)
  }, project)
  await page.waitForTimeout(200)
}

async function expectOnScreen(page: Page, selector: string, label: string) {
  const box = await page.locator(selector).first().boundingBox()
  const size = page.viewportSize()!
  expect(box, `${label} has a box`).not.toBeNull()
  expect(box!.x + box!.width, `${label} reaches the screen`).toBeGreaterThan(0)
  expect(box!.x, `${label} starts inside the screen`).toBeLessThan(size.width)
  expect(box!.y + box!.height, `${label} is below the top`).toBeGreaterThan(0)
  expect(box!.y, `${label} is above the bottom`).toBeLessThan(size.height)
}

test.describe("project groups shown by scrolling", () => {
  test("wide, scrolling through a group carries each of its projects across the showcase, no click @PF-1-ASM-26", async ({ page }) => {
    await page.setViewportSize(WIDE)
    await page.goto("/")
    await page.waitForLoadState("load")
    for (const { id, word, count, projects } of GROUPS) {
      const section = page.locator(`section#${id}`)
      await expect(section.locator(".group-word"), `${id} headline`).toHaveText(word)
      await expect(section.locator(".group-count"), `${id} count`).toHaveText(count)
      await expect(section.locator(".group-line"), `${id} has its line`).not.toBeEmpty()
      expect((await section.boundingBox())!.height, `${id} costs a short scroll`).toBeLessThan(WIDE.height * WIDE_ROOM)
      for (const [stop, project] of projects.entries()) {
        const label = `${project.name} in ${id}`
        await scrollToStop(page, id, stop, projects.length)
        await expectOnScreen(page, `#${project.id} .show-rig[data-role="main"]`, `${label} device`)
        await expect(page.locator(`#${project.id} .show-copy h4`), `${label} full name`).toHaveText(project.name)
        await expect(page.locator(`#${project.id} .show-copy h4`), `${label} name is visible`).toBeVisible()
        await expect(page.locator(`#${project.id} .show-meta .stack`), `${label} line and stack are visible`).toBeVisible()
        await expect(section.locator(".group-word"), `${id} headline holds`).toBeVisible()
        if (projects.length > 1) {
          await expect(section.locator('.group-index li[aria-current="step"]'), `${label} index follows`).toContainText(project.name)
        }
      }
    }
  })

  test("narrow, the headline comes first and every project is a stacked poster reached by scrolling @PF-1-ASM-26", async ({ page }) => {
    await page.setViewportSize(PHONE)
    await page.goto("/")
    await page.waitForLoadState("load")
    for (const { id, word, count, projects } of GROUPS) {
      const section = page.locator(`section#${id}`)
      expect(await section.locator(".group-pin").evaluate((el) => getComputedStyle(el).position), `${id} is not pinned`).not.toBe("sticky")
      expect(await section.locator(".group-track").evaluate((el) => el.scrollWidth <= el.clientWidth), `${id} has no sideways swipe`).toBe(true)
      await expect(section.locator(".group-word")).toHaveText(word)
      await expect(section.locator(".group-count")).toHaveText(count)
      for (const project of projects) {
        const label = `${project.name} in ${id}`
        await scrollToCard(page, project.id)
        const card = page.locator(`#${project.id}`)
        expect((await card.boundingBox())!.height, `${label} is about a screen tall`).toBeLessThanOrEqual(PHONE.height + 1)
        await expectOnScreen(page, `#${project.id} .show-rig[data-role="main"]`, `${label} device`)
        await expect(card.locator(".show-word"), `${label} full name`).toHaveText(project.name)
        await expect(card.locator(".show-meta .stack"), `${label} stack`).toBeVisible()
      }
    }
  })

  test("with reduced motion every width stacks the projects @PF-1-ASM-26", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.setViewportSize(WIDE)
    await page.goto("/")
    await page.waitForLoadState("load")
    for (const { id, projects } of GROUPS) {
      expect(await page.locator(`section#${id} .group-pin`).evaluate((el) => getComputedStyle(el).position), `${id} is not pinned`).not.toBe("sticky")
      for (const project of projects) {
        await scrollToCard(page, project.id)
        await expect(page.locator(`#${project.id} .show-meta .stack`), `${project.name} stack`).toBeVisible()
      }
    }
  })

  test("the pages of the live site and the repositories are linked from their project @PF-1-ASM-26", async ({ page }) => {
    await page.setViewportSize(PHONE)
    await page.goto("/")
    await page.waitForLoadState("load")
    const LINKS: Record<string, string[]> = {
      sonria: ["https://nahuelmosse.github.io/sonria/", "https://github.com/NahuelMosse/sonria"],
      miga: ["https://nahuelmosse.github.io/miga/", "https://github.com/NahuelMosse/miga"],
      club: ["https://github.com/NahuelMosse/ClubNahuelMosse"],
      guardia: ["https://nahuelmosse.itch.io/triaje"],
    }
    for (const [project, hrefs] of Object.entries(LINKS)) {
      for (const href of hrefs) {
        const link = page.locator(`#${project} a[href="${href}"]`)
        await expect(link, `${project} links to ${href}`).toHaveCount(1)
        await expect(link).toHaveAttribute("target", "_blank")
      }
    }
  })
})
