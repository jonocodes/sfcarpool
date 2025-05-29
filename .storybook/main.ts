import type { StorybookConfig } from "@storybook/react-vite";
import { createRequire } from "module";
import path from "path";
import { mergeConfig } from "vite";

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test",
  ],
  framework: { name: "@storybook/react-vite", options: {} },
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@electric-sql/react": path.resolve(__dirname, "../src/electric-sql-react.mock.ts"),
        },
      },
    });
  },
};
export default config;
