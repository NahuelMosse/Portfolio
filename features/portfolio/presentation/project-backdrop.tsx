import { sceneAsset } from "@/features/film"

type BackdropProps = { name: string }

function files(prefix: string, name: string) {
  const wide = sceneAsset(`${prefix}-${name}-16x9`, "webp")
  const tall = sceneAsset(`${prefix}-${name}-9x16`, "webp")
  if (!wide || !tall) throw new Error(`The ${prefix} of ${name} is not delivered`)
  return { wide, tall }
}

// The backdrop of a project section: one illustration for a wide screen and one for a phone, a texture of the product's world
// under everything. A missing file is an error, not a section without its backdrop.
export function ProjectBackdrop({ name }: BackdropProps) {
  const { wide, tall } = files("bg", name)
  return (
    <picture data-backdrop={name} className="backdrop">
      <source media="(min-width: 1280px)" srcSet={wide} />
      <img src={tall} alt="" loading="lazy" decoding="async" />
    </picture>
  )
}

// The ink plate of a project: black ink on white paper, printed over the product's color by multiply, so the drawn objects
// are cut by the frame and the words cross them like a screen-printed poster.
export function ProjectPlate({ name }: BackdropProps) {
  // his portrait in the product's world is the plate when both shapes are delivered; else the still life of the world alone
  const himWide = sceneAsset(`him-${name}-16x9`, "webp")
  const himTall = sceneAsset(`him-${name}-9x16`, "webp")
  const portrait = Boolean(himWide && himTall)
  const wide = portrait ? himWide : sceneAsset(`plate-${name}-16x9`, "webp")
  const tall = portrait ? himTall : sceneAsset(`plate-${name}-9x16`, "webp")
  // a plate still being drawn is a declared gap: the section keeps its field and backdrop
  if (!wide || !tall) return null
  return (
    <picture data-plate={name} data-portrait={portrait ? "" : undefined} className="plate">
      <source media="(min-width: 1280px)" srcSet={wide} />
      <img src={tall} alt="" loading="lazy" decoding="async" />
    </picture>
  )
}
