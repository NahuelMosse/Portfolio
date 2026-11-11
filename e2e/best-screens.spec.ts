import { test, expect, type Page } from "@playwright/test"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import sharp from "sharp"

// Each project shows its most visual real screens, one step per beat. The lead device walks its list, the companion walks the
// other frame's list on the same beat (or the same list one step ahead when the project has one frame only).
type Plan = { group: string; project: string; main: string[]; captions: string[]; second: string[] }
const PLAN: Plan[] = [
  {
    group: "apps",
    project: "grit",
    main: ["grit-hoy", "grit-ejercicio", "grit-progreso"],
    captions: ["Today", "Exercise detail", "Progress"],
    second: ["grit-ejercicio", "grit-progreso", "grit-completado"],
  },
  {
    group: "apps",
    project: "club",
    main: ["club-inicio", "club-sedes", "club-cancha"],
    captions: ["Home", "Venues", "Court"],
    second: ["club-sedes", "club-cancha", "club-listo"],
  },
  {
    group: "landings",
    project: "cebador",
    main: ["cebador-1280", "cebador-sabor-1280", "cebador-tienda-1280"],
    captions: ["Live", "Flavor", "Shop"],
    second: ["cebador-390", "cebador-sabor-390", "cebador-tienda-390"],
  },
  {
    group: "landings",
    project: "sonria",
    main: ["sonria-hero-1440", "sonria-tratamientos-1440", "sonria-equipo-1440"],
    captions: ["Home", "Treatments", "Team"],
    second: ["sonria-hero-390", "sonria-tratamientos-390", "sonria-equipo-390"],
  },
  {
    group: "landings",
    project: "miga",
    main: ["miga-hero-1440", "miga-lista-1440", "miga-local-1440"],
    captions: ["Home", "Today's bread", "The shop"],
    second: ["miga-hero-390", "miga-lista-390", "miga-local-390"],
  },
  {
    group: "game",
    project: "guardia",
    main: ["triaje-page", "triaje-chart", "triaje-room"],
    captions: ["Triaje on itch.io", "Intake chart", "Waiting room"],
    second: ["triaje-mobile", "triaje-chart-390", "triaje-room-390"],
  },
]
const PAIRED = ["cebador", "sonria", "miga", "guardia"]
const TOOLS = ["motion-audit", "http-attack", "migrations-safe"]
const REPLACED = [
  "grit-serie", "grit-descanso", "club-login", "club-horarios", "triaje-title", "triaje-play-2", "triaje-scrolled",
  "cebador-s2-1280", "cebador-s3-1280", "cebador-s2-390", "cebador-s3-390", "sonria-turno-1440", "sonria-turno-390",
  "miga-pedir-1440", "miga-pedir-390",
]
const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]
const TICK = 80
const PIECES = join(process.cwd(), "public", "film", "pieces")
const CONTENT = readFileSync(join(process.cwd(), "features", "portfolio", "presentation", "content.ts"), "utf8")
const ASSETS = readFileSync(join(process.cwd(), "public", "ASSETS.md"), "utf8")
const REAL_PIECES = ASSETS.slice(ASSETS.indexOf("## Real pieces"), ASSETS.indexOf("\n## ", ASSETS.indexOf("## Real pieces") + 3))

