import baseConfig from "@gnd/eslint-config/base";
import reactConfig from "@gnd/eslint-config/react";

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
