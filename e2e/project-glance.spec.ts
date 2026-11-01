import { existsSync } from "node:fs"
import { join } from "node:path"
import { test, expect } from "@playwright/test"

// The illustrations and photos are previewed untracked: the test follows what is on disk.
const onDisk = (id: string) => existsSync(join(process.cwd(), "public", "film", `${id}.webp`))

const STAGES = [
  { project: "dev-kit", name: "kit", device: "wide", line: "How I build with AI agents: the spec in, tested code out." },
  { project: "grit", name: "grit", device: "phone", line: "Offline gym tracker for Android and iOS. Product, design and code." },
  { project: "guardia", name: "triaje", device: "wide", line: "A browser game about triage under pressure. Rules and code." },
  { project: "cebador", name: "cebador", device: "wide", line: "Brand site for a fictional mate soda. Art direction, motion, code." },
  { project: "club", name: "club", device: "phone", line: "App and API to book sports courts. I built both." },
]
const EMPLOYERS = ["smart-warehousing", "grupo-st", "visma", "fravega", "justo"]
const FULL_BLEED = ["ill-cover-16x9", "ill-offer-16x9", "ill-contact-16x9"]
const WORK_STRIP = ["work-warehouse", "work-desk-a", "work-desk-b"]
const PRIVATE_CAPTURE = /\/(fravega-\d|justo-[12])\.webp/
const PHONE_HEIGHT_DESKTOP = 0.7
const PHONE_WIDTH_MOBILE = 0.75
const WIDE_WIDTH_DESKTOP = 0.55
const WIDE_WIDTH_MOBILE = 0.9
const ART_WIDTH_LIMIT = 2
const ART_HEIGHT_LIMIT = 1.4
const EMPLOYER_ART_DESKTOP_MIN = 480
const MAX_WORDS = 12
const MIN_OTHER_PIECES = 3
const MIN_PIECE_WIDTH = 240

const fades = (el: Element) => {
  const style = getComputedStyle(el)
  return style.maskImage !== "none" || style.webkitMaskImage !== "none" || style.clipPath !== "none"
}

