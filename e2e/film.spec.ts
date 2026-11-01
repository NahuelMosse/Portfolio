import { test, expect, type Page } from "@playwright/test"

const CHAPTERS = ["cold-open", "projects", "experience", "end-credits"]
const BANNED_FONTS = /inter|geist|roboto|montserrat|bebas|anton/i

const layerTransform = (page: Page) =>
  page.evaluate(() =>
    Object.fromEntries(
      ["backdrop", "mark", "cutout", "sheet"].map((n) => {
        const el = document.querySelector(`[data-layer="${n}"]`) as HTMLElement
        const m = new DOMMatrix(getComputedStyle(el).transform)
        return [n, [m.m41, m.m42]]
      }),
    ),
  )

const distance = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1])

test("the page loads with no console error at 390 and 1280 @PF-1-S9", async ({ browser }) => {
  for (const width of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 800 } })
    const errors: string[] = []
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()))
    page.on("pageerror", (e) => errors.push(e.message))
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    expect(errors).toEqual([])
    await page.close()
  }
})

test("each chapter enters with its title card when scrolled into view @PF-1-S10", async ({ page }) => {
  await page.goto("/")
  for (const chapter of CHAPTERS.slice(1)) {
    const section = page.locator(`section[data-chapter="${chapter}"]`)
    const card = section.locator("[data-title-card]")
    await expect(card).toHaveAttribute("data-entered", "false")
    await section.scrollIntoViewIfNeeded()
    await section.evaluate((el) => el.scrollIntoView({ block: "start" }))
    await expect(card).toHaveAttribute("data-entered", "true")
  }
})

test("something moves on every chapter while scrolling @PF-1-S3", async ({ page }) => {
  await page.goto("/")
  for (const chapter of CHAPTERS) {
    const section = page.locator(`section[data-chapter="${chapter}"]`)
    const probe = () =>
      section.locator("[data-motion]").first().evaluate((el) => {
        const s = getComputedStyle(el)
        return `${s.transform}|${s.opacity}|${el.getBoundingClientRect().top}`
      })
    await section.evaluate((el) => el.scrollIntoView({ block: "start" }))
    const before = await probe()
    await page.mouse.wheel(0, 300)
    await page.waitForTimeout(500)
    expect(await probe()).not.toEqual(before)
  }
})

test("no sideways scroll at 320, 768 and 1280 @PF-1-S9", async ({ browser }) => {
  for (const width of [320, 768, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 800 } })
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(0)
    await page.close()
  }
})

test("every chapter has full-bleed media and its own transition into the next @PF-1-S20", async ({ page }) => {
  await page.goto("/")
  const width = page.viewportSize()!.width
  for (const [index, chapter] of CHAPTERS.entries()) {
    const section = page.locator(`section[data-chapter="${chapter}"]`)
    const media = await section.locator("[data-media]").first().boundingBox()
    expect(media!.width).toBeGreaterThanOrEqual(width - 1)
    if (index < CHAPTERS.length - 1) await expect(section.locator("[data-transition]")).toHaveCount(1)
  }
})

