// Fingerprints every media file under public/film so a URL changes when, and only when, its content does.
// A key is the path under film/ without a leading r/<width>/ and without extension: the file, its other formats and its
// responsive copies share one version. Run as a script it writes features/film/presentation/media-versions.json.
import { createHash } from "node:crypto"
import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join, relative, sep } from "node:path"
import { fileURLToPath } from "node:url"

const VERSION_LENGTH = 8

function filesUnder(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? filesUnder(join(dir, entry.name)) : [join(dir, entry.name)],
  )
}

const keyOf = (path) => path.replace(/^r\/\d+\//, "").replace(/\.[^./]+$/, "")

/** @param {string} root a public/film folder @returns {Record<string, string>} */
export function mediaVersions(root) {
  const groups = new Map()
  for (const file of filesUnder(root)) {
    const path = relative(root, file).split(sep).join("/")
    const key = keyOf(path)
    groups.set(key, [...(groups.get(key) ?? []), { path, file }])
  }
  const versions = {}
  for (const key of [...groups.keys()].sort()) {
    const hash = createHash("sha1")
    for (const { path, file } of groups.get(key).sort((a, b) => (a.path < b.path ? -1 : 1))) {
      hash.update(path)
      hash.update(readFileSync(file))
    }
    versions[key] = hash.digest("hex").slice(0, VERSION_LENGTH)
  }
  return versions
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(process.cwd(), "public", "film")
  const out = join(process.cwd(), "features", "film", "presentation", "media-versions.json")
  writeFileSync(out, JSON.stringify(mediaVersions(root), null, 2) + "\n")
}
