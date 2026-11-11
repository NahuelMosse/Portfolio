import { FilmShell } from "@/features/film"
import { HeroPoster } from "@/features/portfolio/presentation/hero-poster"
import { Projects } from "@/features/portfolio/presentation/projects"
import { Experience } from "@/features/portfolio/presentation/experience"
import { EndCredits } from "@/features/portfolio/presentation/end-credits"
import { getStructuredData } from "@/lib/machine-readable"

// Wide, Offer ends the screen where Let's talk begins, so the whole OFFER word is on screen and no red shows, and Contact's block
// fills the screen. Elsewhere every chapter lands with its top just under the bar.
const CHAPTERS = [
  { id: "cold-open", label: "01 SUBJECT" },
  { id: "projects", label: "02 PROJECTS" },
  { id: "experience", label: "03 EXPERIENCE" },
  { id: "end-credits", label: "04 OFFER", land: { selector: ".contact-scene", edge: "bottom", wide: true } },
  { id: "contact", label: "05 CONTACT", heading: "#contact-title", land: { selector: ".contact-scene", edge: "top", wide: true } },
] as const

// The one invitation, to the contact scene: the corner call to action and the phone bar.
const TALK = { label: "Let’s talk", href: "#contact" }

export default function Home() {
  const structuredData = getStructuredData()

  return (
    <>
      <FilmShell
        chapters={CHAPTERS}
        cta={TALK}
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
