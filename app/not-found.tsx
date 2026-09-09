import type { Metadata } from "next"
import Link from "next/link"
import { Bricolage_Grotesque, Geist, JetBrains_Mono } from "next/font/google"
import { getContent } from "@/lib/content"
import { DEFAULT_LOCALE } from "@/lib/content/types"
import "./globals.css"

/**
 * A real 404.
 *
 * The previous version redirected every miss to `/`, which returns 200 for a
 * URL that does not exist — Google reads that as a soft 404 and it hides
 * genuinely broken links from anyone auditing the site.
 *
 * This file sits outside `app/[locale]`, which has no layout above it, so it
 * carries its own document shell and fonts.
 */

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "wdth"],
})

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" })

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-code",
  display: "swap",
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "404 — Nahuel Mosse",
  robots: { index: false, follow: true },
}

export default function NotFound() {
  const content = getContent(DEFAULT_LOCALE)

  return (
    <html
      lang={DEFAULT_LOCALE}
      data-palette="lime"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="antialiased">
        <main className="flex min-h-[100svh] items-center bg-bg">
          <div className="reticle pointer-events-none absolute inset-0 opacity-20" />
          <div className="shell relative">
            <p className="mono text-accent">404</p>
            <h1 className="mt-4 max-w-[14ch] text-3xl md:text-4xl">
              This route does not exist.
            </h1>
            <p className="mt-5 max-w-[48ch] text-lg text-fg-dim">
              Nothing is served at this address. Everything worth reading is on
              the home page.
            </p>
            <Link
              href="/"
              className="mono mt-8 inline-flex items-center gap-3 border border-accent bg-accent px-6 py-3.5 text-accent-ink transition-colors hover:bg-transparent hover:text-accent"
            >
              {content.identity.name}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}
