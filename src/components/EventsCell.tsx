// import React from "react";
// import { useQuery } from '@tanstack/react-query'
import { Row, Spinner } from "react-bootstrap";
import { parseDateTime, rowsToDays as rowsToDates } from "./Scheduler/helpers";
import { Config } from "./Scheduler/types";
import Week from "./Week";

import { Event, EventInDb } from "~/utils/models";
import { useShape } from "@electric-sql/react";

// Mock data for events
// const mockEvents = [
//   {
//     id: 1,
//     label: "Morning Carpool",
//     date: "2025-05-13",
//     start: "07:00",
//     end: "08:00",
//     active: true,
//     passenger: true,
//     likelihood: 50,
//   },
//   {
//     id: 2,
//     date: "2025-05-12",
//     start: "07:45",
//     end: "08:15",
//     active: true,
//     passenger: false,
//     likelihood: 80,
//   },
// ];

const myConfig: Config = { startTime: "06:00", endTime: "11:00" };

const rows = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function dbToEvent(item: EventInDb): Event {
  return {
    row: parseDateTime(item.date).weekday - 1,
    text: item.label || "Untitled Event",
    start: parseDateTime(item.start).toFormat("H:mm"),
    end: parseDateTime(item.end).toFormat("H:mm"),
    data: {
      entry: item.id,
      likelihood: item.likelihood,
      mode: item.passenger ? "passenger" : "driver",
    },
  };
}

export const Loading = () => (
  <Row className="justify-content-md-center">
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </Row>
);

export const Failure = ({ error }: { error: Error }) => (
  <div style={{ color: "red" }}>Error: {error?.message}</div>
);

const EventsCell = ({
  before,
  after,
  locationId,
}: {
  before: string;
  after: string;
  locationId: number;
}) => {
  const {
    data: dbEvents,
    isLoading,
    error,
  } = useShape<EventInDb>({
    url: "http://localhost:5133/v1/shape",
    params: {
      table: "events",
      // offset: -1 // Assuming electric-sql handles this or has a different way
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Failure error={error} />;
  }

  const events: Event[] = dbEvents.filter((event) => event.active).map(dbToEvent);
  const dates = rowsToDates(rows, after, before);

  return (
    <Row>
      <Week
        rows={rows}
        dates={dates}
        data={events}
        config={myConfig}
        locationId={locationId}
        provideCreateRandom={false}
        children={null}
      />
    </Row>
  );
};

export default EventsCell;
