import { experience, identity, offer, projects } from "@/features/portfolio/presentation/content"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nawi.dev"

export const revalidate = 3600

export async function GET() {
  const content = [
    `# ${identity.professionalName}`,
    "",
    `> ${identity.professionalName} (known as Nawi) is a ${identity.role} based in ${identity.base}, Argentina. ${identity.promise}`,
    "",
    "## Links",
    "",
    `- [Portfolio](${siteUrl}/): projects, experience and offer`,
    `- [Machine-readable profile](${siteUrl}/portfolio.json): the same content as structured JSON`,
    `- [GitHub](${identity.github})`,
    `- [LinkedIn](${identity.linkedin})`,
    "",
    "## Offer",
    "",
    `- ${offer.freelance.title}: ${offer.freelance.line}`,
    `- ${offer.tpm.title}: ${offer.tpm.line} ${offer.tpm.detail}`,
    "",
    "## Projects",
    "",
    ...projects.map((project) => `- ${project.name}: ${project.what}`),
    "",
    "## Experience",
    "",
    ...experience.map((employer) => `- ${employer.name}: ${employer.what}`),
    "",
    `Contact: ${identity.email}`,
  ].join("\n")

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
