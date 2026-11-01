// The words of the page. Professional name stays Nahuel Mosse; the hero speaks as Nawi.

export const identity = {
  mark: "NAWI",
  professionalName: "Nahuel Mosse",
  greeting: "I'm Nawi.",
  promise: "I design, build and lead digital products, and I put AI to work for them.",
  role: "Technical Lead · Technical Project Manager",
  base: "Buenos Aires",
  knownFor: "designing, building and leading digital products",
  offDuty: "Off duty: CS2, Rocket League, Minecraft, Smite, The Witcher 3, Cyberpunk 2077, chess and Formula 1.",
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

// A real piece of work: a screen, a photo, a capture of a live page, or a text frame taken from a real card, test or pull request.
export type Piece =
  | { kind: "screen" | "photo"; frame: ScreenFrame; src: string; alt: string; caption: string; whole?: true }
  | { kind: "capture"; frame: ScreenFrame; video: string; poster: string; alt: string; caption: string }
  | { kind: "card" | "tests" | "pull-request" | "link"; caption: string; lines: readonly string[]; href?: string }

// What the piece is shown in: an app screen in a phone frame, a web page in a browser frame.
export type ScreenFrame = "phone" | "browser"

export type Project = Story & { stack: string; links: readonly Link[]; pieces: readonly Piece[] }
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
    stack: "Node.js · Playwright · Claude Code",
    links: [
      { label: "motion-audit", href: "https://github.com/NahuelMosse/motion-audit" },
      { label: "http-attack", href: "https://github.com/NahuelMosse/http-attack" },
      { label: "migrations-safe", href: "https://github.com/NahuelMosse/migrations-safe" },
    ],
    pieces: [
      {
        kind: "card",
        caption: "A real card: the requirement frozen, one spec per sentence",
        lines: ["PF-1 · S19 · “los primeros 5 segundos son los mas importantes”", "PF-1 · S27 · “para TPM mucho que se usar IA”", "status: proposed"],
      },
      {
        kind: "tests",
        caption: "Its tagged tests, one per spec",
        lines: [
          "@PF-1-S19 by second 5 the name, the offer and a door are in view",
          "@PF-1-S27 the TPM offer and its door name how he delivers with AI",
          "@PF-1-ASM-17 a failed video keeps its poster",
        ],
      },
      {
        kind: "pull-request",
        caption: "A pull request it closed",
        lines: ["motion-audit #7 · ci: a Dependabot update that reaches the package publishes a new version"],
        href: "https://github.com/NahuelMosse/motion-audit/pull/7",
      },
    ],
  },
  {
    id: "grit",
    name: "Grit",
    what: "A local-first training app for Android and iOS, built in Flutter with Riverpod and SQLite.",
    problem: "Training logs need to work in a gym with no signal and still feel instant.",
    role: "I rebuilt it from its specs, end to end: product, design lab and code.",
    stack: "Flutter · Riverpod · SQLite",
    links: [],
    pieces: [
      screen("phone", "grit-today", "Grit, the today screen of a training day", "Today"),
      screen("phone", "grit-live", "Grit, a live training session", "A live session"),
      screen("phone", "grit-progress", "Grit, the progress screen", "Progress"),
      screen("browser", "grit-lab", "Grit design lab, the exercise illustrations", "The design lab"),
    ],
  },
  {
    id: "guardia",
    name: "Guardia",
    what: "A triage game for the browser, published as Triaje.",
    problem: "Deciding who is treated first under pressure is hard to explain and easy to play.",
    role: "I designed the rules and built the game.",
    stack: "Browser game · itch.io",
    links: [{ label: "Play Triaje", href: "https://nahuelmosse.itch.io/triaje" }],
    pieces: [
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
    stack: "Landing site · motion · GitHub Pages",
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
      {
        kind: "link",
        caption: "The live site",
        lines: ["nahuelmosse.github.io/cebador-landing"],
        href: "https://nahuelmosse.github.io/cebador-landing/",
      },
    ],
  },
  {
    id: "club",
    name: "ClubNahuelMosse",
    what: "A Flutter app with a REST API to book sports courts.",
    problem: "Reserving a court by message is slow and double reservations happen.",
    role: "I built the app and the API.",
    stack: "Flutter · REST API",
    links: [{ label: "Repository", href: "https://github.com/NahuelMosse/ClubNahuelMosse" }],
    pieces: [
      screen("phone", "club-login", "ClubNahuelMosse login screen", "Login"),
      screen("phone", "club-sedes", "ClubNahuelMosse venue list", "Venues"),
      screen("phone", "club-horarios", "ClubNahuelMosse court schedule", "Schedule"),
      screen("phone", "club-listo", "ClubNahuelMosse reservation confirmed", "Booked"),
    ],
  },
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
    { text: "Liceo Cultural Británico · Nivel 7", logo: "/logo-liceo-cultural-britanico.webp" },
    { text: "Liceo Cultural Británico · Nivel 6", logo: "/logo-liceo-cultural-britanico.webp" },
    { text: "Fundamentos de Arquitectura de Software · Platzi 2023" },
    { text: "Fundamentos de Ingeniería de Software · Platzi" },
    { text: "Responsive Web Design · freeCodeCamp" },
  ],
}
