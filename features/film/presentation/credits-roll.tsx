import Image from "next/image"
import { Marquee } from "@/components/ui/marquee"

export type RollItem = { text: string; logo?: string }
export type RollBand = { id: string; label: string; speed: "slow" | "fast"; items: readonly RollItem[] }

function RollEntries({ items }: { items: readonly RollItem[] }) {
  return items.map((item) => (
    <li key={item.text} className="roll-item">
      {item.logo && <Image src={item.logo} alt="" width={32} height={32} />}
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
