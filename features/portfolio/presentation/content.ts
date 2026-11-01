// The words of the page. Professional name stays Nahuel Mosse; the hero speaks as Nawi.

export const identity = {
  mark: "NAWI",
  professionalName: "Nahuel Mosse",
  greeting: "I'm Nawi.",
  promise: "I design, build and lead digital products, and I put AI to work for them.",
  role: "Technical Lead · Technical Project Manager",
  base: "Buenos Aires",
  guild: "Consultora Kovix",
  skills: ["Product architecture", "Full-stack delivery", "AI-assisted engineering", "Technical leadership"],
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

export type Project = Story & { links: readonly Link[] }
export type Employer = Story & { period: string; current?: boolean }

export const projects: readonly Project[] = [
  {
    id: "dev-kit",
    name: "The card is the specification",
    what: "A development kit where the requirement is frozen as a card and every behavior is proven by tests tagged to it.",
    problem: "Work built with AI agents drifts from what was asked, and nobody can tell which part was verified.",
    role: "I designed the method, the guards and the tools, and published the skills that stand alone.",
    links: [
      { label: "motion-audit", href: "https://github.com/NahuelMosse/motion-audit" },
      { label: "http-attack", href: "https://github.com/NahuelMosse/http-attack" },
      { label: "migrations-safe", href: "https://github.com/NahuelMosse/migrations-safe" },
    ],
  },
  {
    id: "grit",
    name: "Grit",
    what: "A local-first training app for Android and iOS, built in Flutter with Riverpod and SQLite.",
    problem: "Training logs need to work in a gym with no signal and still feel instant.",
    role: "I rebuilt it from its specs, end to end: product, design lab and code.",
    links: [],
  },
  {
    id: "guardia",
    name: "Guardia",
    what: "A triage game for the browser, published as Triaje.",
    problem: "Deciding who is treated first under pressure is hard to explain and easy to play.",
    role: "I designed the rules and built the game.",
    links: [{ label: "Play Triaje", href: "https://nahuelmosse.itch.io/triaje" }],
  },
  {
    id: "cebador",
    name: "Cebador",
    what: "The site of a fictional canned mate soda brand, a design piece.",
    problem: "A new brand needs an identity that is felt before it is read.",
    role: "I did the art direction, the motion and the code.",
    links: [{ label: "Visit the site", href: "https://nahuelmosse.github.io/cebador-landing/" }],
  },
  {
    id: "club",
    name: "ClubNahuelMosse",
    what: "A Flutter app with a REST API to book sports courts.",
    problem: "Booking a court by message is slow and double bookings happen.",
    role: "I built the app and the API.",
    links: [{ label: "Repository", href: "https://github.com/NahuelMosse/ClubNahuelMosse" }],
  },
]

export const experience: readonly Employer[] = [
  {
    id: "smart-warehousing",
    name: "Smart Warehousing",
    period: "Current",
    current: true,
    what: "A set of warehouse teams adopting AI-assisted development.",
    problem: "Each team used agents its own way, with no shared method and no review of what they produced.",
    role: "I lead the engineering enablement: the method, the training and the coaching of the teams.",
  },
  {
    id: "grupo-st",
    name: "Grupo ST",
    period: "Current",
    what: "A credit risk platform that manages documents and decisions.",
    problem: "Approving a credit meant moving papers by hand between people.",
    role: "As technical lead I set the architecture and run an AI-first delivery with specifications and tests.",
  },
  {
    id: "visma",
    name: "Visma",
    period: "Current",
    what: "A payroll onboarding product for a Nordic software company.",
    problem: "Setting up a new payroll customer took too long and depended on manual steps.",
    role: "I am the customer's technical contact: scope, architecture, security, cloud and mentoring.",
  },
  {
    id: "fravega",
    name: "Frávega",
    period: "Past",
    what: "The warehouse system of a large retailer's online orders.",
    problem: "Packing orders and handing them to the sorter was slow and fragile.",
    role: "I built the order flow and the seller interface, and planned the critical releases.",
  },
  {
    id: "justo",
    name: "Jüsto",
    period: "Past",
    what: "A multi-warehouse system for an online supermarket.",
    problem: "Inventory lived in spreadsheets and informal knowledge across distribution centers.",
    role: "I designed the system, coordinated the team and kept it steady through the sales peaks.",
  },
]

export const offer = {
  freelance: {
    title: "Freelance",
    line: "Digital products and sites with a visual identity of their own, built fast.",
    subject: "Freelance project · Nahuel Mosse",
  },
  tpm: {
    title: "Technical Project Manager",
    line: "Teams that deliver with AI under human review, led by someone who still codes.",
    subject: "Technical Project Manager role · Nahuel Mosse",
  },
} as const

export const credits = {
  studies: [
    "Analista en Informática · Universidad de Morón · 2025",
    "Técnico Electromecánico · Colegio Emaús · 2021",
  ],
  certifications: [
    "EF SET C2 Proficient",
    "Arquitectura de Software Aplicada · Platzi",
    "Fundamentos de Arquitectura de Software · Platzi 2026",
    "Liceo Cultural Británico · Nivel 7",
    "Liceo Cultural Británico · Nivel 6",
    "Fundamentos de Arquitectura de Software · Platzi 2023",
    "Fundamentos de Ingeniería de Software · Platzi",
    "Responsive Web Design · freeCodeCamp",
  ],
} as const
