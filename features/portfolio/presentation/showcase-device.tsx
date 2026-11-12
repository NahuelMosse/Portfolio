import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react"
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
  const source = piece.kind === "capture" ? piece.poster : piece.src
  const bar = frame === "phone" ? pieceBar(source) : null
  const style = bar ? ({ "--bar": bar.bg, "--trim": bar.trim ?? 0 } as CSSProperties) : undefined
  return (
    <div className="show-screen" data-on={on ? "" : undefined} data-tone={bar?.tone} style={style}>
      {bar && <StatusBar />}
      {piece.kind === "capture" ? (
        // the same poster image stays mounted whether the capture plays or not, so turning it on never swaps a picture
        <SceneMedia capture poster={piece.poster} video={on ? piece.video : undefined} alt={piece.alt} />
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

// The phone beside the browser plays the same story on the same clock: both captures are cut to one timeline, and the phone's video
// follows the main one's time, so each section shows on both screens at once whichever video loaded first.
// A phone more than a second off (its first catch-up) jumps once; a smaller gap is closed by playing a little faster or slower.
const SEEK_AT = 1
const SETTLED = 0.02
const RATE_PER_SECOND = 12
const RATE_RANGE = 0.4
const CHECK_EVERY_MS = 50

// How far the phone is behind the main one (positive) or ahead (negative), on the loop's circle: a main that just looped back
// to the start is ahead of a phone at the end, not a whole loop behind.
function loopDrift(lead: HTMLVideoElement, own: HTMLVideoElement): number {
  const length = lead.duration
  const gap = lead.currentTime - own.currentTime
  if (!Number.isFinite(length) || length <= 0) return gap
  const wrapped = ((((gap + length / 2) % length) + length) % length) - length / 2
  return wrapped
}

function rateFor(drift: number): number {
  if (Math.abs(drift) < SETTLED) return 1
  return Math.min(1 + RATE_RANGE, Math.max(1 - RATE_RANGE, 1 + drift * RATE_PER_SECOND))
}

// The browser refuses a play() with a DOMException (autoplay policy, an interrupted load): the follow loop tries again on its next tick.
// Anything else is a bug and reaches the caller.
function refuseUnlessAutoplay(error: unknown): void {
  if (!(error instanceof DOMException)) throw error
}

function useFollowMain(role: Role) {
  const rig = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (role !== "second") return
    const timer = window.setInterval(() => {
      const own = rig.current?.querySelector<HTMLVideoElement>(".show-screen[data-on] video")
      const lead = rig.current?.parentElement?.querySelector<HTMLVideoElement>('.show-rig[data-role="main"] .show-screen[data-on] video')
      if (!own || !lead || own.readyState < 2 || lead.readyState < 2) return
      if (lead.paused !== own.paused) void (lead.paused ? own.pause() : own.play().catch(refuseUnlessAutoplay))
      const drift = loopDrift(lead, own)
      if (Math.abs(drift) > SEEK_AT) own.currentTime = lead.currentTime
      else own.playbackRate = rateFor(drift)
    }, CHECK_EVERY_MS)
    return () => window.clearInterval(timer)
  }, [role])
  return rig
}

// a screen is a desktop page until its image says otherwise
const DESKTOP_SHAPE = 1.6

// A browser's screen takes the shape of the capture on show: its width over its height, read from the image once it has loaded.
function useShownShape(rig: RefObject<HTMLDivElement | null>, active: number): number {
  const [shape, setShape] = useState(DESKTOP_SHAPE)
  useEffect(() => {
    const img = rig.current?.querySelectorAll(".show-screen")[active]?.querySelector("img")
    if (!img) return
    // the 1x1 placeholder is not the capture: its shape would size the screen for a frame and then change
    const read = () => img.naturalHeight && !img.currentSrc.startsWith("data:") && setShape(img.naturalWidth / img.naturalHeight)
    read()
    img.addEventListener("load", read)
    return () => img.removeEventListener("load", read)
  }, [rig, active])
  return shape
}

// A device lit and shadowed by the scene it stands in: its screen light on the field, a cast shadow on the floor, a rim of lamp
// light on its edge and a sheen that sweeps across the glass as the page scrolls. Its screens change with the story's beats.
export function ShowcaseDevice({ kind, screens, active, role }: DeviceProps) {
  const shown = screens[active]
  const rig = useFollowMain(role)
  const shape = { "--shape": useShownShape(rig, active) } as CSSProperties
  return (
    <div ref={rig} className="show-rig" data-device={kind} data-role={role} style={shape}>
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
