import { SceneMedia } from "./scene-media"
import { sceneAsset } from "./scene-asset"

type SeamFigureProps = {
  side: "left" | "right"
  // the chapter whose top edge this photo of him crosses
  toward: string
  // id of the photo of him, delivered by the owner
  asset: string
  // names the two photos that tie the chapters together; the front crop that stands on the first seam leaves it out
  photo?: "close-crop" | "profile"
}

// A real photo of him standing on the seam between two chapters: half over the chapter above, half over the one below.
export function SeamFigure({ side, toward, asset, photo }: SeamFigureProps) {
  return (
    <div data-seam-figure="" data-seam-photo={photo} data-side={side} data-toward={toward} className="seam-figure" aria-hidden="true">
      <SceneMedia asset={asset} poster={sceneAsset(asset, "webp")} className="seam-media" />
    </div>
  )
}