// The pieces of a project as content.ts lists them: frame, file id and caption, in order.
function piecesOf(project: string) {
  const start = CONTENT.indexOf(`id: "${project}"`)
  expect(start, `${project} is in content.ts`).toBeGreaterThan(-1)
  const open = CONTENT.indexOf("pieces: [", start)
  const close = CONTENT.indexOf("\n    ],", open)
  const body = open > -1 && close > open ? CONTENT.slice(open, close) : ""
  const screens = [...body.matchAll(/screen\(\s*"(phone|browser)",\s*"([a-z0-9-]+)",\s*"[^"]*",\s*"([^"]*)"\s*\)/g)].map((m) => ({ frame: m[1], id: m[2], caption: m[3] }))
  const captures = [...body.matchAll(/frame: "(phone|browser)",\s*video: "\/film\/pieces\/([a-z0-9-]+)\.webm",[\s\S]*?caption: "([^"]*)"/g)].map((m) => ({ frame: m[1], id: m[2], caption: m[3] }))
  const order = (id: string) => body.indexOf(`"${id}"`) > -1 ? body.indexOf(`"${id}"`) : body.indexOf(`/${id}.`)
  return [...screens, ...captures].sort((a, b) => order(a.id) - order(b.id))
}

// The line of the Real pieces section of ASSETS.md that names a piece file.
const assetsLineOf = (id: string) => REAL_PIECES.split("\n").find((line) => new RegExp(`\\b${id}\\.(webp|webm)`).test(line))

type Face = { id: string | null; loaded: boolean; shown: boolean; caption: string | null }

// What one device of the card on show has on: the file of its face that is on, whether it finished loading, whether it is drawn.
async function faceOf(page: Page, project: string, role: "main" | "second"): Promise<Face> {
  return page.locator(`article[data-project="${project}"]`).evaluate((card, role) => {
    const rig = card.querySelector<HTMLElement>(`.show-rig[data-role="${role}"]`)
    if (!rig) return { id: null, loaded: false, shown: false, caption: null }
    const style = getComputedStyle(rig)
    const box = rig.getBoundingClientRect()
    const shown = style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0
    const face = rig.querySelector(".show-screen[data-on]")
    const img = face?.querySelector("img") as HTMLImageElement | null
    const video = face?.querySelector("video") as HTMLVideoElement | null
    const url = video ? video.poster || video.currentSrc : img ? img.currentSrc || img.src : ""
    const match = [...url.matchAll(/pieces\/([a-z0-9-]+)\.(webp|webm)/g)].pop()
    const id = match ? match[1].replace(/-poster$/, "") : null
    const loaded = video ? Boolean(video.poster) : Boolean(img && img.complete && img.naturalWidth > 1 && /pieces\//.test(img.currentSrc))
    const caption = rig.querySelector(".show-tab")?.textContent?.trim() ?? null
    return { id, loaded, shown, caption }
  }, role)
}

// Walks a group with the wheel from just above it to just past it, and records each project's two devices on each beat it reaches.
async function walkGroup(page: Page, group: string) {
  await page.evaluate((id) => {
    const section = document.getElementById(id)!
    window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.5)
  }, group)
  await page.waitForTimeout(400)
  const seen = new Map<string, { main: Face; second: Face }>()
  const end = await page.evaluate((id) => {
    const section = document.getElementById(id)!
    return section.getBoundingClientRect().bottom + window.scrollY
  }, group)
  for (let k = 0; k < 600; k++) {
    const current = await page.locator(`section#${group}`).evaluate((el) => {
      const node = el.querySelector("article[data-current]")
      return node ? { project: node.getAttribute("data-project")!, beat: node.getAttribute("data-beat")! } : null
    })
    if (current) {
      const key = `${current.project}:${current.beat}`
      if (!seen.has(key)) {
        await page.waitForTimeout(300)
        await expect
          .poll(async () => (await faceOf(page, current.project, "main")).loaded, { message: `${key} main screen loads`, timeout: 10_000 })
          .toBe(true)
        seen.set(key, { main: await faceOf(page, current.project, "main"), second: await faceOf(page, current.project, "second") })
      }
    }
    const bottom = await page.evaluate(() => window.scrollY + window.innerHeight)
    if (bottom >= end) break
    await page.mouse.wheel(0, TICK)
    await page.waitForTimeout(90)
  }
  return seen
}

test.describe("the best, most visual screens of each project", () => {
  test("walking each project chapter with the wheel at 1440x900 and 390x844, every beat shows the planned visual screens of that project, loaded @PF-2-S1 @PF-2-S2 @PF-2-ASM-01", async ({ page }) => {
    test.setTimeout(600_000)
    for (const viewport of VIEWPORTS) {
      await page.setViewportSize(viewport)
      await page.goto("/")
      await page.waitForLoadState("load")
      for (const group of [...new Set(PLAN.map((plan) => plan.group))]) {
        const seen = await walkGroup(page, group)
        for (const plan of PLAN.filter((entry) => entry.group === group)) {
          for (let beat = 0; beat < plan.main.length; beat++) {
            const label = `${plan.project} beat ${beat} at ${viewport.width}`
            const at = seen.get(`${plan.project}:${beat}`)
            expect(at, `${label} is reached by the wheel`).toBeTruthy()
            expect(at!.main.id, `${label} lead screen`).toBe(plan.main[beat])
            expect(at!.main.loaded, `${label} lead screen loaded`).toBe(true)
            expect(at!.main.caption, `${label} caption`).toBe(plan.captions[beat])
            if (at!.second.shown) expect(at!.second.id, `${label} companion screen`).toBe(plan.second[beat])
          }
        }
      }
    }
  })

  test("desktop and phone screens of a project come in equal numbers and show the same section on the same beat @PF-2-ASM-02", async ({ page }) => {
    test.setTimeout(600_000)
    for (const project of PAIRED) {
      const pieces = piecesOf(project)
      const browser = pieces.filter((piece) => piece.frame === "browser")
      const phone = pieces.filter((piece) => piece.frame === "phone")
      expect(phone.length, `${project} has as many phone screens as desktop ones`).toBe(browser.length)
      for (const [n, piece] of phone.entries()) {
        expect(piece.caption, `${project} phone screen ${n} is the same section as the desktop one`).toBe(`${browser[n].caption}, on a phone`)
      }
    }
    for (const viewport of VIEWPORTS) {
      await page.setViewportSize(viewport)
      await page.goto("/")
      await page.waitForLoadState("load")
      for (const group of [...new Set(PLAN.filter((plan) => PAIRED.includes(plan.project)).map((plan) => plan.group))]) {
        const seen = await walkGroup(page, group)
        for (const plan of PLAN.filter((entry) => entry.group === group && PAIRED.includes(entry.project))) {
          for (let beat = 0; beat < plan.main.length; beat++) {
            const label = `${plan.project} beat ${beat} at ${viewport.width}`
            const at = seen.get(`${plan.project}:${beat}`)
            expect(at, `${label} is reached by the wheel`).toBeTruthy()
            expect(at!.second.shown, `${label} the phone stands beside the page`).toBe(true)
            expect([at!.main.id, at!.second.id], `${label} page and phone on the same section`).toEqual([plan.main[beat], plan.second[beat]])
          }
        }
      }
    }
  })

  test("every screen of the projects is a real capture listed in ASSETS.md with its frame's ratio, and the replaced screens left the film @PF-2-ASM-03", async () => {
    const RATIO = { phone: [0.44, 0.48], browser: [1.55, 1.8] } as const
    for (const plan of PLAN) {
      const pieces = piecesOf(plan.project)
      expect(pieces.map((piece) => piece.id).sort(), `${plan.project} lists the planned screens`).toEqual([...new Set([...plan.main, ...plan.second])].sort())
      for (const piece of pieces) {
        expect(assetsLineOf(piece.id), `${piece.id} is recorded in ASSETS.md Real pieces`).toBeTruthy()
        const still = join(PIECES, `${piece.id}.webp`)
        const file = existsSync(still) ? still : join(PIECES, `${piece.id}-poster.webp`)
        expect(existsSync(file), `${piece.id} is on disk`).toBe(true)
        const { width, height } = await sharp(file).metadata()
        const [low, high] = RATIO[piece.frame as "phone" | "browser"]
        expect(width! / height!, `${piece.id} has its ${piece.frame}'s ratio`).toBeGreaterThanOrEqual(low)
        expect(width! / height!, `${piece.id} has its ${piece.frame}'s ratio`).toBeLessThanOrEqual(high)
      }
    }
    const widths = readFileSync(join(process.cwd(), "features", "portfolio", "presentation", "piece-widths.json"), "utf8")
    for (const id of REPLACED) {
      expect(existsSync(join(PIECES, `${id}.webp`)), `${id} left the film`).toBe(false)
      expect(CONTENT.includes(`"${id}"`), `${id} left content.ts`).toBe(false)
      expect(widths.includes(`"${id}"`), `${id} left its copies`).toBe(false)
      expect(assetsLineOf(id), `${id} left ASSETS.md`).toBeFalsy()
    }
  })

  test("the three tools keep no screens, only their illustration and links @PF-2-ASM-04", async ({ page }) => {
    for (const tool of TOOLS) {
      const start = CONTENT.indexOf(`id: "${tool}"`)
      expect(start, `${tool} is in content.ts`).toBeGreaterThan(-1)
      expect(CONTENT.slice(start, CONTENT.indexOf("pieces:", start) + 12), `${tool} has no pieces`).toContain("pieces: []")
    }
    await page.setViewportSize(VIEWPORTS[0])
    await page.goto("/")
    await page.waitForLoadState("load")
    for (const tool of TOOLS) {
      const card = page.locator(`article[data-project="${tool}"]`)
      await expect(card, `${tool} is on the page`).toHaveCount(1)
      await expect(card.locator(".show-screen"), `${tool} shows no screen`).toHaveCount(0)
      expect(await card.locator(".show-meta a").count(), `${tool} keeps its links`).toBeGreaterThan(0)
    }
  })

  test("a capture showing someone else's photograph carries its author, licence and source in ASSETS.md @PF-2-ASM-05", async () => {
    const CREDITS = [
      { pieces: ["miga-hero-1440", "miga-lista-1440", "miga-local-1440"], authors: ["Agelaia", "Angel Ganev", "Shixart1985", "Horacio Cambeiro", "Kgbo"] },
      { pieces: ["sonria-hero-1440"], authors: ["OneEuropeanHeart", "Raf24", "Roberto Fiadone"] },
    ]
    for (const { pieces, authors } of CREDITS) {
      for (const id of pieces) {
        const line = assetsLineOf(id)
        expect(line, `${id} is recorded`).toBeTruthy()
        for (const author of authors) expect(line, `${id} credits ${author}`).toContain(author)
        expect(line, `${id} names the licences`).toMatch(/CC BY/)
        expect(line, `${id} names the source`).toContain("commons.wikimedia.org")
      }
    }
    for (const id of ["sonria-equipo-1440", "cebador-sabor-1280", "cebador-tienda-1280"]) {
      expect(assetsLineOf(id), `${id} says its pictures are the project's own`).toMatch(/own/)
    }
  })

  test("every capture's ASSETS.md entry says who appears in it, and no one but him is a photographed person @PF-2-ASM-06", async () => {
    for (const plan of PLAN) {
      for (const piece of piecesOf(plan.project)) {
        const line = assetsLineOf(piece.id)
        expect(line, `${piece.id} is recorded`).toBeTruthy()
        const people = line!.match(/people: ([^.;]+)/)
        expect(people, `${piece.id} says who appears in it`).toBeTruthy()
        expect(["none", "him", "the game's drawn characters"], `${piece.id}: ${people![1]}`).toContain(people![1].trim())
      }
    }
  })
})
