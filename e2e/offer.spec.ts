import { test, expect } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/")
})

const AI_DELIVERY = [/AI-first delivery/i, /Spec-Driven Development/i, /Claude Code/i, /traced to a test/i, /reviewed by a person/i, /pull request/i]

test("the TPM offer and its door name how he delivers with AI @PF-1-S27", async ({ page }) => {
  await expect(page.locator('[data-offer-card="tpm"]')).toContainText(/AI/)
  const door = page.locator('[data-doors] a[href^="mailto:"]', { hasText: /AI/ })
  await expect(door).toHaveCount(1)
  expect(decodeURIComponent(await door.getAttribute("href") as string)).toContain("Technical Project Manager")
})

test("the TPM offer says AI-first delivery with Spec-Driven Development and agents orchestrated with Claude Code, every requirement traced to a test and reviewed by a person on the pull request, links to the dev kit scene, and the Smart Warehousing and Grupo ST entries open with their AI work @PF-1-ASM-23", async ({ page }) => {
  const offer = page.locator('[data-offer-card="tpm"]')
  for (const phrase of AI_DELIVERY) await expect(offer).toContainText(phrase)
  const proof = offer.locator('a[href="#dev-kit"]')
  await expect(proof).toHaveCount(1)
  await expect(page.locator('article[data-project="dev-kit"]#dev-kit')).toHaveCount(1)
  for (const id of ["smart-warehousing", "grupo-st"]) {
    const opening = await page.locator(`article[data-employer="${id}"] [data-field]`).first().textContent()
    expect(opening).toMatch(/\bAI\b/)
  }
})

test("the offer names freelance product builds @PF-1-S6", async ({ page }) => {
  const offer = page.locator('[data-offer-card="freelance"]')
  await expect(offer).toContainText(/freelance/i)
  await expect(offer).toContainText(/\bbuild/i)
  await expect(offer).toContainText(/product|site|app/i)
})

test("the offer names Technical Project Manager for companies @PF-1-S7", async ({ page }) => {
  const offer = page.locator('[data-offer-card="tpm"]')
  await expect(offer).toContainText("Technical Project Manager")
  await expect(offer).toContainText(/compan/i)
})

test("the html lang is en @PF-1-ASM-02", async ({ page }) => {
  await expect(page.locator("html")).toHaveAttribute("lang", "en")
})
