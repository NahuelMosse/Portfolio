import type { ReactNode } from "react"

export type FrameKind = "phone" | "browser"

type DeviceFrameProps = { kind: FrameKind; label: string; children: ReactNode }

// The two frames that hold a real piece: a phone for an app screen, a browser for a web page.
// They belong to the ink-and-wash page: near-black bezel, a thin bone outline, a small crimson tab with the caption, grain over the glass.
export function DeviceFrame({ kind, label, children }: DeviceFrameProps) {
  return (
    <figure data-frame={kind} className="frame">
      <figcaption className="frame-tab">{label}</figcaption>
      {kind === "browser" && (
        <span className="frame-bar" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      )}
      <div className="frame-screen">{children}</div>
      <span data-grain="" className="grain" aria-hidden="true" />
    </figure>
  )
}
