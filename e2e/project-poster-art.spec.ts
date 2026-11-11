import { test, expect, type Locator } from "@playwright/test"

// the product's own color per project (design/art-direction.md) as the browser reports it
const STAGES = [
  { project: "dev-kit", device: "diagram", field: "rgb(179, 38, 30)", line: "Claude Code agents build each card; hooks and tests keep them honest." },
  { project: "grit", device: "phone", field: "rgb(31, 85, 214)", line: "Specified with Spec Kit; AI agents wrote the code against the specs." },
  { project: "guardia", device: "wide", field: "rgb(54, 209, 168)", line: "Built with Claude Code; its trailers and ads made with AI." },
  { project: "cebador", device: "wide", field: "rgb(240, 168, 172)", line: "Built with my dev kit: Claude Code agents, every behavior tested." },
  { project: "club", device: "phone", field: "rgb(205, 235, 58)", line: "Built with my dev kit: specs first, then Claude Code agents." },
]

// The four corners of each drawn screen as fractions of its illustration (top-left, top-right, bottom-right, bottom-left),
// measured on the pixels of the image: the screen is the flat key color inside the drawn bezel.
const DRAWN_SCREENS: Record<string, number[][]> = {
  "ill-scene-grit-4x5": [[0.4444, 0.2186], [0.9227, 0.2171], [0.9263, 0.9531], [0.445, 0.9528]],
  "ill-scene-club-16x9": [[0.4314, 0.106], [0.632, 0.08], [0.6631, 0.8216], [0.464, 0.8499]],
  "ill-scene-triaje-16x9": [[0.4762, 0.3655], [0.9659, 0.3656], [0.9659, 0.8051], [0.4769, 0.8015]],
  "ill-scene-triaje-4x5": [[0.0856, 0.4997], [0.9297, 0.499], [0.9343, 0.8169], [0.0856, 0.8162]],
  "ill-scene-cebador-16x9": [[0.4809, 0.4676], [0.9713, 0.4676], [0.9713, 0.8778], [0.4809, 0.8778]],
  "ill-scene-cebador-4x5": [[0.142, 0.5205], [0.9358, 0.5275], [0.9421, 0.8664], [0.1335, 0.8671]],
}
const HAND_HELD = ["grit", "club"]
const POSTER_WORD_DESKTOP = 0.12
const CASE_NUMERALS = ["01", "02", "03", "04", "05"]
const PHONE_HEIGHT_DESKTOP = 0.7
const PHONE_WIDTH_MOBILE = 0.75
const WIDE_WIDTH_DESKTOP = 0.55
const WIDE_WIDTH_MOBILE = 0.9
const MAX_WORDS = 12
const MIN_OTHER_PIECES = 3
const MIN_PIECE_WIDTH = 240
const CORNER_TOLERANCE = 2.5

type Box = { x: number; y: number; width: number; height: number }

const overlap = (a: Box, b: Box) =>
  Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y))

// the illustration shown at this width: the one of the pair that is displayed
const shownArt = (spread: Locator) =>
  spread.locator("[data-printed-art] img[data-art]").evaluateAll((images) => {
    const shown = (images as HTMLImageElement[]).find((image) => getComputedStyle(image).display !== "none")
    if (!shown) return null
    const style = getComputedStyle(shown)
    const panel = shown.closest("[data-printed-art]")!
    return {
      file: new URL(shown.currentSrc || shown.src).pathname.split("/").pop()!.replace(".webp", ""),
      loaded: shown.complete && shown.naturalWidth > 0,
      blend: style.mixBlendMode,
      masked: style.maskImage !== "none" || style.webkitMaskImage !== "none",
      image: shown.getBoundingClientRect().toJSON(),
      panel: panel.getBoundingClientRect().toJSON(),
    }
  })

