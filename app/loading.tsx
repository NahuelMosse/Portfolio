import { PreloaderFace } from "@/features/film/presentation/preloader"

// While the page streams: the opening title, still, over the ink. The page's only h1 is the cold open's.
export default function Loading() {
  return (
    <main className="preloader" data-fallback="" aria-busy="true">
      <p className="sr-only">Nahuel Mosse</p>
      <PreloaderFace />
    </main>
  )
}
