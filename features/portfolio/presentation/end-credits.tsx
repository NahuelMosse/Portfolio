import { Chapter, SceneMedia, sceneAsset } from "@/features/film"
import { identity, offer } from "./content"
import { Offer } from "./offer"

const mailto = (subject: string) => `mailto:${identity.email}?subject=${encodeURIComponent(subject)}`

export function EndCredits() {
  return (
    <Chapter id="end-credits" label="Contact" tone="dark" className="credits" title={<>Let&rsquo;s <em>talk</em></>}>
      <SceneMedia
        asset="pf-closing-16x9"
        poster={sceneAsset("pf-closing-16x9", "webp")}
        tallPoster={sceneAsset("pf-closing-9x16", "webp")}
        className="world-media"
      />
      <Offer />
      <div data-doors className="doors">
        <a className="door" href={mailto(offer.freelance.subject)}>{offer.freelance.door}</a>
        <a className="door" href={mailto(offer.tpm.subject)}>{offer.tpm.door}</a>
        <a className="door" href={identity.linkedin}>LinkedIn</a>
        <a className="door" href={identity.github}>GitHub</a>
      </div>
    </Chapter>
  )
}