for (const width of [390, 1280]) {
  test(`Boska and General Sans load from the site itself, no element falls back to a system font or uses Inter, Geist, Roboto, Montserrat, Bebas Neue or Anton, and NAWI in Boska spans at least 90% of the viewport width at ${width} @PF-1-ASM-15`, async ({ browser }) => {
    const page = await browser.newPage({ viewport: { width, height: 800 } })
    const external: string[] = []
    page.on("request", (r) => {
      if (/\.(woff2?|ttf)(\?|$)/.test(r.url()) && !r.url().startsWith("http://localhost")) external.push(r.url())
    })
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    expect(external).toEqual([])
    const report = await page.evaluate(async () => {
      await document.fonts.ready
      const loaded = [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/"/g, ""))
      const families = new Set<string>()
      document.querySelectorAll("body *").forEach((el) => {
        if (el.childNodes.length && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim()))
          families.add(getComputedStyle(el).fontFamily.split(",")[0].replace(/"/g, "").trim())
      })
      const mark = document.querySelector('[data-layer="mark"]') as HTMLElement
      const range = document.createRange()
      range.selectNodeContents(mark)
      return {
        loaded,
        families: [...families],
        markWidth: range.getBoundingClientRect().width,
        markFont: getComputedStyle(mark).fontFamily,
        viewport: innerWidth,
      }
    })
    expect(report.loaded).toEqual(expect.arrayContaining(["Boska", "General Sans"]))
    for (const family of report.families) {
      expect(["Boska", "General Sans"]).toContain(family)
      expect(family).not.toMatch(BANNED_FONTS)
    }
    expect(report.markFont).toContain("Boska")
    expect(report.markWidth).toBeGreaterThanOrEqual(report.viewport * 0.9)
    await page.close()
  })
}

test("the cold open shows both Nawi and Nahuel Mosse @PF-1-S23", async ({ page }) => {
  await page.goto("/")
  const open = page.locator('section[data-chapter="cold-open"]')
  await expect(open).toContainText("NAWI")
  await expect(open).toContainText("Nahuel Mosse")
})

test("the cold open backdrop, NAWI, his cut-out and the character sheet move at different depths with pointer and scroll, and stay still under reduced motion @PF-1-ASM-24", async ({ page, browser }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto("/")
  await page.waitForTimeout(1500)
  const rest = await layerTransform(page)
  await page.mouse.move(100, 100)
  await page.mouse.move(1180, 700, { steps: 10 })
  await page.waitForTimeout(800)
  const moved = await layerTransform(page)
  const shifts = Object.keys(rest).map((k) => distance(rest[k], moved[k]))
  expect(new Set(shifts.map((s) => Math.round(s * 10))).size).toBe(4)
  expect(Math.min(...shifts)).toBeGreaterThan(0)
  await page.mouse.wheel(0, 200)
  await page.waitForTimeout(800)
  const scrolled = await layerTransform(page)
  const scrollShifts = Object.keys(moved).map((k) => distance(moved[k], scrolled[k]))
  expect(new Set(scrollShifts.map((s) => Math.round(s * 10))).size).toBe(4)

  const still = await browser.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" })
  await still.goto("/")
  await still.waitForTimeout(800)
  const a = await layerTransform(still)
  await still.mouse.move(100, 100)
  await still.mouse.move(1180, 700, { steps: 10 })
  await still.mouse.wheel(0, 200)
  await still.waitForTimeout(600)
  await still.evaluate(() => scrollTo(0, 0))
  const b = await layerTransform(still)
  expect(b).toEqual(a)
  await still.close()
})

test("the cold open frames him with a character sheet saying class Technical Lead · Technical Project Manager, base Buenos Aires and an off-duty line naming CS2, Rocket League, Minecraft, Smite, The Witcher 3, Cyberpunk 2077, chess and Formula 1 with no game logo or art, in thin-line frames, four-point stars are the only ornament, images sit in arch masks reached by leader lines, and the sheet has no stat bar, level or number @PF-1-ASM-21", async ({ page }) => {
  await page.goto("/")
  const sheet = page.locator('[data-layer="sheet"]')
  await expect(sheet).toContainText("Technical Lead · Technical Project Manager")
  await expect(sheet).toContainText("Buenos Aires")
  for (const game of ["CS2", "Rocket League", "Minecraft", "Smite", "The Witcher 3", "Cyberpunk 2077", "chess", "Formula 1"]) {
    await expect(sheet).toContainText(game)
  }
  await expect(sheet.locator("img, svg image, video, canvas")).toHaveCount(0)
  const frame = sheet.locator("[data-frame]").first()
  expect(parseFloat(await frame.evaluate((e) => getComputedStyle(e).borderTopWidth))).toBeLessThanOrEqual(1.5)
  expect(await page.locator('[data-chapter="cold-open"] [data-star]').count()).toBeGreaterThan(0)
  expect(await page.locator('[data-chapter="cold-open"] [data-arch]').count()).toBeGreaterThan(0)
  expect(await page.locator('[data-chapter="cold-open"] [data-leader]').count()).toBeGreaterThan(0)
  await expect(sheet.locator('[role="progressbar"], meter, progress, [data-stat], [data-level]')).toHaveCount(0)
  const withoutOffDuty = await sheet.evaluate((el) => {
    const clone = el.cloneNode(true) as HTMLElement
    clone.querySelectorAll("[data-off-duty]").forEach((n) => n.remove())
    return clone.textContent ?? ""
  })
  expect(withoutOffDuty).not.toMatch(/\d/)
})

test("NAWI in Boska is the largest text of the site with Nahuel Mosse beneath it in General Sans, the hero says I'm Nawi, and the page title, metadata, llms.txt, portfolio.json and both email doors say Nahuel Mosse @PF-1-ASM-19", async ({ page, request }) => {
  await page.goto("/")
  const sizes = await page.evaluate(() => {
    const out: { text: string; size: number }[] = []
    document.querySelectorAll("body *").forEach((el) => {
      const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent?.trim()).join("")
      if (own) out.push({ text: own, size: parseFloat(getComputedStyle(el).fontSize) })
    })
    return out
  })
  const largest = sizes.sort((a, b) => b.size - a.size)[0]
  expect(largest.text).toBe("NAWI")
  const name = page.locator('[data-name="professional"]')
  const [markBox, nameBox] = [await page.locator('[data-layer="mark"]').boundingBox(), await name.boundingBox()]
  expect(nameBox!.y).toBeGreaterThanOrEqual(markBox!.y + markBox!.height - 2)
  expect(await name.evaluate((e) => getComputedStyle(e).fontFamily)).toContain("General Sans")
  await expect(page.locator('section[data-chapter="cold-open"]')).toContainText("I'm Nawi")
  expect(await page.title()).toContain("Nahuel Mosse")
  expect(await page.locator('meta[name="description"], meta[property="og:title"]').evaluateAll((m) => m.map((x) => x.getAttribute("content")).join(" "))).toContain("Nahuel Mosse")
  expect(await (await request.get("/llms.txt")).text()).toContain("Nahuel Mosse")
  expect(JSON.stringify(await (await request.get("/portfolio.json")).json())).toContain("Nahuel Mosse")
  const doors = page.locator("[data-doors] a[href^='mailto:']")
  await expect(doors).toHaveCount(2)
  for (const href of await doors.evaluateAll((a) => a.map((x) => decodeURIComponent((x as HTMLAnchorElement).href)))) {
    expect(href).toContain("Nahuel Mosse")
  }
})

test("the hero title is in Boska with the cut-out photo in front of it, the only accent color is the red token, and no projector, letterbox or film-credits element exists @PF-1-ASM-09", async ({ page }) => {
  await page.goto("/")
  expect(await page.locator("h1").evaluate((e) => getComputedStyle(e).fontFamily)).toContain("Boska")
  const order = await page.evaluate(() => {
    const z = (n: string) => Number(getComputedStyle(document.querySelector(`[data-layer="${n}"]`)!).zIndex)
    return { mark: z("mark"), cutout: z("cutout") }
  })
  expect(order.cutout).toBeGreaterThan(order.mark)
  const offenders = await page.evaluate(() => {
    const red = getComputedStyle(document.documentElement).getPropertyValue("--red").trim()
    const canvas = document.createElement("canvas").getContext("2d")!
    const rgb = (c: string) => {
      canvas.fillStyle = "#000"
      canvas.fillStyle = c
      const v = canvas.fillStyle as string
      const n = parseInt(v.slice(1), 16)
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
    }
    const redRgb = rgb(red).join()
    const bad = new Set<string>()
    document.querySelectorAll("body *").forEach((el) => {
      const s = getComputedStyle(el)
      for (const c of [s.color, s.backgroundColor, s.borderTopColor]) {
        if (c === "rgba(0, 0, 0, 0)") continue
        const [r, g, b] = rgb(c.startsWith("rgba") ? c.replace(/,\s*[\d.]+\)/, ")").replace("rgba", "rgb") : c)
        const max = Math.max(r, g, b)
        const sat = max === 0 ? 0 : (max - Math.min(r, g, b)) / max
        if (sat > 0.25 && [r, g, b].join() !== redRgb) bad.add(c)
      }
    })
    return [...bad]
  })
  expect(offenders).toEqual([])
  await expect(page.locator("[data-projector], [data-letterbox], [data-film-credits], .projector, .letterbox")).toHaveCount(0)
})
