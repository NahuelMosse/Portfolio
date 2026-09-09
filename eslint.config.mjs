import nextVitals from "eslint-config-next/core-web-vitals"
import nextTypeScript from "eslint-config-next/typescript"
import reactHooks from "eslint-plugin-react-hooks"

/**
 * The extra rule needs the plugin registered in the same config object.
 * Without it ESLint refuses to run at all — `npm run lint` was failing with
 * "could not find plugin react-hooks" rather than reporting on the code.
 */
const eslintConfig = [
  ...nextVitals,
  ...nextTypeScript,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      // Vendored tooling that ships with installed skills — not our source.
      ".claude/**",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]

export default eslintConfig
