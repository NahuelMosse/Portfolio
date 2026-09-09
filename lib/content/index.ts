import { en } from "./en"
import { es } from "./es"
import { DEFAULT_LOCALE, type Locale, type PortfolioContent } from "./types"

const dictionaries: Record<Locale, PortfolioContent> = { en, es }

export function getContent(locale: Locale): PortfolioContent {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE]
}

/** `/` is English, `/es` is Spanish — no redirects, no locale prefix on the default. */
export function localePath(locale: Locale, hash?: string): string {
  const base = locale === DEFAULT_LOCALE ? "/" : `/${locale}`
  return hash ? `${base}#${hash}` : base
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "es" : "en"
}

export * from "./types"
