# PF-8 · the PF-1 tests that fail on main are replaced or retired, and the published files carry no local user paths

status: proposed
cap: 600 min
sources: the requester's chat message, 2026-11-11 (no Jira card), with the two items it refers to as the orchestrating session listed them, frozen in .validation/request.md
not_read: none

## Specs

- S1 · "Replace them or retire them, so a gate that includes them can be green."
- S2 · "Remove those local paths from the published files."
- PF-8-ASM-01 · a frozen test whose behavior the site no longer has is retired, not deleted (the guard keeps committed tagged tests): it stays in its file untouched, its title goes in specs/PF-8-broken-tests-and-local-paths/retired.txt under a `#` line with its reason, the Log gets a `retires:` line, and the gate's suite runs every e2e test with `--test-list-invert` over that list · S1
- PF-8-ASM-02 · a frozen test whose behavior still holds but whose test fails is replaced the kit's way, in a new file with the same tags and a `replaces:` line; the old test, and the old tests earlier cards already replaced (PF-1, PF-2, PF-5), go in the same list under a `#` line naming their replacement, so the gate runs the replacement and not the test it supersedes · S1
- PF-8-ASM-03 · a session record is written relative to the home folder (`~/.claude/projects/...`): the existing sessions.md lines are rewritten that way and the kit's writer (required.mjs sessionLine) writes them that way, so this card's own close publishes no local user path either · S2

## Tasks

- T1 · S2,ASM-03,ASM-01,ASM-02 · specs/PF-1-cinematic-portfolio/sessions.md, specs/PF-2-best-screens/sessions.md, specs/PF-3-mobile-viewport/sessions.md, specs/PF-4-mobile-bar-polish/sessions.md, specs/PF-5-smooth-project-transitions/sessions.md, specs/PF-6-cebador-video-fps/sessions.md, specs/PF-7-triaje-phone-first-screen/sessions.md, .claude/tools/required.mjs, specs/PF-8-broken-tests-and-local-paths/retired.txt, e2e/published-paths.spec.ts, e2e/retired-tests.spec.ts · tests: e2e/published-paths.spec.ts "no published file carries a local Windows user path @PF-8-S2"; e2e/published-paths.spec.ts "a session record is written relative to the home folder @PF-8-ASM-03"; e2e/retired-tests.spec.ts "every test kept out of the gate names its reason and its Log line @PF-8-S1 @PF-8-ASM-01 @PF-8-ASM-02"
  reuses: .claude/tools/required.mjs sessionLine writeSessionLines (the writer of sessions.md)
- T2 · S1,ASM-01,ASM-02 · e2e/pf1-projects-today.spec.ts · old: project-groups, project-presentation, project-presentation-terminal-height, project-title-fit, project-showcase, project-scroll-groups, project-poster, project-poster-art, project-glance-ai-line, project-backdrop, pieces, tools-plain, cebador-playback · tests: e2e/pf1-projects-today.spec.ts "<old title> @<its old tags> @PF-8-S1"
- T3 · S1,ASM-01,ASM-02 · e2e/pf1-screens-today.spec.ts · old: one-screen-sections, one-screen, wide-screens, wide-screens-offer-detail, phone-390, phone-layout, phone-glance, mobile-bar-edges, mobile-memory-skip, mobile-memory-far, image-no-gaps, hero-framing, hero-flow · tests: e2e/pf1-screens-today.spec.ts "<old title> @<its old tags> @PF-8-S1"
- T4 · S1,ASM-01,ASM-02 · e2e/pf1-case-file-today.spec.ts · old: case-file-layout-contracts, case-file, case-file-layout, case-file-layout-disk, case-file-layout-delivered, case-file-assets, asm35-experience, asm35-experience-rest, asm35-cold-open-end, asm35-experience-handoff, asm35-engine, cold-open-short, experience-scene, experience-photos, designer-line, designer-line-rest, chapter-note-line, illustrated-chapters · tests: e2e/pf1-case-file-today.spec.ts "<old title> @<its old tags> @PF-8-S1"
- T5 · S1,ASM-01,ASM-02 · e2e/pf1-media-contact-today.spec.ts · old: scene-media, film, credits, credits-liceo-8, content, contact-drawing, contact-footer, lets-talk-doors, offer, sound-visibility, certifications-curated · tests: e2e/pf1-media-contact-today.spec.ts "<old title> @<its old tags> @PF-8-S1"

How a builder handles each failing test of its group (the list with the first error is .validation/open.txt and .validation/rerun.log; each failed twice against a production build of main, the second time with 2 workers):
- read the test and what the page has today; if the behavior it asserts is still on the site (a moved selector, a renamed asset, a later PF-1 decision that changed a number the Log records), write the replacement in the group's file with the same tags plus `@PF-8-S1`, asserting the same behavior no looser; `node .claude/tools/log.mjs specs/PF-8-broken-tests-and-local-paths "replaces: e2e/<old file> \"<old title>\" · <why it is wrong today, with the evidence> · by: e2e/<new file> \"<new title>\""`, and the old title in retired.txt under `# replaced by e2e/<new file>`;
- if the site no longer has that behavior (a design PF-1 left behind), retire it: `log.mjs ... "retires: e2e/<old file> \"<old title>\" · <what the site shows instead, with the evidence: the later test or Log line that superseded it>"` and its title in retired.txt under `# retired: <reason>`;
- never edit, skip or delete an old test; never loosen what a replacement asserts; a test that passes on its own and fails only under load is not replaced: it is a Log line `flaky: <test> · <evidence>`.

## Changes to existing behavior

- the e2e gate of every later card: the tests listed in retired.txt no longer run; their replacements do · every test it lists
- sessions.md lines name the transcript as `~/.claude/projects/...` instead of an absolute path · specs/*/sessions.md, .claude/tools/required.mjs
- the site does not change

## Gate

```
lint: npx eslint .
types: npx tsc --noEmit
app: npx next build --webpack && npx next start
suite [timeout 120 min]: npx playwright test --workers=3 --test-list-invert specs/PF-8-broken-tests-and-local-paths/retired.txt
```

## Log

- L1 · Requirement as given by the user (2026-11-11), verbatim: "arregla las dos primeras" — The two items it refers to, as I (the orchestrating session) listed them to the user: 1. 22 old PF-1 tests fail on main and no card replaces them (reported by PF-5's runner: in project-groups, project-scroll-groups, project-showcase, project-wipe-transitions, scene-media and slow-line; PF-2/PF-4/PF-6 also reported failing PF-1 suites: scene-media @PF-1-S24 and @PF-1-ASM-20, phone-390, phone-layout, phone-glance, lets-talk-doors, wide-screens-offer-detail, best-screens.spec.ts). Replace them or retire them, so a gate that includes them can be green. 2. Several sessions.md, card.md and closing.md files published on main (public repo) contain local paths C:\Users\<windows user>\... Remove those local paths from the published files.
