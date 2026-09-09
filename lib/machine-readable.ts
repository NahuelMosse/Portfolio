import { getContent } from "./content"
import type { Locale } from "./content/types"
import { SITE_URL } from "./metadata"

/**
 * The same story the page tells, in a shape a machine can read.
 *
 * Everything here derives from `lib/content` — there is no second source of
 * truth to drift out of sync with what a human actually sees.
 */
export function getPortfolioPayload(locale: Locale = "en") {
  const c = getContent(locale)

  return {
    $schema: "https://schema.org/Person",
    generatedAt: new Date().toISOString(),
    locale,
    url: SITE_URL,
    alternates: { en: `${SITE_URL}/`, es: `${SITE_URL}/es` },

    person: {
      name: c.identity.name,
      role: c.identity.role,
      company: c.identity.company,
      location: c.identity.location,
      email: c.identity.email,
      availability: c.identity.availability,
      links: c.identity.links,
      summary: c.meta.description,
    },

    highlights: c.telemetry.metrics.map((m) => ({
      id: m.id,
      value: `${m.value}${m.unit ? ` ${m.unit}` : ""}`,
      label: m.label,
      source: m.source,
      project: m.projectId ?? null,
    })),

    experience: c.work.projects.map((p) => ({
      id: p.id,
      client: p.client,
      title: p.title,
      role: p.role,
      period: p.period,
      summary: p.summary,
      detail: p.body,
      stack: p.stack,
      headline: {
        value: p.headline.value,
        label: p.headline.label,
        source: p.headline.source,
      },
      process: p.flow.nodes.map((n) => n.label),
    })),

    projects: [
      ...c.lab.projects.map((p) => ({
        id: p.id,
        title: p.title,
        tagline: p.tagline,
        detail: p.body,
        stack: p.stack,
        stats: p.stats,
        url: null as string | null,
      })),
      ...c.lab.small.map((p) => ({
        id: p.id,
        title: p.title,
        tagline: p.description,
        detail: [] as string[],
        stack: p.stack,
        stats: [] as { value: string; label: string }[],
        url: p.repo ?? p.demo ?? null,
      })),
    ],

    method: {
      summary: c.method.intro,
      steps: c.method.steps.map((s) => ({ title: s.title, detail: s.body })),
    },

    skills: c.arsenal.items.map((item) => ({
      name: item.name,
      category: item.category,
      years: item.years,
      context: item.note,
    })),

    achievements: c.proof.items.map((a) => ({
      title: a.title,
      issuer: a.issuer,
      year: a.year,
      kind: a.kind,
    })),

    notes: [
      "No client system screenshots are published on this site.",
      "Every process diagram was drawn for this site and depicts a generic domain flow.",
    ],
  }
}

/** Plain-text index for crawlers and LLMs. */
export function getLlmsText(locale: Locale = "en"): string {
  const c = getContent(locale)
  const payload = getPortfolioPayload(locale)

  return [
    `# ${c.identity.name}`,
    "",
    `> ${c.meta.description}`,
    "",
    `${c.identity.role} at ${c.identity.company}. ${c.identity.location}.`,
    c.identity.availability,
    "",
    "## Machine-readable",
    "",
    `- Structured profile: ${SITE_URL}/portfolio.json`,
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
    `- English: ${SITE_URL}/`,
    `- Spanish: ${SITE_URL}/es`,
    "",
    "## Highlights",
    "",
    ...payload.highlights.map((h) => `- ${h.value} — ${h.label} (${h.source})`),
    "",
    "## Experience",
    "",
    ...payload.experience.map(
      (e) => `- ${e.client} — ${e.role}, ${e.period}. ${e.summary}`,
    ),
    "",
    "## Own projects",
    "",
    ...payload.projects.map((p) => `- ${p.title}: ${p.tagline}`),
    "",
    "## Contact",
    "",
    `- Email: ${c.identity.email}`,
    ...c.identity.links.map((l) => `- ${l.label}: ${l.href}`),
    "",
    "## Notes",
    "",
    ...payload.notes.map((n) => `- ${n}`),
    "",
    "Preferred extraction source: /portfolio.json",
  ].join("\n")
}
