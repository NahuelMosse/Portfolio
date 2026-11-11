import { plateSrcSet } from "./plate"

type PlateSourcesProps = { id: string; media?: string; sizes: string }

// The copies of a deferred plate for one layout, AVIF first and WebP as the fallback, left for PlateLoader to fetch. Without a
// media query they serve the picture's own image, so the AVIF goes ahead of its WebP <img>.
export function PlateSources({ id, media, sizes }: PlateSourcesProps) {
  const avif = plateSrcSet(id, "avif")
  return (
    <>
      {avif && <source media={media} type="image/avif" data-srcset={avif} sizes={sizes} />}
      {media && <source media={media} data-srcset={plateSrcSet(id) ?? `/film/${id}.webp`} sizes={sizes} />}
    </>
  )
}
