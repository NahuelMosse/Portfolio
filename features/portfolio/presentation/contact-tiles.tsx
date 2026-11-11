"use client"

import { MarqueeBand } from "./contact-marquee"

// The contact block: the address as a ticker band, the two networks as inverting halves.
export function ContactTiles() {
  return (
    <div data-tiles="" className="contact-tiles">
      <MarqueeBand />
    </div>
  )
}
