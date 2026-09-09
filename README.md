# Nahuel Mosse — Portfolio

A bilingual portfolio built as an instrument panel: a WebGL field behind the
hero, telemetry sourced from real project numbers, a pinned horizontal rail for
case studies, and a palette that mutates as you scroll through the work.

Live: [nahuelmosse.vercel.app](https://nahuelmosse.vercel.app)

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript strict |
| Styling | Tailwind CSS v4 (CSS-first config in `app/globals.css`) |
| 3D | three.js + React Three Fiber — one fullscreen fragment shader |
| Motion | GSAP + ScrollTrigger (pinning), Lenis (smooth scroll), CSS for the rest |
| Testing | Playwright (`e2e/`) |
| Hosting | Vercel |

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm run typecheck
npm run test:e2e     # starts a dev server if none is running
```

## Structure

```
app/
  [locale]/          # `/` → en (rewritten from /en), `/es` → es
    layout.tsx       # <html lang>, fonts, metadata
    page.tsx         # prerendered per locale
    opengraph-image.tsx
  globals.css        # design tokens, palette definitions, reveal system
  llms.txt/          # plain-text profile for crawlers and LLMs
  portfolio.json/    # structured profile, same source as the page
components/
  runtime/           # boot sequence, ⌘K palette, cursor, smooth scroll, palette controller
  hero/              # WebGL field
  sections/          # the nine sections
  work/              # flow diagrams
lib/
  content/           # ALL user-facing copy: en.ts, es.ts, types.ts
  color.ts           # OKLCH → linear RGB, for feeding tokens to the shader
  metadata.ts        # canonical, hreflang, OG, JSON-LD
middleware.ts        # `/` rewrites to `/en`; `/en` redirects to `/`
```

## Editing content

Everything visible on the site lives in `lib/content/en.ts` and
`lib/content/es.ts`, both typed against `PortfolioContent` in
`lib/content/types.ts`. Adding a field to one locale without the other is a
build error, which is the point — half-translated pages don't ship.

`/portfolio.json` and `/llms.txt` derive from the same source, so the
machine-readable version can never drift from what a person sees.

## How a few things work

**Palette mutation.** `data-palette` on `<html>` swaps a set of CSS custom
properties registered with `@property`, so the accent interpolates rather than
snapping. Sections publish a `data-palette-zone`; a single controller in
`components/runtime/palette-zone.tsx` decides which zone owns the viewport
centre and is the only writer of the attribute. Grit inverts the whole surface
to cream and electric blue.

**The reveal system.** `[data-reveal]` elements get `data-shown` from an
IntersectionObserver, backed by a geometry sweep on scroll. The observed
element is never itself clipped or scaled to zero — that makes its intersection
area zero and it would never reveal. Variants animate a child instead.

**The shader.** Domain-warped fBm rendered as contour lines, displaced by the
pointer, dithered to kill banding on a near-black gradient. It reads its colours
from the same design tokens as the rest of the page, converted from OKLCH in
`lib/color.ts`. Desktop only, paused off-screen, absent under
`prefers-reduced-motion`.

## A note on client work

The case studies name the companies and describe the systems, but this site
publishes **no screenshots of client software**. Every process diagram was drawn
for this site and depicts a generic domain flow. The Playwright suite asserts
that the old client screenshots stay unreachable.
