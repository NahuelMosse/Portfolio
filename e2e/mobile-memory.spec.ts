import { test, expect, chromium, webkit, type Page } from "@playwright/test"

// @PF-3-S1 @PF-3-ASM-01: Safari reloads the tab when it runs out of memory. On a phone nothing keeps a standing layer of its own
// (will-change, a 3D transform, a perspective) and what lies farther than a screen from the view holds no filter or playing video.
const VIEWPORT = { width: 390, height: 844 }
const STEP = 640

type Layered = { where: string; why: string }

async function layersOnPage(page: Page, farOnly: boolean): Promise<Layered[]> {
  return page.evaluate((farOnly) => {
    const found: { where: string; why: string }[] = []
    for (const el of document.querySelectorAll<HTMLElement>("body *")) {
      const style = getComputedStyle(el)
      if (style.display === "none") continue
      const box = el.getBoundingClientRect()
      const far = box.bottom < -innerHeight || box.top > innerHeight * 2
      if (farOnly && !far) continue
      const reasons: string[] = []
      if (style.willChange !== "auto") reasons.push(`will-change ${style.willChange}`)
      if (style.transform.includes("matrix3d")) reasons.push("3D transform")
      if (style.perspective !== "none") reasons.push("perspective")
      if (style.transformStyle === "preserve-3d") reasons.push("preserve-3d")
      if (farOnly && style.visibility !== "hidden") {
        if (style.filter.includes("blur")) reasons.push(`filter ${style.filter}`)
        if (style.backdropFilter && style.backdropFilter !== "none") reasons.push("backdrop-filter")
        if (el instanceof HTMLVideoElement && !el.paused) reasons.push("playing video")
      }
      if (reasons.length) found.push({ where: `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)}`, why: reasons.join(", ") })
    }
    return found
  }, farOnly)
}

const engines = { chromium, webkit }

// The engine is launched here: a describe group cannot switch the browser the fixtures use.
async function onPhone(engine: keyof typeof engines, baseURL: string | undefined, body: (page: Page) => Promise<void>) {
  const browser = await engines[engine].launch()
  try {
    const context = await browser.newContext({ baseURL, viewport: VIEWPORT, hasTouch: true, isMobile: true })
    await body(await context.newPage())
  } finally {
    await browser.close()
  }
}

async function openedPage(page: Page) {
  await page.goto("/")
  await page.waitForLoadState("load")
  await page.waitForTimeout(1500)
}

for (const engine of ["chromium", "webkit"] as const) {
  test(`walking a 390x844 phone top to bottom in Chromium and WebKit, nothing farther than a screen from the view is rendered with a layer of its own (${engine}) @PF-3-S1 @PF-3-ASM-01`, async ({ baseURL }) => {
    test.setTimeout(240_000)
    await onPhone(engine, baseURL, async (page) => {
      await openedPage(page)
      const height = await page.evaluate(() => document.documentElement.scrollHeight)
      const offenders = new Map<string, string>()
      for (let y = 0; y < height; y += STEP) {
        await page.evaluate((top) => window.scrollTo(0, top), y)
        await page.waitForTimeout(60)
        for (const layer of await layersOnPage(page, true)) offenders.set(layer.where, layer.why)
      }
      expect([...offenders].map(([where, why]) => `${where}: ${why}`)).toEqual([])
    })
  })

  test(`on a phone no element keeps will-change or a 3D transform (${engine}) @PF-3-ASM-01`, async ({ baseURL }) => {
    await onPhone(engine, baseURL, async (page) => {
      await openedPage(page)
      const offenders = new Set<string>()
      for (const target of [0, 0.25, 0.5, 0.75]) {
        await page.evaluate((share) => window.scrollTo(0, document.documentElement.scrollHeight * share), target)
        await page.waitForTimeout(300)
        for (const layer of await layersOnPage(page, false)) offenders.add(`${layer.where}: ${layer.why}`)
      }
      expect([...offenders]).toEqual([])
    })
  })
}
