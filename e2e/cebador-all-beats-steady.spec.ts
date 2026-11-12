import { test, expect, type Page } from "@playwright/test"

const VIEWPORTS = [
  { width: 1440, height: 900, page: "cebador-1280", phone: "cebador-390" },
  { width: 390, height: 844, page: "cebador-1280", phone: "cebador-390" },
]
const CARD = 'article[data-project="cebador"]'

async function opened(page: Page) {
  await page.waitForLoadState("load")
  await page.waitForFunction(() => !document.documentElement.classList.contains("is-preloading"), undefined, { timeout: 30_000 })
}

async function jumpToLandings(page: Page) {
  await expect
    .poll(
      async () => {
        await page.evaluate(() => {
          const section = document.getElementById("landings")!
          window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.5)
        })
        await page.waitForTimeout(400)
        return page.evaluate(() => Math.abs(document.getElementById("landings")!.getBoundingClientRect().top - window.innerHeight * 0.5))
      },
      { message: "the page jumps to landings", timeout: 15_000 },
    )
    .toBeLessThan(400)
}

// Wheels until the Cebador card is the current one on the given beat.
async function reachBeat(page: Page, beat: number) {
  for (let k = 0; k < 400; k++) {
    const at = await page.locator("section#landings").evaluate((el) => {
      const node = el.querySelector("article[data-current]")
      return node ? `${node.getAttribute("data-project")}:${node.getAttribute("data-beat")}` : ""
    })
    if (at === `cebador:${beat}`) return
    await page.mouse.wheel(0, 80)
    await page.waitForTimeout(250)
  }
  throw new Error(`the wheel never reached Cebador beat ${beat}`)
}

// Marks the videos on first sight and watches them for a new load or a jump back to the start; later calls report what they saw.
function watch(page: Page) {
  return page.evaluate((card) => {
    const out: Record<string, unknown> = {}
    for (const role of ["main", "second"]) {
      const rig = document.querySelector(`${card} .show-rig[data-role="${role}"]`)!
      const box = rig.getBoundingClientRect()
      const videos = [...rig.querySelectorAll<HTMLVideoElement>("video")]
      const on = rig.querySelector<HTMLVideoElement>(".show-screen[data-on] video")
      const stills = [...rig.querySelectorAll("img")].map((img) => img.currentSrc || img.src).filter((url) => /sabor|tienda/.test(url))
      const w = window as unknown as { __pf11?: Record<string, { video: HTMLVideoElement; loads: number; restarts: number }> }
      w.__pf11 ??= {}
      let mark = w.__pf11[role]
      const first = !mark
      if (!mark && on && on.readyState >= 2) {
        const entry = { video: on, loads: 0, restarts: 0 }
        let before = 0
        on.addEventListener("loadstart", () => entry.loads++)
        on.addEventListener("emptied", () => entry.loads++)
        on.addEventListener("timeupdate", () => {
          const wrapped = before > (on.duration || 0) - 1.5
          if (on.currentTime < before - 1 && !wrapped) entry.restarts++
          before = on.currentTime
        })
        w.__pf11[role] = entry
        mark = entry
      }
      out[role] = {
        first,
        same: Boolean(mark && mark.video === on),
        loadsAfterMark: mark ? mark.loads : -1,
        restarts: mark ? mark.restarts : -1,
        videoCount: videos.length,
        src: on?.getAttribute("data-src") || on?.currentSrc || "",
        ready: (on?.readyState ?? 0) >= 2,
        caption: role === "main" ? rig.querySelector(".show-tab")?.textContent?.trim() : null,
        shown: getComputedStyle(rig).display !== "none" && box.width > 0 && box.height > 0,
        stills,
      }
    }
    return out as Record<"main" | "second", { first: boolean; same: boolean; loadsAfterMark: number; restarts: number; videoCount: number; src: string; ready: boolean; caption: string | null; shown: boolean; stills: string[] }>
  }, CARD)
}

test("on Cebador's three beats at 1440x900 and 390x844 the page and the phone play their live captures, the same video elements without a reload or a restart @PF-11-S1 @PF-11-S2 @PF-11-ASM-01", async ({ page }) => {
  test.setTimeout(300_000)
  for (const viewport of VIEWPORTS) {
    await page.setViewportSize(viewport)
    await page.goto("/")
    await opened(page)
    await jumpToLandings(page)
    for (const beat of [0, 1, 2]) {
      await reachBeat(page, beat)
      await expect
        .poll(async () => {
          const now = await watch(page)
          return now.main.ready && now.second.ready
        }, { message: `both captures ready on beat ${beat} at ${viewport.width}`, timeout: 20_000 })
        .toBe(true)
      const seen = await watch(page)
      const label = `beat ${beat} at ${viewport.width}`
      expect(seen.main.src, `${label} page capture`).toContain(`${viewport.page}.webm`)
      expect(seen.second.src, `${label} phone capture`).toContain(`${viewport.phone}.webm`)
      expect(seen.main.caption, `${label} caption`).toBe("Live")
      expect(seen.second.shown, `${label} the phone stands beside the page`).toBe(true)
      expect([seen.main.videoCount, seen.second.videoCount], `${label} one video per device, no stills of Flavor or Shop`).toEqual([1, 1])
      expect([seen.main.stills, seen.second.stills], `${label} no Flavor or Shop still`).toEqual([[], []])
      expect([seen.main.same, seen.second.same], `${label} the same video elements as on the first beat`).toEqual([true, true])
      expect([seen.main.loadsAfterMark, seen.second.loadsAfterMark], `${label} no new load`).toEqual([0, 0])
      expect([seen.main.restarts, seen.second.restarts], `${label} no jump back to the start`).toEqual([0, 0])
    }
  }
})
