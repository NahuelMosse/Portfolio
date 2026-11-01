import type { ReactNode } from "react"
import { ScrollProgress } from "@/components/ui/scroll-progress"

// The page as one film: native scroll, a progress line and the chapters in order.
export function FilmShell({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <main id="main-content">{children}</main>
    </>
  )
}
