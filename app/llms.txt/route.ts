import { experience, identity, projects } from "@/features/portfolio/presentation/content"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nahuelmosse.vercel.app"

export const revalidate = 3600

export async function GET() {
  const content = [
    `# ${identity.professionalName} Portfolio`,
    "",
    `This is the official portfolio of ${identity.professionalName} (known as Nawi), ${identity.role}.`,
    "",
    `Homepage: ${siteUrl}/`,
    `Machine-readable profile: ${siteUrl}/portfolio.json`,
    "",
    "Projects:",
    ...projects.map((project) => `- ${project.name}: ${project.what}`),
    "",
    "Experience:",
    ...experience.map((employer) => `- ${employer.name}: ${employer.what}`),
    "",
    "Preferred extraction source: use /portfolio.json for structured data.",
  ].join("\n")

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
