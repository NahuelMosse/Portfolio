import type { ReactNode } from "react"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { CallToAction } from "./call-to-action"
import type { ChapterLink } from "./chapter-index"
import { CrimsonThread } from "./crimson-thread"
import { HireBar } from "./hire-bar"
import { sceneAsset } from "./scene-asset"
import { SceneMedia } from "./scene-media"
import { TopBar } from "./top-bar"

type FilmShellProps = {
  chapters: readonly ChapterLink[]
  skipLabel: string
  cta: { label: string; href: string }
  hire: { label: string; href: string }
  children: ReactNode
}

// The page as one case file on one near-black canvas: native scroll, the top bar, one crimson thread through the chapters,
// and the controls that never hold the visitor.
export function FilmShell({ chapters, skipLabel, cta, hire, children }: FilmShellProps) {
  return (
    <>
      <TopBar chapters={chapters} skipLabel={skipLabel} hire={hire} soundSrc={sceneAsset("pf-soundtrack", "mp3")} />
      <aside aria-label="Page controls">
        <ScrollProgress />
        <CallToAction label={cta.label} href={cta.href} />
        <HireBar label={hire.label} href={hire.href} />
      </aside>
      <main id="main-content" className="film">
        <span data-grain="" className="grain page-grain" aria-hidden="true" />
        <SceneMedia asset="pf-grain-1x1" poster={sceneAsset("pf-grain-1x1", "webp")} className="grain-texture" />
        {children}
        <CrimsonThread />
      </main>
    </>
  )
}
