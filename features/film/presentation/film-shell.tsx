import type { ReactNode } from "react"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { BackToTop } from "./back-to-top"
import { CallToAction } from "./call-to-action"
import type { ChapterLink } from "./chapter-index"
import { HireBar } from "./hire-bar"
import { MotionEngine } from "./motion-engine"
import { PlateLoader } from "./plate-loader"
import { TopBar } from "./top-bar"
import { sceneAsset } from "./scene-asset"

type FilmShellProps = {
  chapters: readonly ChapterLink[]
  cta: { label: string; href: string }
  children: ReactNode
}

// The page as one case file on one near-black canvas: native scroll, the top bar and the controls that never hold the visitor.
export function FilmShell({ chapters, cta, children }: FilmShellProps) {
  return (
    <>
      <MotionEngine />
      <PlateLoader />
      <TopBar chapters={chapters} soundSrc={sceneAsset("pf-soundtrack", "mp3")} />
      <aside aria-label="Page controls">
        <ScrollProgress />
        <div className="corner-pair">
          <BackToTop variant="corner" />
          <CallToAction label={cta.label} href={cta.href} />
        </div>
        <HireBar label={cta.label} href={cta.href} />
      </aside>
      <main id="main-content" className="film">
        {children}
      </main>
    </>
  )
}
