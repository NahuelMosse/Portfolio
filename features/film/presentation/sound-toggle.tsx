"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

type Phase = "idle" | "on" | "off"

const isOnScreen = (el: Element) => {
  const style = getComputedStyle(el)
  if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) <= 0) return false
  const rect = el.getBoundingClientRect()
  return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < innerHeight && rect.left < innerWidth
}

// the touch chip counts only while it is marked visible; the desktop line has no mark
const invitationOnScreen = () =>
  [...document.querySelectorAll(".sound-cue-chip[data-visible], .cover-cue")].some(isOnScreen)

// The soundtrack starts on the first click, tap or key only while a sound invitation is on screen (the touch chip or the desktop
// cover line); elsewhere that gesture is ignored and listening goes on. The toggle turns it off or on from anywhere; the audio
// element exists only when its file does. Once the visitor has used the toggle, nothing starts the sound for them again. The phase is mirrored on
// <html data-sound> so the cue that invites the first click can leave when the sound starts or the toggle is pressed. The sound
// plays only while the page is on screen, so a hidden tab pauses it and returning resumes it if it was on.
export function SoundToggle({ src }: { src?: string }) {
  const [phase, setPhase] = useState<Phase>("idle")
  const audio = useRef<HTMLAudioElement>(null)
  const stopListening = useRef<() => void>(() => {})
  const phaseRef = useRef<Phase>("idle")
  const on = phase === "on"

  useEffect(() => {
    document.documentElement.dataset.sound = phase
    phaseRef.current = phase
  }, [phase])

  // the soundtrack belongs to the page on screen: a hidden tab pauses it, and coming back resumes it only if it was on
  useEffect(() => {
    const onVisibility = () => {
      const el = audio.current
      if (!el) return
      if (document.hidden) el.pause()
      else if (phaseRef.current === "on") void el.play().catch(() => {})
    }
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [])

  useEffect(() => {
    // A touch is not a user activation on pointerdown: the browser grants it on pointerup / touchend / click. Every one of them
    // tries to play, and the listening stops only once a play has succeeded.
    const EVENTS = ["pointerup", "touchend", "click", "keydown"] as const
    let playing = false
    const onGesture = (event: Event) => {
      if (playing || phaseRef.current !== "idle") return
      if (event instanceof KeyboardEvent && event.key === "Escape") return
      if (event.target instanceof Element && event.target.closest("[data-sound-toggle]")) return
      if (document.hidden || !invitationOnScreen()) return
      playing = true
      void audio.current?.play().then(
        () => {
          stop()
          setPhase("on")
        },
        () => {
          playing = false
        },
      )
    }
    const stop = () => EVENTS.forEach((name) => window.removeEventListener(name, onGesture, { capture: true }))
    stopListening.current = stop
    EVENTS.forEach((name) => window.addEventListener(name, onGesture, { capture: true }))
    return stop
  }, [])

  const toggle = () => {
    stopListening.current()
    const next = !on
    setPhase(next ? "on" : "off")
    if (!audio.current) return
    if (next && !document.hidden) void audio.current.play().catch(() => setPhase("off"))
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
        <SoundBars />
        {on ? "Sound on" : "Sound off"}
      </Button>
    </>
  )
}

// Four thin bars: the sign of sound. Inside the toggle it shows, still, only while the sound has never been started or pressed.
export function SoundBars({ className = "sound-bars" }: { className?: string }) {
  return (
    <i className={className} aria-hidden="true">
      <b />
      <b />
      <b />
      <b />
    </i>
  )
}
