import { Hero } from "@/components/sections/hero"
import { Origins } from "@/components/sections/origins"
import { Education } from "@/components/sections/education"
import { ProfessionalProjects } from "@/components/sections/professional-projects"
import { PersonalProjects } from "@/components/sections/personal-projects"
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
        <ProfessionalProjects />
        <PersonalProjects />
        <Certifications />
        <Present />
        <Contact />
      </ScrollSnapContainer>
      <GlassNavigation />
    </>
  )
}
