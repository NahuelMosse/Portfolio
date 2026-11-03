import { test, expect } from "@playwright/test";
import {
  BEAT_RUN,
  BEATS_PER_PROJECT,
  TURN_RUN,
} from "../features/portfolio/presentation/use-group-track";

// @PF-1-ASM-26: at 390 a terminal window is as tall as the output on show, so it spans the content width and takes at least a
// quarter of the viewport, never the half of the viewport that left a dead black half.
const HOLD = (BEATS_PER_PROJECT - 1) * BEAT_RUN;
const STRIDE = HOLD + TURN_RUN;
const TOTAL = 3 * HOLD + 2 * TURN_RUN;

test("at 390 the product device is large enough to read @PF-1-ASM-26", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.waitForLoadState("load");
  for (const [order, project] of [
    "motion-audit",
    "http-attack",
    "migrations-safe",
  ].entries()) {
    await page.evaluate(
      ({ progress }) => {
        const section = document.getElementById("tools")!;
        window.scrollTo(
          0,
          section.getBoundingClientRect().top +
            window.scrollY +
            (section.offsetHeight - innerHeight) * progress,
        );
      },
      { progress: (order * STRIDE + BEAT_RUN) / TOTAL },
    );
    await page.waitForTimeout(400);
    const box = await page
      .locator(`#${project} .show-rig[data-role="main"]`)
      .boundingBox();
    expect(
      box!.width,
      `${project} spans the content width`,
    ).toBeGreaterThanOrEqual(350);
    expect(
      box!.height,
      `${project} takes a quarter of the viewport`,
    ).toBeGreaterThanOrEqual(844 * 0.25);
  }
});
