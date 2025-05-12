import React from 'react'
// import { useQuery } from '@tanstack/react-query'
import { Row, Spinner } from 'react-bootstrap'
import { parseDateTime, rowsToDays as rowsToDates } from '../Scheduler/helpers'
import { Config, Event } from '../Scheduler/types'
import Week from '../Week/Week'

// Mock data for events
const mockEvents = [
  {
    id: 1,
    label: 'Morning Carpool',
    date: '2025-05-13',
    start: '07:00',
    end: '08:00',
    active: true,
    passenger: true,
    likelihood: 0.9,
  },
  {
    id: 2,
    label: 'Evening Carpool',
    date: '2025-05-12',
    start: '17:00',
    end: '18:00',
    active: true,
    passenger: false,
    likelihood: 0.8,
  },
]

// export const QUERY = gql`
//   query EventsQuery($before: date, $after: date, $locationId: Int) {
//     weekEvents: events(limit: 1) {
//       id
//       label
//     }
//   }
// `

// export const SUBSCRIPTION = gql`
//   subscription EventsSubscription(
//     $before: date
//     $after: date
//     $locationId: Int
//   ) {
//     weekEvents: events(
//       where: {
//         location_id: { _eq: $locationId }
//         date: { _gte: $after, _lte: $before }
//         active: { _eq: true }
//       }
//     ) {
//       active
//       date
//       end
//       id
//       passenger
//       start
//       label
//       likelihood
//     }
//   }
// `



// Mock API call to fetch events
const fetchEvents = async ({ queryKey }: { queryKey: any[] }) => {
  const [, { before, after, locationId }] = queryKey
  console.log('Fetching events with:', { before, after, locationId })
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockEvents)
    }, 500) // Simulate network delay
  })
}

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

export const Loading = () => (
  <Row className="justify-content-md-center">
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </Row>
)

export const Failure = ({ error }: { error: Error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

const EventsCell = ({
  before,
  after,
  locationId,
}: {
  before: string
  after: string
  locationId: number
}) => {
  // const { data, isLoading, isError, error } = useQuery(
  //   ['events', { before, after, locationId }],
  //   fetchEvents
  // )

  const data = mockEvents
  const isLoading = false // Replace with actual loading state
  const isError = false // Replace with actual error state
  const error = null // Replace with actual error object

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <Failure error={error as Error} />
  }

  let events = []

  if (data) {
    events = (data as typeof mockEvents)
      .filter((event) => event.active)
      .map(gqlToEvent)
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

export default EventsCell
