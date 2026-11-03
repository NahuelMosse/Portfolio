import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import {
  BEAT_RUN,
  BEATS_PER_PROJECT,
  TURN_RUN,
} from "../features/portfolio/presentation/use-group-track";

// @PF-1-ASM-28: on wide and short desktop screens no text overlaps other text and nothing leaves the viewport.
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
const TOOLS = ["motion-audit", "http-attack", "migrations-safe"] as const;
const HOLD = (BEATS_PER_PROJECT - 1) * BEAT_RUN;
const STRIDE = HOLD + TURN_RUN;
const TOTAL = 3 * HOLD + 2 * TURN_RUN;

async function showTool(page: Page, order: number, beat = 1) {
  const progress = (order * STRIDE + beat * BEAT_RUN) / TOTAL;
  await page.evaluate((progress) => {
    const section = document.getElementById("tools")!;
    window.scrollTo(
      0,
      section.getBoundingClientRect().top +
        window.scrollY +
        (section.offsetHeight - window.innerHeight) * progress,
    );
  }, progress);
  await page.waitForTimeout(250);
}

async function open(page: Page, size: { width: number; height: number }) {
  await page.setViewportSize(size);
  await page.goto("/");
  await page.waitForLoadState("load");
}

for (const size of SIZES) {
  const at = `${size.width}x${size.height}`;

  test(`at ${at} the tools titles fit the viewport under the strip @PF-1-ASM-28`, async ({
    page,
  }) => {
    await open(page, size);
    for (const [order, tool] of TOOLS.entries()) {
      for (let beat = 0; beat < BEATS_PER_PROJECT; beat++) {
        await showTool(page, order, beat);
        const seen = await page.evaluate((tool) => {
          const card = document.getElementById(tool)!;
          const range = document.createRange();
          range.selectNodeContents(card.querySelector(".show-word")!);
          const text = range.getBoundingClientRect();
          const strip =
            card.querySelector(".show-index")?.getBoundingClientRect().bottom ??
            0;
          return {
            left: text.left,
            right: text.right,
            top: card.querySelector(".show-word")!.getBoundingClientRect().top,
            strip,
          };
        }, tool);
        expect(seen.left, `${tool} starts inside`).toBeGreaterThanOrEqual(0);
        expect(seen.right, `${tool} ends inside`).toBeLessThanOrEqual(
          size.width,
        );
        expect(seen.top, `${tool} is below the strip`).toBeGreaterThanOrEqual(
          seen.strip - 1,
        );
      }
    }
  });

  test(`at ${at} the Projects word clears the Apps group header @PF-1-ASM-28`, async ({
    page,
  }) => {
    await open(page, size);
    const hit = await page.evaluate(() => {
      const word = document.querySelector("#projects h2.chapter-word")!;
      const range = document.createRange();
      range.selectNodeContents(word);
      const w = word.getBoundingClientRect();
      const box = range.getBoundingClientRect();
      const words = {
        top: w.top + (w.height - box.height) / 2,
        bottom: w.bottom - (w.height - box.height) / 2,
      };
      const parts = [
        ...document.querySelectorAll(
          "#apps .group-word, #apps .group-count, #apps .group-line",
        ),
      ];
      return parts.some((part) => {
        const r = part.getBoundingClientRect();
        return (
          r.width > 0 && r.top < words.bottom - 1 && r.bottom > words.top + 1
        );
      });
    });
    expect(hit, "the word's box intersects the header text").toBe(false);
  });

  test(`at ${at} the Offer detail line is not covered by the experience cards @PF-1-ASM-28`, async ({
    page,
  }) => {
    await open(page, size);
    const covered = await page.evaluate(async () => {
      const detail = document.querySelector(
        '[data-chapter-title="offer"] .chapter-detail',
      )!;
      detail.scrollIntoView({ block: "center" });
      await new Promise((done) => setTimeout(done, 250));
      const r = detail.getBoundingClientRect();
      const top = document.elementFromPoint(
        r.left + r.width / 2,
        r.top + r.height / 2,
      );
      return !(top && (top === detail || detail.contains(top)));
    });
    expect(covered, "something covers the detail line").toBe(false);
  });
}

test("the stylesheet declares the styled scrollbar @PF-1-ASM-28", () => {
  const css = readFileSync("app/globals.css", "utf8");
  expect(css).toContain("::-webkit-scrollbar");
  expect(css).toContain("::-webkit-scrollbar-thumb");
  expect(css).toContain("@supports not selector(::-webkit-scrollbar)");
  expect(css).toContain("scrollbar-color: var(--bone) var(--ink)");
});
