const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nahuelmosse.vercel.app"

export const revalidate = 3600

export async function GET() {
  const content = [
    "# Nahuel Mosse Portfolio",
    "",
    "This is the official portfolio of Nahuel Mosse, Software Engineer (Full Stack).",
    "",
    `Homepage: ${siteUrl}/`,
    `Machine-readable profile: ${siteUrl}/portfolio.json`,
    `Sitemap: ${siteUrl}/sitemap.xml`,
    `Robots: ${siteUrl}/robots.txt`,
    "",
    "Primary topics:",
    "- Professional software engineering experience",
    "- Full-stack development with Node.js, React, TypeScript, PostgreSQL, and NestJS",
    "- Personal projects, education, and certifications",
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
