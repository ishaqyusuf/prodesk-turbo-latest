import baseConfig from "../../tooling/eslint/base";
import reactConfig from "../../tooling/eslint/react";

/** @type {import('typescript-eslint').Config} */
export default [
  ...baseConfig,
  ...reactConfig,
  {
    ignores: [],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
];
