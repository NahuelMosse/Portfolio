"use client"

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react"
import { BrandMark } from "./brand-mark"
import { StampSprite } from "./stamp-sprite"
import "./preloader.css"

const SEEN_KEY = "nawi-preloaded"
const SCROLL_KEYS = new Set([" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"])
// the plate is printed in screens of growing dots; the last one is the plate itself
const SCREENS = [0, 1, 2, 3, 4] as const
const PRINTED = "nawi:printed"

// Set in <head> before the first paint, so the title is there from the first frame. The first load of a session plays it whole,
// a later one only fades; without script nothing is set and nothing covers the page. Automated browsers get it only with ?preloader.
//
// It also drives the title until React takes the page. The title lasts exactly as long as the load: no minimum, no timer, no
// cap; it raises PRINTED the frame Boska is in, the cover is decoded and the page is hydrated, and the Preloader plays the way
// out from wherever the stamp's loop is. The reading is only what has really arrived (Boska, the cover, the scripts, the page
// hydrated), eased toward so it does not jump; it inks the stamp (the threshold of the n5-ink filter, rewritten only when the
// reading changes, so the grain is not redrawn every frame) and is written under it, into the text nodes already there.
//
// On a slow line React sometimes fails to hydrate the server's page (error #418, the same before the stamp) and renders it again
// from scratch, which resets the classes of <html>. revive() puts the title back the moment the new Preloader mounts, before it
// paints, and goes on from the same reading: the visitor sees the stamp keep inking, never a cut.
export const PRELOADER_SCRIPT = `(function(){try{var d=document.documentElement,q=/[?&]preloader\\b/.test(location.search),s=sessionStorage.getItem("${SEEN_KEY}");if(!q&&navigator.webdriver)return;d.classList.add("is-preloading","has-title");if(s&&!q)d.classList.add("is-revisit")}catch(e){return}
var B=window.__nawiBoot={font:0,cover:0,hydrated:0,printed:0},shown=0,inked=-1,
ST=["Setting type","Inking the stamp","Pulling the proof","Printed"],keep=d.className;
B.revive=function(){if(B.printed||d.classList.contains("is-preloading"))return;keep.split(" ").forEach(function(c){c&&d.classList.add(c)});inked=-1;step(performance.now())};
if(document.fonts&&document.fonts.load)document.fonts.load('700 1em "Boska"').then(function(){B.font=1},function(){B.font=1});else B.font=1;
function cover(){var i=document.querySelector("#cold-open .scene-art img");if(!i)return B.hydrated;if(!i.complete)return 0;if(!B.decoding){B.decoding=1;(i.decode?i.decode():Promise.resolve()).then(function(){B.cover=1},function(){B.cover=1})}return B.cover}
function scripts(){var t=document.querySelectorAll("script[src]");if(!t.length)return 0;var n=0,e=performance.getEntriesByType("resource");for(var k=0;k<t.length;k++)for(var j=0;j<e.length;j++)if(e[j].name===t[k].src){n++;break}return n/t.length}
function put(e,v){var t=e&&e.firstChild;if(t&&t.nodeType===3){if(t.data!==v)t.data=v}else if(e)e.textContent=v}
function step(){if(B.printed||!d.classList.contains("is-preloading"))return;var p=document.querySelector("[data-preloader]"),c=cover(),sc=scripts(),
all=B.font&&c&&B.hydrated,goal=0.06+0.94*(0.2*B.font+0.3*c+0.3*sc+0.2*B.hydrated);
shown=all?1:Math.max(shown,Math.min(goal,shown+(goal-shown)*0.12+0.0005));
var r=Math.max(1,Math.round(shown*100)),a=document.getElementById("n5-ink-a"),v=(-4.8+4.6*shown).toFixed(3);
B.ink=v;if(a&&(r!==inked||a.getAttribute("intercept")!==v)){inked=r;a.setAttribute("intercept",v)}
if(p){p.style.setProperty("--progress",shown.toFixed(4));var n=p.querySelector("[data-preloader-count]"),g=p.querySelector("[data-preloader-stage]");
put(n,("00"+r).slice(-3));put(g,ST[shown>=1?3:!B.font?0:!c?1:2])}
if(all&&shown>=1){B.printed=1;dispatchEvent(new Event("${PRINTED}"));return}requestAnimationFrame(step)}
requestAnimationFrame(step)})()`

const CASE_LINES = ["Nahuel Mosse — Case file", "Nº 0001 · Buenos Aires"] as const

function Typed({ text, from }: { text: string; from: number }) {
  return (
    <span className="preloader-line">
      {[...text].map((char, n) => (
        <span key={n} className="preloader-char" style={{ "--c": from + n } as CSSProperties}>{char}</span>
      ))}
    </span>
  )
}

function RegistrationMark({ corner }: { corner: "start" | "end" }) {
  return (
    <svg className="preloader-reg" data-corner={corner} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 1v38M1 20h38" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="3.5" fill="currentColor" />
    </svg>
  )
}

