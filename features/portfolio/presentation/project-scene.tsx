import type { CSSProperties, ReactNode } from "react"
import { SCENE_SCREENS } from "./scene-screens"

type ProjectSceneProps = {
  // asset ids of the two cuts of the scene, and the files they resolve to
  asset: string
  wide: string
  tall: string
  title: ReactNode
  children: ReactNode
}

const PHONE_WIDTH = "(max-width: 767px)"

const boxVars = (asset: string, prefix: string) => {
  const box = SCENE_SCREENS[asset]
  if (!box) throw new Error(`No screen box is declared for ${asset}`)
  return {
    [`--${prefix}l`]: `${box.left}%`,
    [`--${prefix}t`]: `${box.top}%`,
    [`--${prefix}w`]: `${box.width}%`,
    [`--${prefix}h`]: `${box.height}%`,
  }
}

// One project as a single full-bleed image: the drawn device holds the real interface, the title sits on the black band.
export function ProjectScene({ asset, wide, tall, title, children }: ProjectSceneProps) {
  const style = { ...boxVars(`${asset}-16x9`, "w"), ...boxVars(`${asset}-4x5`, "t") } as CSSProperties

  return (
    <div data-illustration="" data-asset={`${asset}-16x9`} className="scene-plate" style={style}>
      <picture>
        <source media={PHONE_WIDTH} srcSet={tall} />
        <img src={wide} alt="" loading="lazy" decoding="async" />
      </picture>
      <div data-scene-screen="" className="scene-screen">
        {children}
      </div>
      <div className="scene-title">{title}</div>
    </div>
  )
}
