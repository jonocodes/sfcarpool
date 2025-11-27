// This file has been automatically migrated to valid ESM format by Storybook.
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import { createRequire } from "module";
import path, { dirname } from "path";
import { mergeConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-onboarding", "@chromatic-com/storybook", "@storybook/addon-docs"],
  framework: { name: "@storybook/react-vite", options: {} },
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          // "@electric-sql/react": path.resolve(__dirname, "../src/electric-sql-react.mock.ts"),
        },
      },
    });
  },
};
export default config;
