"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { identity } from "./content"

const GITHUB_HANDLE = identity.github.replace("https://", "")
const LINKEDIN_HANDLE = identity.linkedin.replace("https://", "")
const COPIED_FOR_MS = 2200

// The official marks of the two networks, as paths of a 24-unit square; the envelope is drawn in the page's own style.
const GLYPHS = {
  email: "M3 5h18v14H3zM3 6l9 7 9-7",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
} as const

function Glyph({ name }: { name: keyof typeof GLYPHS }) {
  const stroked = name === "email"
  return (
    <svg data-glyph={name} className="tile-glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d={GLYPHS[name]}
        fill={stroked ? "none" : "currentColor"}
        stroke={stroked ? "currentColor" : "none"}
        strokeWidth={stroked ? 1.8 : 0}
        strokeLinejoin="miter"
      />
      {stroked && <circle cx="12" cy="13" r="2.2" fill="currentColor" />}
    </svg>
  )
}

const Arrow = () => (
  <span className="tile-arrow" aria-hidden="true">
    →
  </span>
)

type ChannelProps = { id: "linkedin" | "github"; href: string; handle: string; line: string; order: number }

// A network as one tile that is a link: its mark, its handle and what is there. It opens in a new tab.
function Channel({ id, href, handle, line, order }: ChannelProps) {
  return (
    <a data-tile={id} data-contact={id === "linkedin" ? id : undefined} className="tile" href={href} target="_blank" rel="noopener noreferrer" style={{ "--n": order } as CSSProperties}>
      <Glyph name={id} />
      <span data-handle="" className="tile-handle">
        {handle}
      </span>
      <span data-line="" className="tile-line">
        {line}
      </span>
      <Arrow />
    </a>
  )
}

// The email tile: the address as a mailto link, and a button that copies it and says so in a live region.
function EmailTile() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    await navigator.clipboard.writeText(identity.email)
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), COPIED_FOR_MS)
  }

  return (
    <div data-tile="email" className="tile tile-email" style={{ "--n": 0 } as CSSProperties}>
      <Glyph name="email" />
      <a data-contact="email" className="tile-link" href={`mailto:${identity.email}`}>
        <span data-handle="" className="tile-handle">
          {identity.email}
        </span>
      </a>
      <p data-line="" className="tile-line">
        Write to me directly: a project, a role or a question.
      </p>
      <div className="tile-actions">
        <button type="button" data-copy="" data-copied={copied ? "" : undefined} onClick={copy}>
          {copied ? "Copied" : "Copy address"}
        </button>
        <span aria-live="polite" className="tile-status">
          {copied ? "Copied" : ""}
        </span>
      </div>
      <Arrow />
    </div>
  )
}

// Three channels as bold tiles that come in one after another when the block scrolls into view; email first and widest.
export function ContactTiles() {
  const list = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<"static" | "waiting" | "in">("static")

  useEffect(() => {
    const node = list.current
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    setPhase("waiting")
    const watch = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setPhase("in")
        watch.disconnect()
      },
      { threshold: 0.15 },
    )
    watch.observe(node)
    return () => watch.disconnect()
  }, [])

  return (
    <div ref={list} data-tiles="" data-phase={phase} className="contact-tiles">
      <EmailTile />
      <div className="tile-stack">
        <Channel id="linkedin" href={identity.linkedin} handle={LINKEDIN_HANDLE} line="Career and references." order={1} />
        <div data-secondary="" className="tile-secondary">
          <Channel id="github" href={identity.github} handle={GITHUB_HANDLE} line="The code of these projects and the three npm tools." order={2} />
        </div>
      </div>
    </div>
  )
}
