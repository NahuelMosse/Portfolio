import { FilmShell } from "@/features/film"
import { HeroPoster } from "@/features/portfolio/presentation/hero-poster"
import { Projects } from "@/features/portfolio/presentation/projects"
import { Experience } from "@/features/portfolio/presentation/experience"
import { EndCredits } from "@/features/portfolio/presentation/end-credits"
import { getStructuredData } from "@/lib/machine-readable"

const CHAPTERS = [
  { id: "cold-open", label: "Cold open" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "end-credits", label: "Contact" },
]

export default function Home() {
  const structuredData = getStructuredData()

  return (
    <>
      <FilmShell chapters={CHAPTERS} skipLabel="Skip intro" cta={{ label: "Let’s talk", href: "#end-credits" }}>
        <HeroPoster />
        <Projects />
        <Experience />
        <EndCredits />
      </FilmShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </>
  )
}
