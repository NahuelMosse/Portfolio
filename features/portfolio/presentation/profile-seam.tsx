import { SceneMedia, sceneAsset } from "@/features/film"

// His profile toward the lamp at the left edge, on the seam between two chapters: no frame, fading into the dark,
// behind the typed text. Decorative; without the file there is no element at all.
export function ProfileSeam() {
  const poster = sceneAsset("pf-him-profile", "webp")
  if (!poster) return null
  return (
    <div data-profile-seam="" className="profile-seam" aria-hidden="true">
      <SceneMedia asset="pf-him-profile" poster={poster} className="profile-seam-media" />
    </div>
  )
}
