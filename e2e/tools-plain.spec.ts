import { test, expect, type Page } from "@playwright/test"

// The three tools are shown to business owners and HR people: an illustration, the stack in plain words and the links as buttons.
// No terminal window and no monospace type.
const TOOLS = [
  {
    id: "motion-audit",
    texts: [
      "Checks that a website moves the way it should: every button answers when touched, and nothing stutters.",
      "A site can look fine in a screenshot and still feel broken in the hand.",
      "I built it and published it for other developers to use.",
      "It watches the real page in a real browser, frame by frame, and reports what feels wrong.",
    ],
    stack: ["Node.js", "Playwright", "Claude Code skill"],
  },
  {
    id: "http-attack",
    texts: [
      "Attacks a system's back end the way a stranger would, before a stranger does.",
      "Most security holes live in the cases nobody thought to test.",
      "I built it and published it for other developers to use.",
      "It tries bad data, rushed requests and someone else's account, and says what broke and how serious it is.",
    ],
    stack: ["Node.js", "No runtime dependencies", "Claude Code skill"],
  },
  {
    id: "migrations-safe",
    texts: [
      "Rehearses changes to a database on a copy before they touch the real one.",
      "One careless change to a database can lose customer data or stop a running business.",
      "I built it and published it for other developers to use.",
      "It checks the change, then runs it on a copy of the data first, on every major database.",
    ],
    stack: ["Node.js", "SQL", "Claude Code skill"],
  },
]
const VIEWPORTS = [
  { width: 1910, height: 912 },
  { width: 390, height: 844 },
]
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

for (const viewport of VIEWPORTS) {
  test(`tools at ${viewport.width}x${viewport.height} show an illustration, plain stack words and buttons, with no terminal or monospace @PF-1-ASM-32`, async ({ page }) => {
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
    for (const progress of WALK.flatMap((step) => [step])) {
      await scrollThrough(page, "tools", progress)
      const current = page.locator("#tools .group-card[data-current]")
      const id = (await current.getAttribute("data-project"))!
      seen.add(id)
      const tool = TOOLS.find((entry) => entry.id === id)!
      const label = `${id} at ${progress}`

      const art = current.locator("picture[data-plate] img")
      await expect(art, `${label} illustration`).toHaveCount(1)
      await expect.poll(() => art.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0), `${label} illustration loaded`).toBe(true)
      expect(await current.locator("picture[data-plate]").evaluate((el) => getComputedStyle(el).display), `${label} illustration shown`).not.toBe("none")

      const stack = current.locator("[data-stack] li")
      await expect(stack, `${label} stack words`).toHaveText(tool.stack)
      for (const link of ["npm", "GitHub"]) {
        const button = current.getByRole("link", { name: link, exact: true })
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
