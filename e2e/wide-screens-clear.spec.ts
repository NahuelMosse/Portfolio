import { test, expect } from "@playwright/test";

// @PF-1-ASM-28: the Projects word and the Offer detail line clear the text and cards around them. Geometry, not elementFromPoint:
// the chapter titles are pointer-events: none, so a hit test never reports them.
const SIZES = [
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1536, height: 864 },
  { width: 1920, height: 900 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1080 },
  { width: 2560, height: 1440 },
  { width: 3440, height: 1440 },
] as const;

for (const size of SIZES) {
  const at = `${size.width}x${size.height}`;

  test(`at ${at} the Projects word ends where the Apps group header text begins @PF-1-ASM-28`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.goto("/");
    await page.waitForLoadState("load");
    const gap = await page.evaluate(() => {
      const word = document.querySelector("#projects h2.chapter-word")!.getBoundingClientRect();
      const header = [...document.querySelectorAll("#apps .group-word, #apps .group-count, #apps .group-line")]
        .map((part) => part.getBoundingClientRect())
        .filter((box) => box.width > 0);
      return Math.min(...header.map((box) => box.top)) - word.bottom;
    });
    expect(gap, "the word's box reaches into the header text").toBeGreaterThanOrEqual(-1);
  });

  test(`at ${at} the Offer detail line starts below the last experience card @PF-1-ASM-28`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.goto("/");
    await page.waitForLoadState("load");
    const gap = await page.evaluate(() => {
      const detail = document.querySelector('[data-chapter-title="offer"] .chapter-detail')!.getBoundingClientRect();
      const experience = document.getElementById("experience")!.getBoundingClientRect();
      return detail.top - experience.bottom;
    });
    expect(gap, "the detail line sits over the experience section").toBeGreaterThanOrEqual(-1);
  });
}
