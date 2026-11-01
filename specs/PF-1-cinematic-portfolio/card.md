# PF-1 · cinematic portfolio for freelance and Technical Project Manager work

status: proposed
cap: 600 min
sources: requirement as text in the session (5 messages, 2026-10-31 and 2026-11-01); cv/CV.tex as the source of experience; lib/content.ts as the current content
not_read: none; the "Equipo WMS Justo" photo is .media-source/justo-team-presentation.jpg (from the requester's Downloads, git-ignored)

## Specs

- S1 · "vi portafolios que se ven increibles que usan generacion de imagen y video"
- S2 · "simplemente decime que crear y con que herramienta gratuita y lo hago"
- S3 · "Quiero que sea un portafolio super vivo"
- S4 · "no me interesa que cuente tanto de mi vida, quiero algo mas corto"
- S5 · "Mas centrado en mi experiencia y proyectos"
- S6 · "enfocalo a freelance"
- S7 · "y a Tecnical Project Manager para empresas"
- S8 · "quiero un portafolio que deje anonadado visualmente al expectador, a nivel cinematografico" · state: loading, reduced-motion, error
- S9 · "es critico el diseño"
- S10 · "quiero que se sienta como una pelicula explorar mi portafolio"
- S11 · "Podes usarlo, pero no por API"
- S12 · "tenes las fotos del portafolio y te paso una mas"
- S13 · "mis proyectos y mi experiencia son super importantes"
- S14 · "no pondria tipo numeros duros e inchequeables"
- S15 · "iria a explicar los proyectos, nada mas"
- S16 · "si se puede poner referencias visuales. Ahi nos ayuda la IA de imagenes"
- S17 · "quiero una muy buena llamada a la accion"
- S18 · "y una UX excelente"
- S19 · "los primeros 5 segundos son los mas importantes"
- S20 · "quiero que se sienta como esas paginas que salen miles de dolares"
- PF-1-ASM-01 · one page in five chapters, in this order: cold open (name and promise over generated video), offer, experience, projects, end credits (contact); origins, education, certifications and present leave the page · S4,S5,S10
- PF-1-ASM-02 · the site stays in English, as today, because the offer is to companies and clients abroad · S6,S7
- PF-1-ASM-03 · every generated image and video is made by the requester with a free web tool from a prompt the session gives, saved in public/film/, self-hosted; video is muted, looping, with a poster frame; with reduced motion only the poster shows · S1,S2,S8
- PF-1-ASM-04 · the end credits offer email and LinkedIn as the actions, GitHub as secondary; no form, there is no backend · S6,S7
- PF-1-ASM-05 · experience comes from cv/CV.tex, not from the current site: Grupo ST, Smart Warehousing, Visma, Frávega, Jüsto, each explained in what it was, what problem it solved and his role, with no figures; the title is "Technical Lead · Technical Project Manager" · S5,S7,S14,S15
- PF-1-ASM-06 · projects: the professional ones are the scenes of experience; three personal projects remain (NASA Calendar, Compound Interest Calculator, Gym App) · S5
- PF-1-ASM-07 · /llms.txt, /portfolio.json and the page metadata say the same positioning as the page · S6,S7
- PF-1-ASM-08 · there is a soundtrack, off by default, with a visible toggle; no audio plays before the visitor presses it · S10
- PF-1-ASM-12 · the call to action has two doors, one per audience: "Start a project" (freelance) and "Bring me in as TPM" (companies); each opens an email with its subject and three prompts prefilled; it stays reachable in a corner from second 3 of the cold open (or its end, whichever comes first) to the credits, and the credits repeat it as the last shot · S17
- PF-1-ASM-13 · the film never holds the visitor: the cold open can be skipped from the first second, a chapter index jumps to any chapter by click or keyboard, scroll stays native (no hijacked wheel), and every chapter reads with sound off; after a jump focus lands on the chapter heading, after skipping on the offer heading, never on body; the skip control is visible and focusable from second 1 · S18
- PF-1-ASM-14 · in the first 5 s, at 390 and 1280 and on a throttled 4G connection, the visitor has seen the first image (poster painted under 1.5 s), his name, the one-line offer to both audiences and one door of the call to action; the cold open video weighs 3 MB or less and the shot cuts happen inside those 5 s, never before the offer · S19
- PF-1-ASM-15 · the bar is a studio-commissioned site (the refs of ## Look): a licensed display face paired with a text face, never a system or default font; every chapter has full-bleed media and an authored transition into the next; no stock template block (three equal cards, centered hero with a gradient blob) · S20
- PF-1-ASM-09 · the look is set by references of level from .claude/reference/design-refs.md, since none came with the card: https://unseen.co and https://a24.raviklaassens.com, lateral https://illoca.unseen.co · S9,S20
- PF-1-ASM-10 · the photos already in public/ (Frávega and Jüsto screens, logos) and the "Equipo WMS Justo" presentation photo are real footage inside the experience scenes, treated: a mask or clip-path, a grade filter and the grain overlay, never a bare rectangular image · S12
- PF-1-ASM-11 · only public/ is served: /.env, /specs/, /package.json, /cv/ and /.media-source/ answer 404; a real photo is published only as a treated copy with its metadata stripped · S2,S12
- PF-1-ASM-16 · the phone number appears nowhere public: not on the page, not in /llms.txt, not in /portfolio.json · S6,S7
- PF-1-ASM-17 · a scene media that fails (404, codec) keeps its poster; if the poster fails too, the scene keeps a graded dark field, and its text stays legible · S8

## Tasks

- T1 · S4,S5,S13,S14,S15,PF-1-ASM-05,PF-1-ASM-06 · features/portfolio/presentation/content.ts (presentation), e2e/content.spec.ts · tests: e2e/content.spec.ts "the page has only cold open, offer, experience, projects and credits @PF-1-S4"; e2e/content.spec.ts "experience and projects are the body of the page @PF-1-S5"; e2e/content.spec.ts "experience shows Grupo ST, Smart Warehousing, Visma, Frávega and Jüsto, each with what it was, the problem and his role @PF-1-ASM-05"; e2e/content.spec.ts "experience and projects carry the most screen time of the page @PF-1-S13"; e2e/content.spec.ts "no percentage, multiplier or before-after figure appears in experience or projects @PF-1-S14"; e2e/content.spec.ts "each project has what it is, the problem and his role, and nothing else @PF-1-S15"; e2e/content.spec.ts "three personal projects remain @PF-1-ASM-06"; e2e/content.spec.ts "the five chapters come in the order cold open, offer, experience, projects, credits @PF-1-ASM-01"
  reuses: lib/content.ts projects, contact (rewritten against cv/CV.tex); no screen of its own: the catalog components are composed by T2 to T6
- T2 · S1,S2,S8,S11,S19,PF-1-ASM-14,PF-1-ASM-03,PF-1-ASM-11,PF-1-ASM-17 · features/film/presentation/scene-media.tsx (presentation), features/film/presentation/cold-open.tsx (presentation), public/ASSETS.md, e2e/film.spec.ts · tests: e2e/film.spec.ts "the cold open plays generated video behind the name @PF-1-S1"; e2e/film.spec.ts "every scene media file answers 200 and has its ASSETS.md entry with the free tool, the prompt and the license @PF-1-S2"; e2e/film.spec.ts "the cold open fills the viewport edge to edge at 390 and 1280 @PF-1-S8"; e2e/film.spec.ts "video is muted and looping with a poster; reduced motion shows only the poster @PF-1-ASM-03"; e2e/film.spec.ts "no request leaves to an image or video generation API while browsing @PF-1-S11"; e2e/film.spec.ts "paths outside public answer 404 @PF-1-ASM-11"; e2e/film.spec.ts "by second 5 the name, the offer and a door are in view at 390 and 1280 @PF-1-S19"; e2e/film.spec.ts "at 390 and 1280 on throttled 4G the poster paints under 1.5 s, the cold open video is 3 MB or less and name, offer and a door show by 5 s @PF-1-ASM-14"; e2e/film.spec.ts "a failed video keeps its poster, a failed poster a dark field, and the text stays legible @PF-1-ASM-17"
  new: no video or media component exists (Grep video|poster in components/ and lib/)
  reuses: @magicui/text-animate, @magicui/noise-texture, @aceternity/spotlight
- T3 · S3,S10,S9,S20,PF-1-ASM-15,PF-1-ASM-09 · features/film/presentation/film-shell.tsx (presentation), features/film/presentation/chapter.tsx (presentation), app/page.tsx (presentation), app/layout.tsx (presentation), app/globals.css (presentation), e2e/film.spec.ts · tests: e2e/film.spec.ts "each chapter enters with its title card when scrolled into view @PF-1-S10"; e2e/film.spec.ts "something moves on every chapter while scrolling @PF-1-S3"; e2e/film.spec.ts "no sideways scroll at 320, 768 and 1280 @PF-1-S9"; e2e/film.spec.ts "every chapter has full-bleed media and its own transition into the next @PF-1-S20"; e2e/film.spec.ts "display and text faces load and no element falls back to a system font @PF-1-ASM-15"; e2e/film.spec.ts "the cold open and every chapter title card are full-bleed in the display face, as in the refs @PF-1-ASM-09"
  reuses: components/scroll-snap-container.tsx (replaced by the film shell), app/animations.css keyframes; @magicui/scroll-progress, @aceternity/sticky-scroll-reveal, @magicui/text-reveal
- T4 · S6,S7,PF-1-ASM-02 · features/portfolio/presentation/offer.tsx (presentation), e2e/offer.spec.ts · tests: e2e/offer.spec.ts "the offer names freelance product builds @PF-1-S6"; e2e/offer.spec.ts "the offer names Technical Project Manager for companies @PF-1-S7"; e2e/offer.spec.ts "the html lang is en @PF-1-ASM-02"
  new: no offer or services section exists (Grep service|offer|freelance in components/ and lib/)
  reuses: @aceternity/focus-cards, @magicui/border-beam, components/ui/card.tsx
- T5 · S5,S12,S16,PF-1-ASM-10 · features/portfolio/presentation/experience.tsx (presentation), features/portfolio/presentation/projects.tsx (presentation), e2e/content.spec.ts · tests: e2e/content.spec.ts "each project scene links to its repository @PF-1-S5"; e2e/content.spec.ts "the Jüsto scene shows the team presentation photo, treated @PF-1-S12"; e2e/content.spec.ts "every real screen and photo sits under a mask or clip-path with a grade filter and the grain overlay, never a bare rectangular img @PF-1-ASM-10"; e2e/content.spec.ts "each project scene has a generated visual reference beside its explanation @PF-1-S16"
  reuses: components/sections/professional-projects.tsx images of fravega and justo ; @aceternity/direction-aware-hover, @aceternity/parallax-scroll
- T6 · S17,S18,PF-1-ASM-04,PF-1-ASM-08,PF-1-ASM-12,PF-1-ASM-13 · features/film/presentation/end-credits.tsx (presentation), features/film/presentation/sound-toggle.tsx (presentation), features/film/presentation/call-to-action.tsx (presentation), features/film/presentation/chapter-index.tsx (presentation), e2e/credits.spec.ts · tests: e2e/credits.spec.ts "the end credits offer email and LinkedIn, and GitHub as a secondary link after the two doors @PF-1-ASM-04"; e2e/credits.spec.ts "the soundtrack is off until the toggle is pressed @PF-1-ASM-08"; e2e/credits.spec.ts "a call to action is in view in every chapter after the cold open @PF-1-S17"; e2e/credits.spec.ts "each door opens an email with its own subject and three prompts in the body; the credits end on the two doors @PF-1-ASM-12"; e2e/credits.spec.ts "the intro skips, the chapter index jumps by click and by keyboard; every link, door, index item, skip and sound toggle answers hover, a visible focus ring and press @PF-1-S18"; e2e/credits.spec.ts "the wheel scrolls natively, every chapter reads with sound off, focus lands on the chapter heading after a jump and on the offer heading after skip, and skip is focusable at second 1 @PF-1-ASM-13"
  reuses: components/sections/contact.tsx links; lucide-react icons; components/ui/button.tsx, @magicui/animated-shiny-text
- T7 · S14,PF-1-ASM-07,PF-1-ASM-16 · app/llms.txt/route.ts (presentation), lib/machine-readable.ts (presentation), lib/metadata.ts (presentation), e2e/content.spec.ts · tests: e2e/content.spec.ts "llms.txt and portfolio.json state the freelance and TPM positioning @PF-1-ASM-07"; e2e/content.spec.ts "no percentage, multiplier or before-after figure in llms.txt, portfolio.json or the page metadata @PF-1-S14"; e2e/content.spec.ts "the phone appears on no page, llms.txt or portfolio.json @PF-1-ASM-16"
  reuses: lib/machine-readable.ts buildPortfolioJson over the new content; no screen: text routes, components/ui/ not involved
- T8 · S9 · components.json (presentation), components/ui/ (presentation), e2e/film.spec.ts · tests: e2e/film.spec.ts "the page loads with no console error at 390 and 1280 @PF-1-S9"
  reuses: `npx shadcn@latest add @magicui/text-animate @magicui/noise-texture @aceternity/spotlight @magicui/scroll-progress @aceternity/sticky-scroll-reveal @magicui/text-reveal @aceternity/focus-cards @magicui/border-beam @aceternity/direction-aware-hover @aceternity/parallax-scroll @magicui/animated-shiny-text`

## Changes to existing behavior

- / · the eight sections become five chapters; Origins, Education, Certifications and Present leave the page · no earlier tests exist
- components/glass-navigation.tsx, components/scroll-snap-container.tsx · replaced by the film shell · no earlier tests exist
- /llms.txt, /portfolio.json · new positioning and the CV's roles · no earlier tests exist

## Look

- ref: https://unseen.co · https://a24.raviklaassens.com · lateral https://illoca.unseen.co (PF-1-ASM-09 · references of level from design-refs.md, none came with the card)
- ref: https://www.raviklaassens.com for the hover states and transitions of the two doors
- ref-genre: studio portfolio, told as a film title sequence
- intent: pinned-media
- behavior: load · the cold open starts black, the letterbox opens and the video fades in, once per visit
- behavior: view · each chapter enters with its title card, scrubbed by scroll, and leaves with the same scrub reversed when scrolling back
- behavior: cursor · links and project scenes answer hover, focus and press; the cursor never hides the native pointer
- behavior: loading · the poster frame with grain holds until the video can play
- behavior: reduced-motion · posters only, no scrub, no parallax, no transform left behind
- tokens: mood cinematic, nocturnal, tactile grain · genre film title sequence · spacing 4 8 16 24 40 64 112 · easing out cubic-bezier(.16,1,.3,1) 900 ms for scene cuts, 200 ms for controls
- copy: no figures; each project told as the problem, what was built and his role · he speaks in first person, short

## Gate

```
suite: npx playwright test {affected}
lint: npx eslint .
types: npx tsc --noEmit
app: npm run build && npx next start -p $PORT
probe loading: node .claude/tools/app.mjs probe specs/PF-1-cinematic-portfolio/steps/loading.json --axe --route "GET /film/*=hold" --out .validation/probe/loading
probe reduced-motion: node .claude/tools/app.mjs probe specs/PF-1-cinematic-portfolio/steps/reduced-motion.json --axe --out .validation/probe/reduced-motion
probe error: node .claude/tools/app.mjs probe specs/PF-1-cinematic-portfolio/steps/error.json --axe --route "GET /film/*=500" --out .validation/probe/error
overflow: node .claude/tools/overflow.mjs
motion: node .claude/tools/motion-audit.mjs $APP_URL
```

## Log

- L1 · "la idea es que ahora mi portafolio es super soso, vi portafolios que se ven increibles que usan generacion de imagen y video. Podes usarlo, pero no por API, simplemente decime que crear y con que herramienta gratuita y lo hago. Quiero que sea un portafolio super vivo. Y no me interesa que cuente tanto de mi vidam, quiero algo mas corto. Mas centrado en mi experiencia y proyectos. La idea es que empiece a trabajar como freelance tambien, asi que enfocalo a freelance y a Tecnical Project Manager para empresas." · earlier: "quiero el control de dise;o a tope" · "es critico el dise;o, ya te voy avisando" · later: "quiero un portafolio que deje anonadado visualmente al expectador, a nivel cinematografico" · "quiero que se sienta como una pelicula explorar mi portafolio" · "tenes las fotos del portafolio y te paso una mas"
- L2 · 2026-11-01 · requester, 2026-11-01: "mis proyectos y mi experiencia son super importantes, pero no pondria tipo numeros duros e inchequeables, iria a explicar los proyectos, nada mas y si se puede poner referencias visuales. Ahi nos ayuda la IA de imagenes"
- L3 · 2026-11-01 · requester, 2026-11-01: "quiero una muy buena llamada a la accion y una UX excelente"
- L4 · 2026-11-01 · requester, 2026-11-01: "los primeros 5 segundos son los mas importantes"
- L5 · 2026-11-01 · requester, 2026-11-01: "quiero que se sienta como esas paginas que salen miles de dolares"
- L6 · 2026-11-01 · declared · L1 "quiero el control de dise;o a tope" is the kit grade raised to mvp on 2026-11-01 (.claude/kit.json), a setting of the method, not a behavior of the screen
