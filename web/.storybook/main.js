import path from 'path';

// Helper function to get absolute paths for packages
const getAbsolutePath = (packageName) =>
  path.dirname(require.resolve(path.join(packageName, 'package.json')));

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    // Use getAbsolutePath for Storybook's addons
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-storysource')
  ],
  framework: {
    // Use getAbsolutePath for the framework
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  viteFinal: (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...(config.resolve?.alias || {}),
          'src': path.resolve(__dirname, '../src')
        },
      },
    };
  },
};

export default config;