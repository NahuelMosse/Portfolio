"use client"

import { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { readTokenAsLinearRgb } from "@/lib/color"

/* -------------------------------------------------------------------------- */
/* Shader                                                                      */
/* -------------------------------------------------------------------------- */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

/**
 * A flow field rendered as contour lines — the page's atmosphere.
 *
 * Domain-warped fBm produces the field; the fract() of that field, thresholded,
 * produces isolines that read as topography or a signal readout depending on
 * how fast they move. The pointer displaces the warp locally, so the surface
 * answers the cursor instead of merely looping.
 *
 * Ordered dithering at the end is deliberate: on a near-black gradient, 8-bit
 * output bands badly, and the Bayer noise that fixes it doubles as film grain.
 */
const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uPointer;      // in UV space
  uniform float uPointerForce; // 0 when the pointer has never moved
  uniform vec3  uAccent;
  uniform vec3  uBackground;
  uniform float uIntensity;    // global dimmer, also drives the intro fade-in

  // -- hash / value noise -------------------------------------------------
  float hash(vec2 p) {
    p = fract(p * vec2(233.34, 851.73));
    p += dot(p, p + 23.45);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f); // smoothstep
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float total = 0.0;
    float amplitude = 0.5;
    // Five octaves is where detail stops being visible at this scale.
    for (int i = 0; i < 5; i++) {
      total += noise(p) * amplitude;
      p = p * 2.02 + vec2(3.1, 1.7);
      amplitude *= 0.5;
    }
    return total;
  }

  // -- 8x8 ordered dither -------------------------------------------------
  float bayer(vec2 fragCoord) {
    vec2 p = floor(mod(fragCoord, 8.0));
    float index = p.x + p.y * 8.0;
    // Cheap approximation of a Bayer 8x8 matrix, good enough to break banding.
    return fract(index * 0.0625 + p.y * 0.125 + hash(p) * 0.06);
  }

  void main() {
    // Aspect-correct coordinates so the field doesn't stretch on wide screens.
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

    float t = uTime * 0.045;

    // Pointer pushes the field away from itself, falling off smoothly.
    vec2 pointer = vec2((uPointer.x - 0.5) * aspect, uPointer.y - 0.5);
    vec2 toPointer = p - pointer;
    float dist = length(toPointer);
    float influence = exp(-dist * 3.4) * uPointerForce;
    p += normalize(toPointer + 1e-5) * influence * 0.16;

    // Domain warping: noise displacing the input of more noise.
    vec2 q = vec2(fbm(p * 1.9 + vec2(0.0, t)), fbm(p * 1.9 + vec2(5.2, 1.3 - t)));
    vec2 r = vec2(
      fbm(p * 2.4 + 3.4 * q + vec2(1.7, 9.2) + t * 0.7),
      fbm(p * 2.4 + 3.4 * q + vec2(8.3, 2.8) - t * 0.5)
    );
    float field = fbm(p * 2.1 + 3.1 * r);

    // Contour lines from the fractional part of the field.
    float rings = field * 9.0 + influence * 2.2;
    float line = abs(fract(rings) - 0.5) * 2.0;
    float width = fwidth(rings) * 1.9 + 0.012;
    float contour = 1.0 - smoothstep(0.0, width, line);

    // Base wash: deep background lifting slightly where the field is high.
    vec3 color = mix(uBackground * 0.55, uBackground * 1.35, field);

    // Accent rides the contours, brightest near the pointer.
    float accentMask = contour * (0.20 + field * 0.55 + influence * 1.7);
    color = mix(color, uAccent, clamp(accentMask, 0.0, 0.92));

    // A second, sparser set of lines gives the field depth.
    float ghost = 1.0 - smoothstep(0.0, fwidth(rings * 0.34) * 2.2 + 0.02,
                                   abs(fract(rings * 0.34) - 0.5) * 2.0);
    color += uAccent * ghost * 0.055;

    // Vignette keeps the eye on the headline.
    float vignette = 1.0 - smoothstep(0.35, 1.15, length(p * vec2(0.82, 1.0)));
    color *= mix(0.28, 1.0, vignette);

    color *= uIntensity;

    // Dither before quantisation, not after.
    color += (bayer(gl_FragCoord.xy) - 0.5) * 0.016;

    gl_FragColor = vec4(color, 1.0);
  }