test("at 390 and 1440 each project's real interface is its focal point, a phone interface at least 70% of the viewport's height at 1440 and 75% of its width at 390 and a laptop or monitor interface at least 55% of the viewport's width at 1440 and 90% at 390, sitting in the screen drawn in its illustration, whose visible part reaches at most twice the interface's width and 1.4 times its height; beside it only the title, one line of at most 12 words, the stack and the link, no What, Problem or My role and no text card among its pieces, at least three other pieces each at least 240 px wide are in view at once with the lead at 1440, at 390 the order is title, interface, line, stack and link, then the swiping row; experience is a header illustration and one block per employer with logo, role, period, one line and the illustration of its system, no real capture of an employer's system is on the page, and his photos at work show; the cold open, offer and closing keep their faded full-bleed illustrations, no pins or torn paper are drawn, and an undelivered illustration leaves no box @PF-1-ASM-26", async ({ page }) => {
  const requested: string[] = []
  page.on("request", (request) => requested.push(request.url()))

  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.goto("/")
    await page.waitForLoadState("load")
    const desktop = viewport.width === 1440
    const aspect = desktop ? "16x9" : "4x5"

    for (const { project, name, device, line } of STAGES) {
      const spread = page.locator(`[data-project="${project}"]`)
      await spread.scrollIntoViewIfNeeded()
      const delivered = onDisk(`ill-scene-${name}-${aspect}`)
      const screen = spread.locator("[data-scene-screen], [data-lead] [data-frame]").first()
      const screenBox = (await screen.boundingBox())!

      if (device === "phone") {
        if (desktop) expect(screenBox.height / viewport.height, `${project} phone height`).toBeGreaterThanOrEqual(PHONE_HEIGHT_DESKTOP - 0.01)
        else expect(screenBox.width / viewport.width, `${project} phone width`).toBeGreaterThanOrEqual(PHONE_WIDTH_MOBILE - 0.01)
      } else {
        expect(screenBox.width / viewport.width, `${project} interface width`).toBeGreaterThanOrEqual((desktop ? WIDE_WIDTH_DESKTOP : WIDE_WIDTH_MOBILE) - 0.01)
      }

      if (delivered) {
        const art = spread.locator("[data-illustration]")
        await expect(art).toHaveCount(1)
        await expect.poll(() => art.locator("img").evaluate((img: HTMLImageElement) => img.currentSrc), `${project} scene image`).toMatch(new RegExp(`ill-scene-${name}-${aspect}\\.webp`))
        expect(await art.evaluate(fades), `${project} art fades into the page`).toBe(true)
        const artBox = (await art.boundingBox())!
        expect(artBox.width, `${project} art width`).toBeLessThanOrEqual(screenBox.width * ART_WIDTH_LIMIT + 1)
        expect(artBox.height, `${project} art height`).toBeLessThanOrEqual(screenBox.height * ART_HEIGHT_LIMIT + 1)
        expect(screenBox.x, `${project} interface inside the art`).toBeGreaterThanOrEqual(artBox.x - 1)
        expect(screenBox.y, `${project} interface inside the art`).toBeGreaterThanOrEqual(artBox.y - 1)
        expect(screenBox.x + screenBox.width, `${project} interface inside the art`).toBeLessThanOrEqual(artBox.x + artBox.width + 1)
        expect(screenBox.y + screenBox.height, `${project} interface inside the art`).toBeLessThanOrEqual(artBox.y + artBox.height + 1)
        expect(await screen.locator("img, video, [data-document]").count(), `${project} real interface in the screen`).toBeGreaterThan(0)
      } else {
        await expect(spread.locator("[data-illustration]"), `${project} leaves no box`).toHaveCount(0)
        await expect(spread.locator("[data-lead] [data-frame]")).toHaveCount(1)
      }

      // the words: the title, one short line, the stack and the link; nothing else
      const text = spread.locator("[data-project-text]")
      await expect(text.locator("h3")).toBeVisible()
      const lineBox = text.locator('[data-field="line"]')
      await expect(lineBox).toHaveText(line)
      expect(line.split(/\s+/).length, `${project} line length`).toBeLessThanOrEqual(MAX_WORDS)
      await expect(spread.locator('[data-field="what"], [data-field="problem"], [data-field="role"], [data-label]'), `${project} has no labeled text`).toHaveCount(0)
      await expect(spread.locator("button[aria-expanded]")).toHaveCount(0)
      await expect(text.locator("[data-stack]")).not.toBeEmpty()
      await expect(spread.locator('[data-kind="card"], [data-kind="tests"], [data-kind="pull-request"], [data-kind="link"], .piece-text'), `${project} has no text piece`).toHaveCount(0)

      const others = spread.locator("[data-pieces] [data-piece]")
      expect(await others.count(), `${project} other pieces`).toBeGreaterThanOrEqual(MIN_OTHER_PIECES)

      if (desktop) {
        // the lead and at least three other pieces fit the viewport together
        const stage = spread.locator("[data-lead], [data-scene-screen]").first()
        await stage.evaluate((el) => window.scrollBy(0, el.getBoundingClientRect().top - 72))
        const lead = (await screen.boundingBox())!
        expect(lead.y, `${project} lead in view`).toBeGreaterThanOrEqual(0)
        expect(lead.y + lead.height, `${project} lead in view`).toBeLessThanOrEqual(viewport.height)
        const inView: number[] = []
        for (const piece of await others.all()) {
          const box = (await piece.boundingBox())!
          const visible = box.x >= 0 && box.x + box.width <= viewport.width && box.y >= 56 && box.y + box.height <= viewport.height
          if (visible) inView.push(box.width)
        }
        expect(inView.length, `${project} pieces in view with the lead`).toBeGreaterThanOrEqual(MIN_OTHER_PIECES)
        for (const width of inView) expect(width, `${project} piece width`).toBeGreaterThanOrEqual(MIN_PIECE_WIDTH - 1)
      } else {
        // title above the interface, then the line, the stack and the link, then the row
        const title = (await spread.locator("h3").first().boundingBox())!
        const now = (await screen.boundingBox())!
        const lineAt = (await lineBox.boundingBox())!
        const stack = (await text.locator("[data-stack]").boundingBox())!
        const row = (await spread.locator("[data-pieces]").boundingBox())!
        expect(title.y + title.height, `${project} title above the interface`).toBeLessThanOrEqual(now.y + 1)
        expect(lineAt.y, `${project} line beneath the interface`).toBeGreaterThanOrEqual(now.y + now.height - 1)
        expect(stack.y, `${project} stack beneath the line`).toBeGreaterThanOrEqual(lineAt.y + lineAt.height - 1)
        expect(row.y, `${project} row beneath the stack`).toBeGreaterThanOrEqual(stack.y + stack.height - 1)
        const links = spread.locator("[data-project-text] .links a")
        if (await links.count()) expect((await links.first().boundingBox())!.y, `${project} link before the row`).toBeLessThanOrEqual(row.y)
        await expect(spread.locator("[data-piece-counter]")).toBeVisible()
      }
    }

    const experience = page.locator('[data-chapter="experience"]')
    if (onDisk("ill-experience-21x9") || onDisk("ill-experience-16x9")) {
      const band = experience.locator("[data-scene]").first().locator("[data-illustration]")
      await expect(band).toHaveCount(1)
      if (onDisk("ill-experience-21x9")) await expect(band.locator("img")).toHaveAttribute("src", /ill-experience-21x9\.webp/)
    }
    await expect(experience.locator("[data-employer]")).toHaveCount(5)
    const employerSides: string[] = []
    for (const id of EMPLOYERS) {
      const block = experience.locator(`[data-employer="${id}"]`)
      await block.scrollIntoViewIfNeeded()
      await expect(block.locator("[data-employer-tag]")).toHaveText(/^(CURRENT|PAST)$/)
      for (const field of ["[data-employer-title]", "[data-employer-period]", '[data-field="what"]']) {
        await expect(block.locator(field)).toBeVisible()
        await expect(block.locator(field)).not.toBeEmpty()
      }
      await expect(block.locator("[data-frame]"), `${id} shows no real screen`).toHaveCount(0)

      if (onDisk(`ill-exp-${id}-4x3`)) {
        const art = block.locator(`[data-illustration][data-asset="ill-exp-${id}-4x3"]`)
        await art.scrollIntoViewIfNeeded()
        await expect(art).toHaveCount(1)
        expect(await art.evaluate(fades), `${id} illustration fades`).toBe(true)
        expect(await art.evaluate((el) => el.closest("[data-frame]") === null), `${id} illustration is not framed`).toBe(true)
        const box = (await art.boundingBox())!
        if (desktop) {
          expect(box.width, `${id} illustration is large`).toBeGreaterThanOrEqual(EMPLOYER_ART_DESKTOP_MIN)
          employerSides.push(box.x + box.width / 2 < viewport.width / 2 ? "left" : "right")
        } else {
          expect(box.width, `${id} illustration fills the column`).toBeGreaterThanOrEqual(viewport.width * 0.8)
        }
      }
    }
    if (desktop && employerSides.length === EMPLOYERS.length) {
      employerSides.forEach((side, index) => expect(side, `employer side ${index}`).not.toBe(employerSides[index - 1]))
    }
    for (const id of ["visma", "fravega", "justo"]) {
      await expect(experience.locator(`[data-employer="${id}"] [data-employer-logo]`)).toBeVisible()
    }

    // his photos at work: footage, never a bare rectangle
    if (onDisk("work-presenting")) {
      const presenting = experience.locator('[data-employer="justo"] [data-work-photo="work-presenting"]')
      await presenting.scrollIntoViewIfNeeded()
      await expect(presenting).toBeVisible()
      expect(await presenting.evaluate(fades), "presenting fades").toBe(true)
      await expect(presenting.locator("[data-grain]")).toHaveCount(1)
    }
    const strip = WORK_STRIP.filter(onDisk)
    if (strip.length > 0) {
      const onTheJob = experience.locator("[data-work-strip]")
      await onTheJob.scrollIntoViewIfNeeded()
      await expect(onTheJob.locator("[data-work-photo]")).toHaveCount(strip.length)
      expect(await onTheJob.evaluate((el) => el.closest("[data-employer]") === null), "the strip sits between blocks").toBe(true)
      for (const photo of await onTheJob.locator("[data-work-photo]").all()) {
        expect(await photo.evaluate(fades), "strip photo fades").toBe(true)
        await expect(photo.locator("[data-grain]")).toHaveCount(1)
      }
    }

    for (const asset of FULL_BLEED.filter(onDisk)) {
      const art = page.locator(`[data-illustration][data-asset="${asset}"]`)
      await expect(art).toHaveCount(1)
      expect(await art.evaluate(fades), `${asset} fades`).toBe(true)
      expect((await art.boundingBox())!.width, `${asset} edge to edge`).toBeGreaterThanOrEqual(viewport.width - 1)
    }

    const drawn = await page.evaluate(() => ({
      pins: document.querySelectorAll("[data-pin], .clip, .crimson-thread").length,
      torn: document.querySelectorAll('[data-asset*="paper-torn"], [data-paper="torn"]').length,
      emptyBoxes: [...document.querySelectorAll("[data-illustration]")].filter((el) => !el.querySelector("img")).length,
      privateCaptures: [...document.querySelectorAll("img, source")].filter((el) => /\/(fravega-\d|justo-[12])\.webp/.test(`${el.getAttribute("src")} ${el.getAttribute("srcset")}`)).length,
    }))
    expect(drawn).toEqual({ pins: 0, torn: 0, emptyBoxes: 0, privateCaptures: 0 })
  }

  expect(requested.filter((url) => PRIVATE_CAPTURE.test(url)), "no private capture is ever requested").toEqual([])
})
