import { sceneAsset } from "@/features/film"

type BackdropProps = { name: string }

// The backdrop of a project section: one illustration for a wide screen and one for a phone, both with a calm dark zone
// where the device and the words sit. A missing file is an error, not a section without its backdrop.
export function ProjectBackdrop({ name }: BackdropProps) {
  const wide = sceneAsset(`bg-${name}-16x9`, "webp")
  const tall = sceneAsset(`bg-${name}-9x16`, "webp")
  if (!wide || !tall) throw new Error(`The backdrop of ${name} is not delivered`)
  return (
    <picture data-backdrop={name} className="backdrop">
      <source media="(min-width: 1280px)" srcSet={wide} />
      <img src={tall} alt="" loading="lazy" decoding="async" />
    </picture>
  )
}
