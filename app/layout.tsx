import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const TITLE = "Nahuel Mosse | Technical Lead · Technical Project Manager"
const DESCRIPTION =
  "Nahuel Mosse, known as Nawi: Technical Lead and Technical Project Manager who designs, builds and leads digital products with AI. Projects and experience."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: "Nahuel Mosse", url: "https://github.com/NahuelMosse" }],
  creator: "Nahuel Mosse",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nahuelmosse.vercel.app"),
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preload" href="/fonts/boska-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/courier-prime-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        {process.env.VERCEL_ENV && <Analytics />}
      </body>
    </html>
  )
}
