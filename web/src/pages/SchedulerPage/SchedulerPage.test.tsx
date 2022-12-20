import { render } from '@redwoodjs/testing/web'

import SchedulerPage from './SchedulerPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SchedulerPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SchedulerPage />)
    }).not.toThrow()
  })
})
