import { Hero } from "@/components/sections/hero"
import { Origins } from "@/components/sections/origins"
import { Education } from "@/components/sections/education"
import { Projects } from "@/components/sections/projects"
import { Certifications } from "@/components/sections/certifications"
import { Present } from "@/components/sections/present"
import { Contact } from "@/components/sections/contact"
import { ScrollSnapContainer } from "@/components/scroll-snap-container"
import { GlassNavigation } from "@/components/glass-navigation"

export default function Home() {
  return (
    <>
      <ScrollSnapContainer>
        <Hero />
        <Origins />
        <Education />
        <Projects />
        <Certifications />
        <Present />
        <Contact />
      </ScrollSnapContainer>
      <GlassNavigation />
    </>
  )
}
