import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { identity } from "@/features/portfolio/presentation/content"

export const shareCardSize = { width: 1200, height: 630 }
export const shareCardAlt = `${identity.professionalName}, ${identity.role}`

// The link preview: the n5 stamp on the ink, with his name, role and promise set beside it.
export async function shareCard() {
  const stamp = await readFile(join(process.cwd(), "public/icon.svg"), "utf8")
  const src = `data:image/svg+xml;base64,${Buffer.from(stamp).toString("base64")}`

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 64, padding: "0 88px", background: "#0a0a0a", color: "#ece6da" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders plain img */}
        <img src={src} width={360} height={360} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1 }}>{identity.professionalName}</div>
          <div style={{ fontSize: 34, color: "#b3201e" }}>{identity.role}</div>
          <div style={{ fontSize: 30, lineHeight: 1.3, opacity: 0.85 }}>{identity.promise}</div>
        </div>
      </div>
    ),
    shareCardSize,
  )
}
