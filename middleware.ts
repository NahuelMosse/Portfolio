import { NextResponse, type NextRequest } from "next/server"

/**
 * URL shape: `/` is English, `/es` is Spanish.
 *
 * Internally both live under `app/[locale]`, so `/` is *rewritten* (not
 * redirected) to `/en` — the visitor keeps the clean URL and still gets the
 * prerendered page. `/en` itself redirects to `/` so the two never compete as
 * duplicate content.
 */
/**
 * Metadata assets generated for the English segment.
 *
 * `app/[locale]/opengraph-image.tsx` is served from the real `/en/...` path and
 * referenced by absolute URL in the page's <meta> tags. Redirecting it to a
 * prefix-less path would send every crawler that fetches the share card to a
 * 404, so these are let through untouched.
 */
const EN_METADATA_ASSET = /^\/en\/(opengraph-image|twitter-image|icon|apple-icon)/

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (EN_METADATA_ASSET.test(pathname)) return NextResponse.next()

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/^\/en/, "") || "/"
    return NextResponse.redirect(url, 308)
  }

  if (pathname === "/") {
    const url = request.nextUrl.clone()
    url.pathname = "/en"
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/en", "/en/:path*"],
}
