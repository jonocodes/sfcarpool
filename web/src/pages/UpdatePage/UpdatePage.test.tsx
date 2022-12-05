import { render } from '@redwoodjs/testing/web'

import UpdatePage from './UpdatePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('UpdatePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<UpdatePage />)
    }).not.toThrow()
  })
})
