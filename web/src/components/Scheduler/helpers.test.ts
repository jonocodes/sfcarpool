import { render } from '@redwoodjs/testing/web'

import { eventToGql } from './helpers'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SchedulerPage', () => {
  it('renders successfully', () => {
    const event = {
      row: 2,
      start: '09:10',
      end: '12:20',
      text: 'words',
      data: {
        entry: 0,
        mode: 'passenger',
        likelihood: 95,
      },
    }

    const gql_data = eventToGql(event, new Date(2020, 2, 20))

    // TODO: finish writing this
    expect(gql_data).toEqual({
      label: 'words',
    })
  })
})
