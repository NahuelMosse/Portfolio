import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { PRELOADER_SCRIPT, Preloader, type PlateCopies } from "@/features/film/presentation/preloader"
import { mediaUrl, sceneAsset } from "@/features/film"
import { plateSrcSet } from "@/features/film/presentation/plate"
import { PHONE } from "@/features/portfolio/presentation/chapter-illustration"

const TITLE = "Nahuel Mosse | Technical Lead · Technical Project Manager"
const DESCRIPTION =
  "Nahuel Mosse, known as Nawi: Technical Lead and Technical Project Manager who designs, builds and leads digital products with AI. Projects and experience."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: "Nahuel Mosse", url: "https://github.com/NahuelMosse" }],
  creator: "Nahuel Mosse",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nawi.dev"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Nahuel Mosse Portfolio",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }] },
}

// the cover's own copies, in the order its <picture> lists them, so the title prints what the cover shows
function coverCopies(wide: string, tall?: string | false): PlateCopies {
  const sources: PlateCopies["sources"] = []
  const tallAvif = tall && plateSrcSet(tall, "avif")
  const tallWebp = tall && (plateSrcSet(tall) ?? mediaUrl(`/film/${tall}.webp`))
  const wideAvif = plateSrcSet(wide, "avif")
  if (tallAvif) sources.push({ media: PHONE, type: "image/avif", srcSet: tallAvif })
  if (tallWebp) sources.push({ media: PHONE, srcSet: tallWebp })
  if (wideAvif) sources.push({ type: "image/avif", srcSet: wideAvif })
  return { sources, src: mediaUrl(`/film/${wide}.webp`), srcSet: plateSrcSet(wide) }
}

const HAS_MOTION_SCRIPT =
  "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('has-motion')"

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const wide = sceneAsset("ill-cover-16x9", "webp") && "ill-cover-16x9"
  const tall = sceneAsset("ill-cover-9x16", "webp") && "ill-cover-9x16"
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* hidden starting states exist only under .has-motion: set before the first paint, absent for reduced motion and without script */}
        <script dangerouslySetInnerHTML={{ __html: HAS_MOTION_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_SCRIPT }} />
        <link rel="preload" href="/fonts/boska-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/courier-prime-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* the cover, at the copy each screen picks, before anything else in the page asks for an image */}
        {tall && <link rel="preload" as="image" type="image/avif" imageSrcSet={plateSrcSet(tall, "avif")} imageSizes="100vw" media={PHONE} fetchPriority="high" />}
        {wide && <link rel="preload" as="image" type="image/avif" imageSrcSet={plateSrcSet(wide, "avif")} imageSizes="100vw" media={tall ? "(min-width: 701px)" : undefined} fetchPriority="high" />}
      </head>
      <body>
        <Preloader plate={wide ? coverCopies(wide, tall) : undefined} />
        {children}
        {process.env.VERCEL_ENV && <Analytics />}
      </body>
    </html>
  )
}
