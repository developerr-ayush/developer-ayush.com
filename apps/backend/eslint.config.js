import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    // Legacy API routes and AI/editor helpers predate the strict rules and are
    // intentionally untouched (their behaviour is a public contract).
    files: ["app/api/**", "lib/ai-config.ts", "lib/editorjs.ts", "lib/oauth.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "prefer-const": "off",
      "turbo/no-undeclared-env-vars": "off",
    },
  },
];
