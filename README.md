# Portfolio

Personal portfolio told as a neo-noir case file: a single scrolling page of illustrated chapters, the work grouped by kind, and a contact sheet at the end.

**Live:** [nawi.dev](https://nawi.dev)

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · GSAP + Lenis · Motion

## Structure

```
app/                       routes, metadata, sitemap/robots/manifest, json + llms endpoints
features/portfolio/        the page: chapters, contact, credits; copy lives in presentation/content.ts
features/film/             scroll-driven film layer and its motion
lib/                       metadata, machine-readable output, share cards
e2e/                       Playwright specs
```

The same content feeds the page, `/portfolio.json`, `/llms.txt` and the JSON-LD.

## Running it

Node 24 and npm 11.

```bash
npm ci
npm run dev
```

```bash
npm run build
npm run lint
npx playwright test
```
