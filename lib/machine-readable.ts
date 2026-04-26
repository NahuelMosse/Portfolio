import { certifications, contact, education, origins, personalInfo, present, projects } from "@/lib/content"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nahuelmosse.vercel.app"
const snapshotDate = new Date().toISOString()

function normalizeText(value: string): string {
  const normalized = value.normalize("NFC").replace(/\uFFFD/g, "")
  const looksMojibake = /[\u00C2\u00C3\u00E2]/.test(normalized)

  if (!looksMojibake) {
    return normalized
  }

  const repaired = Buffer.from(normalized, "latin1").toString("utf8").normalize("NFC")
  const repairedLooksBroken = /[\u00C2\u00C3\u00E2]/.test(repaired)

  return repairedLooksBroken ? normalized : repaired
}

function deepNormalize<T>(value: T): T {
  if (typeof value === "string") {
    return normalizeText(value) as T
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepNormalize(item)) as T
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).map(([key, val]) => [key, deepNormalize(val)])
    return Object.fromEntries(entries) as T
  }

  return value
}

export function getPortfolioPayload() {
  return deepNormalize({
    version: "1.0.0",
    updatedAt: snapshotDate,
    site: {
      name: "Nahuel Mosse Portfolio",
      url: siteUrl,
      language: "en",
    },
    profile: {
      name: personalInfo.name,
      role: personalInfo.role,
      location: personalInfo.location,
      email: personalInfo.email,
      summary: personalInfo.hero.tagline,
      links: {
        linkedin: personalInfo.linkedin,
        github: personalInfo.github,
        gitlab: personalInfo.gitlab,
      },
    },
    sections: {
      origins: {
        title: origins.title,
        paragraphs: origins.paragraphs,
      },
      education: {
        title: education.title,
        intro: education.intro,
        degrees: education.degrees.map((degree) => ({
          id: degree.id,
          title: degree.title,
          institution: degree.institution,
          period: degree.period,
          status: degree.status,
          description: degree.description,
          url: degree.url,
        })),
        conclusion: education.conclusion,
      },
      professionalExperience: projects.professional.items.map((project) => ({
        id: project.id,
        title: project.title,
        period: project.period,
        description: project.description,
        technologies: project.technologies,
        impact: project.impact,
        url: project.url ?? null,
      })),
      personalProjects: projects.personal.items.map((project) => ({
        id: project.id,
        title: project.title,
        period: project.period,
        description: project.description,
        technologies: project.technologies,
        impact: project.impact,
        url: project.url ?? null,
        page: project.page ?? null,
      })),
      certifications: certifications.items.map((item) => ({
        id: item.id,
        title: item.title,
        issuer: item.issuer,
        year: item.year,
        description: item.description,
      })),
      present: {
        title: present.title,
        paragraphs: present.paragraphs,
        interests: present.interests.items,
        conclusion: present.conclusion,
      },
      contact: {
        title: contact.title,
        description: contact.description,
        email: personalInfo.email,
        links: contact.cta.secondary,
      },
    },
  })
}

export function getStructuredData() {
  const professionalAndPersonalProjects = [...projects.professional.items, ...projects.personal.items]

  return deepNormalize([
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: personalInfo.name,
      jobTitle: personalInfo.role,
      email: `mailto:${personalInfo.email}`,
      url: siteUrl,
      homeLocation: {
        "@type": "Place",
        name: personalInfo.location,
      },
      sameAs: [personalInfo.linkedin, personalInfo.github, personalInfo.gitlab],
      knowsAbout: [
        "Node.js",
        "NestJS",
        "React",
        "Next.js",
        "TypeScript",
        "PostgreSQL",
        "API Development",
        "Full Stack Development",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Nahuel Mosse Portfolio",
      description:
        "Software Engineer specializing in full-stack development with Node.js, React, TypeScript, and PostgreSQL.",
      publisher: {
        "@id": `${siteUrl}/#person`,
      },
      inLanguage: "en",
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profile-page`,
      url: siteUrl,
      name: "Nahuel Mosse | Software Engineer Portfolio",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      mainEntity: {
        "@id": `${siteUrl}/#person`,
      },
      description:
        "Portfolio with professional experience, personal projects, education, and certifications.",
      inLanguage: "en",
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${siteUrl}/#projects`,
      name: "Projects",
      itemListElement: professionalAndPersonalProjects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: project.title,
          description: project.description,
          url: project.url ?? ("page" in project ? project.page : undefined) ?? siteUrl,
          keywords: project.technologies.join(", "),
        },
      })),
    },
  ])
}
