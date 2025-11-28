// import React from "react";
// import { useQuery } from '@tanstack/react-query'
import { Row, Spinner } from "react-bootstrap";
import { rowsToDays as rowsToDates } from "./Scheduler/helpers";
import { Config } from "./Scheduler/types";
import Week from "./Week";

import { Event, EventInDb } from "~/utils/models";

import { triplit } from "../../triplit/client";
import { useEffect, useState } from "react";
import { LocalDate, LocalTime, nativeJs, ZoneId } from "@js-joda/core";

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
//   },
//   {
//     id: 2,
//     date: "2025-05-12",
//     start: "07:45",
//     end: "08:15",
//     active: true,
//     passenger: false,
//   },
// ];

const myConfig: Config = { startTime: LocalTime.parse("06:00"), endTime: LocalTime.parse("11:00") };

const rows = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function dbToEvent(item: EventInDb): Event {
  const utcZoned = nativeJs(item.date, ZoneId.UTC); // assumes stored in DB in UTC timezone
  const localDate = utcZoned.toLocalDate();

  return {
    row: localDate.dayOfWeek().value() - 1,
    text: item.label || "Untitled Event",
    start: LocalTime.parse(item.start),
    end: LocalTime.parse(item.end),
    data: {
      entry: item.id,
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
  before: LocalDate;
  after: LocalDate;
  locationId: string;
}) => {
  const [dbEvents, setDbEvents] = useState<EventInDb[]>([]);

  useEffect(() => {
    // Convert LocalDate to Date objects for proper comparison
    // Add one day to 'before' and set to end of day to include all of Friday
    const beforeDate = new Date(before.year(), before.monthValue() - 1, before.dayOfMonth(), 23, 59, 59);
    const afterDate = new Date(after.year(), after.monthValue() - 1, after.dayOfMonth(), 0, 0, 0);

    const query = triplit.query("events").Where([
      ["location_id", "=", locationId],
      ["date", "<=", beforeDate],
      ["date", ">=", afterDate],
    ]);

    const unsubscribe = triplit.subscribe(query, (data) => {
      console.log("live query fetching events");
      console.log(data);
      // Handle null/undefined label to match EventInDb interface
      const convertedData = data.map((item) => ({
        ...item,
        start: item.start, // Keep as string for EventInDb
        end: item.end, // Keep as string for EventInDb
        label: item.label || "", // Convert null/undefined to empty string
      }));
      setDbEvents(convertedData);
      console.log("convertedData", convertedData);
    });

    return () => unsubscribe();
  }, [before, after, locationId]);

  // const {
  //   data: dbEvents,
  //   isLoading,
  //   error,
  // } = useShape<EventInDb>({
  //   url: "http://localhost:5133/v1/shape",
  //   params: {
  //     table: "events",
  //   },
  // });

  // if (isLoading) {
  //   return <Loading />;
  // }

  // if (error) {
  //   return <Failure error={error} />;
  // }

  const events: Event[] = dbEvents
    .filter((event) => event.active && event.location_id === locationId)
    .map(dbToEvent);
  const dates = rowsToDates(rows, after, before);

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
