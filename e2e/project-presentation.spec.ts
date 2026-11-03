import { test, expect, type Page } from "@playwright/test"
import { BEAT_RUN, BEATS_PER_PROJECT, TURN_RUN } from "../features/portfolio/presentation/use-group-track"

// @PF-1-ASM-26: every project is shown as its product, large and legible, walking a different screen at each beat; the tools are
// terminals with real output; the private kit is not on the page; the certifications are rendered once.
const GROUPS = [
  { id: "apps", projects: ["grit", "club"], device: "phone" },
  { id: "landings", projects: ["cebador", "sonria", "miga"], device: "browser" },
  { id: "game", projects: ["guardia"], device: "browser" },
  { id: "tools", projects: ["motion-audit", "http-attack", "migrations-safe"], device: "terminal" },
] as const
const SIZES = [
  { name: "390", width: 390, height: 844 },
  { name: "1440", width: 1440, height: 900 },
] as const
const HOLD = (BEATS_PER_PROJECT - 1) * BEAT_RUN
const STRIDE = HOLD + TURN_RUN
const totalRuns = (count: number) => count * HOLD + (count - 1) * TURN_RUN

async function scrollToRun(page: Page, group: string, count: number, project: number, beat: number) {
  const progress = count > 1 ? (project * STRIDE + beat * BEAT_RUN) / totalRuns(count) : (beat * BEAT_RUN) / HOLD
  await page.evaluate(
    ({ group, progress, count }) => {
      const section = document.getElementById(group)!
      const top = section.getBoundingClientRect().top + window.scrollY
      const run = section.offsetHeight - window.innerHeight
      window.scrollTo(0, top + run * (count > 1 ? progress : progress * (1 - 0)))
    },
    { group, progress, count },
  )
  await page.waitForTimeout(160)
}

// What the visitor sees of a project: its devices that are on screen, with the screen each one shows.
async function seen(page: Page, project: string) {
  return page.evaluate((project) => {
    const card = document.getElementById(project)!
    return [...card.querySelectorAll(".show-rig")]
      .filter((rig) => {
        for (let node: Element | null = rig; node && node !== document.body; node = node.parentElement) {
          if (getComputedStyle(node).visibility === "hidden" || getComputedStyle(node).display === "none") return false
        }
        return true
      })
      .map((rig) => {
        const box = rig.getBoundingClientRect()
        const on = rig.querySelector(".show-screen[data-on]")
        const key = on?.querySelector("img")?.getAttribute("src") ?? on?.textContent?.trim() ?? ""
        return { device: rig.getAttribute("data-device"), role: rig.getAttribute("data-role"), width: box.width, height: box.height, left: box.left, key }
      })
  }, project)
}

test.describe("the tools are terminals and the private kit is not on the page", () => {
  test("a Tools group has three terminals with real output and no kit wording anywhere @PF-1-ASM-26", async ({ page }) => {
    await page.setViewportSize(SIZES[1])
    await page.goto("/")
    const group = page.locator('section[data-group="tools"]')
    await expect(group).toHaveCount(1)
    await expect(group.locator("article.group-card")).toHaveCount(3)
    for (const id of GROUPS[3].projects) {
      const card = group.locator(`article#${id}`)
      await expect(card.locator('.show-rig[data-device="terminal"][data-role="main"]'), `${id} has its terminal`).toHaveCount(1)
      const output = await card.locator(".terminal-line").allTextContents()
      expect(output.length, `${id} shows real output`).toBeGreaterThanOrEqual(8)
      await expect(card.locator('a[href^="https://www.npmjs.com/package/"]')).toHaveCount(1)
      await expect(card.locator('a[href^="https://github.com/NahuelMosse/"]')).toHaveCount(1)
      await expect(card.locator(".terminal-line", { hasText: `npm i -D ${id}` }).first()).toHaveCount(1)
    }
    const words = await page.evaluate(() => document.documentElement.textContent ?? "")
    expect(words).not.toMatch(/dev kit|card is the specification|\bPF-1\b|\bhooks?\b|red tests?|\bthe gate\b|kit-scene|my kit/i)
    await expect(page.locator('[data-group="dev-kit"], #dev-kit')).toHaveCount(0)
    await expect(page.locator('[data-plate="track"]')).toHaveCount(0)
  })
})

