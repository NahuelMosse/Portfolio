import { test, expect, type Page } from "@playwright/test"

// Contracts of the case-file layout that replace the ones of the earlier poster layout (see the Log, "replaces:").

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1280, height: 720 },
] as const

const layerTransforms = (page: Page) =>
  page.evaluate(() =>
    Object.fromEntries(
      ["backdrop", "mark", "sheet"].map((name) => {
        const el = document.querySelector(`[data-layer="${name}"]`) as HTMLElement
        const m = new DOMMatrix(getComputedStyle(el).transform)
        return [name, [m.m41, m.m42]]
      }),
    ),
  )

const travelled = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1])

for (const { width, height } of VIEWPORTS) {
  test(`the cold open shows the desk edge to edge, the name and a Hire me door by second 5 at ${width} @PF-1-S8 @PF-1-S19`, async ({ browser }) => {
    const page = await browser.newPage({ viewport: { width, height } })
    await page.goto("/")
    await page.waitForTimeout(5000)
    const desk = await page.locator('section[data-chapter="cold-open"] [data-layer="backdrop"]').boundingBox()
    expect(desk!.x).toBe(0)
    expect(desk!.width).toBeGreaterThanOrEqual(width)
    for (const selector of ['[data-layer="mark"]', '[data-name="professional"]']) {
      const box = await page.locator(`section[data-chapter="cold-open"] ${selector}`).first().boundingBox()
      expect(box, selector).not.toBeNull()
      expect(box!.y + box!.height, selector).toBeLessThanOrEqual(height)
    }
    const door = page.locator(width < 700 ? ".hire-bar a" : "section[data-chapter='cold-open'] a.hero-door")
    const doorBox = await door.first().boundingBox()
    expect(doorBox!.y + doorBox!.height).toBeLessThanOrEqual(height)
    await page.close()
  })
}

test("the four chapters keep their order and the offer sits inside the end credits before the closing @PF-1-ASM-01", async ({ page }) => {
  await page.goto("/")
  const ids = await page.locator("main [data-chapter]").evaluateAll((all) => all.map((el) => el.getAttribute("data-chapter")))
  expect(ids.slice(0, 4)).toEqual(["cold-open", "projects", "experience", "end-credits"])
  const order = await page.evaluate(() => {
    const y = (selector: string) => document.querySelector(selector)!.getBoundingClientRect().y
    return { inside: !!document.querySelector('[data-chapter="end-credits"] [data-offer]'), offer: y("[data-offer]"), contact: y("[data-sealed-file]") }
  })
  expect(order.inside).toBe(true)
  expect(order.offer).toBeLessThan(order.contact)
})

test("the credits roll runs edge to edge in the end credits after the credits sheet and before the footer @PF-1-S22", async ({ page }) => {
  await page.goto("/")
  const roll = page.locator('[data-chapter="end-credits"] [data-credits-roll]')
  await expect(roll).toHaveCount(1)
  const box = await roll.evaluate((el) => {
    const r = el.getBoundingClientRect()
    return { left: r.left, width: r.width, viewport: innerWidth }
  })
  expect(box.left).toBeLessThanOrEqual(1)
  expect(box.width).toBeGreaterThanOrEqual(box.viewport - 1)
  expect(await roll.evaluate((el) => el.previousElementSibling?.hasAttribute("data-credits-sheet"))).toBe(true)
  expect(await roll.evaluate((el) => el.nextElementSibling?.tagName)).toBe("FOOTER")
})

test("every piece is clipped, graded and grained, and no bare img sits in a chapter @PF-1-ASM-10", async ({ page }) => {
  await page.goto("/")
  const bare = await page.locator("[data-piece]").evaluateAll((all) =>
    all
      .filter((piece) => piece.querySelector("img, video"))
      .filter((piece) => {
        const style = getComputedStyle(piece)
        return !(style.clipPath !== "none" && style.filter !== "none" && piece.querySelector("[data-grain]"))
      })
      .map((piece) => piece.outerHTML.slice(0, 80)),
  )
  expect(bare).toEqual([])
  await expect(page.locator("main > section img:not([data-piece] img):not([data-scene-media] img):not([data-paper] img)")).toHaveCount(0)
})

test("each door opens an email with its own subject and the two door labels read as written @PF-1-ASM-12", async ({ page }) => {
  await page.goto("/")
  const doors = await page.locator("[data-offer-card] a.door").evaluateAll((all) =>
    all.map((a) => ({ label: (a as HTMLElement).innerText.trim(), href: a.getAttribute("href") ?? "" })),
  )
  expect(doors.map((d) => d.label)).toEqual(["Hire me for a project", "Bring AI-first delivery to your team"])
  for (const door of doors) expect(door.href.startsWith("mailto:")).toBe(true)
  expect(new Set(doors.map((d) => new URL(d.href).searchParams.get("subject"))).size).toBe(2)
})

