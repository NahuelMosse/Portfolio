import { test, expect, type APIRequestContext } from "@playwright/test"

const FIGURE = /\d+\s*%|\b\d+\s*x\b|\bfrom \d|\b\d+\s*(million|thousand|hours|min)\b|\bbefore\b.*\bafter\b/i
const PHONE = /\btel:|\+\d[\d\s().-]{7,}\d|\b\d{3,4}[\s.-]\d{4}\b|\(\d{2,4}\)\s?\d{4}/

const readTexts = async (request: APIRequestContext) => {
  const llms = await (await request.get("/llms.txt")).text()
  const json = await (await request.get("/portfolio.json")).text()
  const html = await (await request.get("/")).text()
  return { llms, json, html }
}

const withoutClock = (json: string) => {
  const body = JSON.parse(json)
  delete body.updatedAt
  return body
}

test("llms.txt and portfolio.json state the freelance and TPM positioning @PF-1-ASM-07", async ({ request }) => {
  const { llms, json } = await readTexts(request)
  expect(llms).toMatch(/freelance/i)
  expect(llms).toContain("Technical Project Manager")
  const profile = JSON.parse(json)
  const titles = profile.offer.map((o: { title: string }) => o.title)
  expect(titles).toEqual(["Freelance", "Technical Project Manager"])
  expect(profile.profile.role).toContain("Technical Project Manager")
})

test("no percentage, multiplier or before-after figure in llms.txt, portfolio.json or the page metadata @PF-1-S14", async ({ request }) => {
  const { llms, json, html } = await readTexts(request)
  const metadata = [
    ...html.matchAll(/<title>([^<]*)<\/title>|<meta[^>]+(?:name|property)="(?:description|og:[a-z:]+|twitter:[a-z:]+)"[^>]*>/g),
  ]
    .map((m) => m[0])
    .join("\n")
  expect(metadata.length).toBeGreaterThan(0)
  for (const text of [llms, JSON.stringify(withoutClock(json)), metadata]) expect(text).not.toMatch(FIGURE)
})

test("the phone appears on no page, llms.txt or portfolio.json @PF-1-ASM-16", async ({ request }) => {
  const { llms, json, html } = await readTexts(request)
  const body = withoutClock(json)
  const visible = html.replace(/<script[\s\S]*?<\/script>/g, "")
  for (const text of [llms, JSON.stringify(body), visible]) expect(text).not.toMatch(PHONE)
  expect(Object.keys(body.profile)).not.toContain("phone")
})
