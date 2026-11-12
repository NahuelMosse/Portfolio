import { test, expect } from "@playwright/test"
import { join } from "node:path"
import { mediaVersions } from "../scripts/media-versions.mjs"

const FILM = join(process.cwd(), "public", "film")
const OPENING = /^\/film\/.+\?v=([0-9a-f]{8})$/

const keyOf = (url: string) =>
  new URL(url, "http://x").pathname
    .replace(/^\/film\//, "")
    .replace(/^r\/\d+\//, "")
    .replace(/\.[^./]+$/, "")

// The page's flight data escapes quotes as \", so a backslash ends a URL like a quote does.
test("every /film URL the page emits carries its files' current version, the Cebador captures and posters among them @PF-9-S3 @PF-9-S5", async ({ request }) => {
  const html = await (await request.get("/")).text()
  const urls = [...html.matchAll(/(?<!#)\/film\/[^\s"'<>,)\\]+/g)].map((m) => m[0].replace(/&amp;/g, "&"))
  expect(urls.length).toBeGreaterThan(20)
  const fresh = mediaVersions(FILM)
  for (const url of urls) {
    const match = OPENING.exec(url)
    expect(match, url).not.toBeNull()
    expect(match![1], url).toBe(fresh[keyOf(url)])
  }
  for (const name of ["cebador-1280.webm", "cebador-1280-poster.webp", "cebador-390.webm", "cebador-390-poster.webp"]) {
    expect(
      urls.some((u) => u.startsWith(`/film/pieces/${name}?v=`)),
      name,
    ).toBe(true)
  }
})
