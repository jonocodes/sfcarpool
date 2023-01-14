import { render } from '@redwoodjs/testing/web'

import SiteBootLayout from './SiteBootLayout'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SiteBootLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SiteBootLayout />)
    }).not.toThrow()
  })
})
