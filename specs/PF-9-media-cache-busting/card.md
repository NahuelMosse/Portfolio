# PF-9 · every media URL changes when its content changes, so a returning visitor sees the current Cebador capture

status: proposed
cap: 240 min
sources: the requester's chat messages (2026-11-12, no Jira card) with the context the orchestrating session gathered, frozen in .validation/request.md
not_read: none

## Specs

- S1 · "A returning visitor always gets the current version of every media file the site serves (videos, posters, images under `public/film/`), without waiting for the browser cache to expire"
- S2 · "and media files stay cached long when unchanged."
- S3 · "It must cover every media reference the site emits (content.ts pieces, scene plates, the `r/<width>/` responsive variants, posters), not only Cebador."
- S4 · "The approach is the builder's call."
- S5 · "el video de cebador se sigue viendo la carga en prod"
- PF-9-ASM-01 · a media URL carries `?v=` and the first 8 hex digits of a sha1 over the bytes of every file under public/film that shares its name (the file, its other format and its `r/<width>/` copies), computed by scripts/media-versions.mjs before every `next build` and `next dev`; a change to any of those files changes the URL of all of them, every other media URL stays the same · S1,S4
- PF-9-ASM-02 · a /film response whose query carries `v` is `public, max-age=31536000, immutable`; one without it is `public, max-age=0, must-revalidate`, so a URL that escaped the version is revalidated instead of served stale for 30 days · S2

## Tasks

- T1 · S1,S2,S4,ASM-01 · scripts/media-versions.mjs (data), features/film/presentation/media-versions.json (data), package.json (data) · tests: e2e/media-cache-busting.spec.ts "a media file whose bytes change gets a new version and the files beside it keep theirs @PF-9-S1 @PF-9-S2 @PF-9-S4 @PF-9-ASM-01"
  new: scripts/derive-plates.mjs hashes only a plate's source, by hand and not at build, and covers no piece, capture or poster; nothing else versions a media file (Grep createHash|\?v= in scripts, features, app)
- T2 · S1,S3,S5 · features/film/presentation/media-url.ts (presentation), features/film/presentation/plate.ts (presentation), features/film/presentation/plate-sources.tsx (presentation), features/film/presentation/scene-asset.ts (presentation), features/film/index.ts (presentation), features/film/motion.ts (presentation), features/portfolio/presentation/showcase-device.tsx (presentation), features/portfolio/presentation/piece-image.ts (presentation), features/portfolio/presentation/chapter-illustration.tsx (presentation), app/layout.tsx (presentation) · tests: e2e/media-cache-busting.spec.ts "every /film URL the page emits carries its files' current version, the Cebador captures and posters among them @PF-9-S3 @PF-9-S5"; e2e/media-cache-busting.spec.ts "walking the page at 1440x900 and 390x844 every /film request carries its files' current version @PF-9-S1"
  reuses: features/film/motion.ts and features/film/index.ts, the slice's client and server entries, export mediaUrl beside DEFERRED_BLANK; features/film/presentation/plate.ts plateSrcSet (its `?v=` query becomes the per-file version); features/portfolio/presentation/piece-image.ts pieceSrcSet, pieceThumb
- T3 · S2,ASM-02 · next.config.mjs (presentation) · tests: e2e/media-cache-busting.spec.ts "a versioned /film response is cached 31536000 s as immutable and an unversioned one revalidates instead of being kept 30 days @PF-9-S2 @PF-9-ASM-02"
  reuses: next.config.mjs headers() and its /film rule

## Changes to existing behavior

- every URL under /film the page emits · gains `?v=<version>`; the plates already carried one, now per file set instead of per source · no frozen test asserts a /film URL without a query (Grep of e2e for webp$, webm$, endsWith)
- /film/* Cache-Control · `public, max-age=2592000, stale-while-revalidate=86400` becomes ASM-02's two values · no frozen test reads it
- package.json · `prebuild` and `predev` run scripts/media-versions.mjs

## Look

- plain: no screen changes; only the URLs and cache headers of the media it already shows

## Gate

```
lint: npx eslint .
types: npx tsc --noEmit
app: node scripts/media-versions.mjs && npx next build --webpack && npx next start
suite [timeout 120 min]: npx playwright test --workers=3 --test-list-invert specs/PF-8-broken-tests-and-local-paths/retired.txt
```

## Log

- L1 · Requirement as frozen in .validation/request.md (2026-11-12), verbatim: # Request (verbatim from the requester, in Spanish) / > "el video de cebador se sigue viendo la carga en prod, no estaba mergeado eso?" / > (after testing) "en incognito se ve bien" / ## Context gathered before the card / - Production (nawi.dev) serves `public/film/pieces/cebador-1280.webm` and `cebador-390.webm` byte-identical to main; their first frames already open on the loaded page. / - Vercel serves them with `Cache-Control: public, max-age=2592000, stale-while-revalidate=86400` under the same file name they had before PF-6 re-recorded them. A browser that visited before keeps showing the old capture (with the site's intro loader) for up to 30 days. In a private window the new one shows. / ## What is asked / A returning visitor always gets the current version of every media file the site serves (videos, posters, images under `public/film/`), without waiting for the browser cache to expire, and media files stay cached long when unchanged. / The approach is the builder's call. Candidates: / - a content hash in the URL, as a query string or in the file name, computed at build; / - `immutable` caching only for hashed URLs. / It must cover every media reference the site emits (content.ts pieces, scene plates, the `r/<width>/` responsive variants, posters), not only Cebador.
- L2 · 2026-11-12 · T1,T2,T3 · verify.mjs: types, lint, layers, boundaries passed; suite 62 passed, failed only smoke 'logs no console error' (css MIME 'Refused to execute script' at 1910 and webkit, no /film involvement); 5 PF-9 tests passed
