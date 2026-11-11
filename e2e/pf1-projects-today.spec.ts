import { test, expect, type Page } from "@playwright/test"

// The PF-1 project tests whose behavior the site still has, restated against the page as it stands: project links, group
// headlines, the three tools in plain type, and the certifications band (English wording).

const PHONE = { width: 390, height: 844 }
const WIDE = { width: 1440, height: 900 }
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

async function expectOnScreen(page: Page, selector: string, label: string) {
  const box = await page.locator(selector).first().boundingBox()
  const size = page.viewportSize()!
  expect(box, `${label} has a box`).not.toBeNull()
  expect(box!.x + box!.width, `${label} reaches the screen`).toBeGreaterThan(0)
  expect(box!.x, `${label} starts inside the screen`).toBeLessThan(size.width)
  expect(box!.y + box!.height, `${label} is below the top`).toBeGreaterThan(0)
  expect(box!.y, `${label} is above the bottom`).toBeLessThan(size.height)
}

test("each project scene links to its live page or its repository, except Grit, which is private @PF-1-S5 @PF-8-S1", async ({ page }) => {
  await page.goto("/")
  const expected: Record<string, string | null> = {
    "motion-audit": "github.com/NahuelMosse/motion-audit",
    grit: null,
    guardia: "nahuelmosse.itch.io/triaje",
    cebador: "nahuelmosse.github.io/cebador-landing",
    club: "github.com/NahuelMosse/ClubNahuelMosse",
  }
  for (const [id, href] of Object.entries(expected)) {
    const links = await page.locator(`article[data-project="${id}"] a`).evaluateAll((all) => all.map((a) => (a as HTMLAnchorElement).href))
    if (href === null) expect(links, `${id} has no link`).toHaveLength(0)
    else expect(links.some((l) => l.includes(href)), `${id} links to ${href}`).toBe(true)
  }
})

test("Sonría and Miga open their live site and their repository, and the other projects keep their links @PF-1-ASM-26 @PF-8-S1", async ({ page }) => {
  await page.goto("/")
  await page.waitForLoadState("load")
  const LINKS = [
    { group: "landings", projects: [
      { id: "cebador", hrefs: ["https://nahuelmosse.github.io/cebador-landing/"] },
      { id: "sonria", hrefs: ["https://nahuelmosse.github.io/sonria/", "https://github.com/NahuelMosse/sonria"] },
      { id: "miga", hrefs: ["https://nahuelmosse.github.io/miga/", "https://github.com/NahuelMosse/miga"] },
    ] },
    { group: "game", projects: [{ id: "guardia", hrefs: ["https://nahuelmosse.itch.io/triaje"] }] },
    { group: "apps", projects: [
      { id: "grit", hrefs: [] },
      { id: "club", hrefs: ["https://github.com/NahuelMosse/ClubNahuelMosse"] },
    ] },
    { group: "tools", projects: [
      { id: "motion-audit", hrefs: ["https://github.com/NahuelMosse/motion-audit"] },
      { id: "http-attack", hrefs: ["https://github.com/NahuelMosse/http-attack"] },
      { id: "migrations-safe", hrefs: ["https://github.com/NahuelMosse/migrations-safe"] },
    ] },
  ]
  for (const viewport of [PHONE, WIDE]) {
    await page.setViewportSize(viewport)
    for (const { group, projects } of LINKS) {
      for (const [stop, { id, hrefs }] of projects.entries()) {
        await scrollToStop(page, group, stop, projects.length)
        const card = page.locator(`section#${group} article[data-project="${id}"]`)
        for (const href of hrefs) {
          const link = card.locator(`a[href="${href}"]`)
          await expect(link, `${id} at ${viewport.width} links to ${href}`).toHaveCount(1)
          await expect(link, `${id} at ${viewport.width} shows ${href}`).toBeVisible()
          await expect(link).toHaveAttribute("target", "_blank")
        }
        if (hrefs.length === 0) await expect(card.locator("a"), `${id} is private, no link`).toHaveCount(0)
      }
    }
  }
})

