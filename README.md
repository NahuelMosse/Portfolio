# Portfolio

Personal portfolio site — a single-page, scroll-snapped narrative that walks through how I got into software, what I've built professionally, and where I'm heading.

**Live:** [nahuelmosse.vercel.app](https://nahuelmosse.vercel.app)

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · Framer Motion

## Highlights

- **Scroll-snap narrative** — each section is a full viewport panel with visibility-driven animations (`hooks/use-section-visibility.ts`).
- **Content as data** — every piece of copy, project and certification lives in `lib/content.ts`. No text is hardcoded in components.
- **Machine-readable output** — the same content source feeds `/portfolio.json` and `/llms.txt`, plus JSON-LD structured data, so crawlers and LLMs can read the CV without scraping the DOM (`lib/machine-readable.ts`).
- **Glassmorphism UI** with a custom floating tech-symbol layer and a responsive photo gallery.
- SEO handled through `app/sitemap.ts`, `app/robots.ts` and `app/manifest.ts`.

## Structure

```
app/          routes, metadata, sitemap/robots/manifest, json + llms endpoints
components/
  sections/   one component per narrative section
  ui/         reusable primitives (button, card, gallery, decorators)
lib/          content source, metadata, animation config, helpers
hooks/        section visibility, gallery navigation
```

## Running it

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # eslint
```

## Editing content

Everything visible on the site comes from `lib/content.ts` — personal info, the origins story, education, professional and personal projects, certifications and contact. Change it there and it propagates to the page, the JSON endpoint and the structured data at once.
