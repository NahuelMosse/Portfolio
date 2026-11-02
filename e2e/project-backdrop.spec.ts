import { test, expect } from "@playwright/test"

// the product's own color per project (design/art-direction.md) as the browser reports it, and the backdrop file stem
const PROJECTS = [
  { project: "dev-kit", backdrop: "kit", device: "diagram", field: "rgb(179, 38, 30)" },
  { project: "grit", backdrop: "grit", device: "phone", field: "rgb(31, 85, 214)" },
  { project: "guardia", backdrop: "guardia", device: "wide", field: "rgb(54, 209, 168)" },
  { project: "cebador", backdrop: "cebador", device: "wide", field: "rgb(240, 168, 172)" },
  { project: "club", backdrop: "club", device: "phone", field: "rgb(205, 235, 58)" },
]
const KIT_STEPS = ["card", "questions", "red", "build", "gate", "pr"]
const CRIMSON = "rgb(210, 35, 27)"
const PHONE_HEIGHT_DESKTOP = 0.7
const PHONE_WIDTH_MOBILE = 0.75
const WIDE_WIDTH_DESKTOP = 0.55
const WIDE_WIDTH_MOBILE = 0.9
const MAX_WORDS = 12
const AA = 4.5
const MIN_POSTER_TYPE = 0.12

