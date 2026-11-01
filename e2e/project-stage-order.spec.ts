import { existsSync } from "node:fs"
import { join } from "node:path"
import { test, expect } from "@playwright/test"

// The illustrations and photos are previewed untracked: the test follows what is on disk.
const onDisk = (id: string) => existsSync(join(process.cwd(), "public", "film", `${id}.webp`))

const STAGES = [
  { project: "dev-kit", name: "kit", device: "wide" },
  { project: "grit", name: "grit", device: "phone" },
  { project: "guardia", name: "triaje", device: "wide" },
  { project: "cebador", name: "cebador", device: "wide" },
  { project: "club", name: "club", device: "phone" },
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

const fades = (el: Element) => {
  const style = getComputedStyle(el)
  return style.maskImage !== "none" || style.webkitMaskImage !== "none" || style.clipPath !== "none"
}

test("at 390 and 1440 each project's real interface is its focal point, a phone interface at least 70% of the viewport's height at 1440 and 75% of its width at 390 and a laptop or monitor interface at least 55% of the viewport's width at 1440 and 90% at 390, sitting in the screen drawn in its illustration, whose visible part reaches at most twice the interface's width and 1.4 times its height; the title, What, Problem and My role are visible without a toggle beside it at 1440, at 390 the title is above it and starts in view together with its top half while the three lines follow beneath it, and its other pieces sit in a row beneath; experience is a header illustration and one block per employer with logo, role, period, one line and the illustration of its system, no real capture of an employer's system is on the page, and his photos at work show; the cold open, offer and closing keep their faded full-bleed illustrations, no pins or torn paper are drawn, and an undelivered illustration leaves no box @PF-1-ASM-26", async ({ page }) => {
  const requested: string[] = []
  page.on("request", (request) => requested.push(request.url()))

  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.goto("/")
    await page.waitForLoadState("load")
    const desktop = viewport.width === 1440
    const aspect = desktop ? "16x9" : "4x5"

    for (const { project, name, device } of STAGES) {
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

      // the words: beside the interface at 1440, above it at 390
      const text = spread.locator("[data-project-text]")
      await expect(text.locator("h3")).toBeVisible()
      for (const [field, label] of [["what", "What"], ["problem", "Problem"], ["role", "My role"]]) {
        await expect(text.locator(`[data-field="${field}"]`)).toBeVisible()
        await expect(text.locator(`[data-field="${field}"] [data-label]`)).toHaveText(label)
      }
      await expect(spread.locator("button[aria-expanded]")).toHaveCount(0)
      await expect(text.locator("[data-stack]")).not.toBeEmpty()
      let textBottom = 0
      if (desktop) {
        const textBox = (await text.boundingBox())!
        textBottom = textBox.y + textBox.height
        expect(textBox.x + textBox.width, `${project} text beside the interface`).toBeLessThanOrEqual(screenBox.x + 1)
        expect(textBox.y, `${project} text level with the interface`).toBeLessThan(screenBox.y + screenBox.height)
        expect(textBox.y + textBox.height, `${project} text level with the interface`).toBeGreaterThan(screenBox.y)
      } else {
        // the title alone is above the interface; the interface starts in view with it; the lines follow beneath
        await spread.locator("h3").first().evaluate((el) => el.scrollIntoView({ block: "start" }))
        const titleBox = (await spread.locator("h3").first().boundingBox())!
        const nowScreen = (await screen.boundingBox())!
        expect(titleBox.y + titleBox.height, `${project} title above the interface`).toBeLessThanOrEqual(nowScreen.y + 1)
        expect(titleBox.y, `${project} title in view`).toBeGreaterThanOrEqual(0)
        expect(nowScreen.y + nowScreen.height / 2, `${project} top half of the interface in view`).toBeLessThanOrEqual(viewport.height)
        for (const field of ["what", "problem", "role"]) {
          const box = (await text.locator(`[data-field="${field}"]`).boundingBox())!
          expect(box.y, `${project} ${field} beneath the interface`).toBeGreaterThanOrEqual(nowScreen.y + nowScreen.height - 1)
          textBottom = Math.max(textBottom, box.y + box.height)
        }
        textBottom = Math.max(textBottom, (await text.locator("[data-stack]").boundingBox())!.y)
      }
      const screenNow = (await screen.boundingBox())!

      // the other pieces are one row beneath
      const stageBottom = Math.max(screenNow.y + screenNow.height, textBottom)
      const others = spread.locator("[data-pieces] [data-piece]")
      expect(await others.count(), `${project} other pieces`).toBeGreaterThan(0)
      const boxes: { x: number; y: number }[] = []
      for (const piece of await others.all()) boxes.push((await piece.boundingBox())!)
      for (const box of boxes) {
        expect(box.y, `${project} piece beneath`).toBeGreaterThanOrEqual(stageBottom - 1)
        expect(Math.abs(box.y - boxes[0].y), `${project} pieces in one row`).toBeLessThanOrEqual(2)
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
