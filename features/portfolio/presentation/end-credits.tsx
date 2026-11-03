import { CreditsRoll, type RollBand } from "@/features/film"
import { ChapterIllustration } from "./chapter-illustration"
import { ChapterWord } from "./chapter-word"
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

// The offer over the two-doors illustration, Let's talk over the sealing illustration, then the credits sheet and the roll.
export function EndCredits() {
  return (
    <section data-chapter="end-credits" id="end-credits" className="credits">
      <ChapterIllustration asset="ill-offer-16x9" className="offer-scene">
        <ChapterWord id="offer" heading="h2" numeral="04" note="Two doors">Offer</ChapterWord>
        <Offer />
      </ChapterIllustration>
      <ChapterIllustration asset="ill-contact-16x9" className="contact-scene">
        <div className="contact" id="contact">
          <ChapterWord id="contact" heading="h3" headingId="contact-title" numeral="05" note={identity.base}>Let&rsquo;s talk</ChapterWord>
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
      </ChapterIllustration>
      <div data-credits-sheet="" className="credits-sheet">
        <section>
          <h3>Studies</h3>
          <ul>{credits.studies.map((item) => <li key={item.text}>{item.text}</li>)}</ul>
        </section>
        <section>
          <h3>Certifications</h3>
          <ul>{credits.certifications.map((item) => <li key={item.text}>{item.text}</li>)}</ul>
        </section>
      </div>
      <CreditsRoll bands={bands} />
      <footer className="end-of-file">© Nahuel Mosse — NAWI · END OF FILE</footer>
    </section>
  )
}
