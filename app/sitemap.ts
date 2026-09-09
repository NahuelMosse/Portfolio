import type { MetadataRoute } from "next"
import { PATHS, SITE_URL } from "@/lib/metadata"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const abs = (path: string) => new URL(path, SITE_URL).toString()

  // Same source as the canonical/hreflang pair in buildMetadata, so the sitemap
  // can never drift from the tags on the page.
  const languages = { en: abs(PATHS.en), es: abs(PATHS.es) }

  return [
    {
      url: abs(PATHS.en),
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages },
    },
    {
      url: abs(PATHS.es),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages },
    },
  ]
}