test.describe("the product is the hero", () => {
  for (const size of SIZES) {
    test(`at ${size.name} no project title is wider than the viewport, at rest and at the end of its beats @PF-1-ASM-26`, async ({ page }) => {
      await page.setViewportSize(size)
      await page.goto("/")
      await page.waitForLoadState("load")
      for (const { id, projects } of GROUPS) {
        for (const [order, project] of projects.entries()) {
          for (const beat of [0, BEATS_PER_PROJECT - 1]) {
            await scrollToRun(page, id, projects.length, order, beat)
            const box = await page.locator(`#${project} .show-word`).evaluate((el) => {
              const range = document.createRange()
              range.selectNodeContents(el)
              const rect = range.getBoundingClientRect()
              return { left: rect.left, right: rect.right }
            })
            expect(box.left, `${project} beat ${beat} title starts inside`).toBeGreaterThanOrEqual(0)
            expect(box.right, `${project} beat ${beat} title ends inside`).toBeLessThanOrEqual(size.width)
          }
        }
      }
    })

    test(`at ${size.name} the product device is large enough to read @PF-1-ASM-26`, async ({ page }) => {
      await page.setViewportSize(size)
      await page.goto("/")
      await page.waitForLoadState("load")
      for (const { id, projects, device } of GROUPS) {
        for (const [order, project] of projects.entries()) {
          await scrollToRun(page, id, projects.length, order, 1)
          const rigs = await seen(page, project)
          const lead = rigs.sort((a, b) => b.width * b.height - a.width * a.height)[0]
          if (size.width === 390) {
            expect(lead.width, `${project} spans the content width`).toBeGreaterThanOrEqual(size.width - 40)
            expect(lead.height, `${project} takes its share of the viewport`).toBeGreaterThanOrEqual(size.height * (device === "browser" ? 0.3 : 0.5))
          } else if (lead.device === "browser" || lead.device === "terminal") {
            expect(lead.width, `${project} is most of the page width`).toBeGreaterThanOrEqual(size.width * (lead.device === "browser" ? 0.55 : 0.5))
          } else {
            expect(lead.height, `${project} phone is tall`).toBeGreaterThanOrEqual(size.height * 0.6)
          }
        }
      }
    })
  }

  test("each beat of a project shows a different screen of the product @PF-1-ASM-26", async ({ page }) => {
    await page.setViewportSize(SIZES[0])
    await page.goto("/")
    await page.waitForLoadState("load")
    const available: Record<string, number> = { grit: 4, club: 4, cebador: 4, sonria: 4, miga: 4, guardia: 4, "motion-audit": 4, "http-attack": 4, "migrations-safe": 4 }
    for (const { id, projects } of GROUPS) {
      for (const [order, project] of projects.entries()) {
        const keys = new Set<string>()
        for (let beat = 0; beat < BEATS_PER_PROJECT; beat++) {
          await scrollToRun(page, id, projects.length, order, beat)
          const rigs = await seen(page, project)
          keys.add(rigs.map((rig) => rig.key).join("|"))
        }
        expect(keys.size, `${project} walks its screens`).toBeGreaterThanOrEqual(available[project])
      }
    }
  })
})

