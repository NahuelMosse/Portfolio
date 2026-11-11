// The words of the page. Professional name stays Nahuel Mosse; the hero speaks as Nawi.

export const identity = {
  mark: "NAWI",
  professionalName: "Nahuel Mosse",
  promise: "I design, build and lead digital products, and I put AI to work for them.",
  role: "Technical Lead · Technical Project Manager",
  base: "Buenos Aires",
  knownFor: "designing, building and leading digital products",
  email: "contact@nahuelmosse.com",
  github: "https://github.com/NahuelMosse",
  linkedin: "https://linkedin.com/in/nahuelmosse",
} as const

export type Link = { label: string; href: string }

export type Story = {
  id: string
  name: string
  what: string
  problem: string
  role: string
}

// A real piece of work: a screen, a photo or a capture of a live page.
export type Piece =
  | { kind: "screen" | "photo"; frame: ScreenFrame; src: string; alt: string; caption: string }
  | { kind: "capture"; frame: ScreenFrame; video: string; poster: string; alt: string; caption: string }

// What the piece is shown in: an app screen in a phone frame, a web page in a browser frame.
export type ScreenFrame = "phone" | "browser"

// A tool has no device: its illustration, its stack and its links are shown instead.
export type DeviceKind = ScreenFrame | "tool"

export type Project = Story & {
  line: string
  stack: readonly string[]
  links: readonly Link[]
  pieces: readonly Piece[]
}
export type Employer = Story & { title: string; period: string; current?: boolean; logo?: string }

const screen = (frame: ScreenFrame, src: string, alt: string, caption: string): Piece => ({
  kind: "screen",
  frame,
  src: `/film/pieces/${src}.webp`,
  alt,
  caption,
})

