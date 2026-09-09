import { notFound } from "next/navigation"
import { Portfolio } from "@/components/portfolio"
import { getContent } from "@/lib/content"
import { LOCALES, type Locale } from "@/lib/content/types"
import { buildStructuredData } from "@/lib/metadata"

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

/** Nothing here reads request state, so both locales prerender at build time. */
export const dynamicParams = false

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!(LOCALES as readonly string[]).includes(locale)) notFound()

  const typed = locale as Locale
  const content = getContent(typed)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // `<` is escaped so a stray "</script>" in any content string cannot
          // close the block early and inject markup into the page.
          __html: JSON.stringify(buildStructuredData(typed)).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <Portfolio content={content} locale={typed} />
    </>
  )
}
