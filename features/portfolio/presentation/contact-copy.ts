import { useEffect, useRef, useState } from "react"

const COPIED_FOR_MS = 2200

// Copies a text to the clipboard and reports it for a moment. If the browser refuses, nothing is claimed.
export function useCopy(text: string) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      return
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), COPIED_FOR_MS)
  }

  return { copied, copy }
}
