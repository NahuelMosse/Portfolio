// Records the two Cebador captures (public/film/pieces/cebador-1280.webm and cebador-390.webm, plus their posters)
// from the live site, frame by frame on a virtual 30 fps clock, so every frame is a new picture and none is dropped.
// Playwright's screen recorder drops and repeats frames; here the page's clock (performance.now, Date.now,
// requestAnimationFrame, CSS/WAAPI animations) only moves when a frame is taken. Scroll follows the same
// section keyframes at both widths, so both captures show each section at the same second.
// Writes scripts/record-cebador.landmarks.json (section -> second, per width). Run: node scripts/record-cebador.mjs
// then node scripts/derive-plates.mjs and node scripts/derive-bars.mjs
import { spawnSync } from "node:child_process"
import { createHash } from "node:crypto"
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { chromium } from "playwright"
import sharp from "sharp"

const URL = "https://nahuelmosse.github.io/cebador-landing/"
const FPS = 30
const SECONDS = 10.5
const FRAMES = FPS * SECONDS
const LOADER_WAIT_MS = 8000
const MAX_BYTES = 1_500_000
// crf steps tried in order until the file fits the budget
const CRF_STEPS = [30, 31, 32, 33, 34, 36, 38, 42, 46]
const OUT = join(process.cwd(), "public", "film", "pieces")
const TARGETS = [
  { name: "cebador-1280", viewport: { width: 1280, height: 720 }, encoded: { width: 960, height: 540 }, key: "1280" },
  { name: "cebador-390", viewport: { width: 390, height: 844 }, encoded: { width: 360, height: 780 }, key: "390" },
]
// the second each section is reached; the last one keeps drifting through the shop until the end
const SECTIONS = [
  { section: "hero", second: 0, selector: "#inicio", offset: 0 },
  { section: "flavors", second: 1.5, selector: "#sabores", offset: 0 },
  { section: "origin", second: 3.5, selector: "#origen", offset: 0 },
  { section: "ingredients", second: 5.5, selector: "#origen", offset: 0.6 },
  { section: "reviews", second: 7.5, selector: "#resenas", offset: 0 },
  { section: "where-to-buy", second: 9, selector: "#comprar", offset: 0 },
]
const DRIFT_PX = 300
const SCROLL_STEP_PX = 240
const SCROLL_STEP_MS = 220
const REVEALS_TIMEOUT_MS = 15000
// the longest reveal (map labels, 2 s delay + 0.9 s) plus margin once everything reports complete
const REVEALS_SETTLE_MS = 600
const originReport = {}

// Runs before the page's scripts: a clock that follows real time until frozen, then moves only by tick().
const installClock = () => {
  const real = { now: performance.now.bind(performance), date: Date.now, raf: window.requestAnimationFrame.bind(window), caf: window.cancelAnimationFrame.bind(window) }
  const clock = { frozen: false, offset: 0, base: 0, dateBase: 0, queue: new Map(), next: 1, bases: new WeakMap() }
  performance.now = () => (clock.frozen ? clock.base + clock.offset : real.now())
  Date.now = () => (clock.frozen ? clock.dateBase + clock.offset : real.date())
  window.requestAnimationFrame = (cb) => {
    if (!clock.frozen) return real.raf(cb)
    const id = clock.next++
    clock.queue.set(id, cb)
    return -id
  }
  window.cancelAnimationFrame = (id) => (id < 0 ? clock.queue.delete(-id) : real.caf(id))
  window.__clock = {
    freeze() {
      clock.base = real.now()
      clock.dateBase = real.date()
      clock.frozen = true
      for (const a of document.getAnimations()) {
        clock.bases.set(a, Number(a.currentTime) || 0)
        a.pause()
      }
    },
    tick(ms) {
      clock.offset += ms
      for (const a of document.getAnimations()) {
        if (!clock.bases.has(a)) clock.bases.set(a, 0)
        a.pause()
        a.currentTime = clock.bases.get(a) + clock.offset
      }
      const callbacks = [...clock.queue.values()]
      clock.queue.clear()
      for (const cb of callbacks) cb(clock.base + clock.offset)
    },
  }
}

