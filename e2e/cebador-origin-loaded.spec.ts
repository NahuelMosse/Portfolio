import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";

const ORIGIN = path.join(process.cwd(), "scripts", "record-cebador.origin.json");
const PIECES = path.join(process.cwd(), "public", "film", "pieces");
const PARTS = ["heading", "paragraph", "map", "stats"] as const;

type Frame = { n: number; fonts: string; heading: boolean; paragraph: boolean; map: boolean; stats: boolean };
type Width = { webm: string; sha256: string; frames: Frame[] };

test("on every frame of both Cebador captures where Origen is on screen, its heading, paragraph, map and four stats are at their final state and the fonts are loaded @PF-11-S3 @PF-11-ASM-02", () => {
  expect(existsSync(ORIGIN), "origin report written by the recorder").toBe(true);
  const report = JSON.parse(readFileSync(ORIGIN, "utf8")) as Record<string, Width>;
  expect(Object.keys(report).sort()).toEqual(["1280", "390"]);
  for (const [width, entry] of Object.entries(report)) {
    const file = path.join(PIECES, entry.webm);
    expect(createHash("sha256").update(readFileSync(file)).digest("hex"), `${width}: report matches the written webm`).toBe(entry.sha256);
    expect(entry.frames.length, `${width}: frames with Origen on screen`).toBeGreaterThan(30);
    for (const frame of entry.frames) {
      expect(frame.fonts, `${width} frame ${frame.n} fonts`).toBe("loaded");
      for (const part of PARTS) expect(frame[part], `${width} frame ${frame.n} ${part}`).toBe(true);
    }
  }
});
