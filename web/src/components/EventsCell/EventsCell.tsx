import { useState } from 'react'

import { DateTime } from 'luxon'
import { Col, Form, Row } from 'react-bootstrap'
import type { EventsQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { parseDateTime, rowsToDays as rowsToDates } from '../Scheduler/helpers'
import { Config, Event } from '../Scheduler/types'
import Week from '../Week/Week'

export const QUERY = gql`
  query EventsQuery($before: date, $after: date, $locationId: Int) {
    weekEvents: events(
      where: {
        location_id: { _eq: $locationId }
        date: { _gte: $after, _lte: $before }
        active: { _eq: true }
      }
    ) {
      active
      date
      end
      id
      passenger
      start
      label
      likelihood
    }
  }
`

const myConfig: Config = {
  startTime: '06:00',
  endTime: '11:00',
}

const rows = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

function gqlToEvent(item): Event {
  return {
    row: parseDateTime(item.date).weekday - 1,
    text: item.label,
    start: parseDateTime(item.start).toFormat('H:mm'),
    end: parseDateTime(item.end).toFormat('H:mm'),
    data: {
      entry: item.id,
      likelihood: item.likelihood,
      mode: item.passenger ? 'passenger' : 'driver',
    },
  }
}

export const Loading = () => <div>Loading events...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  weekEvents,
  before,
  after,
  locationId,
}: CellSuccessProps<EventsQuery>) => {
  const events = []

  for (let i = 0; i < weekEvents.length; i++) {
    if (weekEvents[i].active) {
      events.push(gqlToEvent(weekEvents[i]))
    }
  }

  const dates = rowsToDates(rows, after, before)

  return (
    <Row>
      <Week
        rows={rows}
        dates={dates}
        data={events}
        config={myConfig}
        locationId={locationId}
      />
    </Row>
  )
}
