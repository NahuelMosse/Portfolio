import { expect, test } from "@playwright/test"

// @PF-1-ASM-26: the chapter words' numerals follow the top nav (01 Subject, 02 Projects, 03 Experience, 04 Offer, 05 Contact).
test("@PF-1-ASM-26 chapter numerals match the nav order", async ({ page }) => {
  await page.goto("/")
  const numerals = await page.evaluate(() =>
    ["projects", "experience", "offer", "contact"].map((id) => document.querySelector(`[data-chapter-title="${id}"] .chapter-detail span`)?.textContent),
  )
  expect(numerals).toEqual(["02", "03", "04", "05"])
})
