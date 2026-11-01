import { test, expect, type Locator, type Page } from "@playwright/test"

const CHAPTERS = ["cold-open", "projects", "experience", "end-credits"]
const STUDIES = ["Analista en Informática · Universidad de Morón · 2025", "Técnico Electromecánico · Colegio Emaús · 2021"]
const CERTIFICATIONS = [
  "EF SET C2 Proficient",
  "Arquitectura de Software Aplicada · Platzi",
  "Fundamentos de Arquitectura de Software · Platzi 2026",
  "Liceo Cultural Británico · Nivel 7",
  "Liceo Cultural Británico · Nivel 6",
  "Fundamentos de Arquitectura de Software · Platzi 2023",
  "Fundamentos de Ingeniería de Software · Platzi",
  "Responsive Web Design · freeCodeCamp",
]

const credits = (page: Page) => page.locator('section[data-chapter="end-credits"]')

test.beforeEach(async ({ page }) => {
  await page.goto("/")
})

const scrollFraction = async (page: Page, fraction: number) => {
  await page.evaluate((f) => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * f), fraction)
  await page.waitForTimeout(400)
}

const drawn = (page: Page) =>
  page.locator("[data-thread-path]").evaluate((el) => parseFloat(getComputedStyle(el).strokeDasharray))

test("one crimson thread runs from the cold open through every chapter, grows with scroll, and ends split into the two doors; every chapter has a figure crossing into the next and none sits in a closed frame @PF-1-ASM-25", async ({ page }) => {
  const thread = page.locator("[data-crimson-thread]")
  await expect(thread).toHaveCount(1)
  const stops = await page.locator("[data-thread-stop]").count()
  expect(stops).toBeGreaterThanOrEqual(11)
  await expect(thread.locator("[data-thread-node]")).toHaveCount(stops)

  const placement = await page.evaluate(() => {
    const main = document.querySelector("main")!.getBoundingClientRect()
    const rel = (r: DOMRect) => ({ top: r.top - main.top, bottom: r.bottom - main.top, left: r.left - main.left, width: r.width })
    const nodes = [...document.querySelectorAll("[data-thread-node]")].map((n) => {
      const stop = document.querySelector(`[data-thread-stop="${n.getAttribute("data-thread-node")}"]`)!
      const c = n.getBoundingClientRect()
      const s = rel(stop.getBoundingClientRect())
      const y = c.top + c.height / 2 - main.top
      return y >= s.top - 1 && y <= s.bottom + 1
    })
    const path = document.querySelector("[data-thread-path]") as SVGPathElement
    const start = path.getPointAtLength(0)
    const coldOpen = rel(document.querySelector('section[data-chapter="cold-open"]')!.getBoundingClientRect())
    const doors = [...document.querySelectorAll("[data-doors] a[href^='mailto:']")].map((d) => rel(d.getBoundingClientRect()))
    const branches = [...document.querySelectorAll("[data-thread-branch]")].map((b) => {
      const p = b as SVGPathElement
      const end = p.getPointAtLength(p.getTotalLength())
      return { x: end.x, y: end.y }
    })
    return { nodes, startsInColdOpen: start.y >= coldOpen.top && start.y <= coldOpen.bottom, doors, branches }
  })
  expect(placement.nodes.every(Boolean)).toBe(true)
  expect(placement.startsInColdOpen).toBe(true)
  expect(placement.doors).toHaveLength(2)
  expect(placement.branches).toHaveLength(2)
  placement.doors.forEach((door, i) => {
    expect(Math.abs(placement.branches[i].x - (door.left + door.width / 2))).toBeLessThan(door.width / 2)
    expect(Math.abs(placement.branches[i].y - door.top)).toBeLessThan(48)
  })

  const atTop = await drawn(page)
  await scrollFraction(page, 0.5)
  const atMiddle = await drawn(page)
  await scrollFraction(page, 1)
  const atEnd = await drawn(page)
  expect(atTop).toBeLessThan(atMiddle)
  expect(atMiddle).toBeLessThan(atEnd)
  expect(atEnd).toBeGreaterThan(0.98)

  const seams = await page.evaluate((ids) => {
    const figures = [...document.querySelectorAll("[data-seam-figure]")].map((f) => f.getBoundingClientRect())
    return ids.map((id) => {
      const section = document.querySelector(`section[data-chapter="${id}"]`)!
      const r = section.getBoundingClientRect()
      const cs = getComputedStyle(section)
      return {
        id,
        crossed: figures.some((f) => [r.top, r.bottom].some((edge) => f.top < edge - 8 && f.bottom > edge + 8)),
        framed:
          parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth) + parseFloat(cs.borderLeftWidth) > 0 ||
          cs.borderRadius !== "0px" ||
          cs.clipPath !== "none" ||
          cs.boxShadow !== "none" ||
          cs.outlineStyle !== "none",
      }
    })
  }, CHAPTERS)
  for (const seam of seams) {
    expect(seam.crossed, `${seam.id} has a figure crossing its edge`).toBe(true)
    expect(seam.framed, `${seam.id} sits in a closed frame`).toBe(false)
  }
})

