import { test, expect } from "@playwright/test";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { mediaVersions } from "../scripts/media-versions.mjs";

const FILM = join(process.cwd(), "public", "film");
const OPENING = /^\/film\/.+\?v=([0-9a-f]{8})$/;

const keyOf = (url: string) =>
  new URL(url, "http://x").pathname
    .replace(/^\/film\//, "")
    .replace(/^r\/\d+\//, "")
    .replace(/\.[^./]+$/, "");

test("a media file whose bytes change gets a new version and the files beside it keep theirs @PF-9-S1 @PF-9-S2 @PF-9-S4 @PF-9-ASM-01", () => {
  const root = mkdtempSync(join(tmpdir(), "film-"));
  mkdirSync(join(root, "r", "960", "pieces"), { recursive: true });
  mkdirSync(join(root, "pieces"), { recursive: true });
  writeFileSync(join(root, "pieces", "x.webp"), "one");
  writeFileSync(join(root, "r", "960", "pieces", "x.webp"), "one-small");
  writeFileSync(join(root, "ill-a.avif"), "a");
  const before = mediaVersions(root);
  expect(Object.keys(before).sort()).toEqual(["ill-a", "pieces/x"]);
  expect(before["pieces/x"]).toMatch(/^[0-9a-f]{8}$/);
  writeFileSync(
    join(root, "r", "960", "pieces", "x.webp"),
    "one-small-changed",
  );
  const after = mediaVersions(root);
  expect(after["pieces/x"]).not.toBe(before["pieces/x"]);
  expect(after["ill-a"]).toBe(before["ill-a"]);
});

test("every /film URL the page emits carries its files' current version, the Cebador captures and posters among them @PF-9-S3 @PF-9-S5", async ({
  request,
}) => {
  const html = await (await request.get("/")).text();
  const urls = [...html.matchAll(/(?<!#)\/film\/[^\s"'<>,)]+/g)].map((m) =>
    m[0].replace(/&amp;/g, "&"),
  );
  expect(urls.length).toBeGreaterThan(20);
  const fresh = mediaVersions(FILM);
  for (const url of urls) {
    const match = OPENING.exec(url);
    expect(match, url).not.toBeNull();
    expect(match![1], url).toBe(fresh[keyOf(url)]);
  }
  for (const name of [
    "cebador-1280.webm",
    "cebador-1280-poster.webp",
    "cebador-390.webm",
    "cebador-390-poster.webp",
  ]) {
    expect(
      urls.some((u) => u.startsWith(`/film/pieces/${name}?v=`)),
      name,
    ).toBe(true);
  }
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`walking the page at ${viewport.width}x${viewport.height} every /film request carries its files' current version @PF-9-S1`, async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.setViewportSize(viewport);
    const requested: string[] = [];
    page.on("request", (r) => {
      const url = new URL(r.url());
      if (url.pathname.startsWith("/film/"))
        requested.push(url.pathname + url.search);
    });
    await page.goto("/");
    await page.waitForLoadState("load");
    const height = await page.evaluate(
      () => document.documentElement.scrollHeight,
    );
    for (let y = 0; y < height; y += viewport.height / 2) {
      await page.mouse.wheel(0, viewport.height / 2);
      await page.waitForTimeout(120);
    }
    const fresh = mediaVersions(FILM);
    expect(requested.length).toBeGreaterThan(0);
    for (const url of requested) {
      const match = OPENING.exec(url);
      expect(match, url).not.toBeNull();
      expect(match![1], url).toBe(fresh[keyOf(url)]);
    }
  });
}

test("a versioned /film response is cached 31536000 s as immutable and an unversioned one revalidates instead of being kept 30 days @PF-9-S2 @PF-9-ASM-02", async ({
  request,
}) => {
  const versioned = await request.get(
    "/film/pieces/cebador-390-poster.webp?v=abcdef12",
  );
  expect(versioned.headers()["cache-control"]).toBe(
    "public, max-age=31536000, immutable",
  );
  const bare = await request.get("/film/pieces/cebador-390-poster.webp");
  expect(bare.headers()["cache-control"]).toBe(
    "public, max-age=0, must-revalidate",
  );
});
