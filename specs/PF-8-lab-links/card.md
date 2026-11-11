# PF-8 · the portfolio links the lab, not GitHub Pages

status: proposed
cap: 60 min
sources: the requester's chat message, 2026-11-11 (no Jira card); the three lab URLs answer 200 (curl, 2026-11-11)
not_read: none

## Specs

- S1 · "ademas siguen linkeando las paginas de github pages"
- S2 · "parece como que no se actualizo"
- PF-8-ASM-01 · "the pages" are the "Visit the site" links of Cebador, Sonría and Miga; each now points to its lab page https://lab.nawi.dev/cebador/, https://lab.nawi.dev/sonria/ and https://lab.nawi.dev/miga/ (the requester's context: the lab serves them now); the repository links stay · S1
- PF-8-ASM-02 · the machine-readable payload (/portfolio.json, with its JSON-LD graph) is built from the same content, so it carries the lab URLs and no github.io one; the capture script and ASSETS.md keep naming github.io as where the captures were taken from · S2

## Tasks

- T1 · S1,S2,ASM-01,ASM-02 · features/portfolio/presentation/content.ts (presentation), e2e/lab-links.spec.ts · tests: e2e/lab-links.spec.ts "each project scene links to its live page or its repository, except Grit, which is private, and Cebador, Sonría and Miga open the lab @PF-1-S5 @PF-8-S1"; e2e/lab-links.spec.ts "each project holds at least three real pieces and the pieces outnumber the text fields, with Cebador's lab page linked @PF-1-S26 @PF-1-ASM-22 @PF-1-S16 @PF-8-S1"; e2e/lab-links.spec.ts "each personal project shows at least three real pieces: Cebador a looping capture and a link to lab.nawi.dev/cebador, ClubNahuelMosse its four README screens, Guardia captures of nahuelmosse.itch.io/triaje, Grit screens of its app and design lab, the dev kit a real card, its tests and its pull request; the freelance offer in the end credits recalls a strip of them @PF-1-ASM-22 @PF-8-S1"; e2e/lab-links.spec.ts "Sonría and Miga open their lab page and their repository, and the other projects keep their links @PF-1-ASM-26 @PF-8-ASM-01"; e2e/lab-links.spec.ts "the lab pages and the repositories are linked from their project @PF-1-ASM-26 @PF-8-ASM-01"; e2e/lab-links.spec.ts "no link of the page points to github.io @PF-8-S2"; e2e/lab-links.spec.ts "the machine-readable payload carries the three lab URLs and no github.io one @PF-8-ASM-02"
  reuses: features/portfolio/presentation/content.ts projects (the three `links` entries change href only)

## Changes to existing behavior

- the "Visit the site" link of Cebador, Sonría and Miga changes host from nahuelmosse.github.io to lab.nawi.dev
- replaces e2e/case-file-layout-contracts.spec.ts "each project holds at least three real pieces… @PF-1-S26 @PF-1-ASM-22 @PF-1-S16", e2e/pieces.spec.ts "each project scene links to its live page… @PF-1-S5" and "each personal project shows at least three real pieces… @PF-1-ASM-22", e2e/project-groups.spec.ts "Sonría and Miga open their live site… @PF-1-ASM-26", e2e/project-scroll-groups.spec.ts "the pages of the live site and the repositories… @PF-1-ASM-26" (see the Log)

## Look

- plain: only the host of three existing links changes; no screen changes

## Gate

```
refactor-tests: the five frozen tests that assert the old nahuelmosse.github.io hrefs are removed from their files; their tags carry on in e2e/lab-links.spec.ts
suite: npx playwright test e2e/lab-links.spec.ts e2e/case-file-layout-contracts.spec.ts e2e/pieces.spec.ts e2e/project-groups.spec.ts e2e/project-scroll-groups.spec.ts
lint: npx eslint .
types: npx tsc --noEmit
app: npx next start
```

## Log

- L1 · "ademas siguen linkeando las paginas de github pages, parece como que no se actualizo"
