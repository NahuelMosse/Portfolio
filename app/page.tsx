import { FilmShell } from "@/features/film"
import { HeroPoster } from "@/features/portfolio/presentation/hero-poster"
import { Projects } from "@/features/portfolio/presentation/projects"
import { Experience } from "@/features/portfolio/presentation/experience"
import { EndCredits } from "@/features/portfolio/presentation/end-credits"
import { doorHref, offer } from "@/features/portfolio/presentation/content"
import { getStructuredData } from "@/lib/machine-readable"

// Offer: the screen ends where Let's talk begins, so the whole OFFER word is on screen and no red shows. Contact: its block fills the screen.
const CHAPTERS = [
  { id: "cold-open", label: "01 SUBJECT" },
  { id: "projects", label: "02 PROJECTS" },
  { id: "experience", label: "03 EXPERIENCE" },
  { id: "end-credits", label: "04 OFFER", land: { selector: ".contact-scene", edge: "bottom" } },
  { id: "contact", label: "05 CONTACT", heading: "#contact-title", land: { selector: ".contact-scene", edge: "top" } },
] as const

export default function Home() {
  const structuredData = getStructuredData()

  return (
    <>
      <FilmShell
        chapters={CHAPTERS}
        skipLabel="Skip intro"
        cta={{ label: "Let’s talk", href: "#end-credits" }}
        hire={{ label: "Hire me", href: doorHref(offer.freelance) }}
      >
        <HeroPoster />
        <Projects />
        <Experience />
        <EndCredits />
      </FilmShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </>
  )
}
