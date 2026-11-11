import { test, expect } from "@playwright/test"

// @PF-1-ASM-35 scene 4: walking the pinned experience by ticks, the stage is never empty: some copy or some art is on screen at every tick.
const SHOWN = 0.3
const TICKS = 56

test.use({ viewport: { width: 1910, height: 912 } })

test(`no tick of the experience handoff shows an empty stage @PF-1-ASM-35`, async ({ page }) => {
  test.setTimeout(150_000)
  await page.goto("/")
  await page.waitForSelector(".pin-spacer [data-experience-stage]")
  const range = await page.evaluate(() => {
    const spacer = document.querySelector("[data-experience-stage]")!.parentElement!
    const top = spacer.getBoundingClientRect().top + scrollY
    return { top, end: top + spacer.offsetHeight - innerHeight }
  })
  const empty: number[] = []
  for (let i = 0; i <= TICKS; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), range.top + ((range.end - range.top) * i) / TICKS)
    await page.waitForTimeout(1050)
    const shown = await page.evaluate(() => {
      const lineOpacity = [...document.querySelectorAll<HTMLElement>("#experience [data-xp-line]")]
        .filter((n) => getComputedStyle(n).visibility !== "hidden")
        .map((n) => Number(getComputedStyle(n).opacity))
      const artShown = [...document.querySelectorAll<HTMLElement>("#experience [data-employer]")]
        .filter((p) => getComputedStyle(p).visibility !== "hidden")
        .map((p) => {
          const clip = getComputedStyle(p.querySelector(".xp-art img")!).clipPath
          const rightInset = clip.startsWith("inset") ? parseFloat(clip.split(/\s+/)[1]) || 0 : 0
          const ink = getComputedStyle(p.querySelector(".xp-ink")!).clipPath
          const ys = [...ink.matchAll(/[\d.-]+%\s+(-?[\d.]+)%/g)].slice(0, 5).map((m) => Number(m[1]))
          const uncovered = ys.length ? Math.min(1, Math.max(0, ys.reduce((a, b) => a + b, 0) / ys.length / 100)) : 1
          return (1 - rightInset / 100) * uncovered
        })
      return Math.max(0, ...lineOpacity, ...artShown)
    })
    if (shown < SHOWN) empty.push(i)
  }
  expect(empty, "ticks with neither copy nor art on the stage").toEqual([])
})
