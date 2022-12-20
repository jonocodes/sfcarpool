import type { ComponentMeta } from '@storybook/react'

import SchedulerPage from './SchedulerPage'

export const generated = () => {
  return <SchedulerPage />
}

export default {
  title: 'Pages/SchedulerPage',
  component: SchedulerPage,
} as ComponentMeta<typeof SchedulerPage>
