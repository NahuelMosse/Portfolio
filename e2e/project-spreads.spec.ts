import { existsSync } from "node:fs"
import { join } from "node:path"
import { test, expect } from "@playwright/test"

// The illustrations are previewed untracked: the test follows what is on disk.
const onDisk = (id: string) => existsSync(join(process.cwd(), "public", "film", `${id}.webp`))

const SPREADS = [
  { project: "dev-kit", asset: "ill-kit-16x9", frame: "document" },
  { project: "grit", asset: "ill-grit-16x9", frame: "phone" },
  { project: "guardia", asset: "ill-triaje-16x9", frame: "browser" },
  { project: "cebador", asset: "ill-cebador-16x9", frame: "browser" },
  { project: "club", asset: "ill-club-16x9", frame: "phone" },
]
const FULL_BLEED = ["ill-cover-16x9", "ill-offer-16x9", "ill-contact-16x9"]
const LEAD_DESKTOP = 560
const LEAD_PHONE_SHARE = 0.85
const ART_DESKTOP_SHARE = 0.45
const ART_PHONE_SHARE = 0.4
const MIN_TITLE = 32

test("at 390 and 1440 each project is a spread whose illustration takes at most 45% of the width at 1440 and alternates sides, whose lead piece sits in a device frame at least 560 px wide at 1440 and 85% of the column at 390, with What, Problem and My role visible without a toggle; experience is a header illustration and one block per employer with logo, role, period and one line, Frávega and Jüsto showing their screens in a browser frame; the cold open, offer and closing keep their faded full-bleed illustrations, no pins or torn paper are drawn, and an undelivered illustration leaves no box @PF-1-ASM-26", async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.goto("/")
    await page.waitForLoadState("load")
    const desktop = viewport.width === 1440
    const sides: string[] = []

    for (const { project, asset, frame } of SPREADS) {
      const spread = page.locator(`[data-project="${project}"]`)
      await spread.scrollIntoViewIfNeeded()
      const stage = (await spread.locator("[data-stage]").boundingBox())!

      if (onDisk(asset)) {
        const art = spread.locator(`[data-illustration][data-asset="${asset}"]`)
        const artBox = (await art.boundingBox())!
        expect(await art.evaluate((el) => getComputedStyle(el).maskImage !== "none"), `${project} art fades`).toBe(true)
        if (desktop) {
          expect(artBox.width, `${project} art share`).toBeLessThanOrEqual(viewport.width * ART_DESKTOP_SHARE)
          sides.push(artBox.x + artBox.width / 2 < viewport.width / 2 ? "left" : "right")
        } else {
          expect(artBox.height, `${project} art band`).toBeLessThanOrEqual(viewport.height * ART_PHONE_SHARE + 1)
          expect(artBox.y + artBox.height, `${project} band above the work`).toBeLessThanOrEqual(stage.y + 1)
        }
      }

      const lead = spread.locator("[data-lead] [data-frame]")
      await expect(lead).toHaveAttribute("data-frame", frame)
      const leadBox = (await lead.boundingBox())!
      if (desktop) expect(leadBox.width, `${project} lead width`).toBeGreaterThanOrEqual(LEAD_DESKTOP - 1)
      else expect(leadBox.width, `${project} lead share`).toBeGreaterThanOrEqual(stage.width * LEAD_PHONE_SHARE - 1)

      if (desktop) {
        const others = spread.locator("[data-piece]:not([data-lead]) [data-frame]")
        for (const other of await others.all()) {
          expect((await other.boundingBox())!.width, `${project} other smaller`).toBeLessThan(leadBox.width)
        }
        const first = (await others.first().boundingBox())!
        const overlaps = first.x < leadBox.x + leadBox.width && first.x + first.width > leadBox.x && first.y < leadBox.y + leadBox.height
        expect(overlaps, `${project} other overlaps the lead`).toBe(true)
      }

      for (const [field, label] of [["what", "What"], ["problem", "Problem"], ["role", "My role"]]) {
        await expect(spread.locator(`[data-field="${field}"]`)).toBeVisible()
        await expect(spread.locator(`[data-field="${field}"] [data-label]`)).toHaveText(label)
      }
      await expect(spread.locator("button[aria-expanded]")).toHaveCount(0)
      await expect(spread.locator("[data-stack]")).not.toBeEmpty()
      const titleSize = await spread.locator("h3").first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
      expect(titleSize, `${project} title`).toBeGreaterThanOrEqual(MIN_TITLE)
    }
    if (desktop) {
      const other = (side: string) => (side === "left" ? "right" : "left")
      sides.forEach((side, index) => expect(side, `side of spread ${index}`).toBe(index % 2 === 0 ? sides[0] : other(sides[0])))
    }

    const experience = page.locator('[data-chapter="experience"]')
    if (onDisk("ill-experience-16x9")) await expect(experience.locator("[data-illustration]")).toHaveCount(1)
    await expect(experience.locator("[data-employer]")).toHaveCount(5)
    for (const id of ["smart-warehousing", "grupo-st", "visma", "fravega", "justo"]) {
      const block = experience.locator(`[data-employer="${id}"]`)
      await block.scrollIntoViewIfNeeded()
      await expect(block.locator("[data-employer-tag]")).toHaveText(/^(CURRENT|PAST)$/)
      for (const field of ["[data-employer-title]", "[data-employer-period]", '[data-field="what"]']) {
        await expect(block.locator(field)).toBeVisible()
        await expect(block.locator(field)).not.toBeEmpty()
      }
    }
    for (const id of ["visma", "fravega", "justo"]) {
      await expect(experience.locator(`[data-employer="${id}"] [data-employer-logo]`)).toBeVisible()
    }
    for (const [id, count] of [["fravega", 4], ["justo", 3]] as const) {
      await expect(experience.locator(`[data-employer="${id}"] [data-frame="browser"]`)).toHaveCount(count)
      const lead = experience.locator(`[data-employer="${id}"] [data-lead] [data-frame="browser"]`)
      await lead.scrollIntoViewIfNeeded()
      if (desktop) expect((await lead.boundingBox())!.width, `${id} lead width`).toBeGreaterThanOrEqual(LEAD_DESKTOP - 1)
    }

    for (const asset of FULL_BLEED.filter(onDisk)) {
      const art = page.locator(`[data-illustration][data-asset="${asset}"]`)
      await expect(art).toHaveCount(1)
      expect(await art.evaluate((el) => getComputedStyle(el).maskImage !== "none"), `${asset} fades`).toBe(true)
      expect((await art.boundingBox())!.width, `${asset} edge to edge`).toBeGreaterThanOrEqual(viewport.width - 1)
    }

    const drawn = await page.evaluate(() => ({
      pins: document.querySelectorAll("[data-pin], .clip, .crimson-thread").length,
      torn: document.querySelectorAll('[data-asset*="paper-torn"], [data-paper="torn"]').length,
      emptyBoxes: [...document.querySelectorAll("[data-illustration]")].filter((el) => !el.querySelector("img")).length,
    }))
    expect(drawn).toEqual({ pins: 0, torn: 0, emptyBoxes: 0 })
  }
})
