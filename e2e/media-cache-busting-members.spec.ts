import { test, expect, type APIRequestContext } from "@playwright/test"
import { join } from "node:path"
import { mediaVersions } from "../scripts/media-versions.mjs"

const FILM = join(process.cwd(), "public", "film")
const VERSIONED = /^\/film\/.+\?v=([0-9a-f]{8})$/

const keyOf = (url: string) =>
  new URL(url, "http://x").pathname
    .replace(/^\/film\//, "")
    .replace(/^r\/\d+\//, "")
    .replace(/\.[^./]+$/, "")

// The /film URLs the page asks the browser to fetch: the attributes that load media and the stylesheet's url(). The props
// in the page's flight data are content, not requests: the components version them where they emit them.
async function requestedMedia(request: APIRequestContext): Promise<string[]> {
  const html = await (await request.get("/")).text()
  const attributes = [...html.matchAll(/\s(?:src|srcset|srcSet|data-src|data-srcset|poster|href|imagesrcset)="([^"]*)"/g)]
    .flatMap((m) => m[1].replace(/&amp;/g, "&").split(","))
    .map((candidate) => candidate.trim().split(/\s+/)[0])
  const styles = [...html.matchAll(/url\(["']?(\/film\/[^"')]+)/g)].map((m) => m[1])
  return [...new Set([...attributes, ...styles].filter((url) => url.startsWith("/film/")))]
}

test("every /film URL the page emits carries its files' current version, the Cebador captures and posters among them @PF-9-S3 @PF-9-S5", async ({ request }) => {
  const urls = await requestedMedia(request)
  expect(urls.length).toBeGreaterThan(20)
  const fresh = mediaVersions(FILM)
  for (const url of urls) {
    const match = VERSIONED.exec(url)
    expect(match, url).not.toBeNull()
    expect(match![1], url).toBe(fresh[keyOf(url)])
  }
  for (const name of ["cebador-1280.webm", "cebador-1280-poster.webp", "cebador-390.webm", "cebador-390-poster.webp"]) {
    expect(urls.some((url) => url.startsWith(`/film/pieces/${name}?v=`)), name).toBe(true)
  }
})

// S3 names four kinds of media reference: each one is emitted versioned, and each versioned URL still answers.
test("the page emits versioned content.ts pieces, scene plates, r/<width>/ copies and posters, and every versioned /film URL answers 200 @PF-9-S3", async ({ request }) => {
  const urls = await requestedMedia(request)
  const members: Record<string, RegExp> = {
    "content.ts piece": /^\/film\/(r\/\d+\/)?pieces\/[a-z0-9-]+\.(webp|webm)\?v=/,
    "scene plate": /^\/film\/(r\/\d+\/)?(ill|bg|pf|him)-[a-z0-9-]+\.(webp|avif)\?v=/,
    "r/<width>/ copy": /^\/film\/r\/\d+\/.+\?v=/,
    poster: /^\/film\/pieces\/[a-z0-9-]+-poster\.webp\?v=/,
  }
  for (const [member, pattern] of Object.entries(members)) {
    expect(urls.some((url) => pattern.test(url)), `a versioned ${member}`).toBe(true)
  }
  const failing: string[] = []
  for (const url of urls) {
    if (!VERSIONED.test(url)) failing.push(`${url} has no version`)
    else {
      const response = await request.head(url)
      if (response.status() !== 200) failing.push(`${url} ${response.status()}`)
    }
  }
  expect(failing).toEqual([])
})
