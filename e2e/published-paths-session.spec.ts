import { test, expect } from "@playwright/test"
import { homedir } from "node:os"
import { pathToFileURL } from "node:url"

// required.mjs writes a session record by its file name only, so no home folder or drive reaches sessions.md.
test("a session record is written relative to the home folder @PF-8-ASM-03", async () => {
  const required = await import(pathToFileURL(`${process.cwd()}/.claude/tools/required.mjs`).href)
  const absolute = `${homedir()}\\.claude\\projects\\D--projects-Portfolio\\abc123.jsonl`
  const line: string = required.sessionLine(absolute)
  expect(line).toMatch(/ · abc123\.jsonl$/)
  expect(line).not.toContain(homedir())
  expect(line).not.toMatch(/[A-Za-z]:[\\/]|Users[\\/]/)
  expect(line).not.toContain("\\")
})
