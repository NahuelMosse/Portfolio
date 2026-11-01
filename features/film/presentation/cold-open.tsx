import { sceneAsset } from "./scene-asset"
import { SceneMedia } from "./scene-media"

// The desk under the lamp behind the name: with him holding the sealed envelope when that cover is delivered, the empty
// desk and evidence wall otherwise, and the lamp loop when delivered. Without any file it is the graded dark field.
export function ColdOpenBackdrop() {
  const withHim = sceneAsset("pf-cover-him-16x9", "webp")
  return (
    <SceneMedia
      asset={withHim ? "pf-cover-him-16x9" : "pf-desk-16x9"}
      poster={withHim ?? sceneAsset("pf-desk-16x9", "webp")}
      tallPoster={sceneAsset("pf-cover-him-9x16", "webp") ?? sceneAsset("pf-desk-9x16", "webp")}
      video={sceneAsset("pf-cover-loop", "mp4")}
      tallVideo={sceneAsset("pf-cover-loop-9x16", "mp4")}
      className="cover-media"
    />
  )
}
