// The words of the page. Professional name stays Nahuel Mosse; the hero speaks as Nawi.

export const identity = {
  mark: "NAWI",
  professionalName: "Nahuel Mosse",
  greeting: "I'm Nawi.",
  promise: "I design, build and lead digital products, and I put AI to work for them.",
  role: "Technical Lead · Technical Project Manager",
  base: "Buenos Aires",
  knownFor: "designing, building and leading digital products",
  email: "nahuelgamail@gmail.com",
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
  | { kind: "screen" | "photo"; frame: ScreenFrame; src: string; alt: string; caption: string; whole?: true }
  | { kind: "capture"; frame: ScreenFrame; video: string; poster: string; alt: string; caption: string }

// What the piece is shown in: an app screen in a phone frame, a web page in a browser frame.
export type ScreenFrame = "phone" | "browser"

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

// A screen whose frame takes the capture's own ratio, so it is shown whole.
const wholeScreen = (frame: ScreenFrame, src: string, alt: string, caption: string): Piece => ({
  kind: "screen",
  frame,
  src: `/film/pieces/${src}.webp`,
  alt,
  caption,
  whole: true,
})

export const projects: readonly Project[] = [
  {
    id: "dev-kit",
    name: "The card is the specification",
    what: "A development kit where the requirement is frozen as a card and every behavior is proven by tests tagged to it.",
    problem: "Work built with AI agents drifts from what was asked, and nobody can tell which part was verified.",
    role: "I designed the method, the guards and the tools, and published the skills that stand alone.",
    line: "Claude Code agents build each card; hooks and tests keep them honest.",
    stack: ["Node.js", "Playwright", "Claude Code"],
    links: [
      { label: "motion-audit", href: "https://github.com/NahuelMosse/motion-audit" },
      { label: "http-attack", href: "https://github.com/NahuelMosse/http-attack" },
      { label: "migrations-safe", href: "https://github.com/NahuelMosse/migrations-safe" },
    ],
    // its lead and its pieces are drawn by code (kit-diagram, kit-piece), not captured
    pieces: [],
  },
  {
    id: "grit",
    name: "Grit",
    what: "A local-first training app for Android and iOS, built in Flutter with Riverpod and SQLite.",
    problem: "Training logs need to work in a gym with no signal and still feel instant.",
    role: "I rebuilt it from its specs, end to end: product, design lab and code.",
    line: "Specified with Spec Kit; AI agents wrote the code against the specs.",
    stack: ["Flutter", "Riverpod", "SQLite"],
    links: [],
    pieces: [
      screen("phone", "grit-hoy", "Grit's Hoy screen with the active training session", "Today"),
      screen("phone", "grit-serie", "Grit's set entry screen, with 80 kg typed in", "Logging a set"),
      screen("phone", "grit-descanso", "Grit's rest timer counting down between sets", "Rest timer"),
      screen("phone", "grit-completado", "Grit's summary of the completed session", "Session summary"),
      screen("phone", "grit-ejercicio", "Grit's exercise detail with a 60 kg record", "Exercise detail"),
    ],
  },
  {
    id: "guardia",
    name: "Guardia",
    what: "A triage game for the browser, published as Triaje.",
    problem: "Deciding who is treated first under pressure is hard to explain and easy to play.",
    role: "I designed the rules and built the game.",
    line: "Built with Claude Code; its trailers and ads made with AI.",
    stack: ["Browser game", "itch.io"],
    links: [{ label: "Play Triaje", href: "https://nahuelmosse.itch.io/triaje" }],
    pieces: [
      screen("browser", "triaje-title", "The title screen of the Triaje game", "Title screen"),
      screen("browser", "triaje-play-2", "A shift of Triaje in play, with the waiting room open", "In play"),
      screen("browser", "triaje-page", "The Triaje page on itch.io at desktop width", "Triaje on itch.io"),
      screen("browser", "triaje-scrolled", "The Triaje page on itch.io, further down", "Further down the page"),
      wholeScreen("phone", "triaje-mobile", "The Triaje page on itch.io on a phone", "On a phone"),
    ],
  },
  {
    id: "cebador",
    name: "Cebador",
    what: "The site of a fictional canned mate soda brand, a design piece.",
    problem: "A new brand needs an identity that is felt before it is read.",
    role: "I did the art direction, the motion and the code.",
    line: "Built with my dev kit: Claude Code agents, every behavior tested.",
    stack: ["Landing site", "Motion", "GitHub Pages"],
    links: [{ label: "Visit the site", href: "https://nahuelmosse.github.io/cebador-landing/" }],
    pieces: [
      {
        kind: "capture",
        frame: "browser",
        video: "/film/pieces/cebador-1280.webm",
        poster: "/film/pieces/cebador-1280-poster.webp",
        alt: "The Cebador site scrolling at desktop width",
        caption: "Live, at 1280",
      },
      {
        kind: "capture",
        frame: "phone",
        video: "/film/pieces/cebador-390.webm",
        poster: "/film/pieces/cebador-390-poster.webp",
        alt: "The Cebador site scrolling on a phone",
        caption: "Live, at 390",
      },
      screen("browser", "cebador-s2-1280", "The Cebador site's origin section at desktop width", "Origin, at 1280"),
      screen("browser", "cebador-s3-1280", "The Cebador site's reviews section at desktop width", "Reviews, at 1280"),
      screen("phone", "cebador-s2-390", "The Cebador site's origin section on a phone", "Origin, at 390"),
    ],
  },
  {
    id: "sonria",
    name: "Sonría",
    what: "The one-page site of a fictional neighborhood dental clinic in Caballito.",
    problem: "A clinic site has to answer a toothache at once and let people book without calling.",
    role: "I did the design, the copy and the code.",
    line: "Built with my dev kit: Claude Code agents, every behavior tested.",
    stack: ["HTML, CSS, JS", "Playwright", "GitHub Pages"],
    links: [
      { label: "Visit the site", href: "https://nahuelmosse.github.io/sonria/" },
      { label: "Repository", href: "https://github.com/NahuelMosse/sonria" },
    ],
    pieces: [
      screen("browser", "sonria-hero-1440", "The Sonría site's first screen at desktop width, with the urgency card", "Home"),
      screen("browser", "sonria-tratamientos-1440", "The Sonría site's treatments with indicative prices at desktop width", "Treatments"),
      screen("browser", "sonria-turno-1440", "The Sonría site's four-step appointment at desktop width", "Appointment"),
      screen("phone", "sonria-hero-390", "The Sonría site's first screen on a phone, with the urgency by WhatsApp", "Home, at 390"),
      screen("phone", "sonria-tratamientos-390", "The Sonría site's treatments on a phone", "Treatments, at 390"),
      screen("phone", "sonria-turno-390", "The Sonría site's appointment on a phone", "Appointment, at 390"),
    ],
  },
  {
    id: "miga",
    name: "Miga",
    what: "The site of a fictional sourdough bakery in Villa Crespo.",
    problem: "A bakery site has to show today's bread and let people order for pickup.",
    role: "I did the design, the copy and the code.",
    line: "Built with my dev kit: Claude Code agents, every behavior tested.",
    stack: ["HTML, CSS, JS", "Playwright", "GitHub Pages"],
    links: [
      { label: "Visit the site", href: "https://nahuelmosse.github.io/miga/" },
      { label: "Repository", href: "https://github.com/NahuelMosse/miga" },
    ],
    pieces: [
      screen("browser", "miga-hero-1440", "The Miga site's first screen at desktop width, over a sourdough loaf", "Home"),
      screen("browser", "miga-lista-1440", "The Miga site's list of the day's bread with prices at desktop width", "Today's bread"),
      screen("browser", "miga-pedir-1440", "The Miga site's order-to-pickup steps at desktop width", "How to order"),
      screen("phone", "miga-hero-390", "The Miga site's first screen on a phone", "Home, at 390"),
      screen("phone", "miga-lista-390", "The Miga site's list of the day's bread on a phone", "Today's bread, at 390"),
      screen("phone", "miga-pedir-390", "The Miga site's order-to-pickup steps on a phone", "How to order, at 390"),
    ],
  },
  {
    id: "club",
    name: "ClubNahuelMosse",
    what: "A Flutter app with a REST API to book sports courts.",
    problem: "Reserving a court by message is slow and double reservations happen.",
    role: "I built the app and the API.",
    line: "Built with my dev kit: specs first, then Claude Code agents.",
    stack: ["Flutter", "REST API"],
    links: [{ label: "Repository", href: "https://github.com/NahuelMosse/ClubNahuelMosse" }],
    pieces: [
      screen("phone", "club-login", "ClubNahuelMosse login screen", "Login"),
      screen("phone", "club-sedes", "ClubNahuelMosse venue list", "Venues"),
      screen("phone", "club-horarios", "ClubNahuelMosse court schedule", "Schedule"),
      screen("phone", "club-listo", "ClubNahuelMosse reservation confirmed", "Booked"),
    ],
  },
]

// The projects are told in chapters by kind; inside one, the visitor picks the project with a click.
export type ProjectGroup = { id: string; label: string; noun: string; line: string; projects: readonly string[] }

export const groups: readonly ProjectGroup[] = [
  { id: "apps", label: "Apps", noun: "app", line: "Mobile products I design, build and ship end to end.", projects: ["grit", "club"] },
  { id: "landings", label: "Landings", noun: "landing", line: "Live sites that sell a product in one scroll.", projects: ["cebador", "sonria", "miga"] },
  { id: "game", label: "Game", noun: "game", line: "A playable idea, shipped and published.", projects: ["guardia"] },
  { id: "dev-kit", label: "Dev kit", noun: "dev kit", line: "The tools I wrote to build the rest with proof.", projects: ["dev-kit"] },
]

export const experience: readonly Employer[] = [
  {
    id: "smart-warehousing",
    name: "Smart Warehousing",
    title: "AI Engineering Enablement Lead / SDD Coach",
    period: "09/2026 – Present",
    current: true,
    what: "A set of warehouse teams adopting AI-assisted development.",
    problem: "Each team used agents its own way, with no shared method and no review of what they produced.",
    role: "I lead the engineering enablement: the method, the training and the coaching of the teams.",
  },
  {
    id: "grupo-st",
    name: "Grupo ST",
    title: "Technical Lead",
    period: "08/2026 – Present",
    current: true,
    what: "An AI-first delivery on a credit risk platform that manages documents and decisions.",
    problem: "Approving a credit meant moving papers by hand between people.",
    role: "As technical lead I set the architecture and run the delivery with specifications and tests.",
  },
  {
    id: "visma",
    name: "Visma",
    title: "Technical Lead",
    period: "01/2026 – Present",
    current: true,
    logo: "/logo-visma.webp",
    what: "A payroll onboarding product for a Nordic software company.",
    problem: "Setting up a new payroll customer took too long and depended on manual steps.",
    role: "I am the customer's technical contact: scope, architecture, security, cloud and mentoring.",
  },
  {
    id: "fravega",
    name: "Frávega",
    title: "Senior Full Stack Developer",
    period: "06/2023 – 01/2026",
    logo: "/logo-fravega.webp",
    what: "The warehouse system of a large retailer's online orders.",
    problem: "Packing orders and handing them to the sorter was slow and fragile.",
    role: "I built the order flow and the seller interface, and planned the critical releases.",
  },
  {
    id: "justo",
    name: "Jüsto",
    title: "Senior Full Stack Developer",
    period: "11/2022 – 12/2023",
    logo: "/logo-justo.webp",
    what: "A multi-warehouse system for an online supermarket.",
    problem: "Inventory lived in spreadsheets and informal knowledge across distribution centers.",
    role: "I designed the system, coordinated the team and kept it steady through the sales peaks.",
  },
]

export const offer = {
  freelance: {
    title: "Freelance",
    line: "Freelance builds of digital products and sites with a visual identity of their own, from design to launch.",
    detail: "I build the whole product myself, design, code and launch, and the pieces above are what I already built.",
    door: "Hire me for a project",
    subject: "Freelance project · Nahuel Mosse",
    prompts: ["What are you building, and for whom?", "What should it look and feel like?", "When do you need the first version?"],
  },
  tpm: {
    title: "Technical Project Manager",
    line: "For companies: Technical Project Manager of teams that deliver with AI under human review, led by someone who still codes.",
    detail:
      "AI-first delivery: Spec-Driven Development, agents orchestrated with Claude Code, every requirement traced to a test and reviewed by a person on each pull request.",
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

export type CreditItem ={ text: string; logo?: string }

export const credits: { studies: readonly CreditItem[]; certifications: readonly CreditItem[] } = {
  studies: [
    { text: "Analista en Informática · Universidad de Morón · 2025", logo: "/logo-UM.webp" },
    { text: "Técnico Electromecánico · Colegio Emaús · 2021", logo: "/logo-emaus.webp" },
  ],
  certifications: [
    { text: "EF SET C2 Proficient" },
    { text: "Arquitectura de Software Aplicada · Platzi" },
    { text: "Fundamentos de Arquitectura de Software · Platzi 2026" },
    { text: "Liceo Cultural Británico · Nivel 8", logo: "/logo-liceo-cultural-britanico.webp" },
    { text: "Liceo Cultural Británico · Nivel 7", logo: "/logo-liceo-cultural-britanico.webp" },
    { text: "Liceo Cultural Británico · Nivel 6", logo: "/logo-liceo-cultural-britanico.webp" },
    { text: "Fundamentos de Arquitectura de Software · Platzi 2023" },
    { text: "Fundamentos de Ingeniería de Software · Platzi" },
    { text: "Responsive Web Design · freeCodeCamp" },
  ],
}
