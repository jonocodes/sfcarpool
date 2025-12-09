import { Col, Form, Row } from "react-bootstrap";

import EventsCell from "../components/EventsCell";
import LocationsCell from "../components/LocationsCell";
import ConnectionStatus from "../components/ConnectionStatus";
import {
  getWeekStartStr,
  getWeekDates,
  getPreviousWeekStr,
  getNextWeekStr,
  getWeekDateSpanStr,
} from "../components/Scheduler/helpers";
// import { routes } from 'vinxi/dist/types/lib/plugins/routes'
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";

const LOCATION_STORAGE_KEY = "scheduler_selected_location";

// Helper functions for localStorage
const getStoredLocation = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LOCATION_STORAGE_KEY);
};

const setStoredLocation = (locationId: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCATION_STORAGE_KEY, locationId);
};

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

// interface SchedulerSearchParams {
//   location?: number;
//   week?: string;
// }

const SchedulerPage = () => {
  const { location, week } = Route.useSearch();
  const { start, end } = getWeekDates(week);
  const prevWeekStr = getPreviousWeekStr(week);
  const nextWeekStr = getNextWeekStr(week);
  const dateSpanStr = getWeekDateSpanStr(week);
  const loc = location ?? "zzxdc";

  // Save location to localStorage whenever it changes
  useEffect(() => {
    setStoredLocation(loc);
  }, [loc]);

  return (
    <>
      <ConnectionStatus />
      <Row style={{ paddingTop: "30px" }}>
        <Col xs={7}>
          <span className="nav-week">
            <Link
              to="/scheduler"
              search={{
                location: loc,
                week: prevWeekStr,
              }}
            >
              {caret_left}
            </Link>

            {dateSpanStr}

            <Link
              to="/scheduler"
              search={{
                location: loc,
                week: nextWeekStr,
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
    location: search.location
      ? String(search.location)
      : getStoredLocation() ?? "l5PQRRCiuSah4NFM_r6Ln",
    // TODO: validate week input
    week: search.week ? String(search.week) : getWeekStartStr(),
  }),
  component: SchedulerPage,
  ssr: false,
});
