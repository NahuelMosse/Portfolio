import { CreditsRoll, type RollBand } from "@/features/film"
import { ChapterIllustration } from "./chapter-illustration"
import { ChapterWord } from "./chapter-word"
import { ContactTiles } from "./contact-tiles"
import { credits, identity } from "./content"
import { Offer } from "./offer"
import { OfferMotion } from "./offer-motion"

const bands: readonly RollBand[] = [
  { id: "studies", label: "Education", speed: "slow", items: credits.studies },
  { id: "certifications", label: "Certifications", speed: "fast", items: credits.certifications },
]

// The offer over the two-doors illustration, then one red ending block: Let's talk, the contact tiles, the credits roll and the footer.
export function EndCredits() {
  return (
    <section data-chapter="end-credits" id="end-credits" className="credits">
      <OfferMotion />
      <ChapterIllustration asset="ill-offer-16x9" wideOnly className="offer-scene">
        <ChapterWord id="offer" heading="h2" numeral="04" note="Two doors">Offer</ChapterWord>
        <Offer />
      </ChapterIllustration>
      <ChapterIllustration asset="ill-contact-16x9" className="contact-scene">
        <div className="contact" id="contact">
          <ChapterWord id="contact" heading="h3" headingId="contact-title" numeral="05" note={identity.base}>Let&rsquo;s talk</ChapterWord>
          <ContactTiles />
        </div>
        <CreditsRoll bands={bands} />
        <footer className="end-of-file">© Nahuel Mosse — NAWI · END OF FILE</footer>
      </ChapterIllustration>
    </section>
  )
}
