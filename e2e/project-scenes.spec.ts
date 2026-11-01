import { existsSync } from "node:fs"
import { join } from "node:path"
import { test, expect } from "@playwright/test"

// The illustrations and photos are previewed untracked: the test follows what is on disk.
const onDisk = (id: string) => existsSync(join(process.cwd(), "public", "film", `${id}.webp`))

const SCENES = [
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
const PHONE_HEIGHT_DESKTOP = 0.6
const PHONE_WIDTH_MOBILE = 0.45
const WIDE_WIDTH_DESKTOP = 0.45
const WIDE_WIDTH_MOBILE = 0.8
const EMPLOYER_ART_DESKTOP_MIN = 480

const fades = (el: Element) => {
  const style = getComputedStyle(el)
  return style.maskImage !== "none" || style.webkitMaskImage !== "none" || style.clipPath !== "none"
}

test("at 390 and 1440 each project is a full-bleed scene whose real interface sits inside the screen drawn in its illustration, a phone screen at least 60% of the illustration's height at 1440 and 45% of its width at 390 and a laptop or monitor screen at least 45% of its width at 1440 and 80% at 390, with the title over the illustration, What, Problem and My role visible without a toggle and its other pieces in a row beneath; experience is a header illustration and one block per employer with logo, role, period, one line and the illustration of its system, no real capture of an employer's system is on the page, and his photos at work show; the cold open, offer and closing keep their faded full-bleed illustrations, no pins or torn paper are drawn, and an undelivered illustration leaves no box @PF-1-ASM-26", async ({ page }) => {
  const requested: string[] = []
  page.on("request", (request) => requested.push(request.url()))

  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.goto("/")
    await page.waitForLoadState("load")
    const desktop = viewport.width === 1440
    const aspect = desktop ? "16x9" : "4x5"

    for (const { project, name, device } of SCENES) {
      const spread = page.locator(`[data-project="${project}"]`)
      await spread.scrollIntoViewIfNeeded()
      const delivered = onDisk(`ill-scene-${name}-${aspect}`)

      if (delivered) {
        const art = spread.locator("[data-illustration]")
        await expect(art).toHaveCount(1)
        await expect(art.locator("img")).toHaveAttribute("src", new RegExp(`ill-scene-${name}-${aspect}\\.webp`))
        const artBox = (await art.boundingBox())!
        expect(artBox.width, `${project} scene is full-bleed`).toBeGreaterThanOrEqual(viewport.width - 1)
        const ratio = desktop ? 16 / 9 : 4 / 5
        expect(artBox.width / artBox.height, `${project} scene keeps the image's aspect`).toBeCloseTo(ratio, 1)

        const screen = spread.locator("[data-scene-screen]")
        await expect(screen).toHaveCount(1)
        const screenBox = (await screen.boundingBox())!
        expect(screenBox.x, `${project} screen inside the art`).toBeGreaterThanOrEqual(artBox.x - 1)
        expect(screenBox.y, `${project} screen inside the art`).toBeGreaterThanOrEqual(artBox.y - 1)
        expect(screenBox.x + screenBox.width, `${project} screen inside the art`).toBeLessThanOrEqual(artBox.x + artBox.width + 1)
        expect(screenBox.y + screenBox.height, `${project} screen inside the art`).toBeLessThanOrEqual(artBox.y + artBox.height + 1)
        if (device === "phone") {
          if (desktop) expect(screenBox.height / artBox.height, `${project} phone height`).toBeGreaterThanOrEqual(PHONE_HEIGHT_DESKTOP)
          else expect(screenBox.width / artBox.width, `${project} phone width`).toBeGreaterThanOrEqual(PHONE_WIDTH_MOBILE)
        } else {
          expect(screenBox.width / artBox.width, `${project} screen width`).toBeGreaterThanOrEqual(desktop ? WIDE_WIDTH_DESKTOP : WIDE_WIDTH_MOBILE)
        }

        const media = screen.locator("img, video, [data-document]")
        expect(await media.count(), `${project} real interface in the screen`).toBeGreaterThan(0)

        const title = spread.locator("h3").first()
        const titleBox = (await title.boundingBox())!
        expect(titleBox.y, `${project} title over the art`).toBeGreaterThanOrEqual(artBox.y - 1)
        expect(titleBox.y + titleBox.height, `${project} title over the art`).toBeLessThanOrEqual(artBox.y + artBox.height + 1)
        expect(titleBox.x + titleBox.width, `${project} title over the art`).toBeLessThanOrEqual(artBox.x + artBox.width + 1)
      } else {
        await expect(spread.locator("[data-illustration]"), `${project} leaves no box`).toHaveCount(0)
        await expect(spread.locator("[data-lead] [data-frame]")).toHaveCount(1)
      }

      for (const [field, label] of [["what", "What"], ["problem", "Problem"], ["role", "My role"]]) {
        await expect(spread.locator(`[data-field="${field}"]`)).toBeVisible()
        await expect(spread.locator(`[data-field="${field}"] [data-label]`)).toHaveText(label)
      }
      await expect(spread.locator("button[aria-expanded]")).toHaveCount(0)
      await expect(spread.locator("[data-stack]")).not.toBeEmpty()

      // the other pieces are one row beneath the scene
      const bottom = delivered ? (await spread.locator("[data-illustration]").boundingBox())!.y + (await spread.locator("[data-illustration]").boundingBox())!.height : 0
      const others = spread.locator("[data-pieces] [data-piece]")
      expect(await others.count(), `${project} other pieces`).toBeGreaterThan(0)
      const boxes: { x: number; y: number; width: number }[] = []
      for (const piece of await others.all()) boxes.push((await piece.boundingBox())!)
      for (const box of boxes) {
        expect(box.y, `${project} piece beneath the scene`).toBeGreaterThanOrEqual(bottom - 1)
        expect(Math.abs(box.y - boxes[0].y), `${project} pieces in one row`).toBeLessThanOrEqual(2)
      }
      if (desktop && boxes.length > 1) expect(boxes[1].x, `${project} second piece sits beside the first`).toBeGreaterThan(boxes[0].x)
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
