import { readFileSync } from "node:fs"
import { test, expect, type Page } from "@playwright/test"

type Asset = { id: string; file: string; tool: string; status: string; prompt: string }

const CASES = ["dev-kit", "grit", "guardia", "cebador", "club"]
const CHAPTERS = ["cold-open", "projects", "experience", "end-credits"]
const IMAGES = [
  "pf-desk-16x9", "pf-desk-9x16", "pf-wall-strip-9x16", "pf-folder-open-4x5", "pf-file-sealed-16x9", "pf-file-sealed-9x16",
  "pf-paper-torn-16x9", "pf-grain-1x1", ...CASES.map((id) => `pf-exhibit-${id}-4x5`),
]
const VIDEOS = ["pf-cover-loop", "pf-cover-loop-9x16"]
const GAMES = ["CS2", "Rocket League", "Minecraft", "Smite", "The Witcher 3", "Cyberpunk 2077", "chess", "Formula 1"]
const PEOPLE_WORDS = /\b(man|woman|face|statue|god|deity|character|figure|portrait of)\b/i

function readAssets(): Asset[] {
  const text = readFileSync("public/ASSETS.md", "utf8")
  return text
    .split(/^## /m)
    .slice(1)
    .map((block) => {
      const field = (name: string) => block.match(new RegExp(`^- ${name}: (.*)$`, "m"))?.[1]?.trim() ?? ""
      return { id: block.split("\n")[0].trim(), file: field("File"), tool: field("Tool"), status: field("Status"), prompt: field("Prompt") }
    })
}

const gap = (reason: string) => test.info().annotations.push({ type: "gap", description: reason })

const settle = (page: Page) => page.waitForTimeout(900)

const scrollFraction = async (page: Page, fraction: number) => {
  await page.evaluate((f) => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * f), fraction)
  await settle(page)
}

test("the page shows the desk in 16:9 on wide screens and 9:16 on tall ones, the wall strip, the cold open loop, one still-life exhibit per case, the open folder, the sealed file, the torn paper and the grain, each listed in ASSETS.md as made in Gemini or Kling, and no generated image shows a person @PF-1-ASM-20", async ({ browser }) => {
  const assets = readAssets()
  for (const id of IMAGES) {
    const entry = assets.find((a) => a.id === id)
    expect(entry, `ASSETS.md entry for ${id}`).toBeDefined()
    expect(entry!.tool, id).toBe("Gemini")
    expect(entry!.prompt, id).not.toMatch(PEOPLE_WORDS)
  }
  for (const id of VIDEOS) expect(assets.find((a) => a.id === id)?.tool, id).toBe("Kling AI")

  const ready = new Set(assets.filter((a) => a.status === "delivered").map((a) => a.id))
  for (const [width, height, suffix] of [[1280, 720, "16x9"], [390, 844, "9x16"]] as const) {
    const page = await browser.newPage({ viewport: { width, height } })
    await page.goto("/")
    const slots = await page.locator("[data-asset]").evaluateAll((all) => all.map((el) => el.getAttribute("data-asset")))
    for (const id of ["pf-desk-16x9", "pf-wall-strip-9x16", "pf-folder-open-4x5", "pf-file-sealed-16x9", "pf-paper-torn-16x9", "pf-grain-1x1"]) {
      expect(slots, `${id} at ${width}`).toContain(id)
    }
    for (const id of CASES) {
      await expect(page.locator(`[data-project="${id}"] [data-asset^="pf-exhibit-"]`)).toHaveCount(1)
      await expect(page.locator(`[data-project="${id}"] [data-asset="pf-exhibit-${id}-4x5"]`)).toHaveCount(1)
    }
    for (const slot of slots) expect(IMAGES.concat(VIDEOS).concat(slot?.startsWith("pf-him-") || slot?.startsWith("pf-id-") ? [slot] : []), `${slot} is declared`).toContain(slot)
    if (ready.has(`pf-desk-${suffix}`)) {
      const sources = await page.locator("[data-scene-media] img").evaluateAll((all) => all.map((el) => (el as HTMLImageElement).currentSrc))
      expect(sources.some((s) => s.includes(`pf-desk-${suffix}`))).toBe(true)
    } else gap(`pf-desk-${suffix} not delivered yet`)
    await page.close()
  }
})

