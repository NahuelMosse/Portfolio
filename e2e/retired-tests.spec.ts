import { test, expect } from "@playwright/test"
import { readFileSync, readdirSync, existsSync } from "node:fs"

const RETIRED = "specs/PF-8-broken-tests-and-local-paths/retired.txt"
const REASON = /^#\s*(replaced by|retired:)/
const PREFIX = 30

const squash = (text: string) => text.replace(/\s+/g, " ").trim()

function logLines(): string[] {
  return readdirSync("specs")
    .map((dir) => `specs/${dir}/card.md`)
    .filter((card) => existsSync(card))
    .flatMap((card) => readFileSync(card, "utf8").split("\n"))
    .filter((line) => /\b(replaces|retires): /.test(line))
    .map(squash)
}

test("every test kept out of the gate names its reason and its Log line @PF-8-S1 @PF-8-ASM-01 @PF-8-ASM-02", () => {
  const logs = logLines()
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
    const [file, ...titlePath] = line.split(" › ")
    const title = squash(titlePath.at(-1) ?? "")
    if (!reason) problems.push(`no reason above: ${line}`)
    if (!existsSync(file) || !squash(readFileSync(file, "utf8")).includes(title.slice(0, PREFIX).replace(/'/g, "")) && !squash(readFileSync(file, "utf8")).includes(title.slice(0, PREFIX))) {
      problems.push(`not in its file: ${line}`)
    }
    const stem = title.slice(0, PREFIX)
    if (!logs.some((log) => log.includes(file) && log.includes(stem))) problems.push(`no Log line: ${line}`)
  }
  expect(listed).toBeGreaterThan(0)
  expect(problems).toEqual([])
})