export const projects: readonly Project[] = [
  {
    id: "grit",
    name: "Grit",
    what: "A local-first training app for Android and iOS, built in Flutter with Riverpod and SQLite.",
    problem: "Training logs need to work in a gym with no signal and still feel instant.",
    role: "I rebuilt it from its specs, end to end: product, design and code.",
    line: "Specified with Spec Kit; AI agents wrote the code against the specs.",
    stack: ["Flutter", "Riverpod", "SQLite"],
    links: [],
    pieces: [
      screen("phone", "grit-hoy", "Grit's Today screen with the active training session", "Today"),
      screen("phone", "grit-ejercicio", "Grit's exercise detail with a 60 kg record", "Exercise detail"),
      screen("phone", "grit-progreso", "Grit's progress screen with its charts", "Progress"),
      screen("phone", "grit-completado", "Grit's summary of the completed session", "Workout complete"),
    ],
  },
  {
    id: "guardia",
    name: "Triaje",
    what: "A browser game about ER triage, published on itch.io.",
    problem: "Deciding who gets treated first under pressure is hard to explain, but easy to play.",
    role: "I designed the rules and built the game.",
    line: "Built with Claude Code; its trailers and ads made with AI.",
    stack: ["Browser game", "itch.io"],
    links: [{ label: "Play Triaje", href: "https://nahuelmosse.itch.io/triaje" }],
    pieces: [
      screen("browser", "triaje-page", "The Triaje page on itch.io at desktop width", "Triaje on itch.io"),
      screen("browser", "triaje-chart", "A patient's intake chart in Triaje, with triage level 3 picked", "Intake chart"),
      screen("browser", "triaje-room", "Triaje's waiting room on the first shift, with its drawn patients", "Waiting room"),
      screen("phone", "triaje-mobile", "Triaje's first screen on a phone: the shift map with its Start the shift button", "Triaje on itch.io, on a phone"),
      screen("phone", "triaje-chart-390", "A patient's intake chart in Triaje on a phone", "Intake chart, on a phone"),
      screen("phone", "triaje-room-390", "Triaje's waiting room on a phone", "Waiting room, on a phone"),
    ],
  },
  {
    id: "motion-audit",
    name: "motion-audit",
    what: "Checks that a website moves the way it should: every button responds when pressed, and nothing stutters.",
    problem: "A site can look fine in a screenshot and still feel broken to use.",
    role: "I built it and published it for other developers to use.",
    line: "It watches the real page in a real browser, frame by frame, and reports what feels wrong.",
    stack: ["Node.js", "Playwright", "Claude Code skill"],
    links: [
      { label: "npm", href: "https://www.npmjs.com/package/motion-audit" },
      { label: "GitHub", href: "https://github.com/NahuelMosse/motion-audit" },
    ],
    pieces: [],
  },
  {
    id: "http-attack",
    name: "http-attack",
    what: "Attacks your back end the way a hacker would, before a real one does.",
    problem: "Most security holes live in the cases nobody thought to test.",
    role: "I built it and published it for other developers to use.",
    line: "It tries bad input, request floods and other users' accounts, then reports what broke and how serious it is.",
    stack: ["Node.js", "No runtime dependencies", "Claude Code skill"],
    links: [
      { label: "npm", href: "https://www.npmjs.com/package/http-attack" },
      { label: "GitHub", href: "https://github.com/NahuelMosse/http-attack" },
    ],
    pieces: [],
  },
  {
    id: "migrations-safe",
    name: "migrations-safe",
    what: "Tests database changes on a copy before they touch the real one.",
    problem: "One careless change to a database can lose customer data or stop a running business.",
    role: "I built it and published it for other developers to use.",
    line: "It checks the change, then runs it on a copy of the data first, on every major database.",
    stack: ["Node.js", "SQL", "Claude Code skill"],
    links: [
      { label: "npm", href: "https://www.npmjs.com/package/migrations-safe" },
      { label: "GitHub", href: "https://github.com/NahuelMosse/migrations-safe" },
    ],
    pieces: [],
  },
  {
    id: "cebador",
    name: "Cebador",
    what: "The website of a fictional canned yerba mate soda brand, as a design concept.",
    problem: "A new brand needs an identity that is felt before it is read.",
    role: "I did the art direction, the motion and the code.",
    line: "Built with Claude Code agents; every behavior is covered by a test.",
    stack: ["Landing site", "Motion", "GitHub Pages"],
    links: [{ label: "Visit the site", href: "https://nahuelmosse.github.io/cebador-landing/" }],
    pieces: [
      {
        kind: "capture",
        frame: "browser",
        video: "/film/pieces/cebador-1280.webm",
        poster: "/film/pieces/cebador-1280-poster.webp",
        alt: "The Cebador site scrolling at desktop width",
        caption: "Live",
      },
      {
        kind: "capture",
        frame: "phone",
        video: "/film/pieces/cebador-390.webm",
        poster: "/film/pieces/cebador-390-poster.webp",
        alt: "The Cebador site scrolling on a phone",
        caption: "Live, on a phone",
      },
      screen("browser", "cebador-sabor-1280", "The Cebador site's flavor scene, the can over its origin, at desktop width", "Flavor"),
      screen("browser", "cebador-tienda-1280", "The Cebador site's shop at desktop width", "Shop"),
      screen("phone", "cebador-sabor-390", "The Cebador site's flavor scene on a phone", "Flavor, on a phone"),
      screen("phone", "cebador-tienda-390", "The Cebador site's shop on a phone", "Shop, on a phone"),
    ],
  },
  {
    id: "sonria",
    name: "Sonría",
    what: "A one-page website for a fictional neighborhood dental clinic in Buenos Aires.",
    problem: "A dental clinic's site has to help someone with a toothache right away and let them book without calling.",
    role: "I did the design, the copy and the code.",
    line: "Built with Claude Code agents; every behavior is covered by a test.",
    stack: ["HTML, CSS, JS", "Playwright", "GitHub Pages"],
    links: [
      { label: "Visit the site", href: "https://nahuelmosse.github.io/sonria/" },
      { label: "Repository", href: "https://github.com/NahuelMosse/sonria" },
    ],
    pieces: [
      screen("browser", "sonria-hero-1440", "The Sonría site's first screen at desktop width, with the urgency card", "Home"),
      screen("browser", "sonria-tratamientos-1440", "The Sonría site's treatments with indicative prices at desktop width", "Treatments"),
      screen("browser", "sonria-equipo-1440", "The Sonría site's team section at desktop width, with the office", "Team"),
      screen("phone", "sonria-hero-390", "The Sonría site's first screen on a phone, with the urgency by WhatsApp", "Home, on a phone"),
      screen("phone", "sonria-tratamientos-390", "The Sonría site's treatments on a phone", "Treatments, on a phone"),
      screen("phone", "sonria-equipo-390", "The Sonría site's team section on a phone", "Team, on a phone"),
    ],
  },
  {
    id: "miga",
    name: "Miga",
    what: "The website of a fictional sourdough bakery in Buenos Aires.",
    problem: "A bakery's site has to show today's bread and let people order ahead for pickup.",
    role: "I did the design, the copy and the code.",
    line: "Built with Claude Code agents; every behavior is covered by a test.",
    stack: ["HTML, CSS, JS", "Playwright", "GitHub Pages"],
    links: [
      { label: "Visit the site", href: "https://nahuelmosse.github.io/miga/" },
      { label: "Repository", href: "https://github.com/NahuelMosse/miga" },
    ],
    pieces: [
      screen("browser", "miga-hero-1440", "The Miga site's first screen at desktop width, over a sourdough loaf", "Home"),
      screen("browser", "miga-lista-1440", "The Miga site's list of the day's bread with prices at desktop width", "Today's bread"),
      screen("browser", "miga-local-1440", "The Miga site's shop address and hours at desktop width", "The shop"),
      screen("phone", "miga-hero-390", "The Miga site's first screen on a phone", "Home, on a phone"),
      screen("phone", "miga-lista-390", "The Miga site's list of the day's bread on a phone", "Today's bread, on a phone"),
      screen("phone", "miga-local-390", "The Miga site's shop address on a phone", "The shop, on a phone"),
    ],
  },
  {
    id: "club",
    name: "ClubNahuelMosse",
    what: "A Flutter app with a REST API for booking sports courts.",
    problem: "Booking a court over text messages is slow, and double bookings happen.",
    role: "I built the app and the API.",
    line: "Specs first, then Claude Code agents.",
    stack: ["Flutter", "REST API"],
    links: [{ label: "Repository", href: "https://github.com/NahuelMosse/ClubNahuelMosse" }],
    pieces: [
      screen("phone", "club-inicio", "ClubNahuelMosse home screen with the day's bookings", "Home"),
      screen("phone", "club-sedes", "ClubNahuelMosse venue list", "Venues"),
      screen("phone", "club-cancha", "ClubNahuelMosse court page with its photo", "Court"),
      screen("phone", "club-listo", "ClubNahuelMosse reservation confirmed", "Booked"),
    ],
  },
]