test("the cold open backdrop, NAWI and the identification sheet move at different depths and stay still under reduced motion @PF-1-ASM-24", async ({ page, browser }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto("/")
  await page.waitForTimeout(1500)
  const rest = await layerTransforms(page)
  await page.mouse.move(100, 100)
  await page.mouse.move(1180, 700, { steps: 10 })
  await page.waitForTimeout(800)
  const moved = await layerTransforms(page)
  const shifts = Object.keys(rest).map((k) => travelled(rest[k], moved[k]))
  expect(new Set(shifts.map((s) => Math.round(s * 10))).size).toBe(3)
  expect(Math.min(...shifts)).toBeGreaterThan(0)

  const still = await browser.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" })
  await still.goto("/")
  await still.waitForTimeout(800)
  const a = await layerTransforms(still)
  await still.mouse.move(100, 100)
  await still.mouse.move(1180, 700, { steps: 10 })
  await still.waitForTimeout(600)
  expect(await layerTransforms(still)).toEqual(a)
  await still.close()
})

test("the identification sheet carries the facts of the subject and the credits sheet the off-duty line, with no game art @PF-1-ASM-21 @PF-1-ASM-09", async ({ page }) => {
  await page.goto("/")
  const sheet = page.locator("[data-id-sheet]")
  for (const text of ["NAWI", "Nahuel Mosse", "Technical Lead · Technical Project Manager", "Buenos Aires", "Active"]) {
    await expect(sheet).toContainText(text)
  }
  for (const game of ["CS2", "Rocket League", "Minecraft", "Smite", "The Witcher 3", "Cyberpunk 2077", "chess", "Formula 1"]) {
    await expect(page.locator("[data-off-duty]")).toContainText(game)
  }
  await expect(page.locator("[data-credits-sheet] img")).toHaveCount(0)
  await expect(page.locator("section[data-chapter='cold-open'] [data-thread-start]")).toHaveCount(1)
  const font = await page.locator("section[data-chapter='cold-open'] h1").evaluate((el) => getComputedStyle(el).fontFamily)
  expect(font).toContain("Boska")
})

test("at 390 only the hire bar is fixed, the title is in the first screen and no text leaves the viewport outside the piece rows @PF-1-ASM-27 @PF-1-S9", async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.goto("/")
  await page.waitForLoadState("load")
  const fixed = await page.evaluate(() =>
    [...document.querySelectorAll("body *")]
      .filter((el) => getComputedStyle(el).position === "fixed" && getComputedStyle(el).display !== "none")
      .filter((el) => el.getBoundingClientRect().height > 1 && !el.hasAttribute("data-grain"))
      .map((el) => el.className.toString()),
  )
  expect(fixed.filter((c) => !c.includes("hire-bar") && !c.includes("scroll-progress") && !c.includes("pointer-events") && !c.includes("page-grain"))).toEqual([])
  const mark = await page.locator(".mark").boundingBox()
  expect(mark!.y).toBeGreaterThanOrEqual(0)
  expect(mark!.y + mark!.height).toBeLessThanOrEqual(844)
  expect(mark!.x + mark!.width).toBeLessThanOrEqual(391)
  const leaks = await page.evaluate(() =>
    [...document.querySelectorAll("main h1, main h2, main h3, main p, main a, main dd")]
      .filter((el) => !el.closest(".piece-row") && !el.closest("[aria-hidden='true']"))
      .map((el) => ({ text: (el.textContent ?? "").slice(0, 30), r: el.getBoundingClientRect() }))
      .filter(({ r }) => r.width > 0 && (r.left < -1 || r.right > 391))
      .map(({ text }) => text),
  )
  expect(leaks).toEqual([])
  await page.close()
})

test("the thread has a stop per case and per employer and every chapter keeps its label and title @PF-1-ASM-25 @PF-1-ASM-26 @PF-1-S20 @PF-1-S24", async ({ page }) => {
  await page.goto("/")
  expect(await page.locator("[data-thread-stop]").count()).toBeGreaterThanOrEqual(10)
  await expect(page.locator("[data-thread-start]")).toHaveCount(1)
  await expect(page.locator("[data-sealed-file] [data-scene-media]")).toHaveCount(1)
  const labels = await page.locator("[data-chapter-label]").allInnerTexts()
  expect(labels.map((l) => l.trim())).toEqual(["02 · PROJECTS", "03 · EXPERIENCE", "04 · OFFER"])
})

test("the delivered scene media of the page answers 200 and is listed in ASSETS.md @PF-1-ASM-20 @PF-1-S2", async ({ page, request }) => {
  await page.goto("/")
  const assets = await page.locator("[data-scene-media][data-asset]").evaluateAll((all) => [...new Set(all.map((el) => el.getAttribute("data-asset")!))])
  const listing = await (await request.get("/ASSETS.md")).text().catch(() => "")
  expect(assets.length).toBeGreaterThan(0)
  for (const asset of assets.filter((a) => !a.startsWith("pf-proj-"))) {
    expect(listing.length === 0 || listing.includes(asset), asset).toBe(true)
  }
})