test("the end credits offer email and LinkedIn, and GitHub as a secondary link after the two doors @PF-1-ASM-04", async ({ page }) => {
  const section = credits(page)
  await expect(section.locator('a[data-contact="email"][href="mailto:nahuelgamail@gmail.com"]')).toHaveCount(1)
  await expect(section.locator('a[href^="https://linkedin.com/in/nahuelmosse"]')).toHaveCount(1)
  await expect(section.locator('[data-secondary] a[href="https://github.com/NahuelMosse"]')).toHaveCount(1)
  const afterDoors = await section.evaluate(
    (el) =>
      !!(el.querySelector("[data-doors]")!.compareDocumentPosition(el.querySelector("[data-secondary]")!) & Node.DOCUMENT_POSITION_FOLLOWING),
  )
  expect(afterDoors).toBe(true)
})

test("the soundtrack is off until the toggle is pressed @PF-1-ASM-08", async ({ page }) => {
  const toggle = page.locator("[data-sound-toggle]")
  await expect(toggle).toBeVisible()
  await expect(toggle).toHaveAttribute("aria-pressed", "false")
  await page.waitForTimeout(1500)
  const playing = () => page.evaluate(() => [...document.querySelectorAll("audio")].filter((a) => !a.paused).length)
  expect(await playing()).toBe(0)
  await toggle.click()
  await expect(toggle).toHaveAttribute("aria-pressed", "true")
  await toggle.click()
  await expect(toggle).toHaveAttribute("aria-pressed", "false")
  expect(await playing()).toBe(0)
})

test("a call to action is in view in every chapter after the cold open @PF-1-S17", async ({ page }) => {
  const cta = page.locator("[data-cta]")
  await expect(cta).toHaveAttribute("data-visible", "false")
  await expect(cta).toHaveAttribute("data-visible", "true", { timeout: 4500 })
  for (const id of CHAPTERS.slice(1, 3)) {
    await page.locator(`section[data-chapter="${id}"]`).evaluate((el) => el.scrollIntoView({ block: "center" }))
    await expect(cta).toBeInViewport()
  }
  await page.locator("[data-doors]").evaluate((el) => el.scrollIntoView({ block: "center" }))
  await expect(page.locator("[data-doors] a").first()).toBeInViewport()
})

