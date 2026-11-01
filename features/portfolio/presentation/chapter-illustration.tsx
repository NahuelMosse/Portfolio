import type { ReactNode } from "react"
import { sceneAsset } from "@/features/film"

type ChapterIllustrationProps = {
  asset: string
  // portrait version shown on phones, when one exists
  tallAsset?: string
  // a version cut for this place (a 4:5 side panel, a 21:9 band) used instead of `asset` when its file exists
  fittedAsset?: string
  eager?: boolean
  className?: string
  children?: ReactNode
}

const PHONE = "(max-width: 700px)"

// One scene of the case file: the full-bleed illustration with its edges faded into the page, and the copy laid over it.
// An illustration that is not delivered leaves no element: the scene closes around its copy.
export function ChapterIllustration({ asset, tallAsset, fittedAsset, eager, className, children }: ChapterIllustrationProps) {
  const wide = (fittedAsset && sceneAsset(fittedAsset, "webp")) || sceneAsset(asset, "webp")
  const tall = tallAsset ? sceneAsset(tallAsset, "webp") : undefined

  return (
    <div data-scene="" data-has-art={wide ? "" : undefined} className={`scene ${className ?? ""}`}>
      {wide && (
        <div data-illustration="" data-asset={asset} aria-hidden="true" className="scene-art">
          <picture>
            {tall && <source media={PHONE} srcSet={tall} />}
            <img src={wide} alt="" loading={eager ? "eager" : "lazy"} decoding="async" />
          </picture>
        </div>
      )}
      {children && <div className="scene-copy">{children}</div>}
    </div>
  )
}
