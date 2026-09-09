/**
 * Content contract.
 *
 * Both locales are typed against `PortfolioContent`, so a missing or renamed
 * field in one language breaks the build instead of shipping a half-translated
 * page. Every user-visible string on the site comes from here.
 */

export const LOCALES = ["en", "es"] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = "en"

/** Accent identity a section stamps on <html data-palette>. */
export type Palette =
  | "lime"
  | "amber"
  | "nordic"
  | "violet"
  | "green"
  | "cyan"
  | "grit"

/** One node in a hand-drawn flow diagram. */
export interface FlowNode {
  id: string
  label: string
  /** Short annotation shown under the node on hover/focus. */
  detail?: string
}

export interface Metric {
  id: string
  /** Numeric part, already formatted for display. */
  value: string
  /**
   * How the value should be typeset. A "claim" is a qualitative phrase and
   * must not get the display-size numeral treatment — otherwise an adjective
   * ends up shouting louder than the case study it belongs to.
   */
  kind?: "number" | "claim"
  /** Marks the one metric a reader should leave with. Exactly one per set. */
  featured?: boolean
  /** Unit or qualifier rendered next to the value. */
  unit?: string
  label: string
  /** Where the number comes from — keeps the claim honest. */
  source: string
  /** Anchors the metric to a work panel. */
  projectId?: string
  /** 0–1 samples for the sparkline. Shape only, never presented as real data. */
  shape?: number[]
}

export interface WorkProject {
  id: string
  client: string
  title: string
  role: string
  period: string
  /** Sits under the title — one line, no fluff. */
  summary: string
  /** Two or three short paragraphs. */
  body: string[]
  stack: string[]
  palette: Palette
  logo?: string
  headline: Metric
  flow: {
    title: string
    nodes: FlowNode[]
  }
}

export interface LabProject {
  id: string
  title: string
  tagline: string
  body: string[]
  stack: string[]
  stats: { value: string; label: string }[]
  palette: Palette
  media?: {
    poster: string
    video?: string
    shots: { src: string; alt: string }[]
  }
}

export interface SmallProject {
  id: string
  title: string
  year: string
  description: string
  stack: string[]
  repo?: string
  demo?: string
}

export interface ArsenalItem {
  name: string
  category: string
  /** Years of hands-on use — drives the level meter. */
  years: number
  note: string
}

export interface TimelineEntry {
  id: string
  year: string
  title: string
  body: string
  photo?: { src: string; alt: string }
}

export interface Achievement {
  id: string
  title: string
  issuer: string
  year: string
  kind: "certification" | "olympiad" | "degree"
  rarity: "common" | "rare" | "epic" | "legendary"
}

export interface PortfolioContent {
  meta: {
    title: string
    description: string
    keywords: string[]
  }

  identity: {
    name: string
    role: string
    company: string
    location: string
    timezone: string
    email: string
    availability: string
    links: { label: string; href: string }[]
  }

  boot: {
    lines: string[]
    skip: string
  }

  hero: {
    eyebrow: string
    headline: string[]
    statement: string
    ticker: string[]
    scrollCue: string
    paletteHint: string
  }

  telemetry: {
    eyebrow: string
    title: string
    intro: string
    metrics: Metric[]
    footnote: string
  }

  work: {
    eyebrow: string
    title: string
    intro: string
    projects: WorkProject[]
    dragHint: string
  }

  lab: {
    eyebrow: string
    title: string
    intro: string
    projects: LabProject[]
    smallTitle: string
    small: SmallProject[]
  }

  method: {
    eyebrow: string
    title: string
    intro: string
    steps: { id: string; title: string; body: string }[]
    outro: string
  }

  arsenal: {
    eyebrow: string
    title: string
    intro: string
    categories: string[]
    items: ArsenalItem[]
    legend: string
  }

  origins: {
    eyebrow: string
    title: string
    intro: string
    entries: TimelineEntry[]
  }

  proof: {
    eyebrow: string
    title: string
    intro: string
    counterLabel: string
    filters: { id: string; label: string }[]
    items: Achievement[]
  }

  contact: {
    eyebrow: string
    title: string
    body: string
    primary: { label: string; href: string }
    copyLabel: string
    copiedLabel: string
    localTimeLabel: string
  }

  footer: {
    builtWith: string
    stack: string
    repo: string
    note: string
  }

  ui: {
    commandPalette: {
      open: string
      placeholder: string
      empty: string
      groups: { navigate: string; actions: string }
      switchLocale: string
      downloadCv: string
      close: string
    }
    localeLabel: string
    menu: string
    sections: { id: string; label: string }[]
  }
}
