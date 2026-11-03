import { test, expect, type Locator } from "@playwright/test"

// @PF-1-ASM-18 @PF-1-ASM-26: the roll lists the two studies and the three certifications that matter, once each, with their logos.
const STUDIES = ["Analista en Informática · Universidad de Morón · 2025", "Técnico Electromecánico · Colegio Emaús · 2021"]

test("the roll lists the two studies and the three curated certifications, one list read and the copies hidden @PF-1-ASM-18 @PF-1-ASM-26", async ({ page }) => {
  await page.goto("/")
  const roll = page.locator("[data-credits-roll]")
  const readable = (band: Locator) => band.locator("ul:not([aria-hidden]) li").allInnerTexts()
  expect((await readable(roll.locator("[data-band]").nth(0))).map((t) => t.trim())).toEqual(STUDIES)
  const certifications = (await readable(roll.locator("[data-band]").nth(1))).map((t) => t.trim())
  expect(certifications).toHaveLength(3)
  expect(certifications[0]).toBe("EF SET C2 Proficient")
  expect(certifications.some((text) => /Liceo Cultural Británico · Nivel 8/.test(text))).toBe(true)
  expect(certifications.some((text) => /Arquitectura de Software Aplicada · Platzi/.test(text))).toBe(true)
  expect(await roll.innerText()).not.toContain("Ingeniería Informática")
  for (const logo of ["logo-UM", "logo-emaus", "logo-liceo-cultural-britanico"]) {
    expect(await roll.locator(`img[src*="${logo}"]`).count()).toBeGreaterThan(0)
  }
  expect(await roll.locator("[aria-hidden='true'] li").count()).toBeGreaterThan(0)
})

test("the TPM offer links to the tools group and the tools are three projects @PF-1-ASM-23 @PF-1-ASM-26", async ({ page }) => {
  await page.goto("/")
  const proof = page.locator('[data-offer-card="tpm"] a[href="#tools"]')
  await expect(proof).toHaveCount(1)
  await expect(proof).toHaveText(/my tools/)
  await expect(page.locator('section#tools[data-group="tools"] article.group-card')).toHaveCount(3)
})
