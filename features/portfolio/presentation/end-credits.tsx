import { Chapter, CreditsRoll, Reveal, SceneMedia, sceneAsset, type RollBand } from "@/features/film"
import { credits, identity } from "./content"
import { Offer } from "./offer"

const bands: readonly RollBand[] = [
  { id: "studies", label: "Completed studies", speed: "slow", items: credits.studies },
  { id: "certifications", label: "Certifications", speed: "fast", items: credits.certifications },
]

const contactRows = [
  { id: "email", label: identity.email, href: `mailto:${identity.email}`, external: false },
  { id: "linkedin", label: "LinkedIn", href: identity.linkedin, external: true },
  { id: "github", label: "GitHub", href: identity.github, external: true },
] as const

// The offer, then Let's talk with its link rows beside the sealed file, the credits sheet and the roll, and the end of the file.
export function EndCredits() {
  return (
    <Chapter id="end-credits" label="04 · OFFER" subtitle="OPEN CASES // TWO DOORS" title="Offer" className="credits">
      <Offer />
      <div className="contact">
        <div className="contact-text">
          <p data-contact-label="" className="title-card contact-label">05 · CONTACT</p>
          <h3 id="contact-title" tabIndex={-1} className="poster-word chapter-title">Let&rsquo;s talk</h3>
          <ul className="contact-rows">
            {contactRows.map((row) => (
              <li key={row.id} data-secondary={row.id === "github" ? "" : undefined}>
                <a
                  data-contact={row.id === "github" ? undefined : row.id}
                  href={row.href}
                  {...(row.external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {row.label}
                  <span className="row-arrow" aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div data-sealed-file="" className="sealed-file">
          <SceneMedia
            asset="pf-file-sealed-16x9"
            poster={sceneAsset("pf-file-sealed-16x9", "webp")}
            tallPoster={sceneAsset("pf-file-sealed-9x16", "webp")}
            alt="The case file closed under the lamp, sealed in crimson wax"
            className="sealed-media"
          />
          <span data-stamp="case-open" className="stamp case-open">Case open</span>
        </div>
      </div>
      <div data-credits-sheet="" data-paper="credits-sheet" className="paper credits-sheet">
        <Reveal>
          <h3>Studies</h3>
          <ul>{credits.studies.map((item) => <li key={item.text}>{item.text}</li>)}</ul>
        </Reveal>
        <Reveal>
          <h3>Certifications</h3>
          <ul>{credits.certifications.map((item) => <li key={item.text}>{item.text}</li>)}</ul>
        </Reveal>
        <Reveal>
          <h3>Off duty</h3>
          <p data-off-duty="">{identity.offDuty}</p>
        </Reveal>
      </div>
      <CreditsRoll bands={bands} />
      <footer className="end-of-file">© Nahuel Mosse — NAWI · END OF FILE</footer>
    </Chapter>
  )
}
