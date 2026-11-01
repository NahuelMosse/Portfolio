"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

type Point = { x: number; y: number }
type Geometry = { width: number; height: number; trunk: string; nodes: { id: string; at: Point }[]; branches: string[]; ties: string[] }

const PHONE_WIDTH = 700
// the spine at the left edge, on every width
const SPINE_X = 28
const TIE_REACH = 28
const FORK_GAP = 48
const BRANCH_REACH = 0.15
const BRANCHES_START = 0.9

const smooth = (from: Point, to: Point) => {
  const middle = (from.y + to.y) / 2
  return `C ${from.x} ${middle} ${to.x} ${middle} ${to.x} ${to.y}`
}

// Reads where the pins, the two folders and the sealed file are on the page and draws one line through them:
// the spine down the left edge, a pin per case and per employer, a fork into the folders, and the ends tied at the sealed file.
function measure(host: HTMLElement): Geometry | null {
  const frame = host.getBoundingClientRect()
  const locate = (el: Element) => {
    const r = el.getBoundingClientRect()
    return { x: r.left - frame.left + r.width / 2, y: r.top - frame.top + r.height / 2, top: r.top - frame.top, bottom: r.bottom - frame.top, left: r.left - frame.left, width: r.width }
  }
  const start = host.querySelector("[data-thread-start]")
  const file = host.querySelector("[data-sealed-file]")
  const folders = [...host.querySelectorAll("[data-offer-card]")]
  if (!start || !file || folders.length !== 2) return null

  const sealedFile = locate(file)
  const folderPlaces = folders.map(locate)
  const spine = frame.width < PHONE_WIDTH
  const stops = [...host.querySelectorAll("[data-thread-stop]")].map((el, index) => {
    const place = locate(el.querySelector("[data-pin]") ?? el)
    return { id: el.getAttribute("data-thread-stop") ?? String(index), at: { x: SPINE_X, y: place.y } }
  })
  const origin = { x: SPINE_X, y: locate(start).y }
  const fork = { x: SPINE_X, y: folderPlaces[0].top - FORK_GAP }
  const route = [origin, ...stops.map((s) => s.at), fork]
  const trunk = route.slice(1).reduce((d, point, i) => `${d} ${smooth(route[i], point)}`, `M ${route[0].x} ${route[0].y}`)
  const branchEnd = (folder: (typeof folderPlaces)[number]) => ({ x: folder.left + folder.width * BRANCH_REACH, y: folder.top })
  // on a phone the folders are stacked, so each branch leaves the spine just above its own folder
  const branches = folderPlaces.map((folder) => {
    const from = spine ? { x: SPINE_X, y: folder.top - FORK_GAP } : fork
    return `M ${from.x} ${from.y} ${smooth(from, branchEnd(folder))}`
  })
  // on a phone one end carries on down the spine to the sealed file; on wide screens each branch carries on from its folder
  // and ties around the file, one end on each side of the seal
  const ties = spine
    ? [`M ${SPINE_X} ${folderPlaces[1].bottom} ${smooth({ x: SPINE_X, y: folderPlaces[1].bottom }, { x: sealedFile.left + TIE_REACH, y: sealedFile.y })}`]
    : folderPlaces.map((folder, index) => {
        const end = { x: sealedFile.x + (index === 0 ? -TIE_REACH : TIE_REACH), y: sealedFile.y }
        return `M ${folder.x} ${folder.bottom} ${smooth({ x: folder.x, y: folder.bottom }, end)}`
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
