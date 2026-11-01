import { Chapter, CreditsRoll, SceneMedia, SeamFigure, sceneAsset, type RollBand } from "@/features/film"
import { credits, doorHref, identity, offer } from "./content"
import { Offer } from "./offer"

const bands: readonly RollBand[] = [
  { id: "studies", label: "Completed studies", speed: "slow", items: credits.studies },
  { id: "certifications", label: "Certifications", speed: "fast", items: credits.certifications },
]

// The offer, the credits sheet with the two doors, and the case file closed under the lamp with its seal.
export function EndCredits() {
  return (
    <Chapter
      id="end-credits"
      label="Contact"
      number="04"
      seam={<SeamFigure side="right" toward="end-credits" asset="pf-him-profile" photo="profile" />}
      className="credits"
      title={<>Let&rsquo;s <em>talk</em></>}
    >
      <Offer />
      <p className="contact-line">
        <a data-contact="email" href={`mailto:${identity.email}`}>{identity.email}</a>
        <a data-contact="linkedin" href={identity.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
      </p>
      <div data-credits-sheet="" data-paper="credits-sheet" className="credits-sheet">
        <SceneMedia asset="pf-paper-torn-16x9" poster={sceneAsset("pf-paper-torn-16x9", "webp")} className="torn-edge" />
        <p data-off-duty="" className="off-duty">{identity.offDuty}</p>
        <CreditsRoll bands={bands} />
        <div data-doors className="doors">
          <a className="door" href={doorHref(offer.freelance)}>{offer.freelance.door}</a>
          <a className="door" href={doorHref(offer.tpm)}>{offer.tpm.door}</a>
        </div>
      </div>
      <p data-secondary="" className="secondary-link">
        <a href={identity.github} target="_blank" rel="noreferrer">GitHub</a>
      </p>
      <div data-sealed-file="" data-lamp-target="" className="sealed-file">
        <SceneMedia
          asset="pf-file-sealed-16x9"
          poster={sceneAsset("pf-file-sealed-16x9", "webp")}
          tallPoster={sceneAsset("pf-file-sealed-9x16", "webp")}
          alt="The case file closed under the lamp, sealed in crimson wax"
          className="sealed-media"
        />
      </div>
    </Chapter>
  )
}
