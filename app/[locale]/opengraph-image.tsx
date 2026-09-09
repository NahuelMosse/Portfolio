import { ImageResponse } from "next/og"
import { getContent } from "@/lib/content"
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/content/types"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
/**
 * Next reads `alt` once per module, not per generated param, so it cannot vary
 * by locale the way the image itself does — the default locale's title is the
 * closest honest description of what the card renders.
 */
export const alt = getContent(DEFAULT_LOCALE).meta.title

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

/**
 * Share card.
 *
 * Satori has no WebGL, so the field is suggested rather than rendered: a
 * hairline grid plus the same acid accent and monospace readouts the page uses.
 * It reads as the same object without pretending to be a screenshot.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const typed = (LOCALES as readonly string[]).includes(locale)
    ? (locale as Locale)
    : "en"
  const content = getContent(typed)

  const accent = "#c3ff3d"
  const bg = "#0e1116"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: bg,
          padding: "64px 72px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: `linear-gradient(to right, #23293422 1px, transparent 1px), linear-gradient(to bottom, #23293422 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 420,
            height: 420,
            background: `radial-gradient(circle at 70% 30%, ${accent}22 0%, transparent 65%)`,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 16, height: 16, background: accent, display: "flex" }} />
          <div
            style={{
              color: "#9aa3b2",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {content.identity.location}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#f7f8fa",
              fontSize: 128,
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: -5,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>NAHUEL</span>
            <span>MOSSE</span>
          </div>
          <div
            style={{
              marginTop: 26,
              color: accent,
              fontSize: 26,
              letterSpacing: 2,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {content.identity.role}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 44,
            borderTop: "1px solid #232934",
            paddingTop: 26,
            color: "#9aa3b2",
            fontSize: 24,
            letterSpacing: 1,
          }}
        >
          <span>40M+ ops</span>
          <span>40k req / day</span>
          <span>7h48m → 46m</span>
        </div>
      </div>
    ),
    size,
  )
}
