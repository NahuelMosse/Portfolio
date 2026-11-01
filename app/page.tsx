import { FilmShell } from "@/features/film/presentation/film-shell"
import { HeroPoster } from "@/features/portfolio/presentation/hero-poster"
import { Projects } from "@/features/portfolio/presentation/projects"
import { Experience } from "@/features/portfolio/presentation/experience"
import { EndCredits } from "@/features/portfolio/presentation/end-credits"
import { getStructuredData } from "@/lib/machine-readable"

export default function Home() {
  const structuredData = getStructuredData()

  return (
    <>
      <FilmShell>
        <HeroPoster />
        <Projects />
        <Experience />
        <EndCredits />
      </FilmShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </>
  )
}
