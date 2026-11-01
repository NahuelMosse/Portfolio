import { sceneAsset } from "./scene-asset"
import { SceneMedia } from "./scene-media"

// The desk and the evidence wall, with the lamp loop when delivered, behind the name. Without the files it is the graded dark field.
export function ColdOpenBackdrop() {
  return (
    <SceneMedia
      asset="pf-desk-16x9"
      poster={sceneAsset("pf-desk-16x9", "webp")}
      tallPoster={sceneAsset("pf-desk-9x16", "webp")}
      video={sceneAsset("pf-cover-loop", "mp4")}
      tallVideo={sceneAsset("pf-cover-loop-9x16", "mp4")}
      className="cover-media"
    />
  )
}
