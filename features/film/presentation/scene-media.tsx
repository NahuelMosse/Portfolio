"use client"

import { useState, useSyncExternalStore } from "react"
import { DEFERRED_BLANK } from "./deferred"

type SceneMediaProps = {
  // id of the generated asset this slot waits for; real pieces leave it out
  asset?: string
  poster?: string
  // poster for tall (portrait) screens
  tallPoster?: string
  video?: string
  tallVideo?: string
  alt?: string
  // marks a screen capture of a live page
  capture?: boolean
  className?: string
}

type State = "field" | "poster" | "video"

const PORTRAIT = "(orientation: portrait)"

function subscribePortrait(onChange: () => void) {
  const query = window.matchMedia(PORTRAIT)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

const isPortrait = () => window.matchMedia(PORTRAIT).matches

const REDUCED = "(prefers-reduced-motion: reduce)"

function subscribeReduced(onChange: () => void) {
  const query = window.matchMedia(REDUCED)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

const isReduced = () => window.matchMedia(REDUCED).matches

export function SceneMedia({ asset, poster, tallPoster, video, tallVideo, alt = "", capture, className }: SceneMediaProps) {
  const reduced = useSyncExternalStore(subscribeReduced, isReduced, () => false)
  const portrait = useSyncExternalStore(subscribePortrait, isPortrait, () => false)
  const [state, setState] = useState<State>(poster ? "poster" : "field")
  const shownPoster = portrait ? (tallPoster ?? poster) : poster
  const shownVideo = portrait ? (tallVideo ?? video) : video

  // a poster that failed before hydration never fires onError again
  const watchPoster = (node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth === 0) setState("field")
  }

  return (
    <span data-scene-media="" data-asset={asset} data-state={state} className={`scene-media ${className ?? ""}`}>
      {state !== "field" && shownPoster && (
        <picture>
          {tallPoster && <source media={PORTRAIT} data-srcset={tallPoster} />}
          <img ref={watchPoster} src={`${DEFERRED_BLANK}#${poster}`} data-src={poster} alt={alt} decoding="async" onError={() => setState("field")} />
        </picture>
      )}
      {state !== "field" && shownVideo && !reduced && (
        <video
          key={shownVideo}
          data-capture={capture ? "" : undefined}
          data-src={shownVideo}
          // the poster is the picture under it, fetched as the visitor nears it; a real URL here would be fetched at once
          poster={DEFERRED_BLANK}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          onCanPlay={() => setState("video")}
        />
      )}
    </span>
  )
}
