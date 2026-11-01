import { Chapter, CreditsRoll, SceneMedia, sceneAsset, type RollBand } from "@/features/film"
import { credits, identity, offer } from "./content"
import { Offer } from "./offer"

type Door = { subject: string; prompts: readonly string[] }

const mailto = ({ subject, prompts }: Door) => {
  const body = prompts.map((prompt, index) => `${index + 1}. ${prompt}`).join("\n")
  return `mailto:${identity.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

const bands: readonly RollBand[] = [
  { id: "studies", label: "Completed studies", speed: "slow", items: credits.studies },
  { id: "certifications", label: "Certifications", speed: "fast", items: credits.certifications },
]

export function EndCredits() {
  return (
    <Chapter id="end-credits" label="Contact" seamSide="right" className="credits" title={<>Let&rsquo;s <em>talk</em></>}>
      <SceneMedia
        asset="pf-closing-16x9"
        poster={sceneAsset("pf-closing-16x9", "webp")}
        tallPoster={sceneAsset("pf-closing-9x16", "webp")}
        className="world-media"
      />
      <Offer />
      <p className="contact-line">
        <a data-contact="email" href={`mailto:${identity.email}`}>{identity.email}</a>
        <a data-contact="linkedin" href={identity.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
      </p>
      <CreditsRoll bands={bands} />
      <div data-doors className="doors">
        <a className="door" href={mailto(offer.freelance)}>{offer.freelance.door}</a>
        <a className="door" href={mailto(offer.tpm)}>{offer.tpm.door}</a>
      </div>
      <p data-secondary="" className="secondary-link">
        <a href={identity.github} target="_blank" rel="noreferrer">GitHub</a>
      </p>
    </Chapter>
  )
}
