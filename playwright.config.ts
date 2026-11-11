import { defineConfig } from "@playwright/test"

const external = process.env.APP_URL
const port = process.env.PORT || "3100"

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: { baseURL: external || `http://localhost:${port}` },
  webServer: external
    ? undefined
    : {
        command: `npm run build && npx next start -p ${port}`,
        url: `http://localhost:${port}`,
        reuseExistingServer: true,
        timeout: 240_000,
      },
})
