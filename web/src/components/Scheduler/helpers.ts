import { DateTime } from 'luxon'

import { Event } from './types'

export function formatTime(val: number) {
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

export function getTimeSlots(
  tableStartTime: number,
  tableEndTime: number,
  widthTime: number
) {
  let time = tableStartTime
  const times = [time]
  while (time < tableEndTime) {
    time = time + widthTime
    times.push(time)
  }

  return times
}

export function getWeekStart(today: DateTime) {
  // the monday of the current work week
  // if the work week is over, get the next monday

  const day = today.weekday - 1

  // if (day == 5) diff = 2
  // if (day == 6) diff = 1

  let diff = -1 * day
  if (day >= 5) diff = 7 - day
  // else diff = -1 * day

  return today.plus({ days: diff })
}

export function getWeekSpan() {
  const todayStr = DateTime.now().toISODate()

  const start = getWeekStart(DateTime.fromISO(todayStr, { zone: 'utc' }))
  const end = start.plus({ days: 4 })

  const startStr = start.toISODate()
  const endStr = end.toISODate()

  // TODO: this shoult probably return DateTimes not Strings

  return [startStr, endStr]
}

export function eventToGql(evnt: Event, startDate: DateTime) {
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

export function parseDateTime(dateStr) {
  return DateTime.fromISO(dateStr, {
    zone: 'utc',
  })
}

export function rowsToDays(rows, startDateStr, endDateStr) {
  // let currentDate = DateTime.fromISO(startDateStr, { zone: 'utc' })
  let currentDate = parseDateTime(startDateStr)
  // const endDate = DateTime.fromISO(endDateStr, { zone: 'utc' })
  const endDate = parseDateTime(endDateStr)

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

export const CREATE_EVENT = gql`
  mutation CreateEventMutation($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
    }
  }
`

export const UPDATE_EVENT = gql`
  mutation UpdateEventMutation($id: Int!, $input: UpdateEventInput!) {
    updateEvent(id: $id, input: $input) {
      id
    }
  }
`

export const DELETE_EVENT = gql`
  mutation DeleteEventMutation($id: Int!) {
    deleteEvent(id: $id) {
      id
    }
  }
`
