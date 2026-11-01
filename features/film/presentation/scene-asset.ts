import { existsSync } from "node:fs"
import { join } from "node:path"

// A generated asset is a declared gap until its file exists in public/film: the page never requests a file that is not there.
export function sceneAsset(id: string, extension: "webp" | "mp4"): string | undefined {
  const file = `${id}.${extension}`
  return existsSync(join(process.cwd(), "public", "film", file)) ? `/film/${file}` : undefined
}
