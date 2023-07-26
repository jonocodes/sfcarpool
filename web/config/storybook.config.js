const webpack = require('webpack')

module.exports = {
  /**
   * This line adds all of Storybook's essential addons.
   *
   * @see {@link https://storybook.js.org/addons/tag/essentials}
   */
  addons: ['@storybook/addon-essentials', '@storybook/addon-storysource'],

  webpackFinal: async (config, { configType }) => {
    configType === 'PRODUCTION' &&
      config.plugins.push(
        new webpack.ProvidePlugin({
          mockGraphQLQuery: ['@redwoodjs/testing/web', 'mockGraphQLQuery'],
          mockGraphQLMutation: [
            '@redwoodjs/testing/web',
            'mockGraphQLMutation',
          ],
          mockCurrentUser: ['@redwoodjs/testing/web', 'mockCurrentUser'],
        })
      )
    return config
  },

  // stories: [
  //   '../src/components/EventsCell/EventsCell.stories.*', // default page
  //   '../src/**/*.stories.*',
  // ],
}
