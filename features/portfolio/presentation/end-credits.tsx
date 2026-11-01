import { Chapter } from "@/features/film/presentation/chapter"
import { identity, offer } from "./content"

const mailto = (subject: string) => `mailto:${identity.email}?subject=${encodeURIComponent(subject)}`

export function EndCredits() {
  return (
    <Chapter id="end-credits" label="Contact" tone="dark" className="credits" title={<>Let&rsquo;s <em>talk</em></>}>
      <div data-offer className="offer">
        {[offer.freelance, offer.tpm].map((door) => (
          <div key={door.title}>
            <h3>{door.title}</h3>
            <p>{door.line}</p>
          </div>
        ))}
      </div>
      <div data-doors className="doors">
        <a className="door" href={mailto(offer.freelance.subject)}>Hire me for a project</a>
        <a className="door" href={mailto(offer.tpm.subject)}>Talk about a role</a>
        <a className="door" href={identity.linkedin}>LinkedIn</a>
        <a className="door" href={identity.github}>GitHub</a>
      </div>
    </Chapter>
  )
}
