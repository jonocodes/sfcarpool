import { Col, Row } from "react-bootstrap";

import EventsCell from "../components/EventsCell";
import LocationsCell from "../components/LocationsCell";
import { formatDateSpan, getMonday, formatDateOnly } from "../components/Scheduler/helpers";
// import { routes } from 'vinxi/dist/types/lib/plugins/routes'
import { createFileRoute, Link } from "@tanstack/react-router";

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

export const Route = createFileRoute("/scheduler")({
  component: () => {
    const { location = "1", week } = Route.useSearch();
    const start = week ? new Date(week) : getMonday();
    const end = new Date(start);
    end.setDate(start.getDate() + 4);

    const prevWeek = new Date(start);
    prevWeek.setDate(start.getDate() - 7);
    const nextWeek = new Date(start);
    nextWeek.setDate(start.getDate() + 7);

    const prevWeekStr = formatDateOnly(prevWeek);
    const nextWeekStr = formatDateOnly(nextWeek);
    const loc = Number(location);

    const dateSpanStr = formatDateSpan(start, end);

    return (
      <>
        <Row style={{ paddingTop: "30px" }}>
          <Col xm={7}>
            <span className="nav-week">
              <Link
                to="/scheduler"
                search={{
                  location: String(loc),
                  week: prevWeekStr,
                }}
              >
                {caret_left}
              </Link>

              {dateSpanStr}

              <Link
                to="/scheduler"
                search={{
                  location: String(loc),
                  week: nextWeekStr,
                }}
              >
                {caret_right}
              </Link>
            </span>
          </Col>
          <Col xs="auto">
            <LocationsCell locationId={loc} week={week || formatDateOnly(start)} />
          </Col>
        </Row>

        <EventsCell before={end} after={start} locationId={loc} />
      </>
    );
  },
  validateSearch: (search: Record<string, unknown>) => {
    return {
      location: search.location ? search.location : 1,
      week: search.week ? String(search.week) : undefined,
    };
  },
});
