import { SceneMedia } from "@/features/film/presentation/scene-media"
import type { Piece, ScreenFrame } from "./content"

type DeviceProps = {
  kind: ScreenFrame
  screens: readonly Piece[]
  active: number
  role: "main" | "second"
}

// One face of the device: the screen's still, or the live capture while it is the one on.
function Face({ piece, on, role }: { piece: Piece; on: boolean; role: "main" | "second" }) {
  const live = piece.kind === "capture" && on && role === "main"
  return (
    <div className="show-screen" data-on={on ? "" : undefined}>
      {live ? (
        <SceneMedia capture poster={piece.poster} video={piece.video} alt={piece.alt} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={piece.kind === "capture" ? piece.poster : piece.src}
          alt={role === "main" ? piece.alt : ""}
          loading={on && role === "main" ? "eager" : "lazy"}
          decoding="async"
        />
      )}
    </div>
  )
}

// The glow is the screen's own light spilling onto the field behind the device: a blurred copy of the face that is on.
function Glow({ screens, active }: { screens: readonly Piece[]; active: number }) {
  return (
    <div className="show-glow" aria-hidden="true">
      {screens.map((piece, order) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={piece.caption}
          data-on={order === active ? "" : undefined}
          src={piece.kind === "capture" ? piece.poster : piece.src}
          alt=""
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
  )
}

// A device lit and shadowed by the scene it stands in: its screen light on the field, a cast shadow on the floor, a rim of lamp
// light on its edge and a sheen that sweeps across the glass as the page scrolls. Its screens change with the story's beats.
export function ShowcaseDevice({ kind, screens, active, role }: DeviceProps) {
  const shown = screens[active]
  return (
    <div className="show-rig" data-device={kind} data-role={role}>
      <Glow screens={screens} active={active} />
      <span className="show-cast" aria-hidden="true" />
      <figure className="show-device" data-frame={kind}>
        {role === "main" && (
          <figcaption className="show-tab" aria-hidden="true">
            {shown.caption}
          </figcaption>
        )}
        {kind === "browser" && (
          <span className="show-bar" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        )}
        <div className="show-glass">
          {screens.map((piece, order) => (
            <Face key={piece.caption} piece={piece} on={order === active} role={role} />
          ))}
          <i className="show-sheen" aria-hidden="true" />
        </div>
      </figure>
    </div>
  )
}
