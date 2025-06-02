import { DateTime } from "luxon";
import { Col, Form, Row } from "react-bootstrap";

import EventsCell from "../components/EventsCell";
import LocationsCell from "../components/LocationsCell";
import {
  getWeekSpan,
  // getWeekdateSpanStr,
  getWeekStart,
  formatDateSpan,
  parseDateTime,
} from "../components/Scheduler/helpers";
// import { routes } from 'vinxi/dist/types/lib/plugins/routes'
import { createFileRoute, Link, useParams } from "@tanstack/react-router";

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
);

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
);

// function formatDate2(date) {
//   return date.toFormat('LLL dd, yyyy')
// }

const SchedulerPage = ({ locationXXX, week }: { locationXXX: number; week: string }) => {
  let start;

  // try {
  start = parseDateTime(week);
  // TODO: if it cant parse, set to today
  // } catch (error) {
  //   console.error(error)
  //   start = DateTime.now() //.toISODate()
  // }
  if (start.invalid) {
    start = DateTime.now(); //.toISODate()
  }

  if (start.weekday !== 1) {
    start = getWeekStart(parseDateTime(start));

    console.error("BAD WEEK START. SETTING TO ", start);
  }
  const end = start.plus({ days: 4 });

  const prevWeekStr = start.plus({ days: -7 }).toISODate();

  const nextWeekStr = start.plus({ days: 7 }).toISODate();

  const { location } = useParams({ strict: false });

  let loc = 1;
  if (!Number.isNaN(parseInt(location))) {
    // or check that its an int, or an existing location
    loc = Number(location);
  }

  const dateSpanStr = formatDateSpan(start, end);

  console.log("scheduler page location", loc, dateSpanStr);

  return (
    <>
      <Row style={{ paddingTop: "30px" }}>
        <Col xm={7}>
          <span className="nav-week">
            {/* <Link
              // style={{ padding: '10px' }}
              to={routes.scheduler({
                location: loc,
                week: prevWeekStr,
              })}
              activeClassName="active"
            >
              {caret_left}
            </Link> */}

            {dateSpanStr}

            {/* <Link
              // className="nav-link"
              to={routes.scheduler({
                location: loc,
                week: nextWeekStr,
              })}
              activeClassName="active"
            >
              {caret_right}
            </Link> */}
          </span>
        </Col>
        <Col xs="auto">
          <LocationsCell
            locationId={loc}
            // setLocationId={setLocationId}
            week={start.toISODate()}
          ></LocationsCell>
        </Col>
      </Row>

      <EventsCell before={end} after={start} locationId={loc} />
    </>
  );
};

// export default SchedulerPage;

export const Route = createFileRoute("/scheduler")({
  component: SchedulerPage,
  ssr: false,
});
