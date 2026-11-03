import { SceneMedia } from "@/features/film/presentation/scene-media"
import type { Piece, ScreenFrame } from "./content"
import type { TerminalScreen } from "./terminal-output"

type Role = "main" | "second"

type ScreenDeviceProps = { kind: ScreenFrame; screens: readonly Piece[]; active: number; role: Role }
type TerminalDeviceProps = { kind: "terminal"; panes: readonly TerminalScreen[]; name: string; active: number; role: Role }
type DeviceProps = ScreenDeviceProps | TerminalDeviceProps

// One face of the device: the screen's still, or the live capture while it is the one on.
function Face({ piece, on, role }: { piece: Piece; on: boolean; role: Role }) {
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

// The tone of a terminal line comes from the mark its text starts with.
const TONES = [
  ["$ ", "cmd"],
  ["!! ", "err"],
  ["~ ", "warn"],
  ["# ", "note"],
] as const

function toneOf(line: string) {
  const found = TONES.find(([mark]) => line.startsWith(mark))
  return found ? { tone: found[1], text: line.slice(found[0].length), mark: found[0].trim() } : { tone: "out", text: line, mark: "" }
}

// A terminal window: the output a tool really printed, one window per beat.
function TerminalWindow({ panes, name, active }: { panes: readonly TerminalScreen[]; name: string; active: number }) {
  return (
    <figure className="show-device terminal" data-frame="terminal">
      <figcaption className="show-tab" aria-hidden="true">
        {panes[active]?.caption}
      </figcaption>
      <span className="show-bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <b className="terminal-title">{name}</b>
      </span>
      <div className="show-glass">
        {panes.map((pane, order) => (
          <div key={pane.caption} className="show-screen" data-on={order === active ? "" : undefined}>
            <pre className="terminal-screen" aria-label={`${name}: ${pane.caption}`}>
              {pane.lines.map((line, row) => {
                const { tone, text, mark } = toneOf(line)
                return (
                  <span key={row} className="terminal-line" data-tone={tone}>
                    {mark && <b aria-hidden="true">{mark}</b>}
                    {text}
                  </span>
                )
              })}
            </pre>
          </div>
        ))}
        <i className="show-sheen" aria-hidden="true" />
      </div>
    </figure>
  )
}

// A device lit and shadowed by the scene it stands in: its screen light on the field, a cast shadow on the floor, a rim of lamp
// light on its edge and a sheen that sweeps across the glass as the page scrolls. Its screens change with the story's beats.
export function ShowcaseDevice(props: DeviceProps) {
  if (props.kind === "terminal") {
    return (
      <div className="show-rig" data-device="terminal" data-role={props.role}>
        <span className="show-cast" aria-hidden="true" />
        <TerminalWindow panes={props.panes} name={props.name} active={props.active} />
      </div>
    )
  }
  const { kind, screens, active, role } = props
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
