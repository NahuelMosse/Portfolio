import { readFileSync } from "node:fs"
import { test, expect } from "@playwright/test"

type Asset = { id: string; tool: string; status: string; prompt: string }

const CASES = ["dev-kit", "grit", "guardia", "cebador", "club"]
const IMAGES = [
  "pf-desk-16x9", "pf-desk-9x16", "pf-wall-strip-9x16", "pf-folder-open-4x5", "pf-file-sealed-16x9", "pf-file-sealed-9x16",
  "pf-paper-torn-16x9", "pf-grain-1x1", ...CASES.map((id) => `pf-exhibit-${id}-4x5`),
]
const VIDEOS = ["pf-cover-loop", "pf-cover-loop-9x16"]
const IMAGE_TOOLS = ["Gemini", "Codex (OpenAI image generation)"]
const PEOPLE_WORDS = /\b(man|woman|face|statue|god|deity|character|figure|portrait of)\b/i

function readAssets(): Asset[] {
  return readFileSync("public/ASSETS.md", "utf8")
    .split(/^## /m)
    .slice(1)
    .map((block) => {
      const field = (name: string) => block.match(new RegExp(`^- ${name}: (.*)$`, "m"))?.[1]?.trim() ?? ""
      return { id: block.split("\n")[0].trim(), tool: field("Tool"), status: field("Status"), prompt: field("Prompt") }
    })
}

test("the page shows the desk in 16:9 on wide screens and 9:16 on tall ones, the wall strip, the cold open loop, one still-life exhibit per case, the open folder, the sealed file, the torn paper and the grain, each listed in ASSETS.md as made in Gemini, Codex or Kling, and no generated image shows a person @PF-1-ASM-20", async ({ browser }) => {
  const assets = readAssets()
  for (const id of IMAGES) {
    const entry = assets.find((a) => a.id === id)
    expect(entry, `ASSETS.md entry for ${id}`).toBeDefined()
    expect(IMAGE_TOOLS, id).toContain(entry!.tool)
    expect(entry!.prompt, id).not.toMatch(PEOPLE_WORDS)
  }
  for (const id of VIDEOS) expect(assets.find((a) => a.id === id)?.tool, id).toBe("Kling AI")

  for (const [width, height] of [[1280, 720], [390, 844]] as const) {
    const page = await browser.newPage({ viewport: { width, height } })
    await page.goto("/")
    const slots = await page.locator("[data-asset]").evaluateAll((all) => all.map((el) => el.getAttribute("data-asset")))
    for (const id of ["pf-desk-16x9", "pf-wall-strip-9x16", "pf-folder-open-4x5", "pf-file-sealed-16x9", "pf-paper-torn-16x9", "pf-grain-1x1"]) {
      expect(slots, `${id} at ${width}`).toContain(id)
    }
    for (const id of CASES) await expect(page.locator(`[data-project="${id}"] [data-asset="pf-exhibit-${id}-4x5"]`)).toHaveCount(1)
    await page.close()
  }
})

test("the cold open starts the crimson thread at the sealed envelope @PF-1-ASM-21", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto("/")
  await expect(page.locator("[data-thread-path]")).toHaveCount(1)
  const start = await page.evaluate(() => {
    const path = document.querySelector("[data-thread-path]") as SVGPathElement
    const origin = document.querySelector("[data-sealed-envelope]")!.getBoundingClientRect()
    const main = document.querySelector("main")!.getBoundingClientRect()
    const p = path.getPointAtLength(0)
    return { x: p.x + main.left, y: p.y + main.top, box: { l: origin.left, r: origin.right, t: origin.top, b: origin.bottom } }
  })
  expect(start.x).toBeGreaterThanOrEqual(start.box.l - 2)
  expect(start.x).toBeLessThanOrEqual(start.box.r + 2)
  expect(start.y).toBeGreaterThanOrEqual(start.box.t - 2)
  expect(start.y).toBeLessThanOrEqual(start.box.b + 2)
})
