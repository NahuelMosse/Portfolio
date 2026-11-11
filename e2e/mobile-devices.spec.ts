import { test, expect, type Page } from "@playwright/test"

// @PF-3-S4 @PF-3-S5: on a phone the devices stand as large as the stage leaves, each screen in its own shape, clear of the caption.
const WIDTH = 390
const GUTTER = 24
const PHONE_SHAPE = 390 / 844
const SHAPE_TOLERANCE = 0.03
const PHONE_MIN_SHARE = 0.38
const SIZES = [844, 664]

test.use({ viewport: { width: WIDTH, height: 844 }, hasTouch: true, isMobile: true })

type Rig = { kind: string; role: string; width: number; height: number; glass: { left: number; top: number; right: number; bottom: number; width: number; height: number }; captureShape: number | null }
type Caption = { left: number; top: number; right: number; bottom: number }
type Stage = { project: string; rigs: Rig[]; captions: Caption[]; innerHeight: number }

// Brings one project of its group on show and reads where its devices and its caption text stand.
async function readStage(page: Page, project: string): Promise<Stage> {
  await page.evaluate(async (id) => {
    const card = document.getElementById(id)!
    const group = card.closest<HTMLElement>(".group")!
    const tab = group.querySelector<HTMLElement>(`.group-index li[data-project="${id}"] button`)
    if (tab) tab.click()
    else scrollTo(0, group.getBoundingClientRect().top + scrollY + 5)
    for (let wait = 0; wait < 40 && !card.hasAttribute("data-current"); wait++) await new Promise((resolve) => setTimeout(resolve, 50))
  }, project)
  await page.waitForTimeout(450)
  return page.evaluate(async (id) => {
    const card = document.getElementById(id)!
    const visible = (box: DOMRect) => box.width > 1 && box.height > 1
    // the capture's own shape: its file, read here so it does not wait for the page's loader to reach it
    const shapeOf = (img: HTMLImageElement | null) =>
      new Promise<number | null>((resolve) => {
        if (!img) return resolve(null)
        const first = img.dataset.srcset?.split(",")[0].trim().split(" ")[0]
        const source = first || (img.currentSrc || img.src).split("#").pop()!
        const probe = new Image()
        probe.onload = () => resolve(probe.naturalWidth / probe.naturalHeight)
        probe.onerror = () => resolve(null)
        probe.src = source
      })
    const rigs = await Promise.all(
      [...card.querySelectorAll<HTMLElement>(".show-rig")]
      .filter((rig) => visible(rig.getBoundingClientRect()))
      .map(async (rig) => {
        const box = rig.getBoundingClientRect()
        const glass = rig.querySelector(".show-glass")!.getBoundingClientRect()
        const img = rig.querySelector<HTMLImageElement>(".show-screen[data-on] img")
        return {
          kind: rig.dataset.device!,
          role: rig.dataset.role!,
          width: box.width,
          height: box.height,
          glass: { left: glass.left, top: glass.top, right: glass.right, bottom: glass.bottom, width: glass.width, height: glass.height },
          captureShape: await shapeOf(img),
        }
      }),
    )
    const captions = [...card.querySelectorAll<HTMLElement>(".show-beat[data-on] p, .show-meta, .show-ticks")].map((el) => {
      const range = document.createRange()
      range.selectNodeContents(el)
      const box = el.matches(".show-meta, .show-ticks") ? el.getBoundingClientRect() : range.getBoundingClientRect()
      return { left: box.left, top: box.top, right: box.right, bottom: box.bottom }
    })
    return { project: id, rigs, captions, innerHeight }
  }, project)
}

async function projectIds(page: Page) {
  return page.$$eval(".group-card", (cards) => cards.map((card) => card.id))
}

async function openedPage(page: Page) {
  await page.goto("/")
  await page.waitForLoadState("load")
  await page.waitForTimeout(1200)
}

test("on a phone a phone screen keeps the 390:844 shape and a browser screen its capture's shape, within 3 % @PF-3-S5 @PF-3-ASM-05", async ({ page }) => {
  test.setTimeout(180_000)
  await openedPage(page)
  const wrong: string[] = []
  for (const project of await projectIds(page)) {
    const stage = await readStage(page, project)
    for (const rig of stage.rigs) {
      const shape = rig.glass.width / rig.glass.height
      const wanted = rig.kind === "phone" ? PHONE_SHAPE : rig.captureShape
      if (wanted === null) continue
      if (Math.abs(shape / wanted - 1) > SHAPE_TOLERANCE) wrong.push(`${project} ${rig.role} ${rig.kind}: ${shape.toFixed(3)} against ${wanted.toFixed(3)}`)
    }
  }
  expect(wrong).toEqual([])
})

test("on a 390x844 and a 390x664 phone a browser spans the gutters and a phone stands 38 % of the screen, clear of the caption @PF-3-S4 @PF-3-ASM-06", async ({ page }) => {
  test.setTimeout(240_000)
  await openedPage(page)
  const wrong: string[] = []
  for (const height of SIZES) {
    await page.setViewportSize({ width: WIDTH, height })
    await page.waitForTimeout(400)
    for (const project of await projectIds(page)) {
      const stage = await readStage(page, project)
      for (const rig of stage.rigs) {
        const at = `${project} ${rig.role} ${rig.kind} at ${height}`
        if (rig.kind === "browser" && rig.role === "main" && rig.width < WIDTH - 2 * GUTTER - 2) wrong.push(`${at}: ${Math.round(rig.width)} wide`)
        if (rig.kind === "phone" && rig.height < PHONE_MIN_SHARE * stage.innerHeight - 1) wrong.push(`${at}: ${Math.round(rig.height)} tall`)
        for (const caption of stage.captions) {
          const across = Math.min(caption.right, rig.glass.right) - Math.max(caption.left, rig.glass.left)
          const down = Math.min(caption.bottom, rig.glass.bottom) - Math.max(caption.top, rig.glass.top)
          if (across > 1 && down > 1) wrong.push(`${at}: caption over its screen by ${Math.round(down)} px`)
        }
      }
    }
  }
  expect(wrong).toEqual([])
})
