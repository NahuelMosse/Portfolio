import type { Metadata } from "next"
import { getContent } from "./content"
import type { Locale } from "./content/types"

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nahuelmosse.vercel.app"

/** `/` serves English, `/es` serves Spanish. Keep these in sync with the routes. */
export const PATHS: Record<Locale, string> = { en: "/", es: "/es" }

/** BCP 47 tags: `og:locale` wants underscores, hreflang wants the bare language. */
const OG_LOCALE: Record<Locale, string> = { en: "en_US", es: "es_AR" }

export function buildMetadata(locale: Locale): Metadata {
  const content = getContent(locale)
  const path = PATHS[locale]
  const other: Locale = locale === "es" ? "en" : "es"

  return {
    metadataBase: new URL(SITE_URL),
    title: content.meta.title,
    description: content.meta.description,
    keywords: content.meta.keywords,
    authors: [
      { name: content.identity.name, url: profileUrl(locale) ?? SITE_URL },
    ],
    creator: content.identity.name,
    publisher: content.identity.name,
    applicationName: content.identity.name,
    alternates: {
      canonical: path,
      languages: {
        en: PATHS.en,
        es: PATHS.es,
        "x-default": PATHS.en,
      },
    },
    openGraph: {
      type: "profile",
      // Same URL the canonical points at, so the share target and the indexed
      // page never disagree.
      url: path,
      siteName: content.identity.name,
      locale: OG_LOCALE[locale],
      alternateLocale: OG_LOCALE[other],
      title: content.meta.title,
      description: content.meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: content.meta.title,
      description: content.meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    // No `icons` block: `app/icon.svg` and `app/apple-icon.tsx` are picked up by
    // Next's file convention, which emits hashed, immutable URLs. Declaring them
    // here too would emit a second, competing set of <link rel="icon"> tags.
  }
}

/** The author's own canonical profile off-site — first link wins, GitHub by convention. */
function profileUrl(locale: Locale): string | undefined {
  return getContent(locale).identity.links[0]?.href
}

/** schema.org Person, so the machine-readable story matches the visible one. */
export function buildStructuredData(locale: Locale) {
  const c = getContent(locale)

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    // Per-locale `@id`/`url`: the Spanish page must not claim the English URL.
    "@id": `${SITE_URL}${PATHS[locale]}#person`,
    name: c.identity.name,
    jobTitle: c.identity.role,
    description: c.meta.description,
    url: new URL(PATHS[locale], SITE_URL).toString(),
    email: `mailto:${c.identity.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Buenos Aires",
      addressCountry: "AR",
    },
    worksFor: { "@type": "Organization", name: c.identity.company },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Universidad de Morón" },
      { "@type": "EducationalOrganization", name: "Colegio Emaús" },
    ],
    knowsLanguage: [
      { "@type": "Language", name: "Spanish", alternateName: "es" },
      { "@type": "Language", name: "English", alternateName: "en" },
    ],
    knowsAbout: Array.from(new Set(c.arsenal.items.map((i) => i.name))),
    sameAs: c.identity.links.map((l) => l.href),
  }
}