// The opening title over the ink: two registration marks stamped in crimson, the case line typed, and in the middle the n5 stamp
// held over the case file. Its ghost is there from the first frame; the ink comes through the rubber's grain as the page
// arrives, and the stage and the reading sit under it. The route's streaming fallback shows it too, fully inked.
export function PreloaderFace() {
  return (
    <div className="preloader-face" aria-hidden="true">
      <div className="preloader-chrome">
        <RegistrationMark corner="end" />
        <RegistrationMark corner="start" />
        <p className="preloader-case">
          <Typed text={CASE_LINES[0]} from={0} />
          <Typed text={CASE_LINES[1]} from={CASE_LINES[0].length} />
          <i className="preloader-caret" style={{ "--c": CASE_LINES[0].length + CASE_LINES[1].length } as CSSProperties} />
        </p>
      </div>
      <div data-preloader-mark="" className="preloader-mark">
        <div className="preloader-stamp">
          <span className="preloader-stamp-ghost"><BrandMark /></span>
          <span className="preloader-stamp-flash"><BrandMark /></span>
          <span className="preloader-stamp-ink"><BrandMark filter="url(#n5-ink)" /></span>
          <span className="preloader-stamp-dry"><BrandMark /></span>
        </div>
      </div>
      {/* both are written by the head script before React takes the page, so their text is not React's to check */}
      <p className="preloader-read">
        <span data-preloader-stage="" suppressHydrationWarning>Setting type</span>
        <span data-preloader-count="" className="preloader-count" suppressHydrationWarning>001</span>
      </p>
    </div>
  )
}

function coverArt() {
  return document.querySelector<HTMLElement>("#cold-open .scene-art")
}

// The printed plate lies exactly over the cover's first frame: same box, same edge mask, same crop and the dolly's start scale,
// which the scroll engine sets on the cover only once it is running, so the plate is registered again while it prints.
function registerPlate(plate: HTMLElement) {
  const art = coverArt()
  const img = art?.querySelector("img")
  if (!art || !img) return
  const box = art.getBoundingClientRect()
  const artStyle = getComputedStyle(art)
  const imgStyle = getComputedStyle(img)
  Object.assign(plate.style, { left: `${box.left}px`, top: `${box.top}px`, width: `${box.width}px`, height: `${box.height}px` })
  plate.style.maskImage = artStyle.maskImage
  plate.style.setProperty("-webkit-mask-image", artStyle.getPropertyValue("-webkit-mask-image") || artStyle.maskImage)
  plate.querySelectorAll<HTMLImageElement>("img").forEach((layer) => {
    Object.assign(layer.style, {
      left: `${img.offsetLeft}px`,
      top: `${img.offsetTop}px`,
      width: `${img.offsetWidth}px`,
      height: `${img.offsetHeight}px`,
      objectPosition: imgStyle.objectPosition,
      transform: imgStyle.transform,
      transformOrigin: imgStyle.transformOrigin,
    })
  })
}

// The stamp's flight into the top bar: from its box on the title to the bar's mark, by translate and scale only. It is the same
// art in both places, so the two boxes are matched whole.
function flight(mark: HTMLElement) {
  const to = document.querySelector("[data-wordmark] [data-brand-mark] svg")?.getBoundingClientRect()
  const from = mark.querySelector("[data-brand-mark] svg")?.getBoundingClientRect()
  if (!to || !from || !from.width) return null
  const scale = to.width / from.width
  const box = mark.getBoundingClientRect()
  const x = to.left - (from.left - box.left) * scale - box.left
  const y = to.top - (from.top - box.top) * scale - box.top
  return `translate(${x}px, ${y}px) scale(${scale})`
}

// the cover's own sources and copies, so the plate prints the very copy the cover shows and it is fetched once. Plain data, not
// elements: server elements handed to this client component suspend its hydration, and React then regenerates the whole page.
export type PlateCopies = { sources: { media?: string; type?: string; srcSet: string }[]; src: string; srcSet?: string }
type PreloaderProps = { plate?: PlateCopies }

