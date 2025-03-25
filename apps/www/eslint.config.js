import baseConfig, { restrictEnvAccess } from "@gnd/eslint-config/base";
import { customConfig } from "@gnd/eslint-config/custom";
import nextjsConfig from "@gnd/eslint-config/nextjs";
import reactConfig from "@gnd/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
    {
        ignores: [".next/**"],
    },
    ...baseConfig,
    ...reactConfig,
    ...nextjsConfig,
    ...restrictEnvAccess,
    ...customConfig,
];

