import { sceneAsset } from "./scene-asset"
import { SceneMedia } from "./scene-media"

// The still, with its loop when delivered, behind the name. Without the files it is the graded dark field of the stage.
export function ColdOpenBackdrop() {
  return (
    <SceneMedia
      asset="pf-cover-16x9"
      poster={sceneAsset("pf-cover-16x9", "webp")}
      tallPoster={sceneAsset("pf-cover-9x16", "webp")}
      video={sceneAsset("pf-cover-loop", "mp4")}
      tallVideo={sceneAsset("pf-cover-loop-9x16", "mp4")}
      className="cover-media"
    />
  )
}
