import type { ReactNode } from "react"
import { PlateSources, deferredPlate, plateSrcSet, sceneAsset } from "@/features/film"

type ChapterIllustrationProps = {
  asset: string
  // portrait version shown on phones, when one exists
  tallAsset?: string
  // a version cut for this place (a 4:5 side panel, a 21:9 band) used instead of `asset` when its file exists
  fittedAsset?: string
  // the cover: fetched first, at the highest priority, in AVIF where the browser takes it
  eager?: boolean
  // drawn only from the desktop layout up: below it the plate is hidden, so it is never fetched
  wideOnly?: boolean
  // how wide the illustration is drawn, for the copy the browser picks
  sizes?: string
  className?: string
  children?: ReactNode
}

// the tall plate serves phones and every portrait screen below the desktop layout (a tablet held upright)
export const PHONE = "(max-width: 700px), (max-width: 1099px) and (orientation: portrait)"

// The cover's plate as served: the tall plate on a phone, the wide one elsewhere, each in AVIF with WebP as the fallback.
// The opening title prints the same copies, and the layout preloads them, so the cover is fetched once.
export function CoverPicture({ wide, tall, sizes = "100vw" }: { wide: string; tall?: string; sizes?: string }) {
  return (
    <>
      {tall && <source media={PHONE} type="image/avif" srcSet={plateSrcSet(tall, "avif")} sizes={sizes} />}
      {tall && <source media={PHONE} srcSet={plateSrcSet(tall) ?? `/film/${tall}.webp`} sizes={sizes} />}
      <source type="image/avif" srcSet={plateSrcSet(wide, "avif")} sizes={sizes} />
    </>
  )
}

// One scene of the case file: the full-bleed illustration with its edges faded into the page, and the copy laid over it.
// An illustration that is not delivered leaves no element: the scene closes around its copy.
export function ChapterIllustration({ asset, tallAsset, fittedAsset, eager, wideOnly, sizes = "100vw", className, children }: ChapterIllustrationProps) {
  const wideId = fittedAsset && sceneAsset(fittedAsset, "webp") ? fittedAsset : sceneAsset(asset, "webp") ? asset : undefined
  const tallId = tallAsset && sceneAsset(tallAsset, "webp") ? tallAsset : undefined

  return (
    <div data-scene="" data-has-art={wideId ? "" : undefined} className={`scene ${className ?? ""}`}>
      {wideId && (
        <div data-illustration="" data-asset={asset} aria-hidden="true" className={wideOnly ? "scene-art scene-art-wide" : "scene-art"}>
          {eager ? (
            <picture>
              <CoverPicture wide={wideId} tall={tallId} sizes={sizes} />
              <img src={`/film/${wideId}.webp`} srcSet={plateSrcSet(wideId)} sizes={sizes} alt="" fetchPriority="high" decoding="async" />
            </picture>
          ) : (
            <picture>
              {tallId && <PlateSources id={tallId} media={PHONE} sizes={sizes} />}
              <PlateSources id={wideId} sizes={sizes} />
              <img {...deferredPlate(wideId, sizes)} alt="" decoding="async" />
            </picture>
          )}
        </div>
      )}
      {children && <div className="scene-copy">{children}</div>}
    </div>
  )
}
