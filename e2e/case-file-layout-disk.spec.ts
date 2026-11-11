import { existsSync } from "node:fs"
import { join } from "node:path"
import { test, expect, type Page } from "@playwright/test"

// The photos of him are previewed untracked: the test follows what is on disk.
const onDisk = (id: string) => existsSync(join(process.cwd(), "public", "film", `${id}.webp`))
const COVER = onDisk("pf-cover-him-16x9")
const PHOTOS = [
  { id: "pf-cover-him-", present: COVER },
  { id: "pf-him-profile", present: onDisk("pf-him-profile") },
  { id: "pf-id-profile", present: onDisk("pf-id-profile") },
]

const CASES = ["dev-kit", "grit", "guardia", "cebador", "club"]
const EMPLOYERS = ["smart-warehousing", "grupo-st", "visma", "fravega", "justo"]
const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
] as const

// Everything the layout test measures in the page, in one pass.
async function measure(page: Page) {
  return page.evaluate(() => {
    const visible = (el: Element) => {
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      return r.width > 0 && r.height > 0 && cs.display !== "none" && cs.visibility !== "hidden"
    }
    const masked = (el: Element) => {
      for (let node: Element | null = el; node && node !== document.body; node = node.parentElement) {
        const cs = getComputedStyle(node)
        if ((cs.maskImage && cs.maskImage !== "none") || (cs.webkitMaskImage && cs.webkitMaskImage !== "none")) return true
      }
      return false
    }
    const standing = [...document.querySelectorAll("img, video")]
      .filter(visible)
      .filter((el) => !el.closest("[data-piece], [data-chapter='cold-open'], [data-paper], .grain-texture, [data-scene-media='logo']"))
      .filter((el) => !masked(el))
      .map((el) => el.closest("[data-asset]")?.getAttribute("data-asset") ?? el.tagName)

    const luminance = (css: string) => {
      const [r, g, b, a] = (css.match(/[\d.]+/g) ?? ["0", "0", "0", "0"]).map(Number)
      return { light: (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.6, opaque: (a ?? 1) > 0.5 }
    }
    const strayPaper = [...document.querySelectorAll("body *")]
      .filter((el) => {
        const r = el.getBoundingClientRect()
        const { light, opaque } = luminance(getComputedStyle(el).backgroundColor)
        return light && opaque && r.width * r.height > 40000 && !["IMG", "VIDEO", "CANVAS"].includes(el.tagName)
      })
      .filter((el) => !el.closest("[data-paper]"))
      .map((el) => el.className.toString() || el.tagName)

    const rect = (el: Element | null) => {
      const r = el?.getBoundingClientRect()
      return r ? { top: r.top, left: r.left, width: r.width, height: r.height } : null
    }
    const cases = [...document.querySelectorAll("[data-project]")].map((p) => {
      const fields = ["what", "problem", "role"].map((f) => p.querySelector(`[data-field="${f}"]`))
      const pieces = [...p.querySelectorAll("[data-piece]")].map((el) => el.getBoundingClientRect())
      return {
        id: p.getAttribute("data-project"),
        tag: p.querySelector("[data-case-tag]")?.textContent?.trim() ?? "",
        title: p.querySelector("h3")?.textContent?.trim() ?? "",
        fields: fields.map(rect),
        pieceTops: pieces.map((r) => Math.round(r.top)),
        pieceCount: pieces.length,
      }
    })
    const chapters = ["projects", "experience", "end-credits"].map((id) => {
      const section = document.querySelector(`section[data-chapter="${id}"]`)!
      const title = section.querySelector("h2")!
      return {
        id,
        label: section.querySelector("[data-chapter-label]")?.textContent?.trim() ?? "",
        subtitle: section.querySelector("[data-chapter-subtitle]")?.textContent?.trim() ?? "",
        titleWidth: title.getBoundingClientRect().width,
        titleFont: getComputedStyle(title).fontFamily,
      }
    })
    const main = document.querySelector("main")!.getBoundingClientRect()
    const nodes = [...document.querySelectorAll("[data-thread-node]")].map((n) => {
      const r = n.getBoundingClientRect()
      return { id: n.getAttribute("data-thread-node") ?? "", x: r.left + r.width / 2 - main.left }
    })
    const employers = [...document.querySelectorAll("[data-employer]")].map((e) => ({
      id: e.getAttribute("data-employer"),
      tag: e.querySelector("[data-employer-tag]")?.textContent?.trim() ?? "",
      current: e.getAttribute("data-current"),
      name: e.querySelector("h3")?.textContent?.trim() ?? "",
      font: getComputedStyle(e.querySelector("h3")!).fontFamily,
    }))
    const bar = document.querySelector("[data-top-bar]")
    return {
      standing,
      strayPaper,
      papers: [...document.querySelectorAll("[data-paper]")].map((el) => el.getAttribute("data-paper")).sort(),
      cases,
      chapters,
      employers,
      nodes,
      threads: document.querySelectorAll("[data-crimson-thread]").length,
      stops: [...document.querySelectorAll("[data-thread-stop]")].map((el) => el.getAttribute("data-thread-stop")),
      exhibits: document.querySelectorAll("[data-exhibit], [data-asset^='pf-exhibit-']").length,
      emptyHim: [...document.querySelectorAll('[data-state="field"]')]
        .map((el) => el.getAttribute("data-asset") ?? "")
        .filter((id) => id.startsWith("pf-him-") || id === "pf-id-profile"),
      himAssets: document.querySelectorAll('[data-asset^="pf-him-"], [data-asset="pf-id-profile"]').length,
      bar: bar && {
        wordmark: bar.querySelector("[data-wordmark]")?.textContent?.trim(),
        indexVisible: [...bar.querySelectorAll("[data-index-item]")].filter(visible).map((a) => a.textContent?.trim()),
        hire: bar.querySelectorAll("[data-top-hire]").length,
        menu: !!bar.querySelector("[data-menu-button]") && visible(bar.querySelector("[data-menu-button]")!),
        sound: !!bar.querySelector("[data-sound-toggle]"),
      },
      floatingPills: [...document.querySelectorAll("[data-chapter-index]")].filter((el) => getComputedStyle(el).position === "fixed" && !el.closest("[data-top-bar]")).length,
      slab: [...document.querySelectorAll("[data-employer]")].filter((el) => {
        const alpha = getComputedStyle(el).backgroundColor.match(/[\d.]+/g)?.[3]
        return getComputedStyle(el).backgroundColor !== "rgba(0, 0, 0, 0)" && alpha !== "0"
      }).length,
      cold: {
        desk: !!document.querySelector('[data-chapter="cold-open"] [data-asset^="pf-desk-"]'),
        cover: !!document.querySelector('[data-chapter="cold-open"] [data-asset^="pf-cover-him-"]'),
        photos: Object.fromEntries(["pf-cover-him-", "pf-him-profile", "pf-id-profile"].map((id) => [id, document.querySelectorAll(`[data-asset^="${id}"]`).length])),
        label: document.querySelector("[data-case-file-label]")?.textContent?.trim(),
        sheetPhotos: document.querySelectorAll('[data-id-sheet] [data-asset="pf-id-front"]').length,
      },
    }
  })
}

for (const viewport of VIEWPORTS) {
  test.describe(`${viewport.width}`, () => {
    test.use({ viewport })

    test("at 390 and 1440 the page is one dark canvas where no image stands alone as a rectangle, each case is typed on it with its pieces in frames, paper backs only the identification sheet, the two folders and the credits sheet, the thread is a spine with a pin per case and per employer, and a photo of him not delivered leaves no box while a delivered one is the cover of the cold open @PF-1-ASM-26", async ({ page }) => {
      await page.goto("/")
      await page.waitForTimeout(600)
      const m = await measure(page)
      const wide = viewport.width >= 1000

      expect(m.standing, "images standing alone as a rectangle").toEqual([])
      expect(m.exhibits, "the exhibit stills left the page").toBe(0)
      if (COVER) expect(m.cold.cover, "cold open shows the cover of him").toBe(true)
      else expect(m.cold.desk, "cold open shows the desk").toBe(true)
      for (const photo of PHOTOS) {
        if (photo.present) expect(m.cold.photos[photo.id], `${photo.id} is delivered`).toBeGreaterThan(0)
        else expect(m.cold.photos[photo.id], `${photo.id} is not delivered: no element`).toBe(0)
      }
      expect(m.cold.label).toMatch(/CASE FILE 001/i)
      expect(m.cold.sheetPhotos).toBe(1)

      expect(m.strayPaper).toEqual([])
      expect(m.papers).toEqual(["credits-sheet", "folder", "folder", "id-sheet"])

      expect(m.emptyHim, "undelivered photos of him leave no empty box").toEqual([])

      expect(m.cases.map((c) => c.id)).toEqual(CASES)
      m.cases.forEach((c, i) => {
        expect(c.tag).toBe(`CASE 0${i + 1}`)
        expect(c.title.length).toBeGreaterThan(0)
        expect(c.pieceCount, `${c.id} pieces`).toBeGreaterThan(0)
        if (wide) {
          const tops = c.fields.map((f) => f!.top)
          const lefts = c.fields.map((f) => f!.left)
          expect(Math.max(...tops) - Math.min(...tops), `${c.id} what, problem, role share a row`).toBeLessThan(6)
          expect(lefts[0] < lefts[1] && lefts[1] < lefts[2]).toBe(true)
          expect(Math.max(...c.pieceTops) - Math.min(...c.pieceTops), `${c.id} pieces in one row`).toBeLessThan(6)
        }
      })

      expect(m.chapters.map((c) => c.id)).toEqual(["projects", "experience", "end-credits"])
      for (const c of m.chapters) {
        expect(c.label, `${c.id} label`).toMatch(/^\d\d · \S/)
        expect(c.titleFont).toContain("Boska")
        if (wide) expect(c.titleWidth, `${c.id} title is at section scale`).toBeLessThan(viewport.width * 0.6)
      }
      expect(m.chapters.filter((c) => c.id !== "end-credits").every((c) => /\/\//.test(c.subtitle))).toBe(true)

      expect(m.employers.map((e) => e.id)).toEqual(EMPLOYERS)
      for (const e of m.employers) {
        expect(e.tag).toBe(e.current === "true" ? "CURRENT" : "PAST")
        expect(e.font).toContain("Boska")
      }
      expect(m.slab, "no employer sits on a painted slab").toBe(0)

      expect(m.threads).toBe(1)
      expect(m.stops.filter((s) => s?.startsWith("project:"))).toHaveLength(CASES.length)
      expect(m.stops.filter((s) => s?.startsWith("employer:"))).toHaveLength(EMPLOYERS.length)
      expect(m.nodes).toHaveLength(m.stops.length)
      for (const n of m.nodes) expect(n.x, `${n.id} pin is on the spine`).toBeLessThan(wide ? 120 : 48)

      expect(m.floatingPills).toBe(0)
      expect(m.bar?.wordmark).toBe("NAWI")
      expect(m.bar?.sound).toBe(true)
      if (wide) {
        expect(m.bar?.indexVisible).toEqual(["01 SUBJECT", "02 PROJECTS", "03 EXPERIENCE", "04 OFFER", "05 CONTACT"])
        expect(m.bar?.hire, "the top bar holds no Let's talk, the corner is the one").toBe(0)
      } else {
        expect(m.bar?.menu).toBe(true)
        expect(m.bar?.indexVisible).toEqual([])
        await expect(page.locator("[data-hire-bar]")).toBeVisible()
      }
    })
  })
}
