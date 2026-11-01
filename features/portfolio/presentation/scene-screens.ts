// Where the drawn screen sits in each project scene, in percent of the image. The key is the illustration's asset id.
export type ScreenBox = { left: number; top: number; width: number; height: number }

export const SCENE_SCREENS: Readonly<Record<string, ScreenBox>> = {
  "ill-scene-cebador-16x9": { left: 48.09, top: 47.29, width: 49.04, height: 39.96 },
  "ill-scene-cebador-4x5": { left: 13.64, top: 52.57, width: 80.39, height: 34.24 },
  "ill-scene-club-16x9": { left: 44.68, top: 9.03, width: 20.22, height: 74.81 },
  "ill-scene-club-4x5": { left: 43.14, top: 19.47, width: 50.45, height: 75.82 },
  "ill-scene-grit-16x9": { left: 71.29, top: 8.61, width: 20.51, height: 79.06 },
  "ill-scene-grit-4x5": { left: 44.39, top: 21.75, width: 48.22, height: 73.75 },
  "ill-scene-kit-16x9": { left: 36.78, top: 34.43, width: 45.45, height: 43.36 },
  "ill-scene-kit-4x5": { left: 7.22, top: 52.85, width: 86.1, height: 29.89 },
  "ill-scene-triaje-16x9": { left: 47.61, top: 36.45, width: 49.04, height: 44.21 },
  "ill-scene-triaje-4x5": { left: 8.38, top: 49.86, width: 84.94, height: 31.88 },
}

// Pixel size of each cut of a scene, to turn the screen's percentages into proportions.
export const SCENE_SIZES = {
  "16x9": { width: 1672, height: 941 },
  "4x5": { width: 1122, height: 1402 },
} as const
