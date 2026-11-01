import type { ReactNode } from "react"

export type DeviceKind = "phone" | "wide"

type PosterDeviceProps = { device: DeviceKind; children: ReactNode }

// The plain frame of a project's lead interface, drawn by code: a phone bezel, or a browser with its bar for a wide screen.
export function PosterDevice({ device, children }: PosterDeviceProps) {
  return (
    <div data-poster-device="" data-device={device} className="poster-device">
      {device === "wide" && (
        <span className="poster-bar" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      )}
      <div data-scene-screen="" className="poster-screen">
        {children}
      </div>
    </div>
  )
}