// The projects are told in chapters by kind; inside one, the visitor picks the project with a click.
export type ProjectGroup = { id: string; label: string; noun: string; line: string; projects: readonly string[] }

export const groups: readonly ProjectGroup[] = [
  { id: "apps", label: "Apps", noun: "app", line: "Mobile products I design, build and ship end to end.", projects: ["grit", "club"] },
  { id: "landings", label: "Websites", noun: "website", line: "Live websites that sell a product in a single scroll.", projects: ["cebador", "sonria", "miga"] },
  { id: "game", label: "Game", noun: "game", line: "A playable idea, built and published.", projects: ["guardia"] },
  {
    id: "tools",
    label: "Tools",
    noun: "tool",
    line: "Three npm packages I wrote, each one also a Claude Code skill.",
    projects: ["motion-audit", "http-attack", "migrations-safe"],
  },
]

export const experience: readonly Employer[] = [
  {
    id: "smart-warehousing",
    name: "Smart Warehousing",
    title: "AI Engineering Enablement Lead / SDD Coach",
    period: "09/2026 – Present",
    current: true,
    what: "Warehouse engineering teams adopting AI-assisted development.",
    problem: "Each team used AI agents its own way, with no shared method and no review of their output.",
    role: "I lead AI enablement across the teams: the method, the training and hands-on coaching.",
  },
  {
    id: "grupo-st",
    name: "Grupo ST",
    title: "Technical Lead",
    period: "08/2026 – Present",
    current: true,
    what: "A credit risk platform that manages loan documents and approvals, delivered AI-first.",
    problem: "Approving a loan meant passing paperwork by hand from person to person.",
    role: "As technical lead, I set the architecture and run delivery on specs and tests.",
  },
  {
    id: "visma",
    name: "Visma",
    title: "Technical Lead",
    period: "01/2026 – Present",
    current: true,
    logo: "/logo-visma.webp",
    what: "A payroll onboarding product for a Nordic software company.",
    problem: "Onboarding a new payroll customer took too long and relied on manual steps.",
    role: "I'm the client's main technical contact: scope, architecture, security, cloud and mentoring.",
  },
  {
    id: "fravega",
    name: "Frávega",
    title: "Senior Full Stack Developer",
    period: "06/2023 – 01/2026",
    logo: "/logo-fravega.webp",
    what: "The warehouse system behind a major retailer's online orders.",
    problem: "Packing orders and handing them off to the sorter was slow and error-prone.",
    role: "I built the order flow and the seller portal, and planned the critical releases.",
  },
  {
    id: "justo",
    name: "Jüsto",
    title: "Senior Full Stack Developer",
    period: "11/2022 – 12/2023",
    logo: "/logo-justo.webp",
    what: "A multi-warehouse system for an online supermarket.",
    problem: "Inventory lived in spreadsheets and people's heads across distribution centers.",
    role: "I designed the system, coordinated the team and kept it stable through peak sales.",
  },
]

