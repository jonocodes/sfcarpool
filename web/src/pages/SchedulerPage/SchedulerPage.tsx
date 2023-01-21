import { useState } from 'react'

import { DateTime } from 'luxon'
import { Col, Form, Row } from 'react-bootstrap'

import EventsCell from 'src/components/EventsCell'
import LocationsCell from 'src/components/LocationsCell'
import { getWeekSpan } from 'src/components/Scheduler/helpers'

function formatDate(dateStr) {
  // return DateTime.fromISO(dateStr, { zone: 'utc' }).toFormat('ccc LLL dd yyyy')
  return DateTime.fromISO(dateStr, { zone: 'utc' }).toFormat('LLL dd, yyyy')
}

const SchedulerPage = () => {
  const [after, before] = getWeekSpan()

  const [locationId, setLocationId] = useState(1)

  const weekEnd = formatDate(before)
  const weekStart = formatDate(after)

  return (
    <>
      <Row style={{ paddingTop: '30px' }}>
        <Col xm={7}>
          <h3>
            {weekStart} - {weekEnd}
          </h3>
        </Col>
        <Col xs="auto">
          <LocationsCell setLocationId={setLocationId}></LocationsCell>
        </Col>
      </Row>

      <EventsCell before={before} after={after} locationId={locationId} />
    </>
  )
}

export default SchedulerPage
