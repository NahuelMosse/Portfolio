import { test, expect, type Page } from "@playwright/test"

declare global {
  interface Window {
    __playing?: boolean
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = function () {
      window.__playing = true
      return Promise.resolve()
    }
    HTMLMediaElement.prototype.pause = function () {
      window.__playing = false
    }
  })
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveClass(/is-preloading|is-landing/, { timeout: 30000 })
  const hasAudio = (await page.locator("audio").count()) > 0
  test.skip(!hasAudio, "no <audio> is rendered: the soundtrack mp3 is not delivered")
})

const playing = (page: Page) => page.evaluate(() => window.__playing === true)

const setHidden = (page: Page, hidden: boolean) =>
  page.evaluate((h) => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => h })
    document.dispatchEvent(new Event("visibilitychange"))
  }, hidden)

test("a hidden tab pauses the soundtrack and coming back resumes it, with the toggle unchanged @PF-1-ASM-45", async ({ page }) => {
  const toggle = page.locator("[data-sound-toggle]")
  await toggle.click()
  await expect(toggle).toHaveAttribute("aria-pressed", "true")
  expect(await playing(page)).toBe(true)

  await setHidden(page, true)
  expect(await playing(page)).toBe(false)
  await expect(toggle).toHaveAttribute("aria-pressed", "true")
  await expect(toggle).toHaveText(/Sound on/)

  await setHidden(page, false)
  expect(await playing(page)).toBe(true)
})

test("a soundtrack turned off stays off after the tab is hidden and shown @PF-1-ASM-45", async ({ page }) => {
  const toggle = page.locator("[data-sound-toggle]")
  await toggle.click()
  await expect(toggle).toHaveAttribute("aria-pressed", "true")
  await toggle.click()
  await expect(toggle).toHaveAttribute("aria-pressed", "false")
  expect(await playing(page)).toBe(false)

  await setHidden(page, true)
  await setHidden(page, false)
  expect(await playing(page)).toBe(false)
})

const soundPhase = (page: Page) => page.locator("html").getAttribute("data-sound")

test("scrolled past the cover, a click leaves the sound idle and the audio paused @PF-1-ASM-46", async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, 2000))
  await page.waitForTimeout(600)
  await page.mouse.click(200, 300)
  await page.waitForTimeout(300)
  expect(await soundPhase(page)).toBe("idle")
  expect(await playing(page)).toBe(false)
})

test("on the cover with its invitation on screen, a click starts the sound @PF-1-ASM-46", async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(page.locator(".sound-cue-chip[data-visible], .cover-cue").first()).toBeVisible({ timeout: 15000 })
  await page.mouse.click(200, 300)
  await expect(page.locator("html")).toHaveAttribute("data-sound", "on")
  expect(await playing(page)).toBe(true)
})

test("the toggle starts the sound from anywhere @PF-1-ASM-46", async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, 2000))
  await page.waitForTimeout(600)
  await page.locator("[data-sound-toggle]").click()
  await expect(page.locator("html")).toHaveAttribute("data-sound", "on")
  expect(await playing(page)).toBe(true)
})
