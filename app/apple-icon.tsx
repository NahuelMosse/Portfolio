import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

/**
 * iOS ignores SVG touch icons and renders a blank tile, so the mark from
 * `app/icon.svg` is rasterised here instead. It is inset rather than full-bleed
 * because springboard rounds the corners, which would clip the registration
 * marks sitting in them.
 */
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <path d="M10 10h10M10 10v10" stroke="#c3ff3d" stroke-width="3" fill="none"/>
  <path d="M54 54H44M54 54V44" stroke="#c3ff3d" stroke-width="3" fill="none"/>
  <path d="M20 46V20l24 24V18" stroke="#f7f8fa" stroke-width="6" fill="none" stroke-linecap="square"/>
</svg>`

export default function AppleIcon() {
  const src = `data:image/svg+xml;base64,${Buffer.from(MARK).toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e1116",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={132} height={132} />
      </div>
    ),
    size,
  )
}
