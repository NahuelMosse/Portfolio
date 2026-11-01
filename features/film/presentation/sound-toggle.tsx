"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"

// The soundtrack is off until the visitor presses this; the audio element exists only when its file does.
export function SoundToggle({ src }: { src?: string }) {
  const [on, setOn] = useState(false)
  const audio = useRef<HTMLAudioElement>(null)

  const toggle = () => {
    const next = !on
    setOn(next)
    if (!audio.current) return
    if (next) void audio.current.play().catch(() => setOn(false))
    else audio.current.pause()
  }

  return (
    <>
      {src && <audio ref={audio} src={src} loop preload="none" />}
      <Button
        type="button"
        variant="ghost"
        data-sound-toggle=""
        aria-pressed={on}
        className="film-control sound-toggle"
        onClick={toggle}
      >
        {on ? "Sound on" : "Sound off"}
      </Button>
    </>
  )
}
