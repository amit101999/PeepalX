import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * ESLint flat config.
 *
 * Next.js 16 removed `next lint`; linting runs through the ESLint CLI
 * (`npm run lint` -> `eslint .`) using the flat configs that
 * `eslint-config-next` now ships directly.
 */
export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  // .agents and .claude hold vendored agent skills (third-party scripts), not app code.
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "coverage/**",
    "next-env.d.ts",
    ".agents/**",
    ".claude/**",
  ]),
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
]);
