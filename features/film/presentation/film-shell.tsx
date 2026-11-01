import type { ReactNode } from "react"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { CallToAction } from "./call-to-action"
import { ChapterIndex, SkipIntro } from "./chapter-index"
import { CrimsonThread } from "./crimson-thread"
import { HireBar } from "./hire-bar"
import { HudRail } from "./hud-rail"
import { LampLight } from "./lamp-light"
import { sceneAsset } from "./scene-asset"
import { SceneMedia } from "./scene-media"
import { SoundToggle } from "./sound-toggle"

type FilmShellProps = {
  chapters: readonly { id: string; label: string }[]
  skipLabel: string
  cta: { label: string; href: string }
  hire: { label: string; href: string }
  children: ReactNode
}

// The page as one case file: native scroll, one desk and wall behind every chapter, one lamp light and one crimson thread
// through them, and the controls that never hold the visitor.
export function FilmShell({ chapters, skipLabel, cta, hire, children }: FilmShellProps) {
  return (
    <>
      <aside aria-label="Page controls">
        <ScrollProgress />
        <SkipIntro label={skipLabel} />
        <ChapterIndex chapters={chapters} />
        <HudRail chapters={chapters} />
        <SoundToggle src={sceneAsset("pf-soundtrack", "mp3")} />
        <CallToAction label={cta.label} href={cta.href} />
        <HireBar label={hire.label} href={hire.href} />
      </aside>
      <main id="main-content" className="film">
        <div data-fresco="" className="fresco" aria-hidden="true">
          <SceneMedia asset="pf-wall-strip-9x16" poster={sceneAsset("pf-wall-strip-9x16", "webp")} className="fresco-media" />
        </div>
        <LampLight />
        <span data-grain="" className="grain page-grain" aria-hidden="true" />
        <SceneMedia asset="pf-grain-1x1" poster={sceneAsset("pf-grain-1x1", "webp")} className="grain-texture" />
        {children}
        <CrimsonThread />
      </main>
    </>
  )
}
