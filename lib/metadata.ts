import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nawi.dev"

export function generatePageMetadata({
  title,
  description,
  path = "",
}: {
  title: string
  description: string
  path?: string
}): Metadata {
  const url = `${siteUrl}${path}`
  
  return {
    title: `${title} | Nahuel Mosse`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | Nahuel Mosse`,
      description,
      url,
      siteName: "Nahuel Mosse Portfolio",
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Nahuel Mosse`,
      description,
      creator: "@NahuelMosse",
    },
  }
}
