import { test, expect, type Page } from "@playwright/test"

// The projects are four chapters by kind. Inside a chapter the projects are switched with clicks; the scroll only walks the
// beats of the one on show.
const GROUPS = [
  { id: "apps", tabs: [{ id: "grit", label: "Grit" }, { id: "club", label: "Club" }], beats: 4 },
  {
    id: "landings",
    tabs: [
      { id: "cebador", label: "Cebador" },
      { id: "sonria", label: "Sonría" },
      { id: "miga", label: "Miga" },
    ],
    beats: 4,
  },
  { id: "game", tabs: [{ id: "guardia", label: "Guardia" }], beats: 4 },
  { id: "dev-kit", tabs: [{ id: "dev-kit", label: "Dev kit" }], beats: 6 },
]
const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
]
const MIN_TAP = 44
const SHORT_SCROLL = 3.2
const PAGE_CEILING = 15000
const SCREEN_PREFIX: Record<string, string> = { grit: "grit-", club: "club-", cebador: "cebador-", sonria: "sonria-", miga: "miga-", guardia: "triaje-" }

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

test.describe("grouped project chapters", () => {
  test("at 390 and 1440 the projects are four chapters by kind, apps, landings, game and dev kit, each one short pinned scene whose beats follow the scroll and whose tabs name its projects @PF-1-ASM-26", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("load")

    const order = await page.locator('section[data-chapter="projects"] section.show').evaluateAll((els) => els.map((el) => el.id))
    expect(order, "the chapters come in this order").toEqual(GROUPS.map((group) => group.id))
    await expect(page.locator("section.show input, section.show textarea, section.show select"), "interaction is only clicks").toHaveCount(0)

    for (const viewport of VIEWPORTS) {
      await page.setViewportSize(viewport)
      for (const { id, tabs, beats } of GROUPS) {
        const label = `${id} at ${viewport.width}`
        const section = page.locator(`section#${id}`)
        await expect(section, `${label} is a group`).toHaveAttribute("data-group", id)
        const height = (await section.boundingBox())!.height
        expect(height, `${label} pins for more than a screen`).toBeGreaterThan(viewport.height * 2)
        expect(height, `${label} is a short scroll`).toBeLessThan(viewport.height * SHORT_SCROLL)
        expect(await section.locator("[data-scene-screen]").evaluate((el) => getComputedStyle(el).position), `${label} stage sticks`).toBe("sticky")

        await scrollThrough(page, id, 0)
        await expect(section, `${label} starts on the first beat`).toHaveAttribute("data-beat", "0")
        await scrollThrough(page, id, 0.99)
        await expect(section, `${label} ends on the last beat`).toHaveAttribute("data-beat", String(beats - 1))
        await expect(section.locator(".show-beat[data-on]"), `${label} one caption on`).toHaveCount(1)
        await expect(section.locator(".show-beat[data-on]"), `${label} the caption on is shown`).toBeVisible()

        const buttons = section.locator(".show-index button")
        await expect(buttons, `${label} one tab per project`).toHaveCount(tabs.length)
        for (const [position, tab] of tabs.entries()) {
          await expect(buttons.nth(position), `${label} tab ${tab.label}`).toContainText(tab.label)
        }
        await expect(section.locator('.show-index button[aria-pressed="true"]'), `${label} one tab is on`).toHaveCount(1)
        await expect(section, `${label} shows its first project`).toHaveAttribute("data-project", tabs[0].id)
      }
    }
  })

  test("a click on a tab swaps the project on show with its own screens and links, and leaves the scroll where it was @PF-1-ASM-26", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("load")

    for (const viewport of VIEWPORTS) {
      await page.setViewportSize(viewport)
      for (const { id, tabs } of GROUPS.filter((group) => group.tabs.length > 1)) {
        const section = page.locator(`section#${id}`)
        for (const [position, tab] of tabs.entries()) {
          const label = `${tab.label} at ${viewport.width}`
          await scrollThrough(page, id, 0.99)
          const before = await page.evaluate(() => window.scrollY)
          await section.locator(".show-index button").nth(position).click()
          await expect(section, `${label} is on show`).toHaveAttribute("data-project", tab.id)
          await expect(section.locator(".show-index button").nth(position), `${label} tab is pressed`).toHaveAttribute("aria-pressed", "true")
          await expect(section.locator('.show-index button[aria-pressed="true"]'), `${label} only one tab is pressed`).toHaveCount(1)
          expect(Math.abs((await page.evaluate(() => window.scrollY)) - before), `${label} the scroll holds`).toBeLessThan(4)
          const screen = section.locator('.show-rig[data-role="main"] .show-screen[data-on] img').first()
          await expect(screen, `${label} shows its own screen`).toHaveAttribute("src", new RegExp(SCREEN_PREFIX[tab.id]))
        }
      }
    }
  })

  test("Sonría and Miga open their live site and their repository, and the other projects keep their links @PF-1-ASM-26", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("load")
    const LINKS = [
      { group: "landings", project: "sonria", hrefs: ["https://nahuelmosse.github.io/sonria/", "https://github.com/NahuelMosse/sonria"] },
      { group: "landings", project: "miga", hrefs: ["https://nahuelmosse.github.io/miga/", "https://github.com/NahuelMosse/miga"] },
      { group: "landings", project: "cebador", hrefs: ["https://nahuelmosse.github.io/cebador-landing/"] },
      { group: "game", project: "guardia", hrefs: ["https://nahuelmosse.itch.io/triaje"] },
      { group: "apps", project: "club", hrefs: ["https://github.com/NahuelMosse/ClubNahuelMosse"] },
      {
        group: "dev-kit",
        project: "dev-kit",
        hrefs: ["https://github.com/NahuelMosse/motion-audit", "https://github.com/NahuelMosse/http-attack", "https://github.com/NahuelMosse/migrations-safe"],
      },
    ]
    for (const viewport of VIEWPORTS) {
      await page.setViewportSize(viewport)
      for (const { group, project, hrefs } of LINKS) {
        const section = page.locator(`section#${group}`)
        const tab = GROUPS.find((entry) => entry.id === group)!.tabs.findIndex((entry) => entry.id === project)
        await scrollThrough(page, group, 0.99)
        await section.locator(".show-index button").nth(tab).click()
        for (const href of hrefs) {
          const link = section.locator(`a[href="${href}"]`)
          await expect(link, `${project} at ${viewport.width} links to ${href}`).toHaveCount(1)
          await expect(link).toBeVisible()
          await expect(link).toHaveAttribute("target", "_blank")
        }
      }
    }
  })

  test("at 390 every tab is a tap of at least 44 by 44 px @PF-1-ASM-26", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS[0])
    await page.goto("/")
    await page.waitForLoadState("load")
    for (const { id } of GROUPS) {
      await scrollThrough(page, id, 0.5)
      const boxes = await page.locator(`section#${id} .show-index button`).evaluateAll((els) => els.map((el) => el.getBoundingClientRect()))
      expect(boxes.length, `${id} has tabs`).toBeGreaterThan(0)
      for (const box of boxes) {
        expect(box.width, `${id} tab width`).toBeGreaterThanOrEqual(MIN_TAP)
        expect(box.height, `${id} tab height`).toBeGreaterThanOrEqual(MIN_TAP)
      }
    }
  })

  test("the real screens of the landings and the game are sharp at twice their displayed size @PF-1-ASM-26", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("load")
    const SHARP = [
      { group: "landings", tab: 1, id: "sonria" },
      { group: "landings", tab: 2, id: "miga" },
      { group: "game", tab: 0, id: "guardia" },
    ]
    for (const viewport of VIEWPORTS) {
      await page.setViewportSize(viewport)
      for (const { group, tab, id } of SHARP) {
        const section = page.locator(`section#${group}`)
        await scrollThrough(page, group, 0.5)
        await section.locator(".show-index button").nth(tab).click()
        const screen = section.locator('.show-rig[data-role="main"] .show-screen[data-on] img').first()
        await expect(screen).toBeVisible()
        await expect.poll(() => screen.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0), { message: `${id} loads` }).toBe(true)
        const { natural, shown } = await screen.evaluate((img: HTMLImageElement) => ({ natural: img.naturalWidth, shown: img.clientWidth }))
        expect(natural, `${id} at ${viewport.width}: ${natural}px for ${shown}px shown`).toBeGreaterThanOrEqual(shown * 2)
      }
    }
  })

  test("under reduced motion each group is a still: the stage does not stick, every caption is on the page, nothing is tilted or moved, and the tabs still switch @PF-1-ASM-26", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    for (const viewport of VIEWPORTS) {
      await page.setViewportSize(viewport)
      await page.goto("/")
      await page.waitForLoadState("load")

      for (const { id, beats } of GROUPS) {
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

      const landings = page.locator("section#landings")
      await landings.evaluate((el) => el.scrollIntoView())
      await landings.locator(".show-index button").nth(2).click()
      await expect(landings, `miga at ${viewport.width} switches under reduced motion`).toHaveAttribute("data-project", "miga")
    }
  })

  test("experience is one compact, scannable band with the five employers, their role, period and one line each, and the whole page is clearly shorter @PF-1-ASM-26", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("load")
    const CEILING = { 390: 1.6, 1440: 1.3 } as const

    for (const viewport of VIEWPORTS) {
      await page.setViewportSize(viewport)
      const label = `at ${viewport.width}`
      const section = page.locator("section#experience")
      const height = (await section.boundingBox())!.height
      expect(height, `experience ${label} is ${height}px`).toBeLessThanOrEqual(viewport.height * CEILING[viewport.width as 390 | 1440])

      const employers = section.locator("article[data-employer]")
      await expect(employers, `five employers ${label}`).toHaveCount(5)
      for (const employer of await employers.all()) {
        await employer.scrollIntoViewIfNeeded()
        for (const field of ["[data-employer-title]", "[data-employer-period]", '[data-field="what"]']) {
          await expect(employer.locator(field), `${field} ${label}`).toBeVisible()
        }
      }
      expect(await page.evaluate(() => document.documentElement.scrollHeight), `the page ${label}`).toBeLessThanOrEqual(PAGE_CEILING)
    }
  })
})
