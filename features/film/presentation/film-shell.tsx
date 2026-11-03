import type { ReactNode } from "react"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { CallToAction } from "./call-to-action"
import type { ChapterLink } from "./chapter-index"
import { HireBar } from "./hire-bar"
import { MotionEngine } from "./motion-engine"
import { TopBar } from "./top-bar"
import { sceneAsset } from "./scene-asset"

type FilmShellProps = {
  chapters: readonly ChapterLink[]
  skipLabel: string
  cta: { label: string; href: string }
  hire: { label: string; href: string }
  children: ReactNode
}

// The page as one case file on one near-black canvas: native scroll, the top bar and the controls that never hold the visitor.
export function FilmShell({ chapters, skipLabel, cta, hire, children }: FilmShellProps) {
  return (
    <>
      <MotionEngine />
      <TopBar chapters={chapters} skipLabel={skipLabel} hire={hire} soundSrc={sceneAsset("pf-soundtrack", "mp3")} />
      <aside aria-label="Page controls">
        <ScrollProgress />
        <CallToAction label={cta.label} href={cta.href} />
        <HireBar label={hire.label} href={hire.href} />
      </aside>
      <main id="main-content" className="film">
        {children}
      </main>
    </>
  )
}
