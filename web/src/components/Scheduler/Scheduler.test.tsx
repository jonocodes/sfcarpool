import { render } from '@redwoodjs/testing/web'

import Scheduler from './Scheduler'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Scheduler', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Scheduler />)
    }).not.toThrow()
  })
})
