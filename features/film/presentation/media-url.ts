import versions from "./media-versions.json"

const VERSIONS: Record<string, string> = versions

// "/film/r/960/pieces/x.webp" → "pieces/x": the file, its other formats and its responsive copies share one version.
const keyOf = (path: string) =>
  path
    .replace(/^\/film\//, "")
    .replace(/^r\/\d+\//, "")
    .replace(/\.[^./]+$/, "")

// A /film path with the version of its files (scripts/media-versions.mjs), so a changed file is a new URL.
export function mediaUrl(path: string): string {
  const version = VERSIONS[keyOf(path)]
  return version ? `${path}?v=${version}` : path
}
