import { experience, identity, offer, projects } from "@/features/portfolio/presentation/content"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nahuelmosse.vercel.app"

export function getPortfolioPayload() {
  return {
    version: "2.0.0",
    updatedAt: new Date().toISOString(),
    site: { name: "Nahuel Mosse Portfolio", url: siteUrl, language: "en" },
    profile: {
      name: identity.professionalName,
      knownAs: "Nawi",
      role: identity.role,
      location: `${identity.base}, Argentina`,
      email: identity.email,
      summary: identity.promise,
      links: { linkedin: identity.linkedin, github: identity.github },
    },
    projects: projects.map(({ id, name, what, problem, role, links }) => ({ id, name, what, problem, role, links })),
    experience: experience.map(({ id, name, what, problem, role }) => ({ id, name, what, problem, role })),
    offer: [offer.freelance, offer.tpm].map(({ title, line }) => ({ title, line })),
  }
}

export function getStructuredData() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: identity.professionalName,
      alternateName: "Nawi",
      jobTitle: identity.role,
      email: `mailto:${identity.email}`,
      url: siteUrl,
      homeLocation: { "@type": "Place", name: `${identity.base}, Argentina` },
      sameAs: [identity.linkedin, identity.github],
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profile-page`,
      url: siteUrl,
      name: `${identity.professionalName} | ${identity.role}`,
      mainEntity: { "@id": `${siteUrl}/#person` },
      inLanguage: "en",
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${siteUrl}/#projects`,
      name: "Projects",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: project.name,
          description: project.what,
          url: project.links[0]?.href ?? siteUrl,
        },
      })),
    },
  ]
}
