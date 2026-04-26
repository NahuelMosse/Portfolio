import { NextResponse } from "next/server"
import { getPortfolioPayload } from "@/lib/machine-readable"

export const revalidate = 3600

export async function GET() {
  return NextResponse.json(getPortfolioPayload(), {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
