import type { ComponentMeta, ComponentStory } from '@storybook/react'

import SiteBootLayout from './SiteBootLayout'

export const generated: ComponentStory<typeof SiteBootLayout> = (args) => {
  return <SiteBootLayout {...args} />
}

export default {
  title: 'Layouts/SiteBootLayout',
  component: SiteBootLayout,
} as ComponentMeta<typeof SiteBootLayout>
