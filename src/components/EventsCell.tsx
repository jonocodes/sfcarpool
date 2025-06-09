// import React from "react";
// import { useQuery } from '@tanstack/react-query'
import { Row, Spinner } from "react-bootstrap";
import { parseDateTime, rowsToDays as rowsToDates, dbToEvent } from "./Scheduler/helpers";
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

const Loading = () => <Spinner animation="border" />;

const Failure = ({ error }: { error: Error }) => (
  <div style={{ color: "red" }}>Error: {error.message}</div>
);

const EventsCell = ({
  before,
  after,
  locationId,
}: {
  before: Date;
  after: Date;
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
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Failure error={error} />;
  }

  const events: Event[] = dbEvents
    .filter((event) => event.active && event.location_id === locationId)
    .map(dbToEvent);
  const dates = rowsToDates(rows, after, before);

  // debugger;

  return (
    <Row>
      <Week
        rows={rows}
        dates={dates}
        config={myConfig}
        locationId={locationId}
        data={events}
        provideCreateRandom={false}
        children={null}
      />
    </Row>
  );
};

export default EventsCell;
