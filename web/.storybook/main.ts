import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'
import path from 'path'

import { getPaths, importStatementPath } from '@redwoodjs/project-config'


const getAbsolutePath = (packageName: string): any =>
  path.dirname(require.resolve(path.join(packageName, 'package.json')));

const redwoodProjectPaths = getPaths()

const config: StorybookConfig = {
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {}
  },

  stories: [
    `${importStatementPath(
      redwoodProjectPaths.web.src
    )}/**/*.stories.@(js|jsx|ts|tsx|mdx)`,
  ],

  addons: [
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-storysource'),
  ],

  // Add viteFinal to handle the module resolution
  // viteFinal: (config) => {
  //   return mergeConfig(config, {
  //     resolve: {
  //       alias: {
  //         // Ensure internal storybook modules are properly resolved
  //         'storybook/internal': path.resolve(__dirname, '../node_modules/@storybook/internal'),
  //         // Add your project-specific aliases here
  //         'src': path.resolve(__dirname, '../src')
  //       },
  //     },
  //   })
  // }
}

export default config
