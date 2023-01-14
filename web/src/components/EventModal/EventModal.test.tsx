import { render } from '@redwoodjs/testing/web'

import EventModal from './EventModal'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('EventModal', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<EventModal />)
    }).not.toThrow()
  })
})
