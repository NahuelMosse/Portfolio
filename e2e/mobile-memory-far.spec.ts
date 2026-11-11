import { test, expect } from "@playwright/test";

// @PF-3-S1 @PF-3-ASM-01: on a phone a section farther than a screen from the view skips rendering (content-visibility: auto)
// and the page keeps its height while walking it.
test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
});

test("walking a 390x844 phone, every tall section farther than a screen from the view is skipped and the page height holds @PF-3-S1 @PF-3-ASM-01", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.goto("/");
  await page.waitForLoadState("load");
  await page.waitForTimeout(1500);
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  const wrong = new Set<string>();
  let checked = 0;
  for (let y = 0; y < height; y += 640) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(80);
    const report = await page.evaluate(() => {
      const out: string[] = [];
      let count = 0;
      for (const el of document.querySelectorAll<HTMLElement>(
        "section.group",
      )) {
        const box = el.getBoundingClientRect();
        const far = box.bottom < -innerHeight || box.top > innerHeight * 2;
        if (!far) continue;
        count++;
        if (
          el.checkVisibility({
            contentVisibilityAuto: true,
          } as CheckVisibilityOptions) !== false
        )
          out.push(`${el.id || el.className} rendered while far`);
      }
      return { out, count, height: document.documentElement.scrollHeight };
    });
    checked += report.count;
    report.out.forEach((line) => wrong.add(line));
    if (report.height !== height)
      wrong.add(`page height ${height} became ${report.height}`);
  }
  expect(checked).toBeGreaterThan(0);
  expect([...wrong]).toEqual([]);
});
