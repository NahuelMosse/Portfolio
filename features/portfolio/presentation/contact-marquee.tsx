import "./contact-marquee.css"
import { Arrow, Glyph } from "./contact-glyphs"
import { github, linkedin } from "./contact-channels"
import { useCopy } from "./contact-copy"
import { identity } from "./content"

const EMAILS_PER_SET = 3

// One run of the ticker: the address, a star, the address. Two identical sets make the loop seamless.
function Run() {
  const [name, domain] = identity.email.split("@")
  return (
    <span className="band-set">
      {Array.from({ length: EMAILS_PER_SET }, (_, i) => (
        <span key={i} className="band-item">
          {name}
          <span className="band-at">@</span>
          {domain}
          <span className="band-star">✦</span>
        </span>
      ))}
    </span>
  )
}

type HalfProps = { channel: typeof linkedin | typeof github }

// One full-width half: the network in big capitals, its handle in mono; it inverts on hover and focus.
function Half({ channel }: HalfProps) {
  return (
    <a data-contact={channel.id} className="band-half" href={channel.href} target="_blank" rel="noopener noreferrer">
      <Glyph name={channel.id} />
      <span className="half-word">{channel.label}</span>
      <span className="half-handle">
        {channel.host}/{channel.handle}
      </span>
      <Arrow />
    </a>
  )
}

// Variant C: the address runs as a giant ticker band on a slight diagonal; below, the two networks as inverting halves.
export function MarqueeBand() {
  const { copied, copy } = useCopy(identity.email)

  return (
    <>
      <div className="band-field">
        <button type="button" data-copy="" data-copied={copied ? "" : undefined} className="band" aria-label={`Copy ${identity.email}`} onClick={copy}>
          <span className="band-track" aria-hidden="true">
            <Run />
            <Run />
          </span>
        </button>
      </div>
      <p className="band-hint">
        <span>Click the band to copy the address</span>
        <span data-copy-status="" aria-live="polite" className="band-status">
          {copied ? "Copied" : ""}
        </span>
        <a data-contact="email" className="band-mail" href={`mailto:${identity.email}`}>
          Or open your mail app <Arrow />
        </a>
      </p>
      <div className="band-halves">
        <Half channel={linkedin} />
        <div data-secondary="" className="band-slot">
          <Half channel={github} />
        </div>
      </div>
    </>
  )
}
