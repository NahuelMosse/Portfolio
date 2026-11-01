import { readFileSync } from "node:fs"
import { test, expect, type Page } from "@playwright/test"

type Asset = { id: string; file: string; tool: string; license: string; status: string; prompt: string }

const IMAGE_IDS = [
  "pf-cover-16x9", "pf-cover-9x16", "pf-world-16x9", "pf-world-9x16",
  "pf-offer-freelance-4x5", "pf-offer-tpm-4x5",
  "pf-exp-smart-warehousing-16x9", "pf-exp-grupo-st-16x9", "pf-exp-visma-16x9", "pf-exp-fravega-16x9", "pf-exp-justo-16x9",
  "pf-proj-dev-kit-4x5", "pf-proj-grit-4x5", "pf-proj-guardia-4x5", "pf-proj-cebador-4x5", "pf-proj-club-4x5",
  "pf-closing-16x9", "pf-closing-9x16", "pf-paper-torn-16x9", "pf-grain-1x1",
]
const VIDEO_IDS = ["pf-cover-loop", "pf-cover-loop-9x16"]
const CHAPTER_ASSETS: Record<string, string[]> = {
  "cold-open": ["pf-cover-16x9", "pf-cover-9x16"],
  projects: IMAGE_IDS.filter((id) => id.startsWith("pf-proj-")),
  experience: IMAGE_IDS.filter((id) => id.startsWith("pf-exp-")),
  "end-credits": ["pf-closing-16x9", "pf-closing-9x16"],
}
const GENERATION_APIS = /openai|gemini|generativelanguage|klingai|runway|stability\.ai|replicate|midjourney|fal\.(ai|run)|anthropic/i

function readAssets(): Asset[] {
  const text = readFileSync("public/ASSETS.md", "utf8")
  return text
    .split(/^## /m)
    .slice(1)
    .map((block) => {
      const field = (name: string) => block.match(new RegExp(`^- ${name}: (.*)$`, "m"))?.[1]?.trim() ?? ""
      return { id: block.split("\n")[0].trim(), file: field("File"), tool: field("Tool"), license: field("License"), status: field("Status"), prompt: field("Prompt") }
    })
}

const delivered = () => readAssets().filter((a) => a.status === "delivered")
const gap = (reason: string) => test.info().annotations.push({ type: "gap", description: reason })

async function throttle4G(page: Page) {
  const client = await page.context().newCDPSession(page)
  await client.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 })
}

test("the cold open plays generated video behind the name @PF-1-S1", async ({ page }) => {
  const loop = readAssets().find((a) => a.id === "pf-cover-loop")
  if (loop?.status !== "delivered") return gap("pf-cover-loop.mp4 not delivered yet")
  await page.goto("/")
  const video = page.locator('section[data-chapter="cold-open"] video')
  await expect(video).toHaveCount(1)
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0)).toBe(true)
})

test("every scene media file answers 200 and has its ASSETS.md entry with the free tool, the prompt and the license @PF-1-S2", async ({ request }) => {
  const assets = readAssets()
  for (const id of [...IMAGE_IDS, ...VIDEO_IDS]) {
    const entry = assets.find((a) => a.id === id)
    expect(entry, `ASSETS.md entry for ${id}`).toBeDefined()
    expect(entry!.tool).not.toBe("")
    expect(entry!.license).not.toBe("")
    expect(entry!.prompt.length).toBeGreaterThan(20)
    expect(["delivered", "gap"]).toContain(entry!.status)
    const response = await request.get(`/${entry!.file}`)
    // a gap is never covered by a stand-in file
    expect(response.status()).toBe(entry!.status === "delivered" ? 200 : 404)
  }
})

for (const [width, height] of [[390, 844], [1280, 720]]) {
  test(`the cold open fills the viewport edge to edge at ${width} @PF-1-S8`, async ({ browser }) => {
    const page = await browser.newPage({ viewport: { width, height } })
    await page.goto("/")
    const box = await page.locator('section[data-chapter="cold-open"] [data-media]').boundingBox()
    expect(box!.x).toBe(0)
    expect(box!.width).toBeGreaterThanOrEqual(width)
    expect(box!.height).toBeGreaterThanOrEqual(height)
    await page.close()
  })
}

test("video is muted and looping with a poster; reduced motion shows only the poster @PF-1-ASM-03", async ({ page, browser }) => {
  await page.goto("/")
  const videos = page.locator("video")
  expect(await videos.count()).toBeGreaterThan(0)
  for (const attributes of await videos.evaluateAll((all) => all.map((v: HTMLVideoElement) => ({ muted: v.muted, loop: v.loop, poster: v.getAttribute("poster"), inline: v.playsInline })))) {
    expect(attributes.muted).toBe(true)
    expect(attributes.loop).toBe(true)
    expect(attributes.poster).toBeTruthy()
    expect(attributes.inline).toBe(true)
  }
  const still = await browser.newPage({ reducedMotion: "reduce" })
  await still.goto("/")
  await expect(still.locator("video")).toHaveCount(0)
  expect(await still.locator("[data-scene-media] img").count()).toBeGreaterThan(0)
  await still.close()
})

test("no request leaves to an image or video generation API while browsing @PF-1-S11", async ({ page }) => {
  const hosts = new Set<string>()
  page.on("request", (r) => hosts.add(new URL(r.url()).host))
  await page.goto("/")
  await page.waitForLoadState("networkidle")
  await page.mouse.wheel(0, 3000)
  await page.waitForTimeout(500)
  for (const host of hosts) expect(host).not.toMatch(GENERATION_APIS)
  expect([...hosts]).toEqual([new URL(page.url()).host])
})

