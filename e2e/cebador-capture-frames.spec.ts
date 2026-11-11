import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, statSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test, expect } from "@playwright/test";

const PIECES = path.join(process.cwd(), "public", "film", "pieces");
const LANDMARKS = path.join(process.cwd(), "scripts", "record-cebador.landmarks.json");
const CAPTURES = [
  { name: "cebador-1280", size: "960x540" },
  { name: "cebador-390", size: "360x780" },
];
const DURATION = 10.5;
const FPS = 30;

function probe(file: string) {
  const out = execFileSync("ffprobe", ["-v", "error", "-count_frames", "-select_streams", "v:0",
    "-show_entries", "stream=r_frame_rate,nb_read_frames,width,height", "-show_entries", "format=duration",
    "-of", "json", file]).toString();
  return JSON.parse(out) as { streams: { r_frame_rate: string; nb_read_frames: string; width: number; height: number }[]; format: { duration: string } };
}

function frameHashes(file: string): string[] {
  const out = execFileSync("ffmpeg", ["-v", "error", "-i", file, "-f", "framemd5", "-"], { maxBuffer: 1 << 28 }).toString();
  return out.split("\n").filter((l) => l && !l.startsWith("#")).map((l) => l.split(",").pop()!.trim());
}

function frameAt(file: string, second: number): string {
  const dir = mkdtempSync(path.join(tmpdir(), "cebador-"));
  const png = path.join(dir, "f.png");
  execFileSync("ffmpeg", ["-v", "error", "-ss", String(second), "-i", file, "-frames:v", "1", "-y", png]);
  return readFileSync(png).toString("base64");
}

test("each Cebador capture is 30 fps with a new picture on at least 95 % of its frames, 10.5 s long, under 1.5 MB, its poster its first frame @PF-6-S1 @PF-6-ASM-01", () => {
  for (const { name, size } of CAPTURES) {
    const file = path.join(PIECES, `${name}.webm`);
    expect(existsSync(file), name).toBe(true);
    const info = probe(file);
    const stream = info.streams[0];
    const [num, den] = stream.r_frame_rate.split("/").map(Number);
    expect(num / den, `${name} fps`).toBe(FPS);
    expect(`${stream.width}x${stream.height}`).toBe(size);
    expect(Number(stream.nb_read_frames)).toBe(DURATION * FPS);
    expect(Math.abs(Number(info.format.duration) - DURATION)).toBeLessThan(0.1);
    expect(statSync(file).size, `${name} bytes`).toBeLessThan(1.5 * 1024 * 1024);
    const hashes = frameHashes(file);
    const fresh = hashes.filter((h, i) => i > 0 && h !== hashes[i - 1]).length;
    expect(fresh / (hashes.length - 1), `${name} new pictures`).toBeGreaterThanOrEqual(0.95);
    const poster = path.join(PIECES, `${name}-poster.webp`);
    expect(existsSync(poster)).toBe(true);
    const dir = mkdtempSync(path.join(tmpdir(), "cebador-"));
    const first = path.join(dir, "first.png");
    const posterPng = path.join(dir, "poster.png");
    execFileSync("ffmpeg", ["-v", "error", "-i", file, "-frames:v", "1", "-y", first]);
    execFileSync("ffmpeg", ["-v", "error", "-i", poster, "-y", posterPng]);
    const ssim = spawnSync("ffmpeg", ["-i", first, "-i", posterPng, "-lavfi", "ssim", "-f", "null", "-"], { encoding: "utf8" }).stderr;
    const score = Number(/All:([0-9.]+)/.exec(ssim)?.[1]);
    expect(score, `${name} poster ssim`).toBeGreaterThan(0.97);
  }
});

test("the 1280 and 390 Cebador captures show the same section at the same second of the shared 10.5 s timeline @PF-6-ASM-04", () => {
  expect(existsSync(LANDMARKS), "landmarks written by the recorder").toBe(true);
  const marks = JSON.parse(readFileSync(LANDMARKS, "utf8")) as Record<string, { section: string; second: number }[]>;
  const wide = marks["1280"];
  const narrow = marks["390"];
  expect(wide.map((m) => m.section)).toEqual(["hero", "flavors", "origin", "ingredients", "reviews", "where-to-buy"]);
  expect(narrow).toEqual(wide);
  expect(wide[0].second).toBe(0);
  expect(wide[wide.length - 1].second).toBeLessThanOrEqual(DURATION);
  for (const { name } of CAPTURES) {
    const file = path.join(PIECES, `${name}.webm`);
    const shots = wide.map((m) => frameAt(file, Math.min(m.second, DURATION - 0.05)));
    expect(new Set(shots).size, `${name}: each section landmark shows its own picture`).toBe(wide.length);
  }
});
