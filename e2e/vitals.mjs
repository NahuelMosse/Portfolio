import { chromium } from '@playwright/test';

const BASE = process.env.VITALS_BASE || 'http://localhost:8702';
const ROUTES = ['/', '/es'];
const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

const NET_4G = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
};

async function measure(browser, viewportName, route, throttle) {
  const context = await browser.newContext({
    viewport: VIEWPORTS[viewportName],
  });
  const page = await context.newPage();

  await page.addInitScript(() => {
    window.__vitals = { lcp: 0, cls: 0, fcp: 0 };
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) window.__vitals.lcp = last.startTime;
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__vitals.cls += entry.value;
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            window.__vitals.fcp = entry.startTime;
          }
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
    } catch (e) {
      window.__vitals.error = String(e);
    }
  });

  let cdp = null;
  if (throttle) {
    cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', NET_4G);
  }

  const url = `${BASE}${route}`;
  await page.goto(url, { waitUntil: 'load', timeout: 90000 });

  // trigger lazy-loaded content
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(500);
  await page.mouse.wheel(0, -800);

  // wait for boot overlay (~1.2s) + settle for LCP/CLS of initial load
  await page.waitForTimeout(4000);

  const vitals = await page.evaluate(() => window.__vitals);

  const resourceStats = await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource');
    const nav = performance.getEntriesByType('navigation')[0];
    let totalTransfer = nav ? (nav.transferSize || 0) : 0;
    let jsTransfer = 0;
    for (const r of resources) {
      totalTransfer += r.transferSize || 0;
      if (r.initiatorType === 'script') {
        jsTransfer += r.transferSize || 0;
      }
    }
    return {
      requestCount: resources.length + (nav ? 1 : 0),
      totalTransfer,
      jsTransfer,
    };
  });

  await context.close();

  return {
    viewport: viewportName,
    route,
    throttle: !!throttle,
    lcp: vitals.lcp,
    cls: vitals.cls,
    fcp: vitals.fcp,
    requestCount: resourceStats.requestCount,
    totalKB: resourceStats.totalTransfer / 1024,
    jsKB: resourceStats.jsTransfer / 1024,
  };
}

async function main() {
  const browser = await chromium.launch();
  const results = [];

  for (const throttle of [false, true]) {
    for (const viewport of Object.keys(VIEWPORTS)) {
      for (const route of ROUTES) {
        const r = await measure(browser, viewport, route, throttle);
        results.push(r);
        console.log(
          `${viewport} ${route} ${throttle ? '4G' : 'nolimit'} -> LCP=${r.lcp.toFixed(0)}ms CLS=${r.cls.toFixed(3)} FCP=${r.fcp.toFixed(0)}ms reqs=${r.requestCount} total=${r.totalKB.toFixed(0)}KB js=${r.jsKB.toFixed(0)}KB`
        );
      }
    }
  }

  await browser.close();

  console.log('\n| escenario | LCP | CLS | FCP | requests | total KB | JS KB |');
  console.log('|---|---|---|---|---|---|---|');
  for (const r of results) {
    const label = `${r.viewport} ${r.route}${r.throttle ? ' (4G)' : ''}`;
    console.log(
      `| ${label} | ${(r.lcp / 1000).toFixed(2)}s | ${r.cls.toFixed(3)} | ${(r.fcp / 1000).toFixed(2)}s | ${r.requestCount} | ${r.totalKB.toFixed(0)} | ${r.jsKB.toFixed(0)} |`
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
