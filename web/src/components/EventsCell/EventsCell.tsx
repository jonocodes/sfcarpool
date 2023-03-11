import { useState } from 'react'

import { useSubscription } from '@apollo/react-hooks'
import { DateTime } from 'luxon'
import {
  Col,
  Container,
  Form,
  Placeholder,
  Row,
  Spinner,
} from 'react-bootstrap'
import type { EventsQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { parseDateTime, rowsToDays as rowsToDates } from '../Scheduler/helpers'
import { Config, Event } from '../Scheduler/types'
import Week from '../Week/Week'

export const QUERY = gql`
  query EventsQuery($before: date, $after: date, $locationId: Int) {
    weekEvents: events(limit: 1) {
      id
    }
  }
`

export const SUBSCRIPTION = gql`
  subscription EventsSubscription(
    $before: date
    $after: date
    $locationId: Int
  ) {
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

// export const Loading = () => <div>Loading events...</div>

// export const Loading = () => (
//   <div>
//     <Placeholder xs={6} />
//     <Placeholder className="w-75" /> <Placeholder style={{ width: '25%' }} />
//   </div>
// )

export const Loading = () => (
  <Row className="justify-content-md-center">
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </Row>
)

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  weekEvents,
  before,
  after,
  locationId,
}: CellSuccessProps<EventsQuery>) => {

  // NOTE: EventsQuery is a dummy query while I figure out how to integrate the subsciption as the main query into the redwood cell.

  const { data, loading } = useSubscription(SUBSCRIPTION, {
    variables: { before, after, locationId },
  })

  // console.log('sub weekEvents', data)

  let events = []

  if (data && data.weekEvents) {
    events = []

    for (let i = 0; i < data.weekEvents.length; i++) {
      if (data.weekEvents[i].active) {
        events.push(gqlToEvent(data.weekEvents[i]))
      }
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
