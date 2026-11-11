import { test, expect, type Page } from "@playwright/test"
import { readFileSync } from "node:fs"
import { join } from "node:path"

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
const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]
const TICK = 80
const PAIRED = ["cebador", "sonria", "miga", "guardia"]
const CONTENT = readFileSync(join(process.cwd(), "features", "portfolio", "presentation", "content.ts"), "utf8")

// The pieces of a project as content.ts lists them: frame, file id and caption, in order.
function piecesOf(project: string) {
  const start = CONTENT.indexOf(`id: "${project}"`)
  expect(start, `${project} is in content.ts`).toBeGreaterThan(-1)
  const open = CONTENT.indexOf("pieces: [", start)
  const close = CONTENT.indexOf("\n    ],", open)
  const body = open > -1 && close > open ? CONTENT.slice(open, close) : ""
  const screens = [...body.matchAll(/[sS]creen\(\s*"(phone|browser)",\s*"([a-z0-9-]+)",\s*"[^"]*",\s*"([^"]*)"\s*\)/g)].map((m) => ({ frame: m[1], id: m[2], caption: m[3] }))
  const captures = [...body.matchAll(/frame: "(phone|browser)",\s*video: "\/film\/pieces\/([a-z0-9-]+)\.webm",[\s\S]*?caption: "([^"]*)"/g)].map((m) => ({ frame: m[1], id: m[2], caption: m[3] }))
  const order = (id: string) => (body.indexOf(`"${id}"`) > -1 ? body.indexOf(`"${id}"`) : body.indexOf(`/${id}.`))
  return [...screens, ...captures].sort((a, b) => order(a.id) - order(b.id))
}

type Face = { id: string | null; loaded: boolean; shown: boolean; caption: string | null }

// What one device of the card on show has on: the file of its face that is on, whether it finished loading, whether it is drawn.
// A live capture keeps a blank poster attribute: its still is the picture under the video, and its file is the video's source.
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
    const url = video?.getAttribute("data-src") || (img ? img.currentSrc || img.src : "")
    const match = [...url.matchAll(/pieces\/([a-z0-9-]+)\.(webp|webm)/g)].pop()
    const id = match ? match[1].replace(/-poster$/, "") : null
    const still = Boolean(img && img.complete && img.naturalWidth > 1 && /pieces\//.test(img.currentSrc))
    const loaded = still || Boolean(video && video.readyState >= 2)
    const caption = rig.querySelector(".show-tab")?.textContent?.trim() ?? null
    return { id, loaded, shown, caption }
  }, role)
}

// The page's images below the cover start loading only once the opening title gives way, so a walk starts after it.
async function opened(page: Page) {
  await page.waitForLoadState("load")
  await page.waitForFunction(() => !document.documentElement.classList.contains("is-preloading"), undefined, { timeout: 30_000 })
}

// The smooth scroll eases toward the wheel's target; a beat runs about 18% of the screen, so the walk lets each tick land before
// the next one, or the easing still under way while the test looks at a beat would carry the page past the following one.
async function settled(page: Page) {
  let last = await page.evaluate(() => window.scrollY)
  for (let k = 0; k < 40; k++) {
    await page.waitForTimeout(60)
    const now = await page.evaluate(() => window.scrollY)
    if (Math.abs(now - last) < 1) return
    last = now
  }
}

// Walks a group with the wheel from just above it to just past it, and records each project's two devices on each beat it reaches.
async function walkGroup(page: Page, group: string) {
  // a page loaded a second time can start its smooth scroll after the jump and bring it back to the top, so the jump is repeated
  // until it holds; the section above may still settle it by a little, which keeps the start above the group
  const slack = (page.viewportSize()?.height ?? 800) * 0.4
  await expect
    .poll(
      async () => {
        const away = await page.evaluate(({ id, slack }) => {
          const section = document.getElementById(id)!
          const target = section.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.5
          const off = Math.abs(window.scrollY - target)
          if (off > slack) window.scrollTo(0, target)
          return off
        }, { id: group, slack })
        await page.waitForTimeout(400)
        return away
      },
      { message: `the page jumps to ${group}`, timeout: 15_000 },
    )
    .toBeLessThan(slack)
  const seen = new Map<string, { main: Face; second: Face }>()
  const end = await page.evaluate((id) => {
    const section = document.getElementById(id)!
    // the last beat of a group's last project holds only the final few percent of its run: the walk goes half a screen past it
    return section.getBoundingClientRect().bottom + window.scrollY + window.innerHeight * 0.5
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
          .poll(async () => (await faceOf(page, current.project, "main")).loaded, { message: `${key} main screen loads at ${page.viewportSize()?.width}`, timeout: 10_000 })
          .toBe(true)
        seen.set(key, { main: await faceOf(page, current.project, "main"), second: await faceOf(page, current.project, "second") })
      }
    }
    const bottom = await page.evaluate(() => window.scrollY + window.innerHeight)
    if (bottom >= end) break
    await page.mouse.wheel(0, TICK)
    await settled(page)
  }
  return seen
}

test("walking each project chapter with the wheel at 1440x900 and 390x844, every beat shows the planned visual screens of that project, loaded @PF-2-S1 @PF-2-S2 @PF-2-ASM-01", async ({ page }) => {
  test.setTimeout(600_000)
  for (const viewport of VIEWPORTS) {
    await page.setViewportSize(viewport)
    await page.goto("/")
    await opened(page)
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
    await opened(page)
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
