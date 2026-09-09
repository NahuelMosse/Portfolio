import type { MetadataRoute } from "next"
import { getContent } from "@/lib/content"
import { DEFAULT_LOCALE } from "@/lib/content/types"

export default function manifest(): MetadataRoute.Manifest {
  // A web app manifest is a single document with no locale segment, so it can
  // only speak one language — the default one, same as `/`.
  const content = getContent(DEFAULT_LOCALE)

  return {
    id: "/",
    name: content.meta.title,
    short_name: content.identity.name,
    description: content.meta.description,
    lang: DEFAULT_LOCALE,
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#12151b",
    // Matches the `viewport.themeColor` exported from app/[locale]/layout.tsx.
    theme_color: "#12151b",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  }
}
