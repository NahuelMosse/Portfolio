/**
 * OKLCH → linear sRGB.
 *
 * The design tokens are authored in OKLCH because it keeps perceived lightness
 * stable when the accent mutates between sections. WebGL needs linear RGB and
 * `THREE.Color` cannot parse OKLCH, so we convert here rather than duplicating
 * every colour as a hex fallback.
 *
 * Reference: Björn Ottosson's Oklab, https://bottosson.github.io/posts/oklab/
 */

export interface Rgb {
  r: number
  g: number
  b: number
}

const CLAMP = (v: number) => Math.min(1, Math.max(0, v))

/** Parses `oklch(L C H)` / `oklch(L C H / A)`, with L as a number or percent. */
export function parseOklch(input: string): [number, number, number] | null {
  const match = input
    .trim()
    .match(/^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/.*)?\)$/i)
  if (!match) return null

  const [, rawL, rawC, rawH] = match
  const l = rawL.endsWith("%") ? parseFloat(rawL) / 100 : parseFloat(rawL)
  return [l, parseFloat(rawC), parseFloat(rawH)]
}

/** OKLCH to linear-light sRGB, unclamped channels clipped to gamut. */
export function oklchToLinearRgb(l: number, c: number, hDeg: number): Rgb {
  const h = (hDeg * Math.PI) / 180
  const a = c * Math.cos(h)
  const bb = c * Math.sin(h)

  // Oklab → LMS (cube roots)
  const l_ = l + 0.3963377774 * a + 0.2158037573 * bb
  const m_ = l - 0.1055613458 * a - 0.0638541728 * bb
  const s_ = l - 0.0894841775 * a - 1.291485548 * bb

  const L = l_ * l_ * l_
  const M = m_ * m_ * m_
  const S = s_ * s_ * s_

  // LMS → linear sRGB
  return {
    r: CLAMP(4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S),
    g: CLAMP(-1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S),
    b: CLAMP(-0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S),
  }
}

const srgbEncode = (v: number) =>
  v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055

/** Linear sRGB to a `#rrggbb` string, for anything that expects CSS. */
export function linearRgbToHex({ r, g, b }: Rgb): string {
  const channel = (v: number) =>
    Math.round(CLAMP(srgbEncode(v)) * 255)
      .toString(16)
      .padStart(2, "0")
  return `#${channel(r)}${channel(g)}${channel(b)}`
}

/**
 * Resolves a CSS custom property to linear RGB.
 * Handles OKLCH directly and falls back to the browser for every other
 * notation (hex, rgb(), named colours).
 */
export function resolveCssColorToLinearRgb(
  value: string,
  fallback: Rgb = { r: 0, g: 0, b: 0 },
): Rgb {
  const raw = value.trim()
  if (!raw) return fallback

  const oklch = parseOklch(raw)
  if (oklch) return oklchToLinearRgb(...oklch)

  const rgbMatch = raw.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i)
  if (rgbMatch) {
    const toLinear = (v: number) => {
      const n = v / 255
      return n <= 0.04045 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4)
    }
    return {
      r: toLinear(parseFloat(rgbMatch[1])),
      g: toLinear(parseFloat(rgbMatch[2])),
      b: toLinear(parseFloat(rgbMatch[3])),
    }
  }

  const hexMatch = raw.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (hexMatch) {
    const hex = hexMatch[1]
    const full =
      hex.length === 3
        ? hex
            .split("")
            .map((ch) => ch + ch)
            .join("")
        : hex
    const toLinear = (v: number) => {
      const n = v / 255
      return n <= 0.04045 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4)
    }
    return {
      r: toLinear(parseInt(full.slice(0, 2), 16)),
      g: toLinear(parseInt(full.slice(2, 4), 16)),
      b: toLinear(parseInt(full.slice(4, 6), 16)),
    }
  }

  return fallback
}

/** Reads a custom property off <html> and resolves it. */
export function readTokenAsLinearRgb(property: string, fallback: Rgb): Rgb {
  if (typeof window === "undefined") return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    property,
  )
  return resolveCssColorToLinearRgb(value, fallback)
}