test("each door opens an email with its own subject and three prompts in the body; the credits end on the two doors @PF-1-ASM-12", async ({ page }) => {
  const doors = page.locator("[data-doors] a[href^='mailto:']")
  await expect(doors).toHaveCount(2)
  const labels = await doors.allInnerTexts()
  expect(labels.map((l) => l.trim())).toEqual(["Hire me for a project", "Bring AI-first delivery to your team"])
  const subjects = await doors.evaluateAll((a) => a.map((x) => new URL((x as HTMLAnchorElement).href).searchParams.get("subject") ?? ""))
  expect(subjects[0]).toContain("Freelance")
  expect(subjects[1]).toContain("Technical Project Manager")
  const bodies = await doors.evaluateAll((a) => a.map((x) => new URL((x as HTMLAnchorElement).href).searchParams.get("body") ?? ""))
  for (const body of bodies) expect(body.split("\n").filter((l) => l.trim().length > 0)).toHaveLength(3)
  expect(bodies[0]).not.toEqual(bodies[1])
  const lastIsDoor = await credits(page).evaluate((el) => {
    const all = [...el.querySelectorAll("a, button")].filter((n) => !n.closest("[data-secondary]"))
    return !!all[all.length - 1].closest("[data-doors]")
  })
  expect(lastIsDoor).toBe(true)
})