// Reports whether #origen is on screen and, if so, whether each part sits at its final state (see the live main.js reveals).
const installOriginCheck = () => {
  const finalProp = (el, prop, value) => window.gsap.getProperty(el, prop) === value
  window.__origin = () => {
    const root = document.querySelector("#origen")
    if (!root) throw new Error("section #origen not found")
    const rect = root.getBoundingClientRect()
    const fonts = document.fonts.status
    const onScreen = rect.top < innerHeight && rect.bottom > 0
    const shown = (el) => el.classList.contains("in") && Number(getComputedStyle(el).opacity) === 1
    const parts = (sel) => [...root.querySelectorAll(sel)]
    const heading = parts("[data-reveal=mask]").every((h) => h.classList.contains("in") && [...h.querySelectorAll("*")].every((w) => finalProp(w, "yPercent", 0)))
    const paragraph = parts("[data-reveal=rise]").every((el) => shown(el) && finalProp(el, "y", 0))
    const draw = parts("[data-reveal=draw]")
    const map = draw.length > 0 && draw.every((el) => el.classList.contains("in")
      && [...el.querySelectorAll(".ct")].every((p) => parseFloat(getComputedStyle(p).strokeDashoffset) === 0)
      && [...el.querySelectorAll(".pin")].every((p) => finalProp(p, "scale", 1))
      && [...el.querySelectorAll("text")].every((t) => Number(getComputedStyle(t).opacity) === 1 && finalProp(t, "x", 0)))
    const stats = parts("[data-reveal=stat]")
    const counted = stats.length === 4 && stats.every((el) => shown(el) && finalProp(el, "x", 0)
      && el.querySelector("[data-count]").textContent.trim() === el.querySelector("[data-count]").dataset.count)
    return { onScreen, fonts, heading, paragraph, map, stats: counted }
  }
}

const isComplete = (c) => c.fonts === "loaded" && c.heading && c.paragraph && c.map && c.stats

// Plays Origen's reveals on the real clock: scroll through it part by part, wait until all report done, go back to the top.
const playOriginReveals = async (page) => {
  const bottom = await page.evaluate(() => {
    const root = document.querySelector("#origen")
    return Math.round(root.getBoundingClientRect().top + scrollY + root.offsetHeight - innerHeight / 2)
  })
  for (let y = 0; y < bottom; y += SCROLL_STEP_PX) {
    await page.evaluate((to) => window.scrollTo(0, to), y)
    await page.waitForTimeout(SCROLL_STEP_MS)
  }
  await page.evaluate((to) => window.scrollTo(0, to), bottom)
  const deadline = Date.now() + REVEALS_TIMEOUT_MS
  while (!isComplete(await page.evaluate(() => window.__origin()))) {
    if (Date.now() > deadline) throw new Error("Origen reveals did not finish")
    await page.waitForTimeout(250)
  }
  await page.waitForTimeout(REVEALS_SETTLE_MS)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(REVEALS_SETTLE_MS)
}

const readStops = (page) =>
  page.evaluate(
    ({ sections, drift }) => {
      const maxScroll = document.documentElement.scrollHeight - innerHeight
      const stops = sections.map(({ selector, offset }) => {
        const el = document.querySelector(selector)
        if (!el) throw new Error(`section ${selector} not found`)
        return Math.min(maxScroll, Math.round(el.getBoundingClientRect().top + scrollY + el.offsetHeight * offset))
      })
      const last = stops.length - 1
      return { stops, end: Math.min(maxScroll, stops[last] + drift) }
    },
    { sections: SECTIONS, drift: DRIFT_PX },
  )

