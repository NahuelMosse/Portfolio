import { test, expect, type Locator } from "@playwright/test"

// @PF-1-ASM-41 the roll speaks the site's language: studies and certifications in English, institution names as they are.
const STUDIES = ["Associate Degree in Computer Science · Universidad de Morón · 2025", "Technical High School Diploma, Electromechanics · Colegio Emaús · 2021"]
const CERTIFICATIONS = ["EF SET C2 Proficient", "English Level 8 · Liceo Cultural Británico", "Applied Software Architecture · Platzi"]

test("the roll lists the two studies and the three certifications in English, one list read and the copies hidden @PF-1-ASM-41", async ({ page }) => {
  await page.goto("/")
  const roll = page.locator("[data-credits-roll]")
  const readable = (band: Locator) => band.locator("ul:not([aria-hidden]) li").allInnerTexts()
  expect((await readable(roll.locator("[data-band]").nth(0))).map((t) => t.trim())).toEqual(STUDIES)
  expect((await readable(roll.locator("[data-band]").nth(1))).map((t) => t.trim())).toEqual(CERTIFICATIONS)
  const text = await roll.innerText()
  for (const spanish of ["Analista", "Técnico", "Nivel", "Arquitectura"]) expect(text).not.toContain(spanish)
  for (const logo of ["logo-UM", "logo-emaus", "logo-liceo-cultural-britanico"]) {
    expect(await roll.locator(`img[src*="${logo}"]`).count()).toBeGreaterThan(0)
  }
  expect(await roll.locator("[aria-hidden='true'] li").count()).toBeGreaterThan(0)
})
