import { CreditsRoll, type RollBand } from "@/features/film"
import { ChapterIllustration } from "./chapter-illustration"
import { ChapterWord } from "./chapter-word"
import { ContactTiles } from "./contact-tiles"
import { credits, identity } from "./content"
import { Offer } from "./offer"

const bands: readonly RollBand[] = [
  { id: "studies", label: "Completed studies", speed: "slow", items: credits.studies },
  { id: "certifications", label: "Certifications", speed: "fast", items: credits.certifications },
]

// The offer over the two-doors illustration, the roll, then Let's talk over the sealing illustration with the footer on its red ground.
export function EndCredits() {
  return (
    <section data-chapter="end-credits" id="end-credits" className="credits">
      <ChapterIllustration asset="ill-offer-16x9" className="offer-scene">
        <ChapterWord id="offer" heading="h2" numeral="04" note="Two doors">Offer</ChapterWord>
        <Offer />
      </ChapterIllustration>
      <CreditsRoll bands={bands} />
      <ChapterIllustration asset="ill-contact-16x9" className="contact-scene">
        <div className="contact" id="contact">
          <ChapterWord id="contact" heading="h3" headingId="contact-title" numeral="05" note={identity.base}>Let&rsquo;s talk</ChapterWord>
          <ContactTiles />
        </div>
        <footer className="end-of-file">© Nahuel Mosse — NAWI · END OF FILE</footer>
      </ChapterIllustration>
    </section>
  )
}