test("paths outside public answer 404 @PF-1-ASM-11", async ({ request }) => {
  for (const path of ["/.env", "/specs/PF-1-cinematic-portfolio/card.md", "/package.json", "/cv/CV.tex", "/.media-source/justo-team-presentation.jpg"]) {
    expect((await request.get(path)).status(), path).toBe(404)
  }
  const photo = await request.get("/film/justo-team.webp")
  expect(photo.status()).toBe(200)
  const bytes = (await photo.body()).toString("latin1")
  expect(bytes).not.toContain("Exif")
  expect(bytes).not.toContain("<x:xmpmeta")
})

for (const [width, height] of [[390, 844], [1280, 720]]) {
  test(`by second 5 the name, the offer and a door are in view at ${width} @PF-1-S19`, async ({ browser }) => {
    const page = await browser.newPage({ viewport: { width, height } })
    await page.goto("/")
    await page.waitForTimeout(5000)
    for (const selector of ['[data-layer="mark"]', '[data-name="professional"]', ".hero-line", "[data-door]"]) {
      const box = await page.locator(`section[data-chapter="cold-open"] ${selector}`).first().boundingBox()
      expect(box, selector).not.toBeNull()
      expect(box!.y, selector).toBeGreaterThanOrEqual(0)
      expect(box!.y + box!.height, selector).toBeLessThanOrEqual(height)
    }
    await page.close()
  })
}

for (const [width, height] of [[390, 844], [1280, 720]]) {
  test(`at ${width} on throttled 4G the poster paints under 1.5 s, the cold open video is 3 MB or less and name, offer and a door show by 5 s @PF-1-ASM-14`, async ({ browser, request }) => {
    const page = await browser.newPage({ viewport: { width, height } })
    await throttle4G(page)
    const start = Date.now()
    await page.goto("/", { waitUntil: "commit" })
    const poster = readAssets().find((a) => a.id === (width < height ? "pf-cover-9x16" : "pf-cover-16x9"))
    if (poster?.status === "delivered") {
      await page.locator('section[data-chapter="cold-open"] [data-scene-media] img').first().waitFor()
      await page.waitForFunction(() => (document.querySelector('[data-chapter="cold-open"] [data-scene-media] img') as HTMLImageElement | null)?.complete)
      expect(Date.now() - start).toBeLessThan(1500)
    } else gap("cold open poster not delivered yet")
    for (const selector of ['[data-layer="mark"]', ".hero-line", "[data-door]"]) {
      await expect(page.locator(`section[data-chapter="cold-open"] ${selector}`).first()).toBeVisible({ timeout: Math.max(1, 5000 - (Date.now() - start)) })
    }
    for (const id of VIDEO_IDS) {
      const entry = readAssets().find((a) => a.id === id)!
      if (entry.status !== "delivered") continue
      const size = Number((await request.head(`/${entry.file}`)).headers()["content-length"])
      expect(size).toBeLessThanOrEqual(3 * 1024 * 1024)
    }
    await page.close()
  })
}

test("a failed video keeps its poster, a failed poster a dark field, and the text stays legible @PF-1-ASM-17", async ({ page }) => {
  const entry = delivered().find((a) => a.id === "pf-cover-16x9")
  if (!entry) return gap("no cold open poster delivered to fail")
  await page.route("**/film/pf-cover-loop*.mp4", (route) => route.abort())
  await page.goto("/")
  const media = page.locator('section[data-chapter="cold-open"] [data-scene-media]').first()
  await expect(media).toHaveAttribute("data-state", "poster")
  await page.route("**/film/pf-cover-*.webp", (route) => route.abort())
  await page.reload()
  await expect(page.locator('section[data-chapter="cold-open"] [data-scene-media]').first()).toHaveAttribute("data-state", "field")
  await expect(page.locator('section[data-chapter="cold-open"] .hero-line')).toBeVisible()
})

test("every chapter shows at least one illustration of the world @PF-1-S24", async ({ page }) => {
  await page.goto("/")
  const ready = new Set(delivered().map((a) => a.id))
  for (const [chapter, ids] of Object.entries(CHAPTER_ASSETS)) {
    const slots = page.locator(`section[data-chapter="${chapter}"] [data-scene-media][data-asset]`)
    expect(await slots.count(), `${chapter} has a slot for its illustration`).toBeGreaterThan(0)
    if (!ids.some((id) => ready.has(id))) {
      gap(`${chapter}: illustrations not delivered yet`)
      continue
    }
    await expect(slots.filter({ has: page.locator("img") }).first()).toBeVisible()
  }
})

test("the page shows the backdrop and the closing in 16:9 on wide screens and 9:16 on tall ones, the doors, the scenes, the closing, the torn paper and the grain, each listed in ASSETS.md as made in Gemini @PF-1-ASM-20", async ({ browser }) => {
  for (const entry of readAssets().filter((a) => IMAGE_IDS.includes(a.id))) expect(entry.tool, entry.id).toBe("Gemini")
  const ready = new Set(delivered().map((a) => a.id))
  for (const [width, height, suffix] of [[1280, 720, "16x9"], [390, 844, "9x16"]] as const) {
    if (!ready.has(`pf-cover-${suffix}`) || !ready.has(`pf-closing-${suffix}`)) {
      gap(`cover and closing ${suffix} not delivered yet`)
      continue
    }
    const page = await browser.newPage({ viewport: { width, height } })
    await page.goto("/")
    const sources = await page.locator("[data-scene-media] img").evaluateAll((all) => all.map((i: HTMLImageElement) => i.currentSrc))
    expect(sources.some((s) => s.includes(`pf-cover-${suffix}`))).toBe(true)
    expect(sources.some((s) => s.includes(`pf-closing-${suffix}`))).toBe(true)
    await page.close()
  }
})
