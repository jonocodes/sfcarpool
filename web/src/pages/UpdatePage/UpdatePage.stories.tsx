import type { ComponentMeta } from '@storybook/react'

import UpdatePage from './UpdatePage'

export const generated = () => {
  return <UpdatePage />
}

export default {
  title: 'Pages/UpdatePage',
  component: UpdatePage,
} as ComponentMeta<typeof UpdatePage>
