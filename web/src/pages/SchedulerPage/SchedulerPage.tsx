import { useState } from 'react'

import { DateTime } from 'luxon'
import { Col, Form, Row } from 'react-bootstrap'

import { NavLink, routes, useParams } from '@redwoodjs/router'

import EventsCell from 'src/components/EventsCell'
import LocationsCell from 'src/components/LocationsCell'
import {
  getWeekSpan,
  getWeekdateSpanStr,
  getWeekStart,
} from 'src/components/Scheduler/helpers'

// function formatDate(dateStr) {
//   // return DateTime.fromISO(dateStr, { zone: 'utc' }).toFormat('ccc LLL dd yyyy')
//   return DateTime.fromISO(dateStr, { zone: 'utc' }).toFormat('LLL dd, yyyy')
// }

const caret_right = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-caret-right-fill"
    viewBox="0 0 16 16"
  >
    <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
  </svg>
)

const caret_left = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-caret-left-fill"
    viewBox="0 0 16 16"
  >
    <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
  </svg>
)

function formatDate2(date) {
  return date.toFormat('LLL dd, yyyy')
}

const SchedulerPage = ({ locationXXX, weekStart }) => {
  let start

  try {
    start = DateTime.fromISO(weekStart, { zone: 'utc' })
    // TODO: if it cant parse, set to today
  } catch (error) {
    console.error(error)
    start = DateTime.now() //.toISODate()
  }

  if (start.weekday !== 1) {
    start = getWeekStart(DateTime.fromISO(start, { zone: 'utc' }))

    console.error('BAD WEEK START. SETTING TO ', start)
  }
  const end = start.plus({ days: 4 })

  const prevWeekStr = start.plus({ days: -7 }).toISODate()

  const nextWeekStr = start.plus({ days: 7 }).toISODate()

  // const after = start

  // const [after, before] = getWeekSpan()

  // const [locationId, setLocationId] = useState(1)
  // const [locationId, setLocationId] = useState(location)
  const { location } = useParams()

  // const weekEnd = formatDate(before)
  // const weekStart = formatDate(after)

  const dateSpanStr = formatDate2(start) + ' - ' + formatDate2(end)

  console.log('scheduler page location', location, dateSpanStr)

  return (
    <>
      <Row style={{ paddingTop: '30px' }}>
        <Col xm={7}>
          <span className="nav-week">
            <NavLink
              // style={{ padding: '10px' }}
              to={routes.scheduler({
                location: location,
                weekStart: prevWeekStr,
              })}
            >
              {caret_left}
            </NavLink>

            {dateSpanStr}

            <NavLink
              // className="nav-link"
              to={routes.scheduler({
                location: location,
                weekStart: nextWeekStr,
              })}
            >
              {caret_right}
            </NavLink>
          </span>
        </Col>
        <Col xs="auto">
          <LocationsCell
          // setLocationId={setLocationId}
          ></LocationsCell>
        </Col>
      </Row>

      <EventsCell before={end} after={start} locationId={location} />
    </>
  )
}

export default SchedulerPage