test.describe("wide", () => {
  test.use({ viewport: { width: 1280, height: 720 } })

  test("the cold open shows him holding the sealed envelope where the thread starts, height lines behind him, and the identification sheet with two photos of him and Subject NAWI, Name Nahuel Mosse, Role Technical Lead · Technical Project Manager, Base Buenos Aires and Known for, one Active stamp, no stat bar, level or prisoner board; the credits sheet holds the off-duty line naming CS2, Rocket League, Minecraft, Smite, The Witcher 3, Cyberpunk 2077, chess and Formula 1 with no game logo or art @PF-1-ASM-21", async ({ page }) => {
    await page.goto("/")
    const cold = page.locator('section[data-chapter="cold-open"]')
    await expect(cold.locator("[data-him] [data-sealed-envelope]")).toHaveCount(1)
    await expect(cold.locator("[data-height-lines]")).toHaveCount(1)
    const start = await page.evaluate(() => {
      const path = document.querySelector("[data-thread-path]") as SVGPathElement
      const origin = document.querySelector("[data-sealed-envelope]")!.getBoundingClientRect()
      const main = document.querySelector("main")!.getBoundingClientRect()
      const p = path.getPointAtLength(0)
      return { x: p.x + main.left, y: p.y + main.top, box: { l: origin.left, r: origin.right, t: origin.top, b: origin.bottom } }
    })
    expect(start.x).toBeGreaterThanOrEqual(start.box.l - 2)
    expect(start.x).toBeLessThanOrEqual(start.box.r + 2)
    expect(start.y).toBeGreaterThanOrEqual(start.box.t - 2)
    expect(start.y).toBeLessThanOrEqual(start.box.b + 2)

    const sheet = page.locator("[data-id-sheet]")
    await expect(sheet).toHaveCount(1)
    const fields: [string, string][] = [
      ["Subject", "NAWI"], ["Name", "Nahuel Mosse"], ["Role", "Technical Lead · Technical Project Manager"], ["Base", "Buenos Aires"], ["Known for", "designing, building and leading digital products"],
    ]
    for (const [label, value] of fields) {
      const term = sheet.locator("dt", { hasText: new RegExp(`^${label}$`) })
      await expect(term).toHaveCount(1)
      await expect(term.locator("xpath=following-sibling::dd[1]")).toContainText(value)
    }
    await expect(sheet.locator('[data-asset="pf-id-front"], [data-asset="pf-id-profile"]')).toHaveCount(2)
    await expect(sheet.locator("[data-stamp]")).toHaveCount(1)
    await expect(sheet.locator("[data-stamp]")).toHaveText(/^Active$/i)
    await expect(sheet.locator('[role="progressbar"], meter, progress, [data-stat], [data-level]')).toHaveCount(0)
    await expect(page.locator("body")).not.toContainText(/prisoner|inmate|booking|mugshot/i)
    await expect(sheet.locator("[data-off-duty]")).toHaveCount(0)

    const credits = page.locator("[data-credits-sheet]")
    await expect(credits).toHaveCount(1)
    const offDuty = credits.locator("[data-off-duty]")
    for (const game of GAMES) await expect(offDuty).toContainText(game)
    await expect(offDuty.locator("img, svg, video, canvas, picture")).toHaveCount(0)
  })

  test("each chapter title straddles the edge with the chapter before, one lamp light travels down the page onto what is read and ends on the sealed file, the thread never breaks and its ends tie around the sealed file, his photos cross two seams, paper backs only the identification sheet, the two folders and the credits sheet, the cases alternate sides with the first and fourth larger, one HUD rail with a tick per chapter runs the page, and no full-width background change sits between chapters @PF-1-ASM-26", async ({ page }) => {
    await page.goto("/")
    const straddle = await page.evaluate((ids) => {
      return ids.slice(1).map((id) => {
        const section = document.querySelector(`section[data-chapter="${id}"]`)!
        const edge = section.getBoundingClientRect().top
        const title = section.querySelector("h2")!.getBoundingClientRect()
        return { id, over: edge - title.top, under: title.bottom - edge, height: title.height }
      })
    }, CHAPTERS)
    for (const t of straddle) {
      expect(t.over, `${t.id} title rises over the chapter before`).toBeGreaterThan(t.height * 0.25)
      expect(t.under, `${t.id} title falls into its own chapter`).toBeGreaterThan(t.height * 0.25)
    }

    await expect(page.locator("[data-lamp-light]")).toHaveCount(1)
    await expect(page.locator("[data-red-disc]")).toHaveCount(0)
    const targets = ["[data-him]", ...CASES.map((id) => `[data-project="${id}"] [data-exhibit]`), '[data-offer-card="freelance"]', '[data-offer-card="tpm"]', "[data-sealed-file]"]
    for (const selector of targets) {
      await page.locator(selector).first().evaluate((el) => el.scrollIntoView({ block: "center" }))
      await expect
        .poll(
          () =>
            page.evaluate((s) => {
              const lamp = document.querySelector("[data-lamp-light]")!.getBoundingClientRect()
              const r = document.querySelector(s)!.getBoundingClientRect()
              const x = lamp.left + lamp.width / 2
              const y = lamp.top + lamp.height / 2
              return x >= r.left - 4 && x <= r.right + 4 && y >= r.top - 4 && y <= r.bottom + 4
            }, selector),
          { message: `the lamp lands on ${selector}`, timeout: 4000 },
        )
        .toBe(true)
    }
    await scrollFraction(page, 1)
    const onFile = await page.evaluate(() => {
      const lamp = document.querySelector("[data-lamp-light]")!.getBoundingClientRect()
      const r = document.querySelector("[data-sealed-file]")!.getBoundingClientRect()
      const x = lamp.left + lamp.width / 2
      const y = lamp.top + lamp.height / 2
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
    })
    expect(onFile, "the lamp ends on the sealed file").toBe(true)

    const thread = await page.evaluate(() => {
      const main = document.querySelector("main")!.getBoundingClientRect()
      const file = document.querySelector("[data-sealed-file]")!.getBoundingClientRect()
      const trunk = document.querySelectorAll("[data-thread-path]")
      const ties = [...document.querySelectorAll("[data-thread-tie]")].map((t) => {
        const p = t as SVGPathElement
        const end = p.getPointAtLength(p.getTotalLength())
        return { x: end.x + main.left, y: end.y + main.top }
      })
      return {
        trunks: trunk.length,
        nodes: document.querySelectorAll("[data-thread-node]").length,
        stops: document.querySelectorAll("[data-thread-stop]").length,
        tied: ties.map((p) => p.x >= file.left - 4 && p.x <= file.right + 4 && p.y >= file.top - 4 && p.y <= file.bottom + 4),
      }
    })
    expect(thread.trunks).toBe(1)
    expect(thread.nodes).toBe(thread.stops)
    expect(thread.stops).toBeGreaterThanOrEqual(CASES.length + 5)
    expect(thread.tied).toEqual([true, true])

    const seams = await page.evaluate(() =>
      [["close-crop", "experience"], ["profile", "end-credits"]].map(([name, below]) => {
        const photo = document.querySelector(`[data-seam-photo="${name}"]`)!.getBoundingClientRect()
        const edge = document.querySelector(`section[data-chapter="${below}"]`)!.getBoundingClientRect().top
        return { name, over: edge - photo.top, under: photo.bottom - edge }
      }),
    )
    for (const seam of seams) {
      expect(seam.over, `${seam.name} reaches the chapter above`).toBeGreaterThan(24)
      expect(seam.under, `${seam.name} reaches the chapter below`).toBeGreaterThan(24)
    }
    await expect(page.locator("[data-seam-photo]")).toHaveCount(2)

    const paper = await page.evaluate(() => {
      const luminance = (css: string) => {
        const [r, g, b, a] = (css.match(/[\d.]+/g) ?? ["0", "0", "0", "0"]).map(Number)
        return { light: (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.6, opaque: (a ?? 1) > 0.5 }
      }
      const flagged = [...document.querySelectorAll("body *")].filter((el) => {
        const r = el.getBoundingClientRect()
        const { light, opaque } = luminance(getComputedStyle(el).backgroundColor)
        return light && opaque && r.width * r.height > 40000 && !["IMG", "VIDEO", "CANVAS"].includes(el.tagName)
      })
      return {
        stray: flagged.filter((el) => !el.closest("[data-paper]")).map((el) => el.className || el.tagName),
        papers: [...document.querySelectorAll("[data-paper]")].map((el) => el.getAttribute("data-paper")),
      }
    })
    expect(paper.stray).toEqual([])
    expect(paper.papers.sort()).toEqual(["credits-sheet", "folder", "folder", "id-sheet"])

    const sides = await page.evaluate(() =>
      [...document.querySelectorAll("[data-project]")].map((p) => {
        const exhibit = p.querySelector("[data-exhibit]")!.getBoundingClientRect()
        return { side: p.getAttribute("data-case-side"), area: exhibit.width * exhibit.height, centre: exhibit.left + exhibit.width / 2 }
      }),
    )
    sides.forEach((s, i) => {
      expect(s.side).toBe(i % 2 === 0 ? "left" : "right")
      expect(s.centre < 640).toBe(i % 2 === 0)
    })
    const small = Math.max(sides[1].area, sides[2].area, sides[4].area)
    expect(sides[0].area).toBeGreaterThan(small * 1.15)
    expect(sides[3].area).toBeGreaterThan(small * 1.15)

    const rail = page.locator("[data-hud-rail]")
    await expect(rail).toHaveCount(1)
    await expect(rail.locator("[data-rail-tick]")).toHaveCount(CHAPTERS.length)
    expect((await rail.boundingBox())!.height).toBeGreaterThan(720 * 0.5)
    expect(await rail.evaluate((el) => getComputedStyle(el).position)).toBe("fixed")
    await scrollFraction(page, 0)
    await expect(rail.locator('[data-rail-tick][aria-current="true"]')).toHaveAttribute("data-rail-tick", "cold-open")
    await scrollFraction(page, 1)
    await expect(rail.locator('[data-rail-tick][aria-current="true"]')).toHaveAttribute("data-rail-tick", "end-credits")

    const bands = await page.evaluate(() => {
      const painted = (el: Element) => {
        const cs = getComputedStyle(el)
        const alpha = cs.backgroundColor.match(/[\d.]+/g)?.[3]
        return (cs.backgroundColor !== "rgba(0, 0, 0, 0)" && alpha !== "0") || cs.backgroundImage !== "none"
      }
      return [...document.querySelectorAll("section[data-chapter]:not([data-chapter='cold-open']), [data-transition]")]
        .filter((el) => el.getBoundingClientRect().width >= innerWidth * 0.9 && painted(el))
        .map((el) => el.getAttribute("data-chapter") ?? "transition")
    })
    expect(bands).toEqual([])
  })
})

test.describe("phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true })

  test("at 390 the page is one column, the thread is the spine at the left edge with the chapter numbers, each case's pieces swipe sideways with the next one cut at the edge and a counter, what, problem and role open with a toggle with the first case open, a fixed Hire me bar at the bottom is at least 48 px tall, no text is under 14 px and only the piece rows scroll sideways @PF-1-ASM-27", async ({ page }) => {
    await page.goto("/")
    await page.waitForTimeout(500)

    const columns = await page.evaluate(() =>
      [...document.querySelectorAll("[data-project]")].map((p) => {
        const exhibit = p.querySelector("[data-exhibit]")!.getBoundingClientRect()
        const text = p.querySelector("[data-case-text]")!.getBoundingClientRect()
        return { stacked: exhibit.bottom <= text.top + 2 || text.bottom <= exhibit.top + 2, width: text.width }
      }),
    )
    for (const c of columns) {
      expect(c.stacked).toBe(true)
      expect(c.width).toBeGreaterThan(390 * 0.6)
    }

    expect(await page.locator("[data-hud-rail]").evaluate((el) => getComputedStyle(el).display)).toBe("none")
    const spine = await page.evaluate(() => {
      const main = document.querySelector("main")!.getBoundingClientRect()
      const numbers = [...document.querySelectorAll("[data-spine-number]")].map((n) => ({ text: n.textContent?.trim(), left: n.getBoundingClientRect().left }))
      const nodes = [...document.querySelectorAll("[data-thread-node]")].map((n) => n.getBoundingClientRect().left + n.getBoundingClientRect().width / 2 - main.left)
      return { numbers, nodes }
    })
    expect(spine.numbers.map((n) => n.text)).toEqual(["01", "02", "03", "04"])
    for (const n of spine.numbers) expect(n.left).toBeLessThan(48)
    expect(spine.nodes.length).toBeGreaterThan(0)
    for (const x of spine.nodes) expect(x).toBeLessThan(48)

    const row = page.locator('[data-project="grit"] [data-pieces]')
    await row.evaluate((el) => el.scrollIntoView({ block: "center" }))
    const geometry = await row.evaluate((el) => {
      const items = [...el.querySelectorAll("[data-piece]")].map((i) => i.getBoundingClientRect())
      const box = el.getBoundingClientRect()
      return { overflows: el.scrollWidth > el.clientWidth + 1, cut: items[1].left < box.right && items[1].right > box.right, snap: getComputedStyle(el).scrollSnapType, overflowX: getComputedStyle(el).overflowX, count: items.length }
    })
    expect(geometry.overflows).toBe(true)
    expect(geometry.cut).toBe(true)
    expect(geometry.snap).not.toBe("none")
    expect(["auto", "scroll"]).toContain(geometry.overflowX)
    const counter = page.locator('[data-project="grit"] [data-piece-counter]')
    await expect(counter).toHaveText(new RegExp(`^1 / ${geometry.count}$`))
    await row.evaluate((el) => el.scrollTo({ left: (el.querySelectorAll("[data-piece]")[1] as HTMLElement).offsetLeft - 16 }))
    await expect(counter).toHaveText(new RegExp(`^2 / ${geometry.count}$`))

    const toggles = page.locator("[data-project] button[aria-expanded]")
    await expect(toggles).toHaveCount(CASES.length)
    await expect(toggles.nth(0)).toHaveAttribute("aria-expanded", "true")
    await expect(toggles.nth(1)).toHaveAttribute("aria-expanded", "false")
    const details = (id: string) => page.locator(`[data-project="${id}"] [data-field="problem"]`)
    await expect(details("dev-kit")).toBeVisible()
    await expect(details("grit")).toBeHidden()
    await toggles.nth(1).evaluate((el) => el.scrollIntoView({ block: "center" }))
    await toggles.nth(1).click()
    await expect(toggles.nth(1)).toHaveAttribute("aria-expanded", "true")
    await expect(details("grit")).toBeVisible()

    const bar = page.locator("[data-hire-bar]")
    await expect(bar).toBeVisible()
    const barBox = await bar.boundingBox()
    expect(barBox!.height).toBeGreaterThanOrEqual(48)
    expect(await bar.evaluate((el) => getComputedStyle(el).position)).toBe("fixed")
    expect(Math.round(barBox!.y + barBox!.height)).toBe(844)
    await expect(bar.locator("a", { hasText: "Hire me" })).toHaveCount(1)

    const layout = await page.evaluate(() => {
      const small = [...document.querySelectorAll("body *")]
        .filter((el) => {
          const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim())
          const cs = getComputedStyle(el)
          const box = el.getBoundingClientRect()
          return own && cs.display !== "none" && cs.visibility !== "hidden" && box.width > 0 && !el.closest(".sr-only, script, style") && parseFloat(cs.fontSize) < 14
        })
        .map((el) => `${el.tagName}.${el.className}: ${el.textContent?.trim().slice(0, 30)}`)
      const sideways = [...document.querySelectorAll("body *")]
        .filter((el) => ["auto", "scroll"].includes(getComputedStyle(el).overflowX) && el.scrollWidth > el.clientWidth + 1 && el !== document.body && el !== document.documentElement)
        .filter((el) => !el.hasAttribute("data-pieces"))
        .map((el) => `${el.tagName}.${el.className}`)
      return { small, sideways, page: document.documentElement.scrollWidth }
    })
    expect(layout.small).toEqual([])
    expect(layout.sideways).toEqual([])
    expect(layout.page).toBeLessThanOrEqual(390)
  })
})
