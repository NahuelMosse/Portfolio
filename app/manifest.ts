import type { MetadataRoute } from "next"
import { identity } from "@/features/portfolio/presentation/content"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${identity.professionalName} | ${identity.role}`,
    short_name: identity.professionalName,
    description: identity.promise,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  }
}
