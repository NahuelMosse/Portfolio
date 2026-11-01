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
- S21 · "todo lo que son certificaciones y estudios completos, estaria bueno ponerlos en alguna seccion como un elemento que se mueva de derecha a izquierda infinitamente"
- S22 · "en la seccion de contacto supongo que es donde mas impacto tiene. Importante buscar el mayor impacto."
- S23 · "Nahuel Mosse es mi nombre profecional, pero Nawi es mi nombre por el que se me llama"
- S24 · "aprovecha para crear mas imagenes si necesitas, las ilustraciones hacen que el portafolio pase de lindo a hermoso"
- PF-1-ASM-20 · every chapter carries illustrations of the one world of the cold open, made by the requester in Gemini from the prompts the session gives, in the same painterly style and palette: the world (16:9 and 9:16), the two offer doors (freelance workshop, TPM command bridge), one scene per experience role (Smart Warehousing, Grupo ST, Visma, Frávega, Jüsto), one per personal project (NASA Calendar, Compound Interest Calculator, Gym App) and the closing (16:9 and 9:16), plus a torn paper and a grain texture; an illustration not yet delivered is a declared gap in public/ASSETS.md, never a stand-in · S16,S24
- PF-1-ASM-19 · NAWI is the mark: the cold open sets NAWI in the display face edge to edge, its four letters at the largest scale of the site, with "Nahuel Mosse" beneath it in the text face as his professional name; he speaks as Nawi in first person ("I'm Nawi"); the page title, metadata, /llms.txt, /portfolio.json and the email doors name him Nahuel Mosse · S23
- PF-1-ASM-01 · one page in five chapters, in this order: cold open (name and promise over generated video), offer, experience, projects, end credits (contact); origins and present leave the page; completed studies and certifications live only in the credits roll of PF-1-ASM-18 · S4,S5,S10,S21
- PF-1-ASM-18 · the credits roll: in the end credits, after the contact line and right before the two doors, two full-bleed bands scroll right to left without end, over the hero image, as the "featured in" band of ref-01: the slower band carries the completed studies (Analista en Informática · Universidad de Morón · 2025; Técnico Electromecánico · Colegio Emaús · 2021) in the display face; the faster band carries the eight certifications of cv/CV.tex (EF SET C2 Proficient; Arquitectura de Software Aplicada, Platzi; Fundamentos de Arquitectura de Software, Platzi 2026; Liceo Cultural Británico Nivel 7; Liceo Cultural Británico Nivel 6; Fundamentos de Arquitectura de Software, Platzi 2023; Fundamentos de Ingeniería de Software, Platzi; Responsive Web Design, freeCodeCamp), each with its issuer's logo where public/ has it; Ingeniería Informática is in progress and stays out; the edges fade into black; hover or focus pauses a band; screen readers read one plain list, the duplicate copies are aria-hidden; with reduced motion the bands stand still and wrap · S21,S22
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
- PF-1-ASM-15 · the bar is a studio-commissioned site (the refs of ## Look) whose identity is its type: the display face is Boska (Indian Type Foundry via Fontshare, ITF Free Font License, self-hosted woff2), a high-contrast condensed serif with its own character used at maximum scale as the site's mark, NAWI (PF-1-ASM-19) set edge to edge of the viewport at every width and each section heading at poster scale; text in General Sans (same source and license); never a system, default or catalog-common face (Inter, Geist, Roboto, Montserrat, Bebas Neue, Anton); every chapter has full-bleed media and an authored transition into the next; no stock template block (three equal cards, centered hero with a gradient blob) · S20
- PF-1-ASM-09 · the look is set by the 17 references the requester sent (specs/PF-1-cinematic-portfolio/ref/requester-ref-*.png), read as: an own identity carried by a non-generic display face pushed to maximum scale (PF-1-ASM-15), the giant title crossed by the image, his own photo cut out in front of it, one illustrated world under everything in black, bone cream and red, grain and paper texture; "cinematográfico" is light, depth and camera, never cinema props (projector, letterbox, film credits) · S9,S20
- PF-1-ASM-10 · the photos already in public/ (Frávega and Jüsto screens, logos) and the "Equipo WMS Justo" presentation photo are real footage inside the experience scenes, treated: a mask or clip-path, a grade filter and the grain overlay, never a bare rectangular image · S12
- PF-1-ASM-11 · only public/ is served: /.env, /specs/, /package.json, /cv/ and /.media-source/ answer 404; a real photo is published only as a treated copy with its metadata stripped · S2,S12
- PF-1-ASM-16 · the phone number appears nowhere public: not on the page, not in /llms.txt, not in /portfolio.json · S6,S7
- PF-1-ASM-17 · a scene media that fails (404, codec) keeps its poster; if the poster fails too, the scene keeps a graded dark field, and its text stays legible · S8

## Tasks

- T1 · S4,S5,S13,S14,S15,PF-1-ASM-05,PF-1-ASM-06 · features/portfolio/presentation/content.ts (presentation), e2e/content.spec.ts · tests: e2e/content.spec.ts "the page has only cold open, offer, experience, projects and credits @PF-1-S4"; e2e/content.spec.ts "experience and projects are the body of the page @PF-1-S5"; e2e/content.spec.ts "experience shows Grupo ST, Smart Warehousing, Visma, Frávega and Jüsto, each with what it was, the problem and his role @PF-1-ASM-05"; e2e/content.spec.ts "experience and projects carry the most screen time of the page @PF-1-S13"; e2e/content.spec.ts "no percentage, multiplier or before-after figure appears in experience or projects @PF-1-S14"; e2e/content.spec.ts "each project has what it is, the problem and his role, and nothing else @PF-1-S15"; e2e/content.spec.ts "three personal projects remain @PF-1-ASM-06"; e2e/content.spec.ts "the five chapters come in the order cold open, offer, experience, projects, credits @PF-1-ASM-01"
  reuses: lib/content.ts projects, contact (rewritten against cv/CV.tex); no screen of its own: the catalog components are composed by T2 to T6
- T2 · S1,S2,S8,S11,S19,S24,PF-1-ASM-20,PF-1-ASM-14,PF-1-ASM-03,PF-1-ASM-11,PF-1-ASM-17 · features/film/presentation/scene-media.tsx (presentation), features/film/presentation/cold-open.tsx (presentation), public/ASSETS.md, e2e/film.spec.ts · tests: e2e/film.spec.ts "the cold open plays generated video behind the name @PF-1-S1"; e2e/film.spec.ts "every scene media file answers 200 and has its ASSETS.md entry with the free tool, the prompt and the license @PF-1-S2"; e2e/film.spec.ts "the cold open fills the viewport edge to edge at 390 and 1280 @PF-1-S8"; e2e/film.spec.ts "video is muted and looping with a poster; reduced motion shows only the poster @PF-1-ASM-03"; e2e/film.spec.ts "no request leaves to an image or video generation API while browsing @PF-1-S11"; e2e/film.spec.ts "paths outside public answer 404 @PF-1-ASM-11"; e2e/film.spec.ts "by second 5 the name, the offer and a door are in view at 390 and 1280 @PF-1-S19"; e2e/film.spec.ts "at 390 and 1280 on throttled 4G the poster paints under 1.5 s, the cold open video is 3 MB or less and name, offer and a door show by 5 s @PF-1-ASM-14"; e2e/film.spec.ts "a failed video keeps its poster, a failed poster a dark field, and the text stays legible @PF-1-ASM-17"; e2e/film.spec.ts "every chapter shows at least one illustration of the world @PF-1-S24"; e2e/film.spec.ts "the page shows the world, the freelance workshop and the TPM command bridge, the Smart Warehousing, Grupo ST, Visma, Frávega and Jüsto scenes, the NASA Calendar, Compound Interest Calculator and Gym App scenes, the closing, the torn paper and the grain, each listed in ASSETS.md as made in Gemini @PF-1-ASM-20"
  new: no video or media component exists (Grep video|poster in components/ and lib/)
  reuses: @magicui/text-animate, @magicui/noise-texture, @aceternity/spotlight
- T3 · S3,S10,S9,S20,S23,PF-1-ASM-15,PF-1-ASM-09,PF-1-ASM-19 · features/film/presentation/film-shell.tsx (presentation), features/film/presentation/chapter.tsx (presentation), app/page.tsx (presentation), app/layout.tsx (presentation), app/globals.css (presentation), e2e/film.spec.ts · tests: e2e/film.spec.ts "each chapter enters with its title card when scrolled into view @PF-1-S10"; e2e/film.spec.ts "something moves on every chapter while scrolling @PF-1-S3"; e2e/film.spec.ts "no sideways scroll at 320, 768 and 1280 @PF-1-S9"; e2e/film.spec.ts "every chapter has full-bleed media and its own transition into the next @PF-1-S20"; e2e/film.spec.ts "Boska and General Sans load from the site itself, no element falls back to a system font or uses Inter, Geist, Roboto, Montserrat, Bebas Neue or Anton, and NAWI in Boska spans at least 90% of the viewport width at 390 and 1280 @PF-1-ASM-15"; e2e/film.spec.ts "the cold open shows both Nawi and Nahuel Mosse @PF-1-S23"; e2e/film.spec.ts "NAWI in Boska is the largest text of the site with Nahuel Mosse beneath it in General Sans, the hero says I'm Nawi, and the page title, metadata, llms.txt, portfolio.json and both email doors say Nahuel Mosse @PF-1-ASM-19"; e2e/film.spec.ts "the hero title is in Boska with the cut-out photo in front of it, the only accent color is the red token, and no projector, letterbox or film-credits element exists @PF-1-ASM-09"
  reuses: components/scroll-snap-container.tsx (replaced by the film shell), app/animations.css keyframes; @magicui/scroll-progress, @aceternity/sticky-scroll-reveal, @magicui/text-reveal
- T4 · S6,S7,PF-1-ASM-02 · features/portfolio/presentation/offer.tsx (presentation), e2e/offer.spec.ts · tests: e2e/offer.spec.ts "the offer names freelance product builds @PF-1-S6"; e2e/offer.spec.ts "the offer names Technical Project Manager for companies @PF-1-S7"; e2e/offer.spec.ts "the html lang is en @PF-1-ASM-02"
  new: no offer or services section exists (Grep service|offer|freelance in components/ and lib/)
  reuses: @aceternity/focus-cards, @magicui/border-beam, components/ui/card.tsx
- T5 · S5,S12,S16,PF-1-ASM-10 · features/portfolio/presentation/experience.tsx (presentation), features/portfolio/presentation/projects.tsx (presentation), e2e/content.spec.ts · tests: e2e/content.spec.ts "each project scene links to its repository @PF-1-S5"; e2e/content.spec.ts "the Jüsto scene shows the team presentation photo, treated @PF-1-S12"; e2e/content.spec.ts "every real screen and photo sits under a mask or clip-path with a grade filter and the grain overlay, never a bare rectangular img @PF-1-ASM-10"; e2e/content.spec.ts "each project scene has a generated visual reference beside its explanation @PF-1-S16"
  reuses: components/sections/professional-projects.tsx images of fravega and justo ; @aceternity/direction-aware-hover, @aceternity/parallax-scroll
- T6 · S17,S18,S21,S22,PF-1-ASM-04,PF-1-ASM-08,PF-1-ASM-12,PF-1-ASM-13,PF-1-ASM-18 · features/film/presentation/end-credits.tsx (presentation), features/film/presentation/credits-roll.tsx (presentation), features/film/presentation/sound-toggle.tsx (presentation), features/film/presentation/call-to-action.tsx (presentation), features/film/presentation/chapter-index.tsx (presentation), e2e/credits.spec.ts · tests: e2e/credits.spec.ts "the end credits offer email and LinkedIn, and GitHub as a secondary link after the two doors @PF-1-ASM-04"; e2e/credits.spec.ts "the soundtrack is off until the toggle is pressed @PF-1-ASM-08"; e2e/credits.spec.ts "a call to action is in view in every chapter after the cold open @PF-1-S17"; e2e/credits.spec.ts "each door opens an email with its own subject and three prompts in the body; the credits end on the two doors @PF-1-ASM-12"; e2e/credits.spec.ts "the intro skips, the chapter index jumps by click and by keyboard; every link, door, index item, skip and sound toggle answers hover, a visible focus ring and press @PF-1-S18"; e2e/credits.spec.ts "the wheel scrolls natively, every chapter reads with sound off, focus lands on the chapter heading after a jump and on the offer heading after skip, and skip is focusable at second 1 @PF-1-ASM-13"; e2e/credits.spec.ts "the completed studies and the certifications move right to left without end and keep moving after a full loop @PF-1-S21"; e2e/credits.spec.ts "the credits roll sits in the end credits, full-bleed, directly before the two doors @PF-1-S22"; e2e/credits.spec.ts "the roll lists Analista en Informática 2025 and Técnico Electromecánico 2021, the eight certifications with Platzi 2026 and 2023 and Liceo Nivel 7 and 6, not Ingeniería Informática; hover and focus pause it, one list is read and the copies are aria-hidden, reduced motion stands it still @PF-1-ASM-18"
  reuses: components/sections/contact.tsx links; lucide-react icons; components/ui/button.tsx, @magicui/animated-shiny-text, @magicui/marquee; public/logo-UM.webp, public/logo-emaus.webp, public/logo-liceo-cultural-britanico.webp
- T7 · S14,PF-1-ASM-07,PF-1-ASM-16 · app/llms.txt/route.ts (presentation), lib/machine-readable.ts (presentation), lib/metadata.ts (presentation), e2e/content.spec.ts · tests: e2e/content.spec.ts "llms.txt and portfolio.json state the freelance and TPM positioning @PF-1-ASM-07"; e2e/content.spec.ts "no percentage, multiplier or before-after figure in llms.txt, portfolio.json or the page metadata @PF-1-S14"; e2e/content.spec.ts "the phone appears on no page, llms.txt or portfolio.json @PF-1-ASM-16"
  reuses: lib/machine-readable.ts buildPortfolioJson over the new content; no screen: text routes, components/ui/ not involved
- T8 · S9 · components.json (presentation), components/ui/ (presentation), e2e/film.spec.ts · tests: e2e/film.spec.ts "the page loads with no console error at 390 and 1280 @PF-1-S9"
  reuses: `npx shadcn@latest add @magicui/text-animate @magicui/noise-texture @aceternity/spotlight @magicui/scroll-progress @aceternity/sticky-scroll-reveal @magicui/text-reveal @aceternity/focus-cards @magicui/border-beam @aceternity/direction-aware-hover @aceternity/parallax-scroll @magicui/animated-shiny-text @magicui/marquee`

## Changes to existing behavior

- / · the eight sections become five chapters; Origins, Education, Certifications and Present leave the page · no earlier tests exist
- components/glass-navigation.tsx, components/scroll-snap-container.tsx · replaced by the film shell · no earlier tests exist
- /llms.txt, /portfolio.json · new positioning and the CV's roles · no earlier tests exist

## Look

- ref: specs/PF-1-cinematic-portfolio/ref/requester-ref-01.png
- ref: specs/PF-1-cinematic-portfolio/ref/requester-ref-12.png
- ref-notes: PF-1-ASM-09; ref/requester-ref-01..17.png are the 17 sent by the requester, local only and git-ignored; ref-01 (condensed type over a painted world, staggered case list, marquee band, "Let's connect" over the hero image), ref-12 (cut-out subject breaking a red shape, huge grotesque), ref-11 (dark subject with red light and fine line work), ref-05 and ref-06 (an illustrated world under the title), ref-14 (torn edges, content inside the image), ref-16 (each case numbered in a large display numeral, its real pieces in an uneven grid, condensed serif posters), ref-17 (high-contrast condensed serif titles on bone paper, a red sun disc behind the image, a vertical label column, small spaced labels between thin rules, numbered spreads)
- ref-genre: editorial poster portfolio with a world of its own; cinematic means light, depth and camera, not cinema as a theme
- intent: pinned-media
- behavior: load · the hero image settles from a slow scale, the subject rises in front of the giant title and the letters fill in behind it, once per visit
- behavior: view · each section enters with its giant heading sliding against its image (parallax depth between subject, type and world), and leaves with the same scrub reversed when scrolling back
- behavior: cursor · case names, links and doors answer hover, focus and press; hovering a case reveals its image; the cursor never hides the native pointer
- behavior: loading · the still with grain holds until the video can play
- behavior: reduced-motion · stills only, no scrub, no parallax, no transform left behind
- tokens: mood bold, nocturnal, tactile (grain and paper), one world · palette black, bone cream and one red as the only accent (the color shared by 9 of the 17 refs) · type Boska is the identity (NAWI edge to edge as the mark, Nahuel Mosse small beneath, headings at poster scale, uppercase, tight tracking, line-height under 0.9, letters crossed and cut by the image) paired with General Sans for text and for small spaced uppercase labels between thin rules · composition subject cut out in front of the type, type crossing the image, a red disc behind the subject, each case numbered in a large display numeral with its pieces in an uneven grid, asymmetric staggered lists, at least three breaks of the container per section · spacing 4 8 16 24 40 64 112 · easing out cubic-bezier(.16,1,.3,1) 900 ms for section moves, 200 ms for controls
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
- L7 · 2026-11-01 · requester, 2026-11-01: "todo lo que son certificaciones y estudios completos, estaria bueno ponerlos en alguna seccion como un elemento que se mueva de derecha a izquierda infinitamente, no se si entendiste a  que me refiero, en la seccion de contacto supongo que es donde mas impacto tiene. Importante buscar el mayor impacto."
- L8 · 2026-11-01 · requester, 2026-11-01: "no me convence la idea del cine la verdad, te decia a nivel cinematografico, pero no necesariamente cine" and, with 15 reference images (.media-source/refs/): "se que lo que pido no es facil, pero esos son dise;os de paginas web que valen miles de dolares"
- L9 · 2026-11-01 · requester, 2026-11-01: "todas tienen en comun que intentan verse con identidad propia, por eso buscan una tipografia que no sea generica y maximizarla y dale personalidad" · PF-1-ASM-15, PF-1-ASM-09
- L10 · 2026-11-01 · requester: two more reference images with no text (ref/requester-ref-16.png, ref/requester-ref-17.png); read as a high-contrast condensed serif display, numbered cases and a red disc · PF-1-ASM-15, PF-1-ASM-09
- L11 · 2026-11-01 · requester: "una cosa de mi personalidad, Nahuel Mosse es mi nombre profecional, pero Nawi es mi nombre por el que se me llama" · S23, PF-1-ASM-19
- L12 · 2026-11-01 · requester: "aprovecha para crear mas imagenes si necesitas, las ilustraciones hacen que el portafolio pase de lindo a hermoso" · S24, PF-1-ASM-20
