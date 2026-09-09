import type { PortfolioContent } from "./types"

export const en: PortfolioContent = {
  meta: {
    title: "Nahuel Mosse — Senior Full Stack Developer & Technical Lead",
    description:
      "Senior full stack developer and technical lead in Buenos Aires. Four years building warehouse, payroll and credit systems that hold at scale — and the spec-driven method teams use to build them with AI agents.",
    keywords: [
      "Senior Full Stack Developer",
      "Technical Lead",
      "AI Engineering",
      "Spec-Driven Development",
      "TypeScript",
      "NestJS",
      "Next.js",
      "PostgreSQL",
      "Azure",
      "Kubernetes",
      "Buenos Aires",
      "Argentina",
    ],
  },

  identity: {
    name: "Nahuel Mosse",
    role: "Senior Full Stack Developer · Technical Lead",
    company: "Kovix Consulting",
    location: "Buenos Aires, Argentina",
    timezone: "America/Argentina/Buenos_Aires",
    email: "nahuelgamail@gmail.com",
    availability: "Open to remote & international roles",
    links: [
      { label: "GitHub", href: "https://github.com/NahuelMosse" },
      { label: "LinkedIn", href: "https://linkedin.com/in/nahuelmosse" },
      { label: "GitLab", href: "https://gitlab.com/NahuelMosse" },
    ],
  },

  boot: {
    lines: [
      "initializing runtime",
      "mounting warehouse.pipeline",
      "mounting payroll.ingest",
      "mounting credit.scoring",
      "loading agent orchestration",
      "ready",
    ],
    skip: "click to skip",
  },

  hero: {
    eyebrow: "Buenos Aires · Argentina",
    headline: ["NAHUEL", "MOSSE"],
    statement:
      "I build systems that hold at scale — warehouses moving tens of millions of operations, payroll onboarding cut from months to days — and the spec-driven method teams use to build them with AI agents.",
    ticker: [
      "40M+ product operations",
      "40k requests / day",
      "7h48m → 46m",
      "2 months → 1 week",
      "4+ years shipping to production",
      "Senior Full Stack · Technical Lead",
    ],
    scrollCue: "scroll",
    paletteHint: "the page shifts colour as you move through the work",
  },

  telemetry: {
    eyebrow: "01 / telemetry",
    title: "The numbers, and where they come from",
    intro:
      "Impact is easy to claim and hard to source. Every figure below is tied to a specific system, a specific period, and a specific thing that changed for the people using it.",
    metrics: [
      {
        id: "m-operations",
        value: "40M+",
        unit: "ops",
        featured: true,
        label: "Product operations processed",
        source: "Jüsto — multiwarehouse WMS, peak demand periods",
        projectId: "justo",
        shape: [0.18, 0.24, 0.31, 0.29, 0.44, 0.58, 0.53, 0.72, 0.86, 1],
      },
      {
        id: "m-requests",
        value: "40k",
        unit: "req / day",
        label: "Sustained through the Sellers BFF",
        source: "Frávega — 1.2M requests per month",
        projectId: "fravega",
        shape: [0.32, 0.38, 0.35, 0.49, 0.46, 0.62, 0.71, 0.68, 0.88, 0.94],
      },
      {
        id: "m-receiving",
        value: "46",
        unit: "min",
        label: "Average receiving time, down from 7h 48m",
        source: "Frávega — warehouse receiving flow, ~90% reduction",
        projectId: "fravega",
        shape: [1, 0.94, 0.79, 0.62, 0.48, 0.36, 0.27, 0.19, 0.13, 0.1],
      },
      {
        id: "m-onboarding",
        value: "1",
        unit: "week",
        label: "Payroll onboarding stage, down from 2 months",
        source: "Visma — AI-assisted extraction and validation",
        projectId: "visma",
        shape: [1, 0.86, 0.68, 0.51, 0.38, 0.26, 0.18, 0.13, 0.11, 0.09],
      },
      {
        id: "m-simplification",
        value: "80",
        unit: "%",
        label: "Business process steps removed",
        source: "Frávega — fulfilment orchestration rework",
        projectId: "fravega",
        shape: [0.14, 0.22, 0.36, 0.41, 0.55, 0.63, 0.74, 0.81, 0.88, 0.92],
      },
      {
        id: "m-years",
        value: "4+",
        unit: "years",
        label: "Shipping production software at Kovix",
        source: "June 2022 — present, across five client platforms",
        shape: [0.1, 0.22, 0.34, 0.45, 0.56, 0.66, 0.75, 0.84, 0.92, 1],
      },
    ],
    footnote:
      "Client systems are not screenshotted here. The diagrams in the next section are drawn from scratch for this site.",
  },

  work: {
    eyebrow: "02 / work",
    title: "Five systems, five problems",
    intro:
      "Four years at Kovix Consulting, embedded in client engineering teams. Warehouses, payroll, credit. Each panel is one system: what it had to survive, and what I owned inside it.",
    dragHint: "drag or scroll",
    projects: [
      {
        id: "smart-warehousing",
        client: "Kovix · Smart Warehousing",
        title: "Teaching a company to build with agents",
        role: "AI Engineering Enablement Lead · SDD Coach",
        period: "Sep 2026 — present",
        palette: "lime",
        logo: "/logo-kovix.webp",
        summary:
          "A cross-cutting development method for AI-assisted work, applied to greenfield and brownfield projects across different teams and architectures.",
        body: [
          "I created and evolved a transversal methodology for AI-assisted development, then took on a role closer to a Scrum Master than a lead engineer: coaching teams, unblocking them, tracking adoption, and folding their feedback back into the method.",
          "The operating model is deliberate about who does what. Agents take work at a junior to semi-senior scope, under explicit specifications, acceptance criteria and human review gates. Senior engineers concentrate on architecture, scalability, maintainability and the decisions that are expensive to get wrong.",
        ],
        stack: ["Claude Code", "Spec-Driven Development", "Multi-agent orchestration", "Technical enablement"],
        headline: {
          id: "sw-headline",
          value: "Cross-team",
          kind: "claim",
          label: "Method adopted across greenfield and brownfield projects",
          source: "Kovix Consulting, 2026",
        },
        flow: {
          title: "The loop",
          nodes: [
            { id: "spec", label: "Specification", detail: "Scope, acceptance criteria, explicit non-goals" },
            { id: "delegate", label: "Delegation", detail: "Work sized to what an agent can own safely" },
            { id: "agents", label: "Agent execution", detail: "Parallel, bounded, traceable" },
            { id: "review", label: "Human review", detail: "Architecture and quality gate — never skipped" },
            { id: "prod", label: "Production", detail: "Feedback returns to the method" },
          ],
        },
      },
      {
        id: "grupo-st",
        client: "Grupo ST",
        title: "Credit risk, with the paper trail regulators want",
        role: "Technical Lead",
        period: "Aug 2026 — present",
        palette: "amber",
        summary:
          "A document management and decision platform that automates credit approval while keeping every step auditable.",
        body: [
          "Technical lead on a platform that takes a credit application from intake through document extraction, scoring and committee review to a final decision — with traceability at every hop, because the output has to survive an audit.",
          "Built AI-first: agents orchestrated with Claude Code and spec-driven development implement the product end to end from specifications and architecture decisions I own. Domain-driven design over Next.js and NestJS, with a Jest unit suite and a Playwright end-to-end regression suite guarding the complete flows.",
        ],
        stack: ["TypeScript", "Next.js", "NestJS", "Sequelize", "PostgreSQL", "DDD", "Jest", "Playwright", "Turborepo"],
        headline: {
          id: "st-headline",
          value: "End-to-end",
          kind: "claim",
          label: "Intake to decision, fully traceable",
          source: "Grupo ST credit risk platform, in development",
        },
        flow: {
          title: "Application lifecycle",
          nodes: [
            { id: "intake", label: "Intake", detail: "Application and supporting documents" },
            { id: "extract", label: "Extraction", detail: "Structured data pulled from documents" },
            { id: "score", label: "Scoring", detail: "Risk model against policy rules" },
            { id: "committee", label: "Committee", detail: "Human decision, recorded" },
            { id: "decision", label: "Decision", detail: "Approved, conditioned or declined — with reasons" },
          ],
        },
      },
      {
        id: "visma",
        client: "Visma",
        title: "Two months of payroll onboarding, down to one week",
        role: "Technical Lead",
        period: "Jan 2026 — present",
        palette: "nordic",
        logo: "/logo-visma.webp",
        summary:
          "Payroll onboarding for consultants: ingest the client's existing payroll, understand it, validate it, and load it — without a two-month manual project.",
        body: [
          "I led the technical side and talked directly to the client: turning payroll business needs into scope, architecture and roadmap. I also ran the calendar, priorities and work distribution, mentored a junior developer, and owned the product's design system.",
          "The architecture is an Nx monorepo over Next.js and NestJS, clean architecture and DDD, integrated with internal APIs and Azure OpenAI — the integration that took one onboarding stage from two months to one week. Data and async processing run on Prisma over PostgreSQL with BullMQ and Redis for queues, cache and distributed rate limiting, deliberately avoiding persistent Redis as durable storage to keep costs down.",
          "I was also responsible for security, CI/CD and infrastructure as code: Azure deployment with Terraform and AKS, managed identities, Key Vault, private networking and Kubernetes security policies.",
        ],
        stack: [
          "TypeScript",
          "Nx",
          "Next.js",
          "NestJS",
          "Prisma",
          "PostgreSQL",
          "Redis",
          "BullMQ",
          "Azure OpenAI",
          "Terraform",
          "AKS",
        ],
        headline: {
          id: "visma-headline",
          value: "1 week",
          label: "One onboarding stage, down from two months",
          source: "Visma payroll onboarding, 2026",
        },
        flow: {
          title: "Onboarding pipeline",
          nodes: [
            { id: "ingest", label: "Ingest", detail: "Existing payroll files, whatever shape they arrive in" },
            { id: "extract", label: "Extraction", detail: "Azure OpenAI turns documents into structured concepts" },
            { id: "validate", label: "Validation", detail: "Rules and human confirmation before anything is trusted" },
            { id: "queue", label: "Async processing", detail: "BullMQ over Redis, rate limited" },
            { id: "sync", label: "Sync", detail: "Loaded into the payroll platform" },
          ],
        },
      },
      {
        id: "fravega",
        client: "Frávega",
        title: "A warehouse that had to keep moving",
        role: "Full Stack Developer",
        period: "Jun 2023 — Jan 2026",
        palette: "violet",
        logo: "/logo-fravega.webp",
        summary:
          "Modernising order fulfilment in a large-scale warehouse: the software that orchestrated packing and drove the sorter handling internal transport.",
        body: [
          "I worked on the system that assembled packages and integrated with the sorter responsible for moving them through the building — the layer where a bug does not mean a failed request, it means physical goods stop.",
          "I implemented the full BFF architecture for the Sellers module, sustaining 40,000 requests a day and 1.2 million a month. Alongside that: API contract design and documentation across teams, query optimisation, unit testing, and production support.",
          "Simplifying the business process removed roughly 80% of its steps and took average receiving time from 7 hours 48 minutes to 46 minutes. I also planned critical releases, managed calendar risk preventively, wrote deployment guides and mentored teammates.",
        ],
        stack: ["Node.js", "NestJS", "Angular", "React", "TypeScript", "Sequelize", "PostgreSQL", "Jest", "Vitest", "Webhooks"],
        headline: {
          id: "fravega-headline",
          value: "46 min",
          label: "Average receiving time, down from 7h 48m",
          source: "Frávega WMS B2C, 2023–2026",
        },
        flow: {
          title: "Fulfilment path",
          nodes: [
            { id: "receiving", label: "Receiving", detail: "Goods in — the step that went from 7h48m to 46m" },
            { id: "stock", label: "Stock", detail: "Locations and availability" },
            { id: "picking", label: "Picking", detail: "Order assembly" },
            { id: "sorter", label: "Sorter", detail: "Physical routing through the building" },
            { id: "dispatch", label: "Dispatch", detail: "Out to the customer" },
          ],
        },
      },
      {
        id: "justo",
        client: "Jüsto",
        title: "Multiwarehouse, and what expires first",
        role: "Full Stack Developer",
        period: "Nov 2022 — Dec 2023",
        palette: "green",
        logo: "/logo-justo.webp",
        summary:
          "A multiwarehouse WMS for an online supermarket's distribution centres, plus a reduced build for micro-fulfilment centres.",
        body: [
          "Designed a multiwarehouse WMS with isolation close to multitenancy for the distribution centres, and a lighter version for micro-fulfilment centres operating under different constraints.",
          "The real change was replacing spreadsheets and informal knowledge with actual inventory and location traceability, including FEFO dispatch — first expired, first out — which matters when the product is food.",
          "More than ten releases, around 50% less preparation time, tens of millions of operations, and more headroom during historic sales peaks. I also did technical design and API contracts, effort estimation, task tracking, and mentoring to keep the team unblocked during those peaks.",
        ],
        stack: ["Node.js", "NestJS", "Angular", "React", "TypeScript", "Sequelize", "PostgreSQL", "Jest", "Webhooks"],
        headline: {
          id: "justo-headline",
          value: "40M",
          label: "Product operations at peak demand",
          source: "Jüsto WMS multiwarehouse, 2022–2023",
        },
        flow: {
          title: "Multiwarehouse model",
          nodes: [
            { id: "dc", label: "Distribution centres", detail: "Isolated like tenants" },
            { id: "mfc", label: "Micro-fulfilment", detail: "Reduced build, tighter constraints" },
            { id: "inventory", label: "Inventory", detail: "Locations and traceability replacing spreadsheets" },
            { id: "fefo", label: "FEFO", detail: "First expired, first out" },
            { id: "delivery", label: "Delivery", detail: "Same-day grocery" },
          ],
        },
      },
    ],
  },

  lab: {
    eyebrow: "03 / lab",
    title: "What I build when nobody is asking",
    intro:
      "Client work teaches you scale and consequence. Your own projects are where you get to be strict for no reason other than wanting the thing to be right.",
    projects: [
      {
        id: "grit",
        title: "Grit",
        tagline: "A local-first training system. No account, no network, no backend.",
        palette: "grit",
        body: [
          "A Flutter app for people who train on their own: plan routines, run a live session, correct history, and watch progress and streaks build up over time. Everything lives on the device — no sign-up, no server, no telemetry leaving the phone.",
          "I built it the way I coach teams to build: fourteen formal specifications before the code, a roadmap traced against them, and a visual parity audit that renders every screen across languages, themes, screen sizes and font scales, then diffs the results. 1,852 captures, so that accessibility and localisation are verified rather than assumed.",
        ],
        stack: ["Flutter", "Dart", "Riverpod", "Drift", "SQLite", "Spec-Driven Development"],
        stats: [
          { value: "53,300", label: "lines of Dart" },
          { value: "78", label: "test files" },
          { value: "14", label: "formal specs" },
          { value: "1,852", label: "parity captures" },
        ],
        media: {
          poster: "/lab/grit/poster.webp",
          shots: [],
        },
      },
      {
        id: "sdd-kit",
        title: "SDD Kit",
        tagline: "The method, written down and installable.",
        palette: "cyan",
        body: [
          "The spec-driven development methodology I teach at Kovix, packaged so a team can adopt it without me in the room: the written method, plan and snapshot templates, the engines that drive each stage, and evals to check whether an agent actually did what the spec said.",
          "The premise is simple and unfashionable. An agent is good at implementing a decision and bad at making one. So you write the decision down first — scope, acceptance criteria, explicit non-goals — and the review gate stays human.",
        ],
        stack: ["Methodology", "Claude Code", "Templates", "Evals"],
        stats: [
          { value: "10", label: "documented stages" },
          { value: "2", label: "engines" },
          { value: "1", label: "written handbook" },
        ],
      },
    ],
    smallTitle: "Smaller things",
    small: [
      {
        id: "nasa-calendar",
        title: "NASA Calendar",
        year: "2023",
        description:
          "A calendar that pulls NASA's Astronomy Picture of the Day and renders it server-side.",
        stack: ["TypeScript", "Next.js", "React", "SSR"],
        repo: "https://github.com/NahuelMosse/nasa-calendar",
      },
      {
        id: "ias-api",
        title: "CI/CD Pipeline API",
        year: "2026",
        description:
          "A Flask API on Postgres, but the point is the pipeline: GitHub Actions across dev, QA and production, with manual approval before prod and Bandit security scanning.",
        stack: ["Python", "Flask", "PostgreSQL", "Docker", "GitHub Actions"],
        repo: "https://github.com/NahuelMosse/ias_mosse_api",
      },
      {
        id: "node-mongo",
        title: "Node · Mongo CLI",
        year: "2026",
        description:
          "An interactive sales-domain CLI, layered into domain, repository and service — a small thing built with a large thing's discipline.",
        stack: ["TypeScript", "MongoDB", "Mongoose", "Inquirer"],
        repo: "https://github.com/NahuelMosse/Node-Mongo",
      },
      {
        id: "compound-interest",
        title: "Compound Interest Calculator",
        year: "2026",
        description: "Financial projections with interactive charts and a full breakdown of every period.",
        stack: ["React", "Vite", "JavaScript", "Charts"],
        repo: "https://github.com/NahuelMosse/Calculadora-de-interes-compuesto",
        demo: "https://nahuelmosse.github.io/Calculadora-de-interes-compuesto/",
      },
      {
        id: "winapi-login",
        title: "Login WinAPI",
        year: "2022",
        description:
          "A desktop login built directly against the Win32 API in C++. No framework, no safety net — which was the entire point.",
        stack: ["C++", "Win32", "Windows API"],
        repo: "https://github.com/NahuelMosse/Sign-in-log-in-WinApi",
      },
      {
        id: "git-tutorial",
        title: "Git Tutorial",
        year: "2023",
        description: "An interactive reference for Git commands and workflows, written for people learning it.",
        stack: ["HTML", "CSS", "JavaScript"],
        repo: "https://github.com/NahuelMosse/Tutorial-de-Git",
        demo: "https://nahuelmosse.github.io/Tutorial-de-Git/",
      },
    ],
  },

  method: {
    eyebrow: "04 / method",
    title: "How I work with agents",
    intro:
      "Most teams point an agent at a codebase and hope. That produces volume, not software. The method below is what I built at Kovix and what I use on my own projects — the difference is that the decision comes before the code, and a human owns the gate.",
    steps: [
      {
        id: "spec",
        title: "Specification first",
        body: "Scope, acceptance criteria and explicit non-goals, written before a line of code. If it cannot be specified, it is not ready to delegate.",
      },
      {
        id: "size",
        title: "Size the work honestly",
        body: "Agents take work at a junior to semi-senior scope. Architecture, scalability and anything expensive to reverse stays with senior engineers.",
      },
      {
        id: "orchestrate",
        title: "Orchestrate, don't prompt",
        body: "Parallel agents with defined responsibilities and bounded context, each traceable back to the spec that authorised it.",
      },
      {
        id: "gate",
        title: "The human gate is not optional",
        body: "Review is where the method earns its keep. Quality is enforced by tests, regression suites and a person who is accountable for the result.",
      },
      {
        id: "feedback",
        title: "Feed the method back",
        body: "What the team hits in practice becomes the next revision. Adoption is coached, tracked and adjusted — not announced once and abandoned.",
      },
    ],
    outro:
      "This is what I do now as AI Engineering Enablement Lead: not writing more code faster, but making it possible for a team to write it well.",
  },

  arsenal: {
    eyebrow: "05 / arsenal",
    title: "Inventory",
    intro:
      "Everything here has been used against a deadline, in production, with someone depending on the result. Filter by category.",
    legend: "years in use",
    categories: ["Languages", "Frontend", "Backend & Data", "Architecture", "Cloud & DevOps", "AI Engineering", "Quality"],
    items: [
      { name: "TypeScript", category: "Languages", years: 4, note: "Primary language across every platform below." },
      { name: "JavaScript", category: "Languages", years: 5, note: "Where TypeScript hasn't reached yet." },
      { name: "SQL", category: "Languages", years: 4, note: "Query optimisation on warehouse-scale tables." },
      { name: "Python", category: "Languages", years: 3, note: "APIs, tooling and automation." },
      { name: "C++", category: "Languages", years: 3, note: "Win32 desktop work and university systems programming." },
      { name: "Go", category: "Languages", years: 1, note: "Services and CLI tooling." },
      { name: "Java", category: "Languages", years: 2, note: "Object-oriented design coursework and small services." },
      { name: "Dart", category: "Languages", years: 2, note: "Grit, and everything Flutter-shaped." },

      { name: "React", category: "Frontend", years: 4, note: "Backoffices, dashboards and product UI." },
      { name: "Next.js", category: "Frontend", years: 3, note: "App Router, SSR, and this site." },
      { name: "Angular", category: "Frontend", years: 3, note: "Two full warehouse management frontends." },
      { name: "Tailwind CSS", category: "Frontend", years: 3, note: "Design tokens over utility classes." },
      { name: "shadcn/ui · Radix", category: "Frontend", years: 2, note: "Accessible primitives, themed per product." },
      { name: "Flutter", category: "Frontend", years: 2, note: "Local-first mobile, offline by design." },

      { name: "Node.js", category: "Backend & Data", years: 4, note: "Every backend on this page." },
      { name: "NestJS", category: "Backend & Data", years: 4, note: "Hexagonal and DDD service layouts." },
      { name: "PostgreSQL", category: "Backend & Data", years: 4, note: "Schema design and query tuning at scale." },
      { name: "Prisma", category: "Backend & Data", years: 1, note: "Typed data access on the Visma monorepo." },
      { name: "Sequelize", category: "Backend & Data", years: 4, note: "The ORM under both WMS platforms." },
      { name: "Redis · BullMQ", category: "Backend & Data", years: 1, note: "Queues, cache and distributed rate limiting." },
      { name: "MongoDB", category: "Backend & Data", years: 2, note: "Document stores where relations weren't the point." },
      { name: "REST · Webhooks", category: "Backend & Data", years: 4, note: "Contracts between teams that had to hold." },

      { name: "Domain-Driven Design", category: "Architecture", years: 3, note: "Bounded contexts on credit and warehouse domains." },
      { name: "Clean Architecture", category: "Architecture", years: 3, note: "Dependency direction as a build-time rule." },
      { name: "BFF", category: "Architecture", years: 3, note: "40k requests a day through the Sellers backend-for-frontend." },
      { name: "Distributed systems", category: "Architecture", years: 3, note: "Async processing, idempotency, failure paths." },
      { name: "Monorepos", category: "Architecture", years: 2, note: "Nx and Turborepo across multi-app products." },

      { name: "Azure", category: "Cloud & DevOps", years: 1, note: "Production deployment, identity and networking." },
      { name: "Kubernetes · AKS", category: "Cloud & DevOps", years: 1, note: "Workload deployment and security policies." },
      { name: "Terraform", category: "Cloud & DevOps", years: 1, note: "Infrastructure as code, reviewed like code." },
      { name: "Docker", category: "Cloud & DevOps", years: 3, note: "Local parity and build pipelines." },
      { name: "CI/CD", category: "Cloud & DevOps", years: 3, note: "Azure DevOps and GitHub Actions, with approval gates." },
      { name: "Key Vault · Managed identities", category: "Cloud & DevOps", years: 1, note: "Secrets that never touch a repo." },

      { name: "Claude Code", category: "AI Engineering", years: 1, note: "Multi-agent orchestration in daily work." },
      { name: "Spec-Driven Development", category: "AI Engineering", years: 1, note: "The method I wrote, teach and coach." },
      { name: "Azure OpenAI", category: "AI Engineering", years: 1, note: "Document extraction inside payroll onboarding." },
      { name: "OpenAI", category: "AI Engineering", years: 2, note: "Applied AI features with measurable outcomes." },

      { name: "Jest", category: "Quality", years: 4, note: "Unit suites on every service." },
      { name: "Vitest", category: "Quality", years: 2, note: "Faster feedback on frontend packages." },
      { name: "Playwright", category: "Quality", years: 1, note: "End-to-end regression guarding complete flows." },
      { name: "Datadog", category: "Quality", years: 2, note: "Production observability and alerting." },
      { name: "OpenSearch", category: "Quality", years: 2, note: "Log search when something is already on fire." },
    ],
  },

  origins: {
    eyebrow: "06 / origins",
    title: "How it started",
    intro:
      "Not a straight line. A kid with a hand-me-down computer, a failed attempt, and then one class that made everything click.",
    entries: [
      {
        id: "o-2011",
        year: "2011",
        title: "The first computer",
        body: "My first computer arrived when I was twelve. Like most kids, I used it for Minecraft. Nothing about that suggested a career.",
        photo: { src: "/origins-photo-1.webp", alt: "Nahuel as a child" },
      },
      {
        id: "o-2015",
        year: "2015",
        title: "Jarvis, and giving up",
        body: "At fifteen I built my own PC and ended up watching a Python tutorial. I wanted my own AI assistant — Jarvis, from Iron Man. I understood almost none of it, and after a while I stopped.",
        photo: { src: "/origins-photo-4.webp", alt: "Childhood photo" },
      },
      {
        id: "o-2018",
        year: "2018–2019",
        title: "Olympiads",
        body: "Mathematics and physics competitions, through to national finals. Years of being handed a problem with no method attached and having to find one. That turned out to be the actual training.",
        photo: { src: "/origins-photo-3.webp", alt: "Childhood photo" },
      },
      {
        id: "o-2021",
        year: "2021",
        title: "The class that clicked",
        body: "A programming class in my final year of school, and a second attempt. This time it landed. I spent hours helping classmates debug their C — the missing semicolon, the off-by-one — and taught myself a GUI library for a course that only asked for two while loops.",
      },
      {
        id: "o-2022",
        year: "2022",
        title: "First job, first semester",
        body: "I enrolled in Computer Engineering and had a job by my first semester. What started as a kid playing games became a career spent on systems that other people depend on.",
        photo: { src: "/present-photo-2.webp", alt: "Nahuel pair programming at Kovix" },
      },
      {
        id: "o-2024",
        year: "2023–2026",
        title: "Warehouses, and what software costs",
        body: "Three years on warehouse systems, including time on site in a hard hat. When your code stops, physical goods stop. It changes how you think about a deploy.",
        photo: { src: "/present-photo-3.webp", alt: "Nahuel on site at a warehouse" },
      },
      {
        id: "o-2026",
        year: "2026",
        title: "Teaching the method",
        body: "Now I lead AI engineering enablement: writing the method, coaching teams through it, and keeping the human gate where it belongs.",
        photo: { src: "/present-photo-4.webp", alt: "Nahuel working with a teammate" },
      },
    ],
  },

  proof: {
    eyebrow: "07 / proof",
    title: "Achievements",
    intro:
      "Certifications, degrees and a decade of mathematics and physics competitions. The olympiads are older than the code, and they are the reason I like problems that don't come with a method attached.",
    counterLabel: "unlocked",
    filters: [
      { id: "all", label: "All" },
      { id: "certification", label: "Certifications" },
      { id: "olympiad", label: "Olympiads" },
      { id: "degree", label: "Education" },
    ],
    items: [
      { id: "a-eng", title: "Computer Engineering — 4th year", issuer: "University of Morón", year: "2022–", kind: "degree", rarity: "epic" },
      { id: "a-analyst", title: "Computer Systems Analyst — completed", issuer: "University of Morón", year: "2025", kind: "degree", rarity: "epic" },
      { id: "a-scholar", title: "Merit scholarship — GPA above 8.5", issuer: "University of Morón", year: "2022–", kind: "degree", rarity: "rare" },
      { id: "a-tech", title: "Electromechanical Technician", issuer: "Colegio Emaús", year: "2021", kind: "degree", rarity: "common" },

      { id: "a-efset", title: "EF SET English — C2 Proficient", issuer: "EF Education First", year: "2026", kind: "certification", rarity: "legendary" },
      { id: "a-arch-applied", title: "Applied Software Architecture", issuer: "Platzi", year: "2026", kind: "certification", rarity: "rare" },
      { id: "a-arch-fund-26", title: "Software Architecture Fundamentals", issuer: "Platzi", year: "2026", kind: "certification", rarity: "common" },
      { id: "a-liceo-7", title: "Advanced English — Level 7", issuer: "Liceo Cultural Británico", year: "2025", kind: "certification", rarity: "rare" },
      { id: "a-liceo-6", title: "Advanced English — Level 6", issuer: "Liceo Cultural Británico", year: "2025", kind: "certification", rarity: "common" },
      { id: "a-arch-fund-23", title: "Software Architecture Fundamentals", issuer: "Platzi", year: "2023", kind: "certification", rarity: "common" },
      { id: "a-eng-fund", title: "Software Engineering Fundamentals", issuer: "Platzi", year: "2023", kind: "certification", rarity: "common" },
      { id: "a-fcc", title: "Responsive Web Design", issuer: "freeCodeCamp", year: "2022", kind: "certification", rarity: "common" },

      { id: "a-oaf", title: "National finalist — Physics Olympiad, Games category", issuer: "OAF Argentina", year: "2019", kind: "olympiad", rarity: "legendary" },
      { id: "a-mateclubes-18", title: "National runner-up — Mateclubes", issuer: "OMA Argentina", year: "2018", kind: "olympiad", rarity: "legendary" },
      { id: "a-lit-math", title: "National finalist — Literature & Mathematics", issuer: "OMA Argentina", year: "2018", kind: "olympiad", rarity: "epic" },
      { id: "a-mateclubes-17", title: "National finalist — Mateclubes", issuer: "OMA Argentina", year: "2017", kind: "olympiad", rarity: "epic" },
      { id: "a-oma-19", title: "Metropolitan round — Mathematics Olympiad", issuer: "OMA Argentina", year: "2019", kind: "olympiad", rarity: "rare" },
      { id: "a-oma-18", title: "Metropolitan round — Mathematics Olympiad", issuer: "OMA Argentina", year: "2018", kind: "olympiad", rarity: "rare" },
      { id: "a-emat-sci-19", title: "Champion — Scientific Challenges", issuer: "Colegio Emaús", year: "2019", kind: "olympiad", rarity: "rare" },
      { id: "a-emat-3-19", title: "Champion — Third round", issuer: "Colegio Emaús", year: "2019", kind: "olympiad", rarity: "common" },
      { id: "a-emat-2-19", title: "Champion — Second round", issuer: "Colegio Emaús", year: "2019", kind: "olympiad", rarity: "common" },
      { id: "a-emat-1-19", title: "Runner-up — First round", issuer: "Colegio Emaús", year: "2019", kind: "olympiad", rarity: "common" },
      { id: "a-emat-sci-18", title: "Champion — Scientific Challenges", issuer: "Colegio Emaús", year: "2018", kind: "olympiad", rarity: "rare" },
      { id: "a-emat-2-18", title: "Champion — Second round", issuer: "Colegio Emaús", year: "2018", kind: "olympiad", rarity: "common" },
      { id: "a-emat-3r-18", title: "Second runner-up — Third round", issuer: "Colegio Emaús", year: "2018", kind: "olympiad", rarity: "common" },
      { id: "a-emat-1r-18", title: "Second runner-up — First round", issuer: "Colegio Emaús", year: "2018", kind: "olympiad", rarity: "common" },
      { id: "a-emat-17", title: "Champion — Ematemática", issuer: "Colegio Emaús", year: "2017", kind: "olympiad", rarity: "rare" },
    ],
  },

  contact: {
    eyebrow: "08 / contact",
    title: "Let's talk",
    body:
      "I'm open to remote and international roles where the problems are hard enough to be interesting and the team cares how things are built. Based in Buenos Aires, working across time zones already.",
    primary: { label: "Send an email", href: "mailto:nahuelgamail@gmail.com" },
    copyLabel: "copy address",
    copiedLabel: "copied",
    localTimeLabel: "local time",
  },

  footer: {
    builtWith: "Built with",
    stack: "Next.js · React · TypeScript · Tailwind · WebGL · GSAP",
    repo: "Source",
    note: "No client system screenshots. Every diagram on this site was drawn for it.",
  },

  ui: {
    commandPalette: {
      open: "Menu",
      placeholder: "Jump to a section, or type a command…",
      empty: "Nothing matches that.",
      groups: { navigate: "Navigate", actions: "Actions" },
      switchLocale: "Ver en español",
      downloadCv: "Download CV",
      close: "Close",
    },
    localeLabel: "ES",
    menu: "Menu",
    sections: [
      { id: "hero", label: "Top" },
      { id: "telemetry", label: "Telemetry" },
      { id: "work", label: "Work" },
      { id: "lab", label: "Lab" },
      { id: "method", label: "Method" },
      { id: "arsenal", label: "Arsenal" },
      { id: "origins", label: "Origins" },
      { id: "proof", label: "Proof" },
      { id: "contact", label: "Contact" },
    ],
  },
}
