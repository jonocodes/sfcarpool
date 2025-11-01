import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

// Temporarily commented out due to missing @storybook/experimental-addon-test package
// import { storybookTest } from '@storybook/experimental-addon-test/vitest-plugin';

const dirname =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/writing-tests/test-addon
export default defineConfig({
  test: {
    globals: true,
    // Temporarily commented out Storybook workspace config due to missing package
    // workspace: [
    //   {
    //     extends: true,
    //     plugins: [
    //       // The plugin will run tests for the stories defined in your Storybook config
    //       // See options at: https://storybook.js.org/docs/writing-tests/test-addon#storybooktest
    //       storybookTest({ configDir: path.join(dirname, '.storybook') }),
    //     ],
    //     test: {
    //       name: 'storybook',
    //       browser: {
    //     enabled: true,
    //     headless: true,
    //     name: 'chromium',
    //     provider: 'playwright'
    //   },
    //       setupFiles: ['.storybook/vitest.setup.ts'],
    //     },
    //   },
    // ],
  },
});