test.describe("the contact channels", () => {
  const TILES = [
    { id: "email", handle: "nahuelgamail@gmail.com" },
    { id: "linkedin", handle: "linkedin.com/in/nahuelmosse" },
    { id: "github", handle: "github.com/NahuelMosse" },
  ] as const

  for (const size of SIZES) {
    test(`at ${size.name} email, LinkedIn and GitHub are three tiles with glyph, handle and line, none overflowing @PF-1-ASM-26`, async ({ page }) => {
      await page.setViewportSize(size)
      await page.goto("/")
      await page.locator("#contact").scrollIntoViewIfNeeded()
      await page.waitForTimeout(1200)
      const tiles = page.locator("#contact [data-tile]")
      await expect(tiles).toHaveCount(3)
      const boxes: Record<string, { x: number; y: number; width: number; height: number }> = {}
      for (const { id, handle } of TILES) {
        const tile = page.locator(`#contact [data-tile="${id}"]`)
        await expect(tile.locator("svg[data-glyph]"), `${id} has its glyph`).toHaveCount(1)
        await expect(tile.locator("[data-handle]"), `${id} shows its handle`).toHaveText(handle)
        expect(((await tile.locator("[data-line]").textContent()) ?? "").trim().length, `${id} says what is there`).toBeGreaterThan(12)
        const overflow = await tile.evaluate((el) => {
          const box = el.getBoundingClientRect()
          const handleBox = el.querySelector("[data-handle]")!.getBoundingClientRect()
          return { scroll: el.scrollWidth - el.clientWidth, handleRight: handleBox.right - box.right, right: box.right }
        })
        expect(overflow.scroll, `${id} tile does not overflow`).toBeLessThanOrEqual(1)
        expect(overflow.handleRight, `${id} handle is inside its tile`).toBeLessThanOrEqual(1)
        expect(overflow.right, `${id} tile is inside the viewport`).toBeLessThanOrEqual(size.width)
        boxes[id] = (await tile.boundingBox())!
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(size.width)
      if (size.width === 390) {
        expect(boxes.linkedin.y, "stacked: email first").toBeGreaterThan(boxes.email.y)
        expect(boxes.github.y, "stacked: GitHub last").toBeGreaterThan(boxes.linkedin.y)
        for (const box of Object.values(boxes)) expect(box.width, "full width").toBeGreaterThanOrEqual(size.width - 80)
      } else {
        expect(boxes.email.width / (boxes.linkedin.x + boxes.linkedin.width - boxes.email.x), "email is about two thirds").toBeGreaterThan(0.55)
        expect(boxes.linkedin.x).toBeGreaterThan(boxes.email.x + boxes.email.width - 1)
        expect(boxes.github.y).toBeGreaterThan(boxes.linkedin.y)
      }
      const external = page.locator('#contact [data-tile="linkedin"] a, #contact [data-tile="github"] a, #contact a[data-tile="linkedin"], #contact a[data-tile="github"]')
      for (const link of await external.all()) {
        await expect(link).toHaveAttribute("target", "_blank")
        await expect(link).toHaveAttribute("rel", /noopener/)
      }
      await expect(page.locator('#contact a[href="mailto:nahuelgamail@gmail.com"]')).toHaveCount(1)
    })
  }

  test("the copy button says Copied in a live region and goes back @PF-1-ASM-26", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"])
    await page.goto("/")
    const button = page.locator("#contact button[data-copy]")
    await button.scrollIntoViewIfNeeded()
    await expect(page.locator("#contact [aria-live]")).toHaveCount(1)
    await button.click()
    await expect(page.locator("#contact [aria-live]")).toHaveText(/Copied/)
    await expect(button).toHaveAttribute("data-copied", "")
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("nahuelgamail@gmail.com")
    await expect(button).not.toHaveAttribute("data-copied", "", { timeout: 4000 })
  })
})

test.describe("the footer", () => {
  for (const size of SIZES) {
    test(`at ${size.name} the certifications are rendered once, in the rotating band, and it never shows a gap @PF-1-ASM-26`, async ({ page }) => {
      await page.setViewportSize(size)
      await page.goto("/")
      await expect(page.locator("[data-credits-sheet]")).toHaveCount(0)
      const band = page.locator('[data-band="certifications"]')
      const listed = (await band.locator("ul.sr-only li").allTextContents()).map((text) => text.trim())
      expect(listed).toEqual(["EF SET C2 Proficient", "Liceo Cultural Británico · Nivel 8", "Arquitectura de Software Aplicada · Platzi"])
      await expect(page.locator("section[data-chapter='end-credits'] h3", { hasText: /^Certifications$/ })).toHaveCount(0)
      for (const id of ["studies", "certifications"]) {
        const copies = await page.locator(`[data-band="${id}"] .roll-list`).evaluateAll((lists) => lists.map((list) => list.getBoundingClientRect().width))
        const covered = copies.slice(1).reduce((sum, width) => sum + width, 0)
        expect(covered, `${id} band covers the viewport while it loops`).toBeGreaterThanOrEqual(size.width)
      }
    })
  }
})