// The first load of a session opens on a title sequence whose progress is what the cover needs (the page hydrated, the fonts,
// the cover plate decoded): the stamp hangs over the case file, breathing, while its ink comes through, and behind it the plate
// prints in coarser and coarser dots until it is the cover's first frame. At full ink the stamp comes down on the cover with a
// thud and a spread of ink; then the slate lifts off the plate, which is the cover itself, and the stamp, still crimson,
// flies into its place in the top bar. The stamp's loop runs for as long as the load does and the way out starts from
// whatever frame of it is on screen. A later load of the session keeps the loop and the way out over the slate alone; reduced
// motion shows the still, fully inked stamp and crossfades it. Scrolling waits for it.
export function Preloader({ plate }: PreloaderProps) {
  const root = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState("")

  // a page React had to render again from scratch gets its title back before it paints
  useLayoutEffect(() => {
    ;(window as Window & { __nawiBoot?: { revive?: () => void } }).__nawiBoot?.revive?.()
  }, [])

  useEffect(() => {
    const html = document.documentElement
    const node = root.current
    if (!node || !html.classList.contains("is-preloading")) return
    setStatus("Loading the portfolio")
    const mark = node.querySelector<HTMLElement>("[data-preloader-mark]")!
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const boot = (window as Window & { __nawiBoot?: { hydrated: number; printed: number } }).__nawiBoot
    const printed = reduced ? null : node.querySelector<HTMLElement>("[data-preloader-plate]")

    const hold = (event: Event) => {
      if (event instanceof KeyboardEvent && !SCROLL_KEYS.has(event.key)) return
      event.preventDefault()
      event.stopPropagation()
    }
    const held = ["wheel", "touchmove", "keydown"] as const
    held.forEach((type) => window.addEventListener(type, hold, { capture: true, passive: false }))
    const release = () => held.forEach((type) => window.removeEventListener(type, hold, { capture: true }))

    const timers: number[] = []
    let frame = 0
    let done = false
    const end = () => {
      if (done) return
      done = true
      release()
      html.classList.remove("is-preloading", "is-revisit", "is-landing")
      node.removeAttribute("data-state")
      setStatus("Portfolio loaded")
      try { sessionStorage.setItem(SEEN_KEY, "1") } catch {}
    }
    const land = () => {
      if (printed) registerPlate(printed)
      node.setAttribute("data-state", "landing")
      html.classList.add("is-landing")
      html.classList.remove("is-preloading")
      const to = flight(mark)
      if (!to) {
        timers.push(window.setTimeout(end, 600))
        return
      }
      const flying = { duration: 760, easing: "cubic-bezier(0.7, 0, 0.2, 1)", fill: "forwards" } as const
      // the wet ink settles into the bar's flat crimson on the way
      node.querySelector(".preloader-stamp-dry")?.animate([{ opacity: 0 }, { opacity: 1 }], flying)
      node.querySelector(".preloader-stamp-ink")?.animate([{ opacity: 1 }, { opacity: 0 }], flying)
      mark.animate([{ transform: "none" }, { transform: to }], flying).finished.then(end, end)
    }
    const leave = () => {
      if (reduced) {
        node.setAttribute("data-state", "fading")
        html.classList.remove("is-preloading")
        timers.push(window.setTimeout(end, 300))
        return
      }
      // the thud: the stamp comes down onto the cover from wherever its loop has it, the full impression at once and the ink
      // spreading from it
      const stamp = node.querySelector<HTMLElement>(".preloader-stamp")
      const looped = stamp ? getComputedStyle(stamp).transform : "none"
      node.setAttribute("data-state", "striking")
      stamp?.animate(
        [
          { transform: looped === "none" ? "translateY(-3%) scale(1.04)" : looped, easing: "cubic-bezier(0.55, 0, 1, 0.45)" },
          { transform: "scale(0.992) rotate(0.15deg)", offset: 0.5, easing: "cubic-bezier(0.2, 0, 0.2, 1)" },
          { transform: "none" },
        ],
        { duration: 240 },
      )
      node.querySelector(".preloader-stamp-flash")?.animate(
        [
          { opacity: 0, transform: "scale(1)" },
          { opacity: 0.7, transform: "scale(1)", offset: 0.3 },
          { opacity: 0, transform: "scale(1.14)" },
        ],
        { duration: 520, easing: "cubic-bezier(0.2, 0, 0.2, 1)" },
      )
      timers.push(window.setTimeout(land, 280))
    }
    // the plate is registered on the cover every few frames while it prints, so it follows the cover's layout and the dolly's
    // start scale; the ink and the reading are the head script's
    let ticks = 0
    const register = () => {
      if (printed && ticks++ % 6 === 0) registerPlate(printed)
      frame = requestAnimationFrame(register)
    }
    frame = requestAnimationFrame(register)
    const onPrinted = () => {
      cancelAnimationFrame(frame)
      leave()
    }
    window.addEventListener(PRINTED, onPrinted, { once: true })
    if (!boot) onPrinted()
    else {
      boot.hydrated = 1
      if (boot.printed) onPrinted()
    }

    return () => {
      window.removeEventListener(PRINTED, onPrinted)
      cancelAnimationFrame(frame)
      timers.forEach((timer) => window.clearTimeout(timer))
      release()
    }
  }, [])

  return (
    <>
      <StampSprite />
      {/* its --progress is the head script's from the first frame */}
      <div ref={root} data-preloader="" className="preloader" suppressHydrationWarning>
        <i className="preloader-slate" aria-hidden="true" />
        {plate && (
          <div data-preloader-plate="" className="preloader-plate" aria-hidden="true">
            {SCREENS.map((screen) => (
              <picture key={screen} className="preloader-screen" style={{ "--k": screen } as CSSProperties}>
                {plate.sources.map((source) => (
                  <source key={`${source.media}${source.type}`} media={source.media} type={source.type} srcSet={source.srcSet} sizes="100vw" />
                ))}
                {/* lazy only so React does not preload a second, WebP copy: on screen it is fetched at once, with the cover's own request */}
                <img src={plate.src} srcSet={plate.srcSet} sizes="100vw" alt="" loading="lazy" decoding="async" />
              </picture>
            ))}
          </div>
        )}
        <PreloaderFace />
      </div>
      <p className="sr-only" role="status" aria-live="polite">{status}</p>
    </>
  )
}
