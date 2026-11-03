import Image from "next/image"
import { Marquee } from "@/components/ui/marquee"

// mark: a one-colour brand drawing painted in the text colour; ratio is its width over its height
export type RollItem = { text: string; logo?: string; mark?: { src: string; ratio: number } }
export type RollBand = { id: string; label: string; speed: "slow" | "fast"; items: readonly RollItem[] }

function RollEntries({ items }: { items: readonly RollItem[] }) {
  return items.map((item) => (
    <li key={item.text} className="roll-item">
      {item.logo && (
        // an issuer's logo is scene media for the ASM-10 rule: flat artwork, not a photo that needs a mask
        <span data-scene-media="logo" className="roll-logo">
          <Image src={item.logo} alt="" width={32} height={32} />
        </span>
      )}
      {item.mark && (
        <span
          data-roll-mark=""
          aria-hidden="true"
          className="roll-mark"
          style={{ maskImage: `url(${item.mark.src})`, WebkitMaskImage: `url(${item.mark.src})`, aspectRatio: item.mark.ratio }}
        />
      )}
      {item.text}
    </li>
  ))
}

// Two full-bleed bands moving right to left. Screen readers get one plain list per band;
// the looping copies are hidden from them.
export function CreditsRoll({ bands }: { bands: readonly RollBand[] }) {
  return (
    <div data-credits-roll="" className="credits-roll">
      {bands.map((band) => (
        <div key={band.id} data-band={band.id} role="group" aria-label={band.label} tabIndex={0} className="roll-band">
          <ul className="sr-only">
            <RollEntries items={band.items} />
          </ul>
          <Marquee
            aria-hidden="true"
            repeat={4}
            className="roll-marquee"
            style={{ ["--duration" as string]: `var(--motion-roll-${band.speed})` }}
          >
            <ul className="roll-list" aria-hidden="true">
              <RollEntries items={band.items} />
            </ul>
          </Marquee>
        </div>
      ))}
    </div>
  )
}