`

/* -------------------------------------------------------------------------- */
/* Field mesh                                                                  */
/* -------------------------------------------------------------------------- */

const ACCENT_FALLBACK = { r: 0.55, g: 1, b: 0.09 }
const BG_FALLBACK = { r: 0.007, g: 0.009, b: 0.014 }

/** Pulls a design token off <html> straight into a three.js colour. */
function applyToken(
  target: THREE.Color,
  property: string,
  fallback: { r: number; g: number; b: number },
) {
  const { r, g, b } = readTokenAsLinearRgb(property, fallback)
  // Values are already linear-light, which is what the shader samples.
  target.setRGB(r, g, b, THREE.LinearSRGBColorSpace)
}

function Field({ paused }: { paused: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null)
  const { size, viewport } = useThree()

  // Pointer is smoothed towards the raw target so the field glides.
  const pointer = useRef(new THREE.Vector2(0.5, 0.5))
  const pointerTarget = useRef(new THREE.Vector2(0.5, 0.5))
  const pointerForce = useRef(0)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uPointerForce: { value: 0 },
      uAccent: { value: new THREE.Color("#c3ff3d") },
      uBackground: { value: new THREE.Color("#12151b") },
      uIntensity: { value: 0 },
    }),
    [],
  )

  // Track the pointer on the window, not the canvas, so leaving the hero
  // decays the influence instead of freezing it.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerTarget.current.set(
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight,
      )
      pointerForce.current = 1
    }
    const onLeave = () => {
      pointerForce.current = 0
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerleave", onLeave)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  // Palette changes elsewhere on the page propagate into the shader.
  useEffect(() => {
    const sync = () => {
      const mat = material.current
      if (!mat) return
      applyToken(mat.uniforms.uAccent.value, "--accent", ACCENT_FALLBACK)
      applyToken(mat.uniforms.uBackground.value, "--bg", BG_FALLBACK)
    }
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-palette"],
    })
    return () => observer.disconnect()
  }, [])

  useFrame((_, delta) => {
    const mat = material.current
    if (!mat) return

    // Fade in on first frames; fade out (but keep rendering one last frame)
    // when the hero scrolls away, so there is never a hard cut.
    const targetIntensity = paused ? 0 : 1
    mat.uniforms.uIntensity.value = THREE.MathUtils.damp(
      mat.uniforms.uIntensity.value,
      targetIntensity,
      2.4,
      delta,
    )

    if (paused && mat.uniforms.uIntensity.value < 0.01) return

    mat.uniforms.uTime.value += Math.min(delta, 0.05)
    mat.uniforms.uResolution.value.set(size.width, size.height)

    pointer.current.lerp(pointerTarget.current, 1 - Math.pow(0.001, delta))
    mat.uniforms.uPointer.value.copy(pointer.current)
    mat.uniforms.uPointerForce.value = THREE.MathUtils.damp(
      mat.uniforms.uPointerForce.value,
      pointerForce.current,
      3,
      delta,
    )
  })

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}

/* -------------------------------------------------------------------------- */
/* Canvas shell                                                                */
/* -------------------------------------------------------------------------- */

export default function FieldCanvas({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas
      // Capped DPR: at 2x this shader is fill-rate bound for no visible gain.
      dpr={[1, 1.65]}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
        depth: false,
      }}
      // The Canvas only re-renders while it is on screen.
      frameloop={paused ? "demand" : "always"}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <Field paused={paused} />
    </Canvas>
  )
}
