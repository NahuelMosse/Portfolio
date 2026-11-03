import { existsSync } from "node:fs"
import { join } from "node:path"
import { test, expect } from "@playwright/test"

// The cover illustration is previewed untracked: its checks follow what is on disk.
const COVER_ON_DISK = existsSync(join(process.cwd(), "public", "film", "ill-cover-16x9.webp"))

const NAWI_SHARE = 0.85
const EDGE_TOLERANCE = 2
const BODY_FLOOR = 16
const LABEL_MAX_CHARACTERS = 40
const RECTANGLE_RADIUS_CEILING = 4
// Where his head is in each cover illustration, as fractions of the picture (x0, y0, x1, y1).
const HEAD = { wide: [0.25, 0.08, 0.44, 0.42], tall: [0.22, 0.22, 0.58, 0.43] } as const

test("at 390 and 1440 the cold open shows him with nothing held toward the camera, NAWI at least 85% of the viewport wide flush to one edge, the identification sheet as ruled fine type with no bordered box, body text in General Sans at 16 px or more, Courier only in short uppercase labels, and every button a rectangle, never a pill @PF-1-ASM-26 @PF-1-ASM-21", async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    await page.evaluate(async () => {
      await document.fonts.ready
      // lazy illustrations and the scroll-driven entrances settle once every part has been in view
      for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) {
        scrollTo(0, y)
        await new Promise((resolve) => setTimeout(resolve, 60))
      }
      scrollTo(0, 0)
    })

    const m = await page.evaluate(
      ({ head, labelMax, bodyFloor }) => {
        const visible = (el: Element) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden"
        const rect = (el: Element) => el.getBoundingClientRect()
        const cold = document.querySelector('[data-chapter="cold-open"]')!
        const mark = cold.querySelector('[data-layer="mark"]') as HTMLElement
        const markBox = rect(mark)
        const range = document.createRange()
        range.selectNodeContents(mark)
        const markText = range.getBoundingClientRect()

        const img = cold.querySelector("[data-illustration] img") as HTMLImageElement | null
        let headHit = false
        if (img) {
          const box = rect(img)
          const scale = Math.max(box.width / img.naturalWidth, box.height / img.naturalHeight)
          const drawn = { w: img.naturalWidth * scale, h: img.naturalHeight * scale }
          const origin = { x: box.left + (box.width - drawn.w) / 2, y: box.top + (box.height - drawn.h) / 2 }
          const [x0, y0, x1, y1] = img.naturalHeight > img.naturalWidth ? head.tall : head.wide
          const face = { l: origin.x + x0 * drawn.w, t: origin.y + y0 * drawn.h, r: origin.x + x1 * drawn.w, b: origin.y + y1 * drawn.h }
          headHit = markText.left < face.r && markText.right > face.l && markText.top < face.b && markText.bottom > face.t
        }

        const sheet = cold.querySelector("[data-id-sheet]") as HTMLElement
        const sheetStyle = getComputedStyle(sheet)
        const sides = ["Top", "Right", "Bottom", "Left"].map((side) => parseFloat(sheetStyle.getPropertyValue(`border-${side.toLowerCase()}-width`)))
        const rules = [...sheet.querySelectorAll("*")].filter((el) => parseFloat(getComputedStyle(el).borderTopWidth) > 0).length

        const bad: string[] = []
        document.querySelectorAll("body *").forEach((el) => {
          const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent?.trim()).join(" ").trim()
          if (!own || !visible(el) || el.closest("[data-document], [data-chapter-word], [data-layer='mark'], [data-wordmark], .terminal-screen, .terminal-title, script, style")) return
          const style = getComputedStyle(el)
          const family = style.fontFamily.split(",")[0].replace(/"/g, "").trim()
          const caps = style.textTransform === "uppercase" || own === own.toUpperCase()
          if (family === "Courier Prime" && !(caps && own.length <= labelMax)) bad.push(`courier-not-label: ${own.slice(0, 40)}`)
          if (family === "General Sans" && parseFloat(style.fontSize) < bodyFloor) bad.push(`small-body: ${own.slice(0, 40)} ${style.fontSize}`)
          if (family !== "General Sans" && family !== "Courier Prime" && family !== "Boska") bad.push(`family ${family}: ${own.slice(0, 40)}`)
        })

        const buttons = [...document.querySelectorAll("a.door, .film-control, .corner-cta, .hire-bar a, button")]
          .filter(visible)
          .map((el) => ({ label: (el.textContent ?? "").trim().slice(0, 30), radius: parseFloat(getComputedStyle(el).borderTopLeftRadius) }))

        return {
          viewport: innerWidth,
          mark: { width: markText.width, boxLeft: markBox.left, boxRight: markBox.right, textLeft: markText.left, textRight: markText.right, blend: getComputedStyle(mark).mixBlendMode },
          headHit,
          sheet: { sides, background: sheetStyle.backgroundColor, rules },
          bad,
          buttons,
          coverAsset: cold.querySelector("[data-illustration]")?.getAttribute("data-asset") ?? null,
          held: cold.querySelectorAll("[data-envelope], [data-stamp], .stamp").length,
        }
      },
      { head: HEAD, labelMax: LABEL_MAX_CHARACTERS, bodyFloor: BODY_FLOOR },
    )

    const where = `at ${viewport.width}`
    expect(m.held, `${where}: no envelope or stamp is drawn by code`).toBe(0)
    if (COVER_ON_DISK) {
      expect(m.coverAsset, where).toBe("ill-cover-16x9")
      expect(m.headHit, `${where}: NAWI crosses his head`).toBe(true)
    }

    expect(m.mark.width, `${where}: NAWI width`).toBeGreaterThanOrEqual(m.viewport * NAWI_SHARE)
    expect(m.mark.textLeft, where).toBeGreaterThanOrEqual(-EDGE_TOLERANCE)
    expect(m.mark.textRight, where).toBeLessThanOrEqual(m.viewport + EDGE_TOLERANCE)
    const flush = Math.min(Math.abs(m.mark.textLeft), Math.abs(m.viewport - m.mark.textRight))
    expect(flush, `${where}: NAWI flush to one edge`).toBeLessThanOrEqual(EDGE_TOLERANCE + 6)
    expect(m.mark.blend, `${where}: NAWI is a poster device over the art`).not.toBe("normal")

    expect(Math.min(...m.sheet.sides), `${where}: the sheet has no box`).toBe(0)
    expect(m.sheet.background, where).toBe("rgba(0, 0, 0, 0)")
    expect(m.sheet.rules, `${where}: the sheet is ruled by thin lines`).toBeGreaterThanOrEqual(4)

    expect(m.bad, where).toEqual([])
    for (const button of m.buttons) expect(button.radius, `${where}: ${button.label} is a rectangle`).toBeLessThanOrEqual(RECTANGLE_RADIUS_CEILING)
  }
})
