import { test, expect } from "@playwright/test"

// @PF-1-ASM-39 every roll item that names Platzi or EF SET carries its brand mark before the text, 1em tall, hidden from assistive tech.
test("the Platzi and EF SET roll items carry their brand mark at the text height @PF-1-ASM-39", async ({ page }) => {
  await page.setViewportSize({ width: 1910, height: 912 })
  await page.goto("/")
  await page.locator(".contact-scene").scrollIntoViewIfNeeded()
  const m = await page.evaluate(() => {
    const items = [...document.querySelectorAll<HTMLElement>('.credits-roll [aria-hidden="true"] .roll-item')].filter((i) => /Platzi|EF SET/.test(i.textContent ?? ""))
    return items.map((item) => {
      const mark = item.querySelector<HTMLElement>("img, svg, [data-roll-mark]")
      const box = mark?.getBoundingClientRect()
      return {
        text: item.textContent,
        hasMark: !!mark,
        hidden: mark?.closest('[aria-hidden="true"]') !== null,
        ratio: box ? box.height / parseFloat(getComputedStyle(item).fontSize) : 0,
        width: box?.width ?? 0,
      }
    })
  })
  expect(m.some((x) => /Platzi/.test(x.text ?? ""))).toBe(true)
  expect(m.some((x) => /EF SET/.test(x.text ?? ""))).toBe(true)
  for (const x of m) {
    expect(x.hasMark, x.text ?? "").toBe(true)
    expect(x.hidden).toBe(true)
    expect(x.ratio, x.text ?? "").toBeGreaterThan(0.9)
    expect(x.ratio, x.text ?? "").toBeLessThan(1.1)
    expect(x.width).toBeGreaterThan(8)
  }
})
