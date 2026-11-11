import { test, expect } from "@playwright/test"

const AI_SEARCH_AGENTS = ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "PerplexityBot"]

// The page as a crawler that runs no JavaScript receives it.
const rawHtml = async (request: import("@playwright/test").APIRequestContext) => {
  const response = await request.get("/")
  expect(response.status()).toBe(200)
  return response.text()
}

const visibleText = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, " ")

test("the raw HTML has one h1, a title, a description and a canonical URL @PF-1-ASM-44", async ({ request }) => {
  const html = await rawHtml(request)
  expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
  expect(html).toMatch(/<title>[^<]*Nahuel Mosse[^<]*<\/title>/)
  expect(html).toMatch(/<meta name="description" content="[^"]{50,}"/)
  expect(html).toMatch(/<link rel="canonical" href="https?:\/\/[^"]+"/)
})

test("the JSON-LD parses and names the WebSite, the Person and the ProfilePage about him @PF-1-ASM-44", async ({ request }) => {
  const html = await rawHtml(request)
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  expect(blocks.length).toBeGreaterThan(0)
  const nodes = blocks.flatMap((block) => JSON.parse(block[1]))
  const byType = (type: string) => nodes.find((node: { "@type": string }) => node["@type"] === type)
  expect(byType("WebSite")).toBeTruthy()
  const person = byType("Person")
  expect(person.name).toBe("Nahuel Mosse")
  expect(person.sameAs).toEqual(expect.arrayContaining([expect.stringContaining("github.com"), expect.stringContaining("linkedin.com")]))
  expect(byType("ProfilePage").mainEntity["@id"]).toBe(person["@id"])
})

test("who he is, what he does and where he is are in the HTML without JavaScript @PF-1-ASM-44", async ({ request }) => {
  const text = visibleText(await rawHtml(request))
  for (const fact of ["Nahuel Mosse", "NAWI", "Technical Lead · Technical Project Manager", "Buenos Aires", "Freelance", "Technical Project Manager"]) {
    expect(text).toContain(fact)
  }
})

test("robots.txt lets search and AI search agents in and points to a sitemap that answers @PF-1-ASM-44", async ({ request }) => {
  const robots = await request.get("/robots.txt")
  expect(robots.status()).toBe(200)
  const body = await robots.text()
  for (const agent of AI_SEARCH_AGENTS) {
    const group = body.split(/\n\s*\n/).find((block) => new RegExp(`^User-Agent: ${agent}$`, "mi").test(block))
    expect(group, agent).toBeTruthy()
    expect(group).toMatch(/^Allow: \/$/m)
    expect(group).not.toMatch(/^Disallow: \/$/m)
  }
  expect(body).toMatch(/^Sitemap: \S+\/sitemap\.xml$/m)
  const sitemap = await request.get("/sitemap.xml")
  expect(sitemap.status()).toBe(200)
  expect(await sitemap.text()).toContain("<urlset")
})

test("the share image answers as an image and llms.txt answers with his summary @PF-1-ASM-44", async ({ request }) => {
  const html = await rawHtml(request)
  const og = /<meta property="og:image" content="([^"]+)"/.exec(html)?.[1]
  expect(og).toBeTruthy()
  const image = await request.get(new URL(og!).pathname + new URL(og!).search)
  expect(image.status()).toBe(200)
  expect(image.headers()["content-type"]).toMatch(/^image\//)
  const llms = await request.get("/llms.txt")
  expect(llms.status()).toBe(200)
  expect(await llms.text()).toContain("Nahuel Mosse")
})