test("wide, scrolling through a group carries each of its projects across the showcase, no click @PF-1-ASM-26 @PF-8-S1", async ({ page }) => {
  const GROUPS = [
    { id: "apps", word: "Apps", count: "2 apps", projects: [{ id: "grit", name: "Grit" }, { id: "club", name: "ClubNahuelMosse" }] },
    { id: "landings", word: "Websites", count: "3 websites", projects: [{ id: "cebador", name: "Cebador" }, { id: "sonria", name: "Sonría" }, { id: "miga", name: "Miga" }] },
    { id: "game", word: "Game", count: "1 game", projects: [{ id: "guardia", name: "Triaje" }] },
  ]
  await page.setViewportSize(WIDE)
  await page.goto("/")
  await page.waitForLoadState("load")
  for (const { id, word, count, projects } of GROUPS) {
    const section = page.locator(`section#${id}`)
    await expect(section.locator(".group-word"), `${id} headline`).toHaveText(word)
    await expect(section.locator(".group-count"), `${id} count`).toHaveText(count)
    await expect(section.locator(".group-line"), `${id} has its line`).not.toBeEmpty()
    expect(await section.evaluate((el) => el.getBoundingClientRect().height), `${id} costs a short scroll`).toBeLessThan(WIDE.height * WIDE_ROOM)
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

const TOOLS = [
  {
    id: "motion-audit",
    texts: [
      "Checks that a website moves the way it should: every button responds when pressed, and nothing stutters.",
      "A site can look fine in a screenshot and still feel broken to use.",
      "I built it and published it for other developers to use.",
      "It watches the real page in a real browser, frame by frame, and reports what feels wrong.",
    ],
    stack: ["Node.js", "Playwright", "Claude Code skill"],
  },
  {
    id: "http-attack",
    texts: [
      "Attacks your back end the way a hacker would, before a real one does.",
      "Most security holes live in the cases nobody thought to test.",
      "I built it and published it for other developers to use.",
      "It tries bad input, request floods and other users' accounts, then reports what broke and how serious it is.",
    ],
    stack: ["Node.js", "No runtime dependencies", "Claude Code skill"],
  },
  {
    id: "migrations-safe",
    texts: [
      "Tests database changes on a copy before they touch the real one.",
      "One careless change to a database can lose customer data or stop a running business.",
      "I built it and published it for other developers to use.",
      "It checks the change, then runs it on a copy of the data first, on every major database.",
    ],
    stack: ["Node.js", "SQL", "Claude Code skill"],
  },
]
const TOOL_VIEWPORTS = [{ width: 1910, height: 912 }]
const WALK = [0.02, 0.2, 0.4, 0.6, 0.8, 0.98]

async function scrollThrough(page: Page, id: string, progress: number) {
  await page.evaluate(
    ({ id, progress }) => {
      const section = document.getElementById(id)!
      const top = section.getBoundingClientRect().top + window.scrollY
      window.scrollTo(0, top + (section.offsetHeight - window.innerHeight) * progress)
    },
    { id, progress },
  )
  await page.waitForTimeout(250)
}

for (const viewport of TOOL_VIEWPORTS) {
  test(`tools at ${viewport.width}x${viewport.height} show an illustration, plain stack words and buttons, with no terminal or monospace @PF-1-ASM-32 @PF-8-S1`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto("/")
    await page.waitForLoadState("load")

    for (const tool of TOOLS) {
      const card = page.locator(`article[data-project="${tool.id}"]`)
      await expect(card.locator('[data-frame="terminal"], .terminal, pre'), `${tool.id} has no terminal`).toHaveCount(0)
      const mono = await card.evaluate((root) =>
        [...root.querySelectorAll("*")].filter((el) => /mono|courier/i.test(getComputedStyle(el).fontFamily)).map((el) => el.className || el.tagName),
      )
      expect(mono, `${tool.id} has no monospace element`).toEqual([])
      const text = await card.evaluate((root) => root.textContent ?? "")
      for (const line of tool.texts) expect(text, `${tool.id} copy`).toContain(line)
    }

    const seen = new Set<string>()
    for (const progress of WALK) {
      await scrollThrough(page, "tools", progress)
      const current = page.locator("#tools article[data-current]")
      const id = (await current.getAttribute("data-project"))!
      seen.add(id)
      const tool = TOOLS.find((entry) => entry.id === id)!
      const label = `${id} at ${progress}`

      const art = current.locator("picture[data-plate] img")
      await expect(art, `${label} illustration`).toHaveCount(1)
      await expect.poll(() => art.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0), `${label} illustration loaded`).toBe(true)
      expect(await current.locator("picture[data-plate]").evaluate((el) => getComputedStyle(el).display), `${label} illustration shown`).not.toBe("none")

      await expect(current.locator("[data-stack] li"), `${label} stack words`).toHaveText(tool.stack)
      for (const link of ["npm", "GitHub"]) {
        const button = current.getByRole("link", { name: new RegExp(`^${link} →$`) })
        await expect(button, `${label} ${link} link`).toBeVisible()
        expect(await button.getAttribute("href"), `${label} ${link} href`).toContain(id)
      }

      const inside = await current.evaluate(
        (root, vp) => {
          const targets = [".show-copy", "[data-stack]", ".show-meta a"]
          return targets.flatMap((selector) =>
            [...root.querySelectorAll(selector)].map((el) => {
              const box = el.getBoundingClientRect()
              return { selector, ok: box.left >= -1 && box.right <= vp.width + 1 && box.top >= -1 && box.bottom <= vp.height + 1 }
            }),
          )
        },
        viewport,
      )
      expect(inside.filter((entry) => !entry.ok), `${label} stays inside the viewport`).toEqual([])
    }
    expect([...seen].sort(), "the walk reaches the three tools").toEqual(TOOLS.map((tool) => tool.id).sort())
  })
}

for (const size of [{ name: "390", width: 390, height: 844 }, { name: "1440", width: 1440, height: 900 }]) {
  test(`at ${size.name} the certifications are rendered once, in the rotating band, and it never shows a gap @PF-1-ASM-26 @PF-8-S1`, async ({ page }) => {
    await page.setViewportSize(size)
    await page.goto("/")
    await expect(page.locator("[data-credits-sheet]")).toHaveCount(0)
    const band = page.locator('[data-band="certifications"]')
    const listed = (await band.locator("ul.sr-only li").allTextContents()).map((text) => text.trim())
    expect(listed).toEqual(["EF SET C2 Proficient", "English Level 8 · Liceo Cultural Británico", "Applied Software Architecture · Platzi"])
    await expect(page.locator("section[data-chapter='end-credits'] h3", { hasText: /^Certifications$/ })).toHaveCount(0)
    for (const id of ["studies", "certifications"]) {
      // The copies are measured once the band's fonts and images have laid out, so the width is polled.
      await expect
        .poll(async () => {
          const copies = await page.locator(`[data-band="${id}"] .roll-list`).evaluateAll((lists) => lists.map((list) => list.getBoundingClientRect().width))
          return copies.slice(1).reduce((sum, width) => sum + width, 0)
        }, { message: `${id} band covers the viewport while it loops` })
        .toBeGreaterThanOrEqual(size.width)
    }
  })
}
