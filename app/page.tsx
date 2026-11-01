import { FilmShell } from "@/features/film"
import { HeroPoster } from "@/features/portfolio/presentation/hero-poster"
import { Projects } from "@/features/portfolio/presentation/projects"
import { ProfileSeam } from "@/features/portfolio/presentation/profile-seam"
import { Experience } from "@/features/portfolio/presentation/experience"
import { EndCredits } from "@/features/portfolio/presentation/end-credits"
import { doorHref, offer } from "@/features/portfolio/presentation/content"
import { getStructuredData } from "@/lib/machine-readable"

const CHAPTERS = [
  { id: "cold-open", label: "01 SUBJECT" },
  { id: "projects", label: "02 PROJECTS" },
  { id: "experience", label: "03 EXPERIENCE" },
  { id: "end-credits", label: "04 OFFER" },
  { id: "contact", label: "05 CONTACT", heading: "#contact-title" },
]

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
        <ProfileSeam />
        <Experience />
        <EndCredits />
      </FilmShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </>
  )
}