export const offer = {
  freelance: {
    title: "Freelance",
    line: "Digital products and websites with a visual identity of their own, from design to launch.",
    detail: "I handle the whole product myself: design, code and launch. Everything above is my own work.",
    door: "Let’s talk about your project",
    subject: "Freelance project · Nahuel Mosse",
    prompts: ["What are you building, and for whom?", "What should it look and feel like?", "When do you need the first version?"],
  },
  tpm: {
    title: "Technical Project Manager",
    line: "For companies: I lead teams that ship with AI under human review, and I still write code.",
    detail:
      "AI-first delivery: Spec-Driven Development, agents orchestrated with Claude Code, every requirement traced to a test, and every pull request reviewed by a person.",
    door: "Bring AI-first delivery to your team",
    subject: "Technical Project Manager role · Nahuel Mosse",
    prompts: ["What does your team deliver today?", "Where does delivery slow down?", "Who reviews the AI-assisted work?"],
  },
} as const

// The email a door opens: its own subject and its three prompts as the body.
export const doorHref = ({ subject, prompts }: { subject: string; prompts: readonly string[] }) => {
  const body = prompts.map((prompt, index) => `${index + 1}. ${prompt}`).join("\n")
  return `mailto:${identity.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export type CreditItem = { text: string; logo?: string; mark?: { src: string; ratio: number } }

export const credits: { studies: readonly CreditItem[]; certifications: readonly CreditItem[] } = {
  studies: [
    { text: "Associate Degree in Computer Science · Universidad de Morón · 2025", logo: "/logo-UM.webp" },
    { text: "Technical High School Diploma, Electromechanics · Colegio Emaús · 2021", logo: "/logo-emaus.webp" },
  ],
  certifications: [
    { text: "EF SET C2 Proficient", mark: { src: "/logos/efset.svg", ratio: 103 / 24 } },
    { text: "English Level 8 · Liceo Cultural Británico", logo: "/logo-liceo-cultural-britanico.webp" },
    { text: "Applied Software Architecture · Platzi", mark: { src: "/logos/platzi.svg", ratio: 1 } },
  ],
}
