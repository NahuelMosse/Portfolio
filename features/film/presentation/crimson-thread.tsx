"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

type Point = { x: number; y: number }
type Geometry = { width: number; height: number; trunk: string; nodes: { id: string; at: Point }[]; branches: string[]; ties: string[] }

const PHONE_WIDTH = 700
// on a phone the thread is the spine at the left edge
const SPINE_X = 20
const TIE_REACH = 28
const SWING = 0.06
const DOOR_GAP = 24
const BRANCHES_START = 0.9

const smooth = (from: Point, to: Point) => {
  const middle = (from.y + to.y) / 2
  return `C ${from.x} ${middle} ${to.x} ${middle} ${to.x} ${to.y}`
}

// Reads where the stops and the doors are on the page and draws one line through them,
// splitting above the two doors.
function measure(host: HTMLElement): Geometry | null {
  const frame = host.getBoundingClientRect()
  const locate = (el: Element) => {
    const r = el.getBoundingClientRect()
    return { x: r.left - frame.left + r.width / 2, y: r.top - frame.top + r.height / 2, top: r.top - frame.top, bottom: r.bottom - frame.top, width: r.width }
  }
  const envelope = host.querySelector("[data-sealed-envelope]")
  const file = host.querySelector("[data-sealed-file]")
  const doors = [...host.querySelectorAll("[data-doors] a[href^='mailto:']")]
  if (!envelope || !file || doors.length !== 2) return null

  const start = locate(envelope)
  const sealedFile = locate(file)
  const doorPlaces = doors.map(locate)
  const spine = frame.width < PHONE_WIDTH
  const stops = [...host.querySelectorAll("[data-thread-stop]")].map((el, index) => {
    const place = locate(el)
    const side = index % 2 === 0 ? SWING : 1 - SWING
    const x = spine ? SPINE_X : frame.width * side
    return { id: el.getAttribute("data-thread-stop") ?? String(index), at: { x, y: place.y } }
  })
  const forkX = spine ? SPINE_X : (doorPlaces[0].x + doorPlaces[1].x) / 2
  const fork = { x: forkX, y: doorPlaces[0].top - DOOR_GAP * 2 }
  const origin = { x: spine ? SPINE_X : start.x, y: start.y }
  const route = [origin, ...stops.map((s) => s.at), fork]
  const trunk = route.slice(1).reduce((d, point, i) => `${d} ${smooth(route[i], point)}`, `M ${route[0].x} ${route[0].y}`)
  // on a phone the thread is the spine only: no branches or ties across the text and the doors
  const branches = spine ? [] : doorPlaces.map((door) => `M ${fork.x} ${fork.y} ${smooth(fork, { x: door.x, y: door.top })}`)
  // each branch carries on from its door and ties around the sealed file, one end on each side of the seal
  const ties = spine ? [] : doorPlaces.map((door, index) => {
    const end = { x: sealedFile.x + (index === 0 ? -TIE_REACH : TIE_REACH), y: sealedFile.y }
    return `M ${door.x} ${door.bottom} ${smooth({ x: door.x, y: door.bottom }, end)}`
  })
  return { width: frame.width, height: frame.height, trunk, nodes: stops, branches, ties }
}

export function CrimsonThread() {
  const svg = useRef<HTMLDivElement>(null)
  const [geometry, setGeometry] = useState<Geometry | null>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: svg, offset: ["start start", "end end"] })
  const trunkLength = useTransform(scrollYProgress, [0, BRANCHES_START], [0, 1])
  const branchLength = useTransform(scrollYProgress, [BRANCHES_START, 1], [0, 1])

  useEffect(() => {
    const host = svg.current?.parentElement
    if (!host) return
    const update = () => setGeometry(measure(host))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(host)
    window.addEventListener("load", update)
    return () => {
      observer.disconnect()
      window.removeEventListener("load", update)
    }
  }, [])

  return (
    <div ref={svg} className="thread-host">
    <svg
      data-crimson-thread=""
      className="crimson-thread"
      aria-hidden="true"
      viewBox={`0 0 ${geometry?.width ?? 1} ${geometry?.height ?? 1}`}
      preserveAspectRatio="none"
    >
      {geometry && (
        <>
          <motion.path data-thread-path="" d={geometry.trunk} style={{ pathLength: reduced ? 1 : trunkLength }} />
          {geometry.branches.map((d, index) => (
            <motion.path key={index} data-thread-branch="" d={d} style={{ pathLength: reduced ? 1 : branchLength }} />
          ))}
          {geometry.ties.map((d, index) => (
            <motion.path key={`tie-${index}`} data-thread-tie="" d={d} style={{ pathLength: reduced ? 1 : branchLength }} />
          ))}
          {geometry.nodes.map((node) => (
            <circle key={node.id} data-thread-node={node.id} cx={node.at.x} cy={node.at.y} r={4} />
          ))}
        </>
      )}
    </svg>
    </div>
  )
}
