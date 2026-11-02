import { test, expect, type Locator } from "@playwright/test"

const STUDIES = ["Analista en Informática · Universidad de Morón · 2025", "Técnico Electromecánico · Colegio Emaús · 2021"]
const CERTIFICATIONS = [
  "EF SET C2 Proficient",
  "Arquitectura de Software Aplicada · Platzi",
  "Fundamentos de Arquitectura de Software · Platzi 2026",
  "Liceo Cultural Británico · Nivel 8",
  "Liceo Cultural Británico · Nivel 7",
  "Liceo Cultural Británico · Nivel 6",
  "Fundamentos de Arquitectura de Software · Platzi 2023",
  "Fundamentos de Ingeniería de Software · Platzi",
  "Responsive Web Design · freeCodeCamp",
]
const GAME_WORDS = ["Off duty", "Rocket League", "Minecraft", "Smite", "Witcher", "Cyberpunk"]

test.beforeEach(async ({ page }) => {
  await page.goto("/")
})

test("the roll lists Analista en Informática 2025 and Técnico Electromecánico 2021, the nine certifications with Platzi 2026 and 2023 and Liceo Nivel 8, 7 and 6, not Ingeniería Informática, and the page names no games: no off-duty line @PF-1-ASM-18 @PF-1-ASM-21", async ({ page }) => {
  const roll = page.locator("[data-credits-roll]")
  const studies = roll.locator("[data-band]").nth(0)
  const certifications = roll.locator("[data-band]").nth(1)
  const readable = (band: Locator) => band.locator("ul:not([aria-hidden]) li").allInnerTexts()
  expect((await readable(studies)).map((t) => t.trim())).toEqual(STUDIES)
  expect((await readable(certifications)).map((t) => t.trim())).toEqual(CERTIFICATIONS)
  expect(await roll.innerText()).not.toContain("Ingeniería Informática")
  for (const logo of ["logo-UM", "logo-emaus", "logo-liceo-cultural-britanico"]) {
    expect(await roll.locator(`img[src*="${logo}"]`).count()).toBeGreaterThan(0)
  }
  await expect(page.locator("[data-off-duty]")).toHaveCount(0)
  const text = await page.evaluate(() => document.documentElement.textContent ?? "")
  for (const word of GAME_WORDS) expect(text, `page names ${word}`).not.toContain(word)
})