test("at 390 and 1440 each project section carries a full-bleed backdrop from its own file, its real interface large in a plain code-drawn frame with no blend and no perspective, its field color, numeral and word kept, legible stack chips on every product color, and the dev kit diagram a six-shape crimson path on the backdrop @PF-1-ASM-26", async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.goto("/")
    await page.waitForLoadState("load")
    const desktop = viewport.width === 1440

    for (const { project, backdrop, device, field } of PROJECTS) {
      const spread = page.locator(`[data-project="${project}"]`)
      await spread.scrollIntoViewIfNeeded()
      const spreadBox = (await spread.boundingBox())!

      // the field stays under everything, edge to edge
      expect(await spread.evaluate((el) => getComputedStyle(el).backgroundColor), `${project} field color`).toBe(field)
      expect(spreadBox.width, `${project} full-bleed`).toBeGreaterThanOrEqual(viewport.width - 1)

      // the backdrop: one picture covering the whole section, the file of the width, loaded, covering, never blended
      const picture = spread.locator("picture[data-backdrop]")
      await expect(picture, `${project} has one backdrop`).toHaveCount(1)
      const pictureBox = (await picture.boundingBox())!
      expect(Math.abs(pictureBox.x - spreadBox.x), `${project} backdrop left`).toBeLessThanOrEqual(1)
      expect(Math.abs(pictureBox.width - spreadBox.width), `${project} backdrop width`).toBeLessThanOrEqual(1)
      expect(Math.abs(pictureBox.y - spreadBox.y), `${project} backdrop top`).toBeLessThanOrEqual(1)
      expect(Math.abs(pictureBox.height - spreadBox.height), `${project} backdrop height`).toBeLessThanOrEqual(1)
      const image = picture.locator("img")
      await image.scrollIntoViewIfNeeded()
      await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0), `${project} backdrop loaded`).toBe(true)
      const shown = await image.evaluate((el: HTMLImageElement) => {
        const style = getComputedStyle(el)
        return { file: new URL(el.currentSrc).pathname.split("/").pop(), fit: style.objectFit, blend: style.mixBlendMode, box: el.getBoundingClientRect().toJSON() }
      })
      expect(shown.file, `${project} backdrop file`).toBe(`bg-${backdrop}-${desktop ? "16x9" : "9x16"}.webp`)
      expect(shown.fit, `${project} backdrop is cover`).toBe("cover")
      expect(shown.blend, `${project} backdrop is not blended`).toBe("normal")
      expect(Math.abs(shown.box.width - spreadBox.width), `${project} backdrop image width`).toBeLessThanOrEqual(1)
      expect(Math.abs(shown.box.height - spreadBox.height), `${project} backdrop image height`).toBeLessThanOrEqual(1)
      const scrim = await picture.evaluate((el) => getComputedStyle(el, "::after").backgroundImage)
      expect(scrim, `${project} a scrim keeps the text legible`).toContain("gradient")

      // the old printed panel is gone
      await expect(spread.locator("img[data-art], [data-printed-art], .drawn-screen"), `${project} no multiplied ink panel`).toHaveCount(0)

      // the interface: large, in a plain frame, no blend, no perspective
      const screen = spread.locator("[data-scene-screen]")
      await expect(screen, `${project} one interface`).toHaveCount(1)
      const screenBox = (await screen.boundingBox())!
      if (device === "phone") {
        if (desktop) expect(screenBox.height / viewport.height, `${project} phone height`).toBeGreaterThanOrEqual(PHONE_HEIGHT_DESKTOP - 0.01)
        else expect(screenBox.width / viewport.width, `${project} phone width`).toBeGreaterThanOrEqual(PHONE_WIDTH_MOBILE - 0.01)
      } else {
        expect(screenBox.width / viewport.width, `${project} interface width`).toBeGreaterThanOrEqual((desktop ? WIDE_WIDTH_DESKTOP : WIDE_WIDTH_MOBILE) - 0.01)
      }
      const chain = await screen.evaluate((el) => {
        const own: { blend: string; transform: string }[] = []
        for (let node: Element | null = el; node && !node.matches("[data-project]"); node = node.parentElement) {
          const style = getComputedStyle(node)
          own.push({ blend: style.mixBlendMode, transform: style.transform })
        }
        // every painted element inside the interface, a hidden one blends nothing
        const inside = [...el.querySelectorAll("*")].filter((node) => node.getClientRects().length > 0).map((node) => getComputedStyle(node).mixBlendMode)
        return { own, inside }
      })
      expect(chain.own.every(({ blend }) => blend === "normal"), `${project} the interface is never blended`).toBe(true)
      expect(chain.own.every(({ transform }) => transform === "none"), `${project} no perspective on the interface`).toBe(true)
      expect(chain.inside.every((blend) => blend === "normal"), `${project} nothing painted inside the interface is blended`).toBe(true)
      await expect(spread.locator("[data-document]"), `${project} no typed document`).toHaveCount(0)

      if (device === "diagram") {
        const diagram = screen.locator("svg[data-kit-diagram]")
        await expect(diagram).toHaveCount(1)
        const steps = diagram.locator("[data-kit-step]")
        expect(await steps.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-kit-step"))), "the path in order").toEqual(KIT_STEPS)
        const shapes = await steps.evaluateAll((nodes) => nodes.map((node) => node.querySelector("[data-draw] > g, [data-draw] > path, [data-draw] > circle")?.outerHTML ?? ""))
        expect(new Set(shapes).size, "six distinct shapes").toBe(KIT_STEPS.length)
        const words = ((await diagram.textContent()) ?? "").trim().split(/\s+/).filter(Boolean)
        expect(words.length, "diagram words").toBeLessThanOrEqual(MAX_WORDS)
        expect(await diagram.locator("path[data-draw='stroke']").evaluate((el) => getComputedStyle(el).stroke), "the path is crimson").toBe(CRIMSON)
        // no plate: the diagram and everything around it up to the section is see-through
        const plates = await diagram.evaluate((el) => {
          const opaque: string[] = []
          for (let node: Element | null = el; node && !node.matches("[data-project]"); node = node.parentElement) {
            const color = getComputedStyle(node).backgroundColor
            if (color !== "rgba(0, 0, 0, 0)" && color !== "transparent") opaque.push(`${node.tagName}.${node.getAttribute("class")}:${color}`)
          }
          return opaque
        })
        expect(plates, "no black box behind the diagram").toEqual([])
        const stationBoxes = await steps.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().toJSON()))
        for (const box of stationBoxes) expect(box.width, "each shape is large enough to read").toBeGreaterThanOrEqual(viewport.width * 0.08)
        expect(await spread.locator("[data-pieces] [data-piece] svg").count(), "pieces show the path").toBeGreaterThanOrEqual(3)
      } else {
        expect(await screen.locator("img, video").count(), `${project} real interface in the frame`).toBeGreaterThan(0)
        await expect(screen.locator("[data-frame]"), `${project} plain drawn frame`).toHaveCount(1)
      }

      // the numeral and the word: kept, in Boska uppercase
      for (const [selector, size] of [["[data-poster-numeral]", true], ["[data-poster-word]", true]] as const) {
        const style = await spread.locator(selector).evaluate((el) => {
          const computed = getComputedStyle(el)
          return { family: computed.fontFamily, size: parseFloat(computed.fontSize), transform: computed.textTransform }
        })
        expect(style.family, `${project} ${selector} face`).toContain("Boska")
        expect(style.transform, `${project} ${selector} uppercase`).toBe("uppercase")
        if (size && desktop) expect(style.size / viewport.width, `${project} ${selector} scale`).toBeGreaterThanOrEqual(MIN_POSTER_TYPE - 0.002)
      }

      // the text: its title is the top element at its center, and every chip reads at AA on any product color
      const hitsTitle = await spread.locator("[data-project-text] h3").evaluate((h3) => {
        const scrolled = window.scrollY
        h3.scrollIntoView({ block: "center" })
        const box = h3.getBoundingClientRect()
        const top = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2)
        window.scrollTo(0, scrolled)
        return !!top && h3.contains(top)
      })
      expect(hitsTitle, `${project} the title is over the backdrop`).toBe(true)
      const chips = await spread.locator("[data-stack] li").evaluateAll((items) => {
        const channels = (color: string) => (color.match(/[\d.]+/g) ?? []).map(Number)
        const light = (rgb: number[]) => {
          const [r, g, b] = rgb.map((value) => {
            const unit = value / 255
            return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4
          })
          return 0.2126 * r + 0.7152 * g + 0.0722 * b
        }
        return items.map((item) => {
          const style = getComputedStyle(item)
          const [fr, fg, fb] = channels(style.color)
          const [br, bg, bb, alpha = 1] = channels(style.backgroundColor)
          // the worst case under the chip is white: the lightest thing a backdrop could put there
          const under = [br, bg, bb].map((value) => value * alpha + 255 * (1 - alpha))
          const [high, low] = [light([fr, fg, fb]), light(under)].sort((a, b) => b - a)
          return (high + 0.05) / (low + 0.05)
        })
      })
      expect(chips.length, `${project} has stack chips`).toBeGreaterThan(0)
      for (const ratio of chips) expect(ratio, `${project} chip contrast`).toBeGreaterThanOrEqual(AA)

      if (!desktop) {
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
        expect(overflow, `${project} no horizontal overflow`).toBeLessThanOrEqual(0)
      }
    }
  }

  // the diagram draws on by default and stands drawn with reduced motion
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  const kit = page.locator('[data-project="dev-kit"]')
  await kit.scrollIntoViewIfNeeded()
  await expect.poll(() => kit.locator("[data-draw]").first().evaluate((el) => getComputedStyle(el).animationName), "the diagram draws on").not.toBe("none")
  await page.emulateMedia({ reducedMotion: "reduce" })
  const still = await kit.locator("[data-draw]").evaluateAll((els) => els.every((el) => getComputedStyle(el).animationName === "none"))
  expect(still, "reduced motion shows the diagram drawn").toBe(true)
})
