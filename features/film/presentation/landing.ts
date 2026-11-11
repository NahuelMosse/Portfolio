import { smoothScroll } from "./motion-engine"

// Where a jump puts its target: "bar" sets its top edge just under the top bar, "top" at the top of the screen (a scene that
// fills the screen under the bar), "bottom" at the bottom of the screen, so the screen shows what comes right before it.
export type Edge = "bar" | "top" | "bottom"
export type Landing = { selector: string; edge: Edge; wide?: boolean }

const WIDE = "(min-width: 1100px)"
const SETTLED_PX = 2

// Its offset from its offset parent as laid out, before any sticky hold: a sticky stage is measured where it rests in the flow.
function restingOffset(node: HTMLElement) {
  if (getComputedStyle(node).position !== "sticky") return { top: node.offsetTop, parent: node.offsetParent as HTMLElement | null }
  const inline = node.style.position
  node.style.position = "static"
  const measured = { top: node.offsetTop, parent: node.offsetParent as HTMLElement | null }
  node.style.position = inline
  return measured
}

// The element's top in the document as laid out: transforms do not count, a pinned scene stands where its pin spacer stands and
// a sticky stage where it rests. That is where it is in its first beat, wherever the page is scrolled now.
export function flowTop(element: HTMLElement): number {
  let top = 0
  let node: HTMLElement | null = element
  while (node) {
    const spacer = node.parentElement
    if (spacer?.classList.contains("pin-spacer")) node = spacer
    const { top: offset, parent } = restingOffset(node)
    top += offset
    node = parent
  }
  return top
}

function barBottom() {
  const bar = document.querySelector("[data-top-bar]")
  return bar ? Math.max(0, bar.getBoundingClientRect().height) : 0
}

function destination(target: HTMLElement, edge: Edge) {
  const top = flowTop(target)
  const y = edge === "top" ? top : edge === "bottom" ? top - window.innerHeight : top - barBottom()
  const max = document.documentElement.scrollHeight - window.innerHeight
  // whole pixels, rounded up so a scene never ends a fraction below the screen
  return Math.min(Math.max(0, Math.ceil(y)), max)
}

// Scrolls so the target lands on its edge, then checks once the scroll has stopped: if anything above it changed height on the
// way (a plate that decoded, a pin refreshed), it lands again from where it is.
export function landOn(target: HTMLElement, edge: Edge, reduced: boolean) {
  const engine = smoothScroll()
  const settle = () => {
    const y = destination(target, edge)
    if (Math.abs(window.scrollY - y) > SETTLED_PX) {
      if (engine) engine.scrollTo(y, { immediate: true, force: true })
      else window.scrollTo({ top: y, behavior: "auto" })
    }
  }
  const y = destination(target, edge)
  if (engine) {
    engine.scrollTo(y, { immediate: reduced, force: true, lock: true, onComplete: settle })
    return
  }
  if (reduced || Math.abs(window.scrollY - y) <= SETTLED_PX) {
    window.scrollTo({ top: y, behavior: "auto" })
    return
  }
  window.addEventListener("scrollend", settle, { once: true })
  window.scrollTo({ top: y, behavior: "smooth" })
}

// The landing for a target: its chapter's own when it has one for this width, else a scene that fills the screen lands on the
// top edge and anything else just under the bar.
export function landingFor(target: HTMLElement, landing?: Landing): { element: HTMLElement; edge: Edge } {
  if (landing && (!landing.wide || window.matchMedia(WIDE).matches)) {
    const element = document.querySelector<HTMLElement>(landing.selector)
    if (element) return { element, edge: landing.edge }
  }
  return { element: target, edge: target.matches("[data-group]") ? "top" : "bar" }
}
