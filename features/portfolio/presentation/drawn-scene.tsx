"use client"

import { useLayoutEffect, useRef, type ReactNode } from "react"
import { screenMatrix, type Point, type Quad } from "../domain/screen-matrix"
import { imagePixels, imageStyle, panelStyle, type SceneArt } from "./scene-art"

type DrawnSceneProps = {
  art: SceneArt
  // the image files of each width, resolved on the server
  sources: { desktop: string; mobile: string }
  composition: "a" | "b"
  children: ReactNode
}

type Width = "desktop" | "mobile"

const distance = ([ax, ay]: Point, [bx, by]: Point) => Math.hypot(ax - bx, ay - by)

// the screen's corners in the panel's own pixels, from where the shown illustration sits in it
function cornersInPanel(shown: HTMLImageElement, panel: HTMLElement, screen: Quad): Quad {
  const placed = shown.getBoundingClientRect()
  const origin = panel.getBoundingClientRect()
  const at = ([x, y]: Point): Point => [placed.left - origin.left + x * placed.width, placed.top - origin.top + y * placed.height]
  return [at(screen[0]), at(screen[1]), at(screen[2]), at(screen[3])]
}

// One project's stage: its ink illustration printed on the field and, over the drawing of a screen, the real interface
// carried by the same perspective as the drawing, so it looks set inside the device it is drawn on.
export function DrawnScene({ art, sources, composition, children }: DrawnSceneProps) {
  const panel = useRef<HTMLDivElement>(null)
  const screen = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const frame = panel.current
    const overlay = screen.current
    if (!frame || !overlay) return

    const map = () => {
      const shown = [...frame.querySelectorAll<HTMLImageElement>("img[data-art]")].find((image) => getComputedStyle(image).display !== "none")
      if (!shown) return
      const corners = cornersInPanel(shown, frame, art[shown.dataset.art as Width].screen)
      const [topLeft, topRight, bottomRight, bottomLeft] = corners
      const width = (distance(topLeft, topRight) + distance(bottomLeft, bottomRight)) / 2
      const height = (distance(topLeft, bottomLeft) + distance(topRight, bottomRight)) / 2
      overlay.style.width = `${width}px`
      overlay.style.height = `${height}px`
      overlay.style.transform = screenMatrix({ width, height, corners })
      overlay.setAttribute("data-mapped", "")
    }

    map()
    const watcher = new ResizeObserver(map)
    watcher.observe(frame)
    return () => watcher.disconnect()
  }, [art])

  return (
    <div ref={panel} data-printed-art="" data-side={composition === "a" ? "right" : "left"} className="spread-stage drawn-stage" style={panelStyle(art)}>
      {(["desktop", "mobile"] as const).map((width) => {
        const [pixelWidth, pixelHeight] = imagePixels(art[width])
        return <img key={width} data-art={width} src={sources[width]} alt="" aria-hidden="true" width={pixelWidth} height={pixelHeight} loading="lazy" decoding="async" style={imageStyle(art[width])} />
      })}
      <div ref={screen} data-scene-screen="" className="drawn-screen">
        {children}
      </div>
    </div>
  )
}
