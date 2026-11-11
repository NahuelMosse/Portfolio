import type { MetadataRoute } from "next"

// AI search and user-fetch agents are named so the policy toward them stays explicit; training crawlers fall under "*".
const SEARCH_AGENTS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
]

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nawi.dev"
  const disallow = ["/api/", "/private/"]

  return {
    rules: [
      { userAgent: SEARCH_AGENTS, allow: "/", disallow },
      { userAgent: "*", allow: "/", disallow },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
