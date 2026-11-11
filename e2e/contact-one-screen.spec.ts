import { test, expect } from "@playwright/test"

// The footer is the last thing in the contact scene and the credits roll sits above LET'S TALK (ASM-33), so the tiles clear the footer, not the roll.
const VIEWPORTS = [
  { width: 1910, height: 912 },
  { width: 1920, height: 1080 },
  { width: 1440, height: 900 },
  { width: 1280, height: 720 },
  { width: 2560, height: 1080 },
] as const

const TOP_BAR = 56

for (const { width, height } of VIEWPORTS) {
  test(`contact at ${width}x${height}: LET'S TALK to the footer fits one screen and the tiles clear the footer @PF-1-ASM-29`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto("/")
    await page.locator(".contact-scene").scrollIntoViewIfNeeded()
    const span = await page.evaluate(() => {
      const contact = document.querySelector("#contact")!.getBoundingClientRect()
      const foot = document.querySelector(".end-of-file")!.getBoundingClientRect()
      const hint = document.querySelector(".band-hint")!.getBoundingClientRect()
      const halves = document.querySelector(".band-halves")!.getBoundingClientRect()
      return { height: foot.bottom - contact.top, hintClear: hint.bottom <= halves.top + 1, halvesClear: halves.bottom <= foot.top + 1 }
    })
    expect(span.height, "from LET'S TALK to the end of the page").toBeLessThanOrEqual(height - TOP_BAR + 1)
    expect(span.hintClear, "the hint clears the tiles").toBe(true)
    expect(span.halvesClear, "the tiles clear the footer").toBe(true)
  })
}
