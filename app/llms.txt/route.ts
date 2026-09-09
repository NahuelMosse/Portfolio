import { getLlmsText } from "@/lib/machine-readable"

export const revalidate = 3600

export async function GET() {
  return new Response(getLlmsText("en"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
