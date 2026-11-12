import { test, expect } from "@playwright/test"
import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { homedir } from "node:os"
import { extname } from "node:path"
import { pathToFileURL } from "node:url"

// A real user path has a name after Users; a placeholder such as <windows user> does not match.
const LOCAL_USER_PATH = /(?:[A-Za-z]:[\\/]|[\\/][a-z][\\/])Users[\\/][^\\/<>\s"'`]+[\\/]/i
const BINARY = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".ico", ".mp4", ".webm", ".woff", ".woff2", ".ttf", ".otf", ".pdf", ".zip"])

test("no published file carries a local Windows user path @PF-8-S2", () => {
  const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
    .split("\0")
    .filter((file) => file && !BINARY.has(extname(file).toLowerCase()))
  const offenders = files.filter((file) => {
    let text: string
    try {
      text = readFileSync(file, "utf8")
    } catch {
      return false
    }
    if (text.includes("\0")) return false
    return LOCAL_USER_PATH.test(text)
  })
  expect(offenders).toEqual([])
})

test("a session record is written relative to the home folder @PF-8-ASM-03", async () => {
  const required = await import(pathToFileURL(`${process.cwd()}/.claude/tools/required.mjs`).href)
  const absolute = `${homedir()}\\.claude\\projects\\D--projects-Portfolio\\abc123.jsonl`
  const line: string = required.sessionLine(absolute)
  expect(line).toContain(" · ~/.claude/projects/D--projects-Portfolio/abc123.jsonl")
  expect(line).not.toContain(homedir())
  expect(line).not.toContain("\\")
})
