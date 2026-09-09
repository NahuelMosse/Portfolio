import { chromium } from '@playwright/test';

const BASE = process.env.VITALS_BASE || 'http://localhost:8702';
const ROUTES = ['/', '/es'];
const VIEWPORT = { width: 390, height: 844 };
const REPS = Number(process.env.VITALS_REPS || 5);

const NET_4G = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
};

async function measure(browser, route, { blockFonts = false } = {}) {
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();

  if (blockFonts) {
    await page.route('**://fonts.gstatic.com/**', (route) => route.abort());
  }

  await page.addInitScript(() => {
    window.__shifts = [];
    window.__cls = 0;
    window.__lcp = 0;
    try {
      const describe = (node) => {
        if (!node) return null;
        try {
          if (node.nodeType !== 1) return { text: trunc(node.textContent) };
          const tag = node.tagName ? node.tagName.toLowerCase() : '';
          const id = node.id ? `#${node.id}` : '';
          const classes = node.classList
            ? Array.from(node.classList).slice(0, 3).map((c) => `.${c}`).join('')
            : '';
          return `${tag}${id}${classes}`;
        } catch (e) {
          return null;
        }
      };
      function trunc(s) {
        if (!s) return '';
        const clean = s.replace(/\s+/g, ' ').trim();
        return clean.length > 40 ? clean.slice(0, 40) + '…' : clean;
      }
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.hadRecentInput) continue;
          window.__cls += entry.value;
          const sources = (entry.sources || []).map((s) => {
            const node = s.node || null;
            return {
              selector: describe(node),
              textContent: node && node.nodeType === 1 ? trunc(node.textContent) : null,
              previousRect: s.previousRect
                ? { x: s.previousRect.x, y: s.previousRect.y, width: s.previousRect.width, height: s.previousRect.height }
                : null,
              currentRect: s.currentRect
                ? { x: s.currentRect.x, y: s.currentRect.y, width: s.currentRect.width, height: s.currentRect.height }
                : null,
            };
          });
          window.__shifts.push({
            value: entry.value,
            startTime: entry.startTime,
            sources,
          });
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) window.__lcp = last.startTime;
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      window.__shiftsError = String(e);
    }
  });

  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', NET_4G);

  const url = `${BASE}${route}`;
  await page.goto(url, { waitUntil: 'load', timeout: 90000 });

  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(500);
  await page.mouse.wheel(0, -800);

  await page.waitForTimeout(4000);

  const data = await page.evaluate(() => ({
    cls: window.__cls,
    lcp: window.__lcp,
    shifts: window.__shifts,
    error: window.__shiftsError,
  }));

  await context.close();
  return data;
}

function printTop(route, rep, data) {
  console.log(`\n=== ${route} — rep ${rep} — CLS: ${data.cls.toFixed(4)} — LCP: ${data.lcp.toFixed(0)}ms ===`);
  if (data.error) console.log('  PerformanceObserver error:', data.error);
  if (data.cls > 0.1) {
    const top = [...data.shifts].sort((a, b) => b.value - a.value).slice(0, 3);
    top.forEach((shift, i) => {
      console.log(`  #${i + 1} value=${shift.value.toFixed(4)} startTime=${shift.startTime.toFixed(0)}ms`);
      shift.sources.forEach((s, j) => {
        console.log(`      source[${j}]: ${s.selector || '(node ausente)'} text="${s.textContent || ''}"`);
        console.log(`         previousRect: ${JSON.stringify(s.previousRect)}`);
        console.log(`         currentRect:  ${JSON.stringify(s.currentRect)}`);
      });
    });
  }
}

async function main() {
  const browser = await chromium.launch();
  const summary = {};

  for (const route of ROUTES) {
    summary[route] = { cls: [], lcp: [] };
    for (let rep = 1; rep <= REPS; rep++) {
      const data = await measure(browser, route, { blockFonts: false });
      printTop(route, rep, data);
      summary[route].cls.push(data.cls);
      summary[route].lcp.push(data.lcp);
    }
  }

  await browser.close();

  console.log('\n=== RESUMEN ===');
  for (const route of ROUTES) {
    const clsVals = summary[route].cls.map((v) => v.toFixed(4)).join(', ');
    const lcpVals = summary[route].lcp.map((v) => (v / 1000).toFixed(2) + 's').join(', ');
    console.log(`${route}: CLS = [${clsVals}] | LCP = [${lcpVals}]`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
