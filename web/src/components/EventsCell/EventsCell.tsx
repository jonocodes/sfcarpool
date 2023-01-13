import { DateTime } from 'luxon'
import { Col, Container, Form, Row } from 'react-bootstrap'
import type { EventsQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import {
  formatTime,
  parseDateTime,
  rowsToDays as rowsToDates,
} from '../Scheduler/helpers'
import { Config, Event } from '../Scheduler/types'
import Week from '../Week/Week'

export const QUERY = gql`
  query EventsQuery($before: Date, $after: Date, $locationId: Int) {
    weekEvents(before: $before, after: $after, locationId: $locationId) {
      id
      createdAt
      updatedAt
      label
      date
      start
      end
      passenger
      likelihood
      active
      locationId
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

export const Loading = () => <div>Loading...</div>

// export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

function formatDate(dateStr) {
  return DateTime.fromISO(dateStr, { zone: 'utc' }).toFormat('ccc LLL dd yyyy')
}

export const Success = ({
  weekEvents,
  before,
  after,
  locationId,
}: CellSuccessProps<EventsQuery>) => {
  const _events = []

  for (let i = 0; i < weekEvents.length; i++) {
    if (weekEvents[i].active) {
      _events.push(gqlToEvent(weekEvents[i]))
    }
  }

  console.log(_events)

  const locationText = 'North Berkeley BART -> SF Financial District'

  const weekEnd = formatDate(before)
  const weekStart = formatDate(after)
  const dates = rowsToDates(rows, after, before)

  return (
    <Container>
      <Row style={{ paddingTop: '30px' }}>
        <Col xm={7}>
          <h3>
            {weekStart} - {weekEnd}
          </h3>
        </Col>
        <Col xs="auto">
          <Form.Select>
            <option aria-label="location" value={locationId}>
              {locationText}
            </option>
          </Form.Select>
        </Col>
      </Row>
      <Row>
        <Week rows={rows} dates={dates} data={_events} config={myConfig} />
      </Row>
    </Container>
  )
}
