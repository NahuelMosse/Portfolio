import Image from "next/image"
import type { CSSProperties } from "react"
import type { PortfolioContent, TimelineEntry } from "@/lib/content/types"
import { Section, delay } from "@/components/ui/primitives"
import { cn } from "@/lib/utils"

// Procedural noise tile, inlined as a data-URI so the grain overlay has no
// network dependency — same trick as the global `.grain` utility, scoped
// locally since `--grain-tile` isn't defined at the root.
const GRAIN_TILE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect filter='url(%23n)' width='100%25' height='100%25'/%3E%3C/svg%3E\")"

export function Origins({ content }: { content: PortfolioContent }) {
  const { origins } = content

  return (
    <Section id="origins" eyebrow={origins.eyebrow} title={origins.title} intro={origins.intro}>
      <div className="relative space-y-16 md:space-y-24">
        {/* Continuous spine running the length of the timeline, only on desktop. */}
        <span
          aria-hidden
          className="absolute top-2 bottom-2 left-[7rem] hidden w-px bg-line-soft md:block"
        />

        {origins.entries.map((entry, i) => (
          <Entry key={entry.id} entry={entry} index={i} />
        ))}
      </div>
    </Section>
  )
}

function Entry({ entry, index }: { entry: TimelineEntry; index: number }) {
  const photoFirst = entry.photo && index % 2 === 1
  const eager = index < 2

  const text = (
    <div className="flex flex-col gap-3">
      <h3 className="text-xl md:text-2xl">{entry.title}</h3>
      <p className="max-w-[58ch] text-lg leading-relaxed text-fg-dim">{entry.body}</p>
    </div>
  )

  const photo = entry.photo ? (
    <TreatedPhoto photo={entry.photo} eager={eager} />
  ) : null

  return (
    <div
      className="relative grid gap-6 md:grid-cols-[7rem_1fr] md:gap-10"
      data-reveal
      style={delay(index * 90)}
    >
      <div className="flex items-start gap-3 md:block md:text-right">
        <span className="mono tnum text-accent">{entry.year}</span>
        {/* Sits on the spine at 7rem, centred on the 1px rule. */}
        <span
          aria-hidden
          className="mt-2 h-[7px] w-[7px] shrink-0 bg-accent md:absolute md:left-[calc(7rem-3px)] md:top-[9px] md:mt-0"
        />
      </div>

      <div className="flex flex-col gap-6">
        {photoFirst ? photo : null}
        {text}
        {!photoFirst ? photo : null}
      </div>
    </div>
  )
}

function TreatedPhoto({
  photo,
  eager,
}: {
  photo: { src: string; alt: string }
  eager: boolean
}) {
  return (
    /* Width is capped: at full column width these read as hero images and
       swamp the text they belong to. */
    <div
      className="group relative aspect-[4/3] w-full max-w-[34rem] overflow-hidden border border-line-soft"
      style={{ "--grain-tile": GRAIN_TILE } as CSSProperties}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        width={1200}
        height={800}
        sizes="(min-width:1024px) 46vw, 92vw"
        loading={eager ? "eager" : "lazy"}
        className={cn(
          "h-full w-full object-cover grayscale contrast-[1.08] brightness-[0.82] transition-[filter] duration-[600ms]",
          "group-hover:grayscale-0 group-hover:brightness-100",
        )}
      />
      {/* Duotone wash: accent composited with `color` blend mode reads as a
          tint over the desaturated photo, and fades out on hover so the
          image "returns to life" at full color. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-accent opacity-[0.14] transition-opacity duration-[600ms] group-hover:opacity-0"
        style={{ mixBlendMode: "color" }}
      />
      <div aria-hidden className="grain absolute inset-0" />
    </div>
  )
}