test("the intro skips, the chapter index jumps by click and by keyboard; every link, door, index item, skip and sound toggle answers hover, a visible focus ring and press @PF-1-S18", async ({ page }) => {
  const targets: Record<string, Locator> = {
    link: page.locator("article[data-project] .links a").first(),
    door: page.locator("[data-doors] a").first(),
    index: page.locator("[data-chapter-index] [data-index-item]").first(),
    skip: page.locator("[data-skip]"),
    sound: page.locator("[data-sound-toggle]"),
  }
  for (const [name, target] of Object.entries(targets)) {
    await target.evaluate((el) => el.scrollIntoView({ block: "center" }))
    await target.focus()
    const ring = await target.evaluate((el) => getComputedStyle(el).outlineStyle)
    expect(ring, `${name} focus ring`).not.toBe("none")
  }
  for (const [name, target] of Object.entries(targets)) {
    await target.evaluate((el) => el.scrollIntoView({ block: "center" }))
    const style = () =>
      target.evaluate((el) => {
        const s = getComputedStyle(el)
        return `${s.backgroundColor}|${s.color}|${s.transform}`
      })
    const rest = await style()
    await target.hover()
    await page.waitForTimeout(350)
    expect(await style(), `${name} hover`).not.toEqual(rest)
    await page.mouse.down()
    await page.waitForTimeout(350)
    const press = await target.evaluate((el) => getComputedStyle(el).transform)
    await page.mouse.up()
    expect(press, `${name} press`).not.toBe("none")
    await page.mouse.move(2, 2)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.locator('[data-index-item="experience"]').click()
  await expect(page.locator('section[data-chapter="experience"] h2')).toBeFocused()
  await page.locator('[data-index-item="end-credits"]').focus()
  await page.keyboard.press("Enter")
  await expect(page.locator('section[data-chapter="end-credits"] h2')).toBeFocused()
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.locator("[data-skip]").click()
  await expect(page.locator("article[data-project] h3").first()).toBeFocused()
})

test("the wheel scrolls natively, every chapter reads with sound off, focus lands on the chapter heading after a jump and on the first project heading after skip, and skip is focusable at second 1 @PF-1-ASM-13", async ({ page }) => {
  await page.waitForTimeout(1000)
  const skip = page.locator("[data-skip]")
  await expect(skip).toBeVisible()
  await skip.focus()
  await expect(skip).toBeFocused()
  await page.mouse.move(600, 400)
  await page.mouse.wheel(0, 400)
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(200)
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThanOrEqual(1200)
  for (const id of CHAPTERS.slice(1)) {
    await page.locator(`[data-index-item="${id}"]`).click()
    const heading = page.locator(`section[data-chapter="${id}"] h2`)
    await expect(heading).toBeFocused()
    expect((await heading.innerText()).trim().length).toBeGreaterThan(0)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await skip.click()
  expect(await page.evaluate(() => document.activeElement?.tagName)).toBe("H3")
  await expect(page.locator("article[data-project] h3").first()).toBeFocused()
})

test("the completed studies and the certifications move right to left without end and keep moving after a full loop @PF-1-S21", async ({ page }) => {
  const bands = page.locator("[data-credits-roll] [data-band]")
  await expect(bands).toHaveCount(2)
  await bands.first().evaluate((el) => el.scrollIntoView({ block: "center" }))
  for (let i = 0; i < 2; i++) {
    const track = bands.nth(i).locator(".animate-marquee").first()
    const x = () => track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41)
    const first = await x()
    await page.waitForTimeout(400)
    expect(await x()).toBeLessThan(first)
    const iterations = await track.evaluate((el) => {
      const animation = el.getAnimations()[0]
      const timing = animation.effect!.getComputedTiming()
      animation.currentTime = (timing.duration as number) * 1.5
      return timing.iterations
    })
    expect(iterations).toBe(Infinity)
    const afterLoop = await x()
    await page.waitForTimeout(400)
    expect(await x()).not.toEqual(afterLoop)
  }
})

test("the credits roll sits in the end credits, full-bleed, directly before the two doors @PF-1-S22", async ({ page }) => {
  const roll = credits(page).locator("[data-credits-roll]")
  await expect(roll).toHaveCount(1)
  const box = await roll.evaluate((el) => {
    const r = el.getBoundingClientRect()
    return { left: r.left, width: r.width, viewport: innerWidth }
  })
  expect(box.left).toBeLessThanOrEqual(1)
  expect(box.width).toBeGreaterThanOrEqual(box.viewport - 1)
  expect(await roll.evaluate((el) => el.nextElementSibling?.hasAttribute("data-doors"))).toBe(true)
})

test("the roll lists Analista en Informática 2025 and Técnico Electromecánico 2021, the eight certifications with Platzi 2026 and 2023 and Liceo Nivel 7 and 6, not Ingeniería Informática; hover and focus pause it, one list is read and the copies are aria-hidden, reduced motion stands it still @PF-1-ASM-18", async ({ page }) => {
  const roll = page.locator("[data-credits-roll]")
  const studies = roll.locator("[data-band]").nth(0)
  const certifications = roll.locator("[data-band]").nth(1)
  const readable = (band: Locator) => band.locator("ul:not([aria-hidden]) li").allInnerTexts()
  expect((await readable(studies)).map((t) => t.trim())).toEqual(STUDIES)
  expect((await readable(certifications)).map((t) => t.trim())).toEqual(CERTIFICATIONS)
  expect(await roll.innerText()).not.toContain("Ingeniería Informática")
  for (const logo of ["logo-UM", "logo-emaus", "logo-liceo-cultural-britanico"]) {
    expect(await roll.locator(`img[src*="${logo}"]`).count()).toBeGreaterThan(0)
  }
  expect(await roll.locator("[aria-hidden='true'] li").count()).toBeGreaterThan(0)
  const durations = await roll.locator("[data-band]").evaluateAll((els) =>
    els.map((el) => el.querySelector(".animate-marquee")!.getAnimations()[0].effect!.getComputedTiming().duration as number),
  )
  expect(durations[0]).toBeGreaterThan(durations[1])
  expect(await studies.evaluate((el) => getComputedStyle(el).maskImage)).not.toBe("none")
  await studies.evaluate((el) => el.scrollIntoView({ block: "center" }))
  const state = (band: Locator) => band.locator(".animate-marquee").first().evaluate((el) => el.getAnimations()[0].playState)
  expect(await state(studies)).toBe("running")
  await studies.hover()
  expect(await state(studies)).toBe("paused")
  await page.mouse.move(2, 2)
  await certifications.focus()
  expect(await state(certifications)).toBe("paused")
  await page.emulateMedia({ reducedMotion: "reduce" })
  const still = await certifications.evaluate((el) => {
    const copies = [...el.querySelectorAll(".animate-marquee")]
    return {
      animation: getComputedStyle(copies[0]).animationName,
      wraps: getComputedStyle(copies[0].parentElement!).flexWrap,
      extraCopies: copies.slice(1).every((c) => getComputedStyle(c).display === "none"),
    }
  })
  expect(still).toEqual({ animation: "none", wraps: "wrap", extraCopies: true })
})

test("each chapter title straddles the edge with the chapter before, the one red disc travels down behind every chapter with scroll and is the rising disc at the closing, each deity looks or reaches toward the next chapter, one HUD rail with a tick per chapter runs the whole page, and no full-width background change sits between chapters @PF-1-ASM-26", async ({ page }) => {
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

  await expect(page.locator("[data-red-disc]")).toHaveCount(1)
  const disc = (fraction: number) =>
    scrollFraction(page, fraction).then(() =>
      page.evaluate(() => {
        const el = document.querySelector("[data-red-disc]")!
        const r = el.getBoundingClientRect()
        const centre = r.top + r.height / 2
        const inside = (id: string) => {
          const s = document.querySelector(`section[data-chapter="${id}"]`)!.getBoundingClientRect()
          return centre + scrollY >= s.top + scrollY && centre + scrollY <= s.bottom + scrollY
        }
        const z = parseInt(getComputedStyle(el).zIndex || "0") || 0
        const chapterZ = parseInt(getComputedStyle(document.querySelector("section[data-chapter]")!).zIndex) || 0
        return { top: r.top, page: centre + scrollY, inColdOpen: inside("cold-open"), inCredits: inside("end-credits"), behind: z < chapterZ }
      }),
    )
  const start = await disc(0)
  const middle = await disc(0.5)
  const late = await disc(0.75)
  const end = await disc(1)
  expect(start.inColdOpen).toBe(true)
  expect(start.page).toBeLessThan(middle.page)
  expect(middle.page).toBeLessThan(end.page)
  expect(end.inCredits).toBe(true)
  expect(end.top).toBeLessThan(late.top)
  expect([start, middle, end].every((d) => d.behind)).toBe(true)

  const figures = await page.evaluate(() =>
    [...document.querySelectorAll("[data-seam-figure]")].map((f) => ({
      toward: f.getAttribute("data-toward"),
      side: f.getAttribute("data-side"),
      mirrored: new DOMMatrix(getComputedStyle(f).transform).a < 0,
    })),
  )
  expect(figures.map((f) => f.toward)).toEqual(CHAPTERS.slice(1))
  figures.forEach((f, i) => {
    expect(f.mirrored, `figure ${i} faces the chapter its side points to`).toBe(f.side === "right")
    if (i > 0) expect(f.side).not.toBe(figures[i - 1].side)
  })

  const rail = page.locator("[data-hud-rail]")
  await expect(rail).toHaveCount(1)
  await expect(rail.locator("[data-rail-tick]")).toHaveCount(CHAPTERS.length)
  const box = await rail.boundingBox()
  expect(box!.height).toBeGreaterThan(page.viewportSize()!.height * 0.5)
  expect(await rail.evaluate((el) => getComputedStyle(el).position)).toBe("fixed")
  await scrollFraction(page, 0)
  await expect(rail.locator('[data-rail-tick][aria-current="true"]')).toHaveAttribute("data-rail-tick", "cold-open")
  await scrollFraction(page, 1)
  await expect(rail.locator('[data-rail-tick][aria-current="true"]')).toHaveAttribute("data-rail-tick", "end-credits")

  const bands = await page.evaluate(() => {
    const wide = (el: Element) => el.getBoundingClientRect().width >= innerWidth * 0.9
    const painted = (el: Element) => {
      const cs = getComputedStyle(el)
      const alpha = cs.backgroundColor.match(/[\d.]+/g)?.[3]
      return (cs.backgroundColor !== "rgba(0, 0, 0, 0)" && alpha !== "0") || cs.backgroundImage !== "none"
    }
    return [...document.querySelectorAll("section[data-chapter]:not([data-chapter='cold-open']), [data-transition]")]
      .filter((el) => wide(el) && painted(el))
      .map((el) => el.getAttribute("data-chapter") ?? "transition")
  })
  expect(bands).toEqual([])
})
