import type { ReactNode } from "react"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { CallToAction } from "./call-to-action"
import { ChapterIndex, SkipIntro } from "./chapter-index"
import { CrimsonThread } from "./crimson-thread"
import { sceneAsset } from "./scene-asset"
import { SceneMedia } from "./scene-media"
import { SoundToggle } from "./sound-toggle"

type FilmShellProps = {
  chapters: readonly { id: string; label: string }[]
  skipLabel: string
  cta: { label: string; href: string }
  children: ReactNode
}

// The page as one film: native scroll, one fresco behind every chapter, one crimson thread through them,
// and the controls that never hold the visitor.
export function FilmShell({ chapters, skipLabel, cta, children }: FilmShellProps) {
  return (
    <>
      <ScrollProgress />
      <SkipIntro label={skipLabel} />
      <ChapterIndex chapters={chapters} />
      <SoundToggle src={sceneAsset("pf-soundtrack", "mp3")} />
      <CallToAction label={cta.label} href={cta.href} />
      <main id="main-content" className="film">
        <div data-fresco="" className="fresco" aria-hidden="true">
          <SceneMedia asset="pf-fresco-strip-9x16" poster={sceneAsset("pf-fresco-strip-9x16", "webp")} className="fresco-media" />
        </div>
        {children}
        <CrimsonThread />
      </main>
    </>
  )
}
