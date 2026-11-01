import { globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTypeScript from "eslint-config-next/typescript"

const eslintConfig = [
  ...nextVitals,
  ...nextTypeScript,
  // kit tooling and the registry-installed catalog are not written here
  globalIgnores([".claude/**", "components/ui/**"]),
  {
    rules: {
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]

export default eslintConfig