// scroll position at a second: straight lines through the section stops, then the drift to the end
const scrollAt = (second, { stops, end }) => {
  const times = [...SECTIONS.map((s) => s.second), SECONDS]
  const points = [...stops, end]
  const segment = Math.max(0, times.findIndex((t) => t > second) - 1)
  const from = Math.min(segment, points.length - 2)
  const share = Math.min(1, Math.max(0, (second - times[from]) / (times[from + 1] - times[from])))
  return Math.round(points[from] + (points[from + 1] - points[from]) * share)
}

const run = (cmd, args) => {
  const done = spawnSync(cmd, args, { encoding: "utf8" })
  if (done.status !== 0) throw new Error(`${cmd} failed: ${done.stderr}`)
}

const encode = (frames, file, { width, height }) => {
  for (const crf of CRF_STEPS) {
    run("ffmpeg", ["-v", "error", "-y", "-framerate", String(FPS), "-i", join(frames, "%04d.png"),
      "-vf", `scale=${width}:${height}:flags=lanczos`, "-c:v", "libvpx-vp9", "-crf", String(crf), "-b:v", "0",
      "-pix_fmt", "yuv420p", "-r", String(FPS), "-row-mt", "1", "-an", file])
    if (statSync(file).size < MAX_BYTES) return crf
  }
  throw new Error(`${file} does not fit ${MAX_BYTES} bytes at crf ${CRF_STEPS.at(-1)}`)
}

const record = async (browser, target) => {
  const context = await browser.newContext({ viewport: target.viewport, deviceScaleFactor: 1 })
  const page = await context.newPage()
  await page.addInitScript(installClock)
  await page.addInitScript(installOriginCheck)
  await page.goto(URL, { waitUntil: "load" })
  await page.waitForTimeout(LOADER_WAIT_MS)
  await playOriginReveals(page)
  const path = await readStops(page)
  await page.evaluate(() => window.__clock.freeze())
  const frames = mkdtempSync(join(tmpdir(), `cebador-${target.key}-`))
  const originFrames = []
  for (let n = 0; n < FRAMES; n++) {
    const seen = await page.evaluate(({ y, ms }) => { window.scrollTo(0, y); window.__clock.tick(ms); return window.__origin() }, { y: scrollAt(n / FPS, path), ms: n === 0 ? 0 : 1000 / FPS })
    if (seen.onScreen) {
      const { onScreen, ...measured } = seen
      if (!isComplete(measured)) throw new Error(`${target.name} frame ${n + 1}: Origen is not at its final state: ${JSON.stringify(measured)}`)
      originFrames.push({ n: n + 1, ...measured })
    }
    await page.screenshot({ path: join(frames, `${String(n + 1).padStart(4, "0")}.png`) })
  }
  await context.close()
  const file = join(OUT, `${target.name}.webm`)
  const crf = encode(frames, file, target.encoded)
  const first = join(frames, "poster.png")
  run("ffmpeg", ["-v", "error", "-y", "-i", file, "-frames:v", "1", first])
  await sharp(first).webp({ quality: 82 }).toFile(join(OUT, `${target.name}-poster.webp`))
  rmSync(frames, { recursive: true, force: true })
  originReport[target.key] = { webm: `${target.name}.webm`, sha256: createHash("sha256").update(readFileSync(file)).digest("hex"), frames: originFrames }
  console.log(`${target.name}: crf ${crf}, ${statSync(file).size} bytes`)
}

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch()
try {
  for (const target of TARGETS) await record(browser, target)
} finally {
  await browser.close()
}
const landmarks = SECTIONS.map(({ section, second }) => ({ section, second }))
writeFileSync(join(process.cwd(), "scripts", "record-cebador.landmarks.json"), `${JSON.stringify({ 1280: landmarks, 390: landmarks }, null, 2)}\n`)
writeFileSync(join(process.cwd(), "scripts", "record-cebador.origin.json"), `${JSON.stringify(originReport, null, 2)}
`)