test("at 390 and 1440 each project is a full-bleed field of its product color with its real interface large in a device frame, a phone at least 70% of the viewport height at 1440 and 75% of its width at 390, a laptop or browser at least 55% of the width at 1440 and 90% at 390, its numeral and word in Boska uppercase at least 12% of the viewport wide at 1440, its ink illustration loaded on the field and covering neither the interface nor the text, an interface set in a drawn screen carrying a perspective transform, the dev kit lead an svg diagram with at most 12 words and no typed document, consecutive cases with different compositions, beside it the stack, one line of at most 12 words and the link @PF-1-ASM-26", async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.goto("/")
    await page.waitForLoadState("load")
    const desktop = viewport.width === 1440
    const compositions: string[] = []
    const textSides: string[] = []
    const scenesWithHand: number[] = []

    for (const [index, { project, device, field, line }] of STAGES.entries()) {
      const spread = page.locator(`[data-project="${project}"]`)
      await spread.scrollIntoViewIfNeeded()
      const screen = spread.locator("[data-scene-screen]")
      const drawn = device === "phone" || device === "wide"

      // the field: the product's color, edge to edge
      expect(await spread.evaluate((el) => getComputedStyle(el).backgroundColor), `${project} field color`).toBe(field)
      const spreadBox = (await spread.boundingBox())!
      expect(spreadBox.x, `${project} field starts at the left edge`).toBeLessThanOrEqual(1)
      expect(spreadBox.width, `${project} field is full-bleed`).toBeGreaterThanOrEqual(viewport.width - 1)

      // the interface: its size by device
      if (drawn) await expect(screen, `${project} interface is mapped on the drawn screen`).toHaveAttribute("data-mapped", "")
      const screenBox = (await screen.boundingBox())!
      if (device === "phone") {
        if (desktop) expect(screenBox.height / viewport.height, `${project} phone height`).toBeGreaterThanOrEqual(PHONE_HEIGHT_DESKTOP - 0.01)
        else expect(screenBox.width / viewport.width, `${project} phone width`).toBeGreaterThanOrEqual(PHONE_WIDTH_MOBILE - 0.01)
      } else {
        expect(screenBox.width / viewport.width, `${project} interface width`).toBeGreaterThanOrEqual((desktop ? WIDE_WIDTH_DESKTOP : WIDE_WIDTH_MOBILE) - 0.01)
      }
      expect(await screen.locator("img, video, svg").count(), `${project} real interface or diagram in the frame`).toBeGreaterThan(0)
      await expect(spread.locator("[data-document]"), `${project} shows no typed document`).toHaveCount(0)

      // the printed illustration: loaded, multiplied onto the field, faded, never over the text, under the interface
      const art = (await shownArt(spread))!
      expect(art, `${project} shows an illustration`).not.toBeNull()
      await expect.poll(async () => (await shownArt(spread))!.loaded, `${project} illustration loaded`).toBe(true)
      expect(art.blend, `${project} illustration is printed on the field`).toBe("multiply")
      expect(art.masked, `${project} illustration fades at its edges`).toBe(true)
      // on a phone the text wrapper has no box of its own (its title and details sit around the stage): the box is theirs together
      const textParts = (await spread.locator("[data-project-text]").evaluate((el) => {
        const parts = getComputedStyle(el).display === "contents" ? [...el.children] : [el]
        return parts.map((part) => part.getBoundingClientRect().toJSON())
      })) as Box[]
      const textBox = {
        x: Math.min(...textParts.map((box) => box.x)),
        y: Math.min(...textParts.map((box) => box.y)),
        width: Math.max(...textParts.map((box) => box.x + box.width)) - Math.min(...textParts.map((box) => box.x)),
        height: Math.max(...textParts.map((box) => box.y + box.height)) - Math.min(...textParts.map((box) => box.y)),
      }
      const textArea = textParts.reduce((sum, part) => sum + overlap(art.panel as Box, part), 0)
      expect(textArea, `${project} illustration does not cover the text`).toBe(0)
      const hitsText = await spread.locator("[data-project-text] h3").evaluate((h3, id) => {
        // a spread taller than the screen leaves its title out of view: bring it in before asking what is on top of it
        const scrolled = window.scrollY
        h3.scrollIntoView({ block: "center" })
        const box = h3.getBoundingClientRect()
        const top = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2)
        window.scrollTo(0, scrolled)
        return h3.contains(top) && !!top && document.querySelector(`[data-project="${id}"]`)!.contains(top)
      }, project)
      expect(hitsText, `${project} the title is the top element at its center`).toBe(true)
      const blended = await screen.evaluate((el) => {
        const chain: string[] = []
        for (let node: Element | null = el; node && !node.matches("[data-project]"); node = node.parentElement) chain.push(getComputedStyle(node).mixBlendMode)
        return chain
      })
      expect(blended.every((mode) => mode === "normal"), `${project} the interface is never blended`).toBe(true)

      if (drawn) {
        // the interface follows the drawn screen: its four corners are the screen's four corners
        const quad = DRAWN_SCREENS[art.file]
        expect(quad, `${project} measured corners for ${art.file}`).toBeDefined()
        const corners = await screen.evaluate((el) => {
          const matrix = new DOMMatrix(getComputedStyle(el).transform)
          const origin = ((el as HTMLElement).offsetParent as HTMLElement).getBoundingClientRect()
          const w = (el as HTMLElement).offsetWidth
          const h = (el as HTMLElement).offsetHeight
          return {
            transform: getComputedStyle(el).transform,
            points: [[0, 0], [w, 0], [w, h], [0, h]].map(([x, y]) => {
              const p = matrix.transformPoint(new DOMPoint(x, y, 0, 1))
              return [origin.left + (el as HTMLElement).offsetLeft + p.x / p.w, origin.top + (el as HTMLElement).offsetTop + p.y / p.w]
            }),
          }
        })
        expect(corners.transform, `${project} carries a transform`).toMatch(/^matrix(3d)?\(/)
        quad.forEach(([qx, qy], corner) => {
          expect(Math.abs(corners.points[corner][0] - (art.image.x + qx * art.image.width)), `${project} corner ${corner} x`).toBeLessThanOrEqual(CORNER_TOLERANCE)
          expect(Math.abs(corners.points[corner][1] - (art.image.y + qy * art.image.height)), `${project} corner ${corner} y`).toBeLessThanOrEqual(CORNER_TOLERANCE)
        })
        if (art.file === "ill-scene-club-16x9") {
          expect(corners.transform, "a tilted screen needs a perspective matrix").toMatch(/^matrix3d\(/)
          expect(Math.abs(corners.points[0][1] - corners.points[1][1]), "the tilt is kept").toBeGreaterThan(3)
        }
        // nothing of the illustration is over the screen: its center and four inner points land on the interface
        const centroid = [0, 1, 2, 3].reduce((sum, c) => [sum[0] + corners.points[c][0] / 4, sum[1] + corners.points[c][1] / 4], [0, 0])
        const probes = [centroid, ...corners.points.map(([x, y]) => [x + (centroid[0] - x) * 0.15, y + (centroid[1] - y) * 0.15])]
        for (const [x, y] of probes) {
          if (y < 0 || y > viewport.height) continue
          const onInterface = await page.evaluate(([px, py]) => !!document.elementFromPoint(px, py)?.closest("[data-scene-screen]"), [x, y])
          expect(onInterface, `${project} the interface is over the drawing at ${Math.round(x)},${Math.round(y)}`).toBe(true)
        }
        if (HAND_HELD.includes(project)) scenesWithHand.push(index)
      } else {
        // the dev kit: a diagram drawn by code, few words, no typed document
        const diagram = screen.locator("svg[data-kit-diagram]")
        await expect(diagram).toHaveCount(1)
        await expect(diagram.locator("[data-kit-step]")).toHaveCount(5)
        const words = ((await diagram.textContent()) ?? "").trim().split(/\s+/).filter(Boolean)
        expect(words.length, `${project} diagram words`).toBeLessThanOrEqual(MAX_WORDS)
        expect(await diagram.locator("[data-draw]").count(), `${project} diagram draws on`).toBeGreaterThan(0)
        const pieceSvgs = spread.locator("[data-pieces] [data-piece] svg")
        expect(await pieceSvgs.count(), `${project} pieces show the path`).toBeGreaterThanOrEqual(MIN_OTHER_PIECES)
        await expect(spread.locator("[data-pieces] img, [data-pieces] video, [data-pieces] .piece-text"), `${project} pieces are not screenshots`).toHaveCount(0)
      }

      // the numeral and the word: Boska uppercase at poster scale
      const numeral = spread.locator("[data-poster-numeral]")
      const word = spread.locator("[data-poster-word]")
      await expect(numeral).toHaveText(CASE_NUMERALS[index])
      await expect(word).not.toBeEmpty()
      for (const piece of [numeral, word]) {
        const style = await piece.evaluate((el) => {
          const computed = getComputedStyle(el)
          return { family: computed.fontFamily, size: parseFloat(computed.fontSize), transform: computed.textTransform }
        })
        expect(style.family, `${project} poster type face`).toContain("Boska")
        expect(style.transform, `${project} poster type is uppercase`).toBe("uppercase")
        if (desktop) expect(style.size / viewport.width, `${project} poster type scale`).toBeGreaterThanOrEqual(POSTER_WORD_DESKTOP - 0.002)
      }
      const wordBox = (await word.boundingBox())!
      expect(wordBox.x + wordBox.width, `${project} the word is one solid line inside the viewport`).toBeLessThanOrEqual(viewport.width)
      expect(overlap(wordBox, textBox), `${project} the word is not over the text`).toBe(0)
      if (desktop) {
        const crossed = overlap(wordBox, art.panel as Box) + overlap(wordBox, screenBox)
        expect(crossed, `${project} the word crosses the art or the interface`).toBeGreaterThan(0)
        textSides.push(textBox.x + textBox.width / 2 < screenBox.x + screenBox.width / 2 ? "left" : "right")
      }
      compositions.push((await spread.getAttribute("data-composition")) ?? "")
      expect(await spread.locator("[data-poster-detail]").count(), `${project} fine small-type detail`).toBeGreaterThan(0)

      // the words: the title, one short line, the stack and the link; nothing else
      const text = spread.locator("[data-project-text]")
      await expect(text.locator("h3")).toBeVisible()
      const lineBox = text.locator('[data-field="line"]')
      await expect(lineBox).toHaveText(line)
      expect(line.split(/\s+/).length, `${project} line length`).toBeLessThanOrEqual(MAX_WORDS)
      await expect(spread.locator('[data-field="what"], [data-field="problem"], [data-field="role"], [data-label]'), `${project} has no labeled text`).toHaveCount(0)
      await expect(text.locator("[data-stack]")).not.toBeEmpty()
      await expect(spread.locator('[data-kind="card"], [data-kind="tests"], [data-kind="pull-request"], [data-kind="link"], .piece-text'), `${project} has no text piece`).toHaveCount(0)

      const others = spread.locator("[data-pieces] [data-piece]")
      expect(await others.count(), `${project} other pieces`).toBeGreaterThanOrEqual(MIN_OTHER_PIECES)

      if (desktop) {
        // the lead and at least three other pieces fit the viewport together
        await screen.evaluate((el) => window.scrollBy(0, el.getBoundingClientRect().top - 72))
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
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
        expect(overflow, `${project} no horizontal overflow`).toBeLessThanOrEqual(0)
      }
    }

    compositions.forEach((composition, index) => expect(composition, `composition ${index}`).not.toBe(compositions[index - 1]))
    textSides.forEach((side, index) => expect(side, `text side ${index}`).not.toBe(textSides[index - 1]))
    expect(scenesWithHand.length, "at most two hand-held device scenes").toBeLessThanOrEqual(2)
    scenesWithHand.forEach((at, index) => expect(at - (scenesWithHand[index - 1] ?? -9), "never two hand-held scenes in a row").toBeGreaterThan(1))
  }

  // the draw-on animation runs by default and is off with reduced motion
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  const kit = page.locator('[data-project="dev-kit"]')
  await kit.scrollIntoViewIfNeeded()
  await expect.poll(() => kit.locator("[data-draw]").first().evaluate((el) => getComputedStyle(el).animationName), "the diagram draws on").not.toBe("none")
  await page.emulateMedia({ reducedMotion: "reduce" })
  const still = await kit.locator("[data-draw]").evaluateAll((els) => els.every((el) => getComputedStyle(el).animationName === "none"))
  expect(still, "reduced motion shows the diagram drawn").toBe(true)
})
