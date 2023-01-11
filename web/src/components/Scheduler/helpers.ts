import { DateTime } from 'luxon'

import { Event } from './types'

export function formatTime(val) {
  const i1 = val % 3600

  const h = '' + (Math.floor(val / 36000) || '') + Math.floor((val / 3600) % 10)
  const i = '' + Math.floor(i1 / 600) + Math.floor((i1 / 60) % 10)
  return h + ':' + i
}

export function calcStringTime(str) {
  const slice = str.split(':')
  const h = Number(slice[0]) * 60 * 60
  const i = Number(slice[1]) * 60
  return h + i
}

// export function eventToGql(evnt: Event, startDate: Date) {
//   const passenger = evnt.data.mode == 'passenger'

//   // TODO: use DateTime instead of Date

//   const _date = new Date(startDate.getTime() + evnt.row * 24 * 60 * 60 * 1000)
//   const dateStr = _date.toISOString()

//   let start = evnt.start
//   if (start.length == 4) start = '0' + start

//   let end = evnt.end
//   if (end.length == 4) end = '0' + end

//   return {
//     // id: evnt.data.entry,
//     label: evnt.text,
//     passenger,
//     locationId: 1,
//     start: '1970-01-10T' + start + ':00Z',
//     end: '1970-01-10T' + end + ':00Z',
//     date: dateStr,
//     likelihood: Number(evnt.data.likelihood),
//     active: true,
//   }
// }

export function eventToGql2(evnt: Event, startDate: DateTime) {
  const passenger = evnt.data.mode == 'passenger'

  const date = startDate.plus({ days: evnt.row })
  const dateStr = date.toISO()

  let start = evnt.start
  if (start.length == 4) start = '0' + start

  let end = evnt.end
  if (end.length == 4) end = '0' + end

  return {
    // id: evnt.data.entry,
    label: evnt.text,
    passenger,
    locationId: 1,
    start: '1970-01-10T' + start + ':00Z',
    end: '1970-01-10T' + end + ':00Z',
    date: dateStr,
    likelihood: Number(evnt.data.likelihood),
    active: true,
  }
}

export function rowsToDays(rows, startDateStr, endDateStr) {
  let currentDate = DateTime.fromISO(startDateStr, { zone: 'utc' })
  const endDate = DateTime.fromISO(endDateStr, { zone: 'utc' })

  const dates = []

  while (currentDate <= endDate) {
    dates.push(currentDate)
    currentDate = currentDate.plus({ days: 1 })
  }

  console.log('dates', dates)

  if (rows.length != dates.length)
    throw new Error('Row count and day span do not match')

  return dates
}
