import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/metadata"

export default function robots(): MetadataRoute.Robots {
  return {
    // Everything published here is meant to be indexed, including the
    // machine-readable /llms.txt and /portfolio.json.
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
