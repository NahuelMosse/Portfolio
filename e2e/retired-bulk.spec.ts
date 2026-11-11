import { test, expect } from "@playwright/test"
import { readFileSync, readdirSync, existsSync } from "node:fs"

const RETIRED = "specs/PF-8-broken-tests-and-local-paths/retired.txt"
const REASON = /^#\s*(replaced by|retired:)/
const BULK_REASON = "# retired: PF-1 frozen suite retired by the user; covered by e2e/smoke.spec.ts"
const BULK_LOG = "retires: every test whose title carries a @PF-1- tag"
const PREFIX = 30

const squash = (text: string) => text.replace(/\s+/g, " ").trim()
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

// A title built from a template literal is found by matching it against the template, each `${…}` standing for any text.
const sourceHasTitle = (source: string, title: string) => {
  const flat = squash(source)
  if (flat.includes(title.slice(0, PREFIX))) return true
  return [...flat.matchAll(/`([^`]*\$\{[^`]*)`/g)].some(([, template]) =>
    new RegExp(`^${template.split(/\$\{[^}]*\}/).map(escape).join("[^]{1,60}?")}$`).test(title),
  )
}

function logLines(): string[] {
  return readdirSync("specs")
    .map((dir) => `specs/${dir}/card.md`)
    .filter((card) => existsSync(card))
    .flatMap((card) => readFileSync(card, "utf8").split("\n"))
    .filter((line) => /\b(replaces|retires): /.test(line))
    .map(squash)
}

test("every test kept out of the gate names its reason and its Log line, the PF-1 suite by the requester's one decision @PF-8-S1 @PF-8-ASM-01 @PF-8-ASM-02 @PF-8-ASM-04", () => {
  const logs = logLines()
  expect(logs.some((log) => log.includes(BULK_LOG)), "the bulk retires: Log line").toBe(true)
  expect(existsSync("e2e/smoke.spec.ts"), "the smoke suite that covers the retired PF-1 suite").toBe(true)
  let reason = ""
  const problems: string[] = []
  let listed = 0
  for (const raw of readFileSync(RETIRED, "utf8").split("\n")) {
    const line = raw.trim()
    if (!line) continue
    if (line.startsWith("#")) {
      if (REASON.test(line)) reason = line
      continue
    }
    listed++
    const [name, ...titlePath] = line.split(" › ")
    const file = `e2e/${name}`
    const title = squash(titlePath.at(-1) ?? "")
    if (!reason) problems.push(`no reason above: ${line}`)
    if (!existsSync(file) || !sourceHasTitle(readFileSync(file, "utf8"), title)) problems.push(`not in its file: ${line}`)
    if (reason === BULK_REASON) {
      if (!titlePath.some((part) => part.includes("@PF-1-"))) problems.push(`under the PF-1 reason without a PF-1 tag: ${line}`)
      continue
    }
    const stem = title.slice(0, PREFIX)
    if (!logs.some((log) => log.includes(file) && log.includes(stem))) problems.push(`no Log line: ${line}`)
  }
  expect(listed).toBeGreaterThan(0)
  expect(problems).toEqual([])
})
