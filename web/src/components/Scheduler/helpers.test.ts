// import { render } from '@redwoodjs/testing/web'

import { DateTime } from 'luxon'

import { eventToGql, getWeekStart } from './helpers'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('eventToGql', () => {
  it('converts successfully', () => {
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

    const gql_data = eventToGql(event, new DateTime(2020, 2, 20))

    // TODO: finish writing this
    expect(gql_data).toEqual({
      label: 'words',
      active: true,
      date: '2020-02-20T00:00:00Z',
      start: '1970-01-10T09:10:00Z',
      end: '1970-01-10T12:20:00Z',
      likelihood: 95,
      locationId: 1,
      passenger: true,
    })
  })
})

describe('getWeekStart', () => {
  it('calculates successfully', () => {
    const thisMonday = DateTime.fromISO('2023-01-09', {
      zone: 'utc',
    })
    const nextMonday = DateTime.fromISO('2023-01-16', {
      zone: 'utc',
    })

    expect(
      getWeekStart(
        DateTime.fromISO('2023-01-10', {
          // sat
          zone: 'utc',
        })
      )
    ).toEqual(thisMonday)

    expect(
      getWeekStart(
        DateTime.fromISO('2023-01-14', {
          // sat
          zone: 'utc',
        })
      )
    ).toEqual(nextMonday)
  })
})
