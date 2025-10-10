import { Col, Form, Row } from "react-bootstrap";

import EventsCell from "../components/EventsCell";
import LocationsCell from "../components/LocationsCell";
import { formatDateSpan } from "../components/Scheduler/helpers";
// import { routes } from 'vinxi/dist/types/lib/plugins/routes'
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";

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

// interface SchedulerSearchParams {
//   location?: number;
//   week?: string;
// }

const SchedulerPage = () => {
  const { location, week } = Route.useSearch();
  const start = new Date(week);
  const end = new Date(start.getTime() + 4 * 24 * 60 * 60 * 1000);
  const prevWeekStr = new Date(start.getTime() - 7 * 24 * 60 * 60 * 1000);
  const nextWeekStr = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
  const loc = location ?? "zzxdc";

  const dateSpanStr = formatDateSpan(start, end);

  return (
    <>
      <Row style={{ paddingTop: "30px" }}>
        <Col xm={7}>
          <span className="nav-week">
            <Link
              to="/scheduler"
              search={{
                location: loc,
                week: prevWeekStr.toISOString(),
              }}
            >
              {caret_left}
            </Link>

            {dateSpanStr}

            <Link
              to="/scheduler"
              search={{
                location: loc,
                week: nextWeekStr.toISOString(),
              }}
            >
              {caret_right}
            </Link>
          </span>
        </Col>
        <Col xs="auto">
          <LocationsCell locationId={loc} week={week}></LocationsCell>
        </Col>
      </Row>

      <EventsCell before={end} after={start} locationId={loc} />
    </>
  );
};
export const Route = createFileRoute("/scheduler")({
  validateSearch: (search: Record<string, unknown>) => ({
    location: search.location ? String(search.location) : "rstarst",
    week: search.week ? String(search.week) : new Date().toISOString(),
  }),
  component: SchedulerPage,
  ssr: false,
});
