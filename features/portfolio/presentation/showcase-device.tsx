import type { CSSProperties } from "react"
// kit-boundary: features/film/motion.ts is the film slice's client entry; its index reaches the server-only scene assets
import { DEFERRED_BLANK, SceneMedia } from "@/features/film/motion"
import type { Piece, ScreenFrame } from "./content"
import { deferredPiece, pieceBar, pieceThumb } from "./piece-image"

type Role = "main" | "second"

// how wide a device's screen is drawn: the main one up to half the stage, the second a third of it; full width on a phone
const SCREEN_SIZES: Record<Role, string> = { main: "(max-width: 700px) 92vw, 50vw", second: "(max-width: 700px) 60vw, 34vw" }

type DeviceProps = { kind: ScreenFrame; screens: readonly Piece[]; active: number; role: Role }

// The phone's status bar: the clock, the island and the signal, wifi and battery. It takes the color of the app's top edge, so it
// reads on a light screen and on a dark one, and every size is a share of the screen's width.
function StatusBar() {
  return (
    <span className="show-status" aria-hidden="true">
      <b className="show-clock">9:41</b>
      <i className="show-island" />
      <svg className="show-signal" viewBox="0 0 17 11" fill="currentColor">
        <rect x="0" y="7.5" width="3" height="3.5" rx="0.8" />
        <rect x="4.6" y="5" width="3" height="6" rx="0.8" />
        <rect x="9.2" y="2.5" width="3" height="8.5" rx="0.8" />
        <rect x="13.8" y="0" width="3" height="11" rx="0.8" />
      </svg>
      <svg className="show-wifi" viewBox="0 0 16 11" fill="currentColor">
        <path d="M8 2.2c2.2 0 4.2.9 5.7 2.3l1.1-1.2A10 10 0 0 0 8 .5 10 10 0 0 0 1.2 3.3l1.1 1.2A8.3 8.3 0 0 1 8 2.2Z" />
        <path d="M8 5.7c1.3 0 2.5.5 3.4 1.3l1.1-1.2A6.8 6.8 0 0 0 8 4a6.8 6.8 0 0 0-4.5 1.8L4.6 7c.9-.8 2.1-1.3 3.4-1.3Z" />
        <path d="M8 9.2c.5 0 1-.2 1.4-.5L8 7.2 6.6 8.7c.4.3.9.5 1.4.5Z" />
      </svg>
      <svg className="show-battery" viewBox="0 0 26 12" fill="currentColor">
        <rect x="0.5" y="0.5" width="22" height="11" rx="3.2" fill="none" stroke="currentColor" opacity="0.45" />
        <rect x="2" y="2" width="19" height="8" rx="2" />
        <rect x="23.6" y="4" width="1.8" height="4" rx="0.9" opacity="0.45" />
      </svg>
    </span>
  )
}

// One face of the device: the screen's still, or the live capture while it is the one on. A phone's face carries its status bar and
// starts below it; a capture that came with a bar of its own is cropped so the bar is not drawn twice.
function Face({ piece, on, role, frame }: { piece: Piece; on: boolean; role: Role; frame: ScreenFrame }) {
  const live = piece.kind === "capture" && on
  const source = piece.kind === "capture" ? piece.poster : piece.src
  const bar = frame === "phone" ? pieceBar(source) : null
  const style = bar ? ({ "--bar": bar.bg, "--trim": bar.trim ?? 0 } as CSSProperties) : undefined
  return (
    <div className="show-screen" data-on={on ? "" : undefined} data-tone={bar?.tone} style={style}>
      {bar && <StatusBar />}
      {live ? (
        <SceneMedia capture poster={piece.poster} video={piece.video} alt={piece.alt} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img {...deferredPiece(source, SCREEN_SIZES[role])} alt={role === "main" ? piece.alt : ""} decoding="async" />
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
          src={`${DEFERRED_BLANK}#${pieceThumb(piece.kind === "capture" ? piece.poster : piece.src)}`}
          data-src={pieceThumb(piece.kind === "capture" ? piece.poster : piece.src)}
          alt=""
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
            <Face key={piece.caption} piece={piece} on={order === active} role={role} frame={kind} />
          ))}
          <i className="show-sheen" aria-hidden="true" />
        </div>
      </figure>
    </div>
  )
}
