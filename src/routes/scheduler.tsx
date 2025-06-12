import { Col, Row } from "react-bootstrap";
import React from "react";

import EventsCell from "../components/EventsCell";
import LocationsCell from "../components/LocationsCell";
import { formatDateSpan, getMonday, formatDateOnly } from "../components/Scheduler/helpers";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";

const LOCATION_STORAGE_KEY = "sfcarpool-last-location";

const getStoredLocation = (): number => {
  try {
    const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
    return stored ? Number(stored) : 1;
  } catch {
    return 1;
  }
};

const setStoredLocation = (locationId: number) => {
  try {
    localStorage.setItem(LOCATION_STORAGE_KEY, locationId.toString());
  } catch {
    console.error("Error setting stored location", locationId);
    // Silently fail if localStorage is not available
  }
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

export const Route = createFileRoute("/scheduler")({
  component: () => {
    const { location, week } = Route.useSearch();
    const loc = Number(location);

    // Save location to localStorage whenever it changes
    React.useEffect(() => {
      setStoredLocation(loc);
    }, [loc]);

    const start = week ? getMonday(new Date(week)) : getMonday(new Date());
    const end = new Date(start);
    end.setDate(start.getDate() + 4);

    const prevWeek = new Date(start);
    prevWeek.setDate(start.getDate() - 7);
    const nextWeek = new Date(start);
    nextWeek.setDate(start.getDate() + 7);

    const prevWeekStr = formatDateOnly(prevWeek);
    const nextWeekStr = formatDateOnly(nextWeek);

    // Check if we're using defaults
    const isCurrentWeek = !week;
    const defaultLocation = getStoredLocation();

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
            <LocationsCell locationId={loc} week={isCurrentWeek ? formatDateOnly(start) : week} />
          </Col>
        </Row>

        <EventsCell before={end} after={start} locationId={loc} />
      </>
    );
  },
  validateSearch: (search: Record<string, unknown>) => {
    const defaultLocation = getStoredLocation();
    const currentWeekStr = formatDateOnly(getMonday(new Date()));

    return {
      location: search.location ? Number(search.location) : defaultLocation,
      week: search.week && String(search.week) !== currentWeekStr ? String(search.week) : undefined,
    };
  },
});
