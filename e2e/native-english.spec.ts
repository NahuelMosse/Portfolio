import { test, expect } from "@playwright/test"

// @PF-1-ASM-42 the page reads as written by a native English speaker: no calques from Spanish, Spanish words explained or left as names.
const LINES = [
  "Checks that a website moves the way it should: every button responds when pressed, and nothing stutters.",
  "A site can look fine in a screenshot and still feel broken to use.",
  "Attacks your back end the way a hacker would, before a real one does.",
  "It tries bad input, request floods and other users' accounts, then reports what broke and how serious it is.",
  "Tests database changes on a copy before they touch the real one.",
  "The website of a fictional canned yerba mate soda brand, as a design concept.",
  "Booking a court over text messages is slow, and double bookings happen.",
  "Approving a loan meant passing paperwork by hand from person to person.",
  "I'm the client's main technical contact: scope, architecture, security, cloud and mentoring.",
  "I handle the whole product myself: design, code and launch. Everything above is my own work.",
  "For companies: I lead teams that ship with AI under human review, and I still write code.",
  "Associate Degree in Computer Science · Universidad de Morón · 2025",
  "Technical High School Diploma, Electromechanics · Colegio Emaús · 2021",
  "English Level 8 · Liceo Cultural Británico",
]
const CALQUES = [
  "answers when touched",
  "in the hand",
  "a stranger would",
  "rushed requests",
  "Rehearses",
  "Approving a credit",
  "Reserving a court by message",
  "design lab",
  "Freelance builds",
  "the pieces above are what I already built",
  "Identification sheet",
  "Completed studies",
  "IT Analyst",
  "Landings",
]

test("every line a visitor reads is idiomatic English: the rewritten lines are on the page and the calques are gone @PF-1-ASM-42", async ({ page }) => {
  await page.goto("/")
  const text = await page.evaluate(() => document.body.textContent!.replace(/\s+/g, " "))
  for (const line of LINES) expect(text, line).toContain(line)
  for (const calque of CALQUES) expect(text, calque).not.toContain(calque)
  const labels = await page.evaluate(() => [...document.querySelectorAll("[aria-label],[alt]")].map((el) => el.getAttribute("aria-label") ?? el.getAttribute("alt")).join(" | "))
  for (const calque of ["Identification sheet", "Completed studies", "Hoy screen", "Landings"]) expect(labels, calque).not.toContain(calque)
  const sites = page.locator("section#landings")
  await expect(sites.locator(".group-word")).toHaveText("Websites")
  await expect(sites.locator(".group-count")).toHaveText("3 websites")
  await expect(page.locator("[data-id-sheet] .sheet-title")).toHaveText("ID sheet")
})
