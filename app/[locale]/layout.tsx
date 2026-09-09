import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import { Bricolage_Grotesque, Geist, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/content/types"
import { buildMetadata } from "@/lib/metadata"
import "../globals.css"

/**
 * Locale lives in the route segment rather than in a request header.
 *
 * An earlier version read `headers()` here to set `<html lang>`, which opted
 * the whole tree into dynamic rendering. This shape keeps `lang` correct in the
 * served HTML *and* lets both locales prerender: `/` is rewritten to `/en` by
 * middleware, so the public URLs stay `/` and `/es`.
 */

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  // No `weight`: loading the variable face gives the full wght range plus the
  // optical-size axis, which is what keeps the huge hero type from looking
  // like a scaled-up body font.
  axes: ["opsz", "wdth"],
})

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})

/** Everything that reads as data — readouts, labels, metrics — uses this. */
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-code",
  display: "swap",
  weight: ["400", "500", "700"],
})

/**
 * Since Next 15 `themeColor` and `colorScheme` are rejected inside `Metadata`
 * and must be exported here instead. The page ships one palette — dark, with
 * only a local inversion inside the "grit" section — so a single value keeps
 * the browser chrome from flashing a mismatched bar on load. `#12151b` is the
 * computed `--bg` token from globals.css.
 */
export const viewport: Viewport = {
  themeColor: "#12151b",
  colorScheme: "dark",
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) {
    // Unreachable while `dynamicParams` is false, but a page without a title is
    // worse than a redundant guard — and an unknown segment is not indexable.
    return { ...buildMetadata(DEFAULT_LOCALE), robots: { index: false, follow: false } }
  }
  return buildMetadata(locale)
}

function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <html
      lang={locale}
      data-palette="lime"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="antialiased">
        {children}
        {process.env.VERCEL_ENV ? <Analytics /> : null}
      </body>
    </html>
  )
}
