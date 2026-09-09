import { defineConfig, devices } from "@playwright/test"

const PORT = Number(process.env.PORT ?? 8701)
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : [["list"]],

  use: {
    baseURL: BASE_URL,
    // Motion is the product here — a video of a failing run is worth more
    // than a stack trace.
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],

  // Reuse a dev server if one is already up; otherwise start one.
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `npx next dev --port ${PORT}`,
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 180_000,
      },
})
