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

// export const QUERY = gql`
//   query EventsQuery($before: date, $after: date, $locationId: Int) {
//     weekEvents: events(limit: 1) {
//       id
//       label
//     }
//   }
// `

// export const SUBSCRIPTION = gql`
//   subscription EventsSubscription(
//     $before: date
//     $after: date
//     $locationId: Int
//   ) {
//     weekEvents: events(
//       where: {
//         location_id: { _eq: $locationId }
//         date: { _gte: $after, _lte: $before }
//         active: { _eq: true }
//       }
//     ) {
//       active
//       date
//       end
//       id
//       passenger
//       start
//       label
//       likelihood
//     }
//   }
// `

// Mock API call to fetch events
// const fetchEvents = async ({ queryKey }: { queryKey: any[] }) => {
//   const [, { before, after, locationId }] = queryKey;
//   console.log("Fetching events with:", { before, after, locationId });
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(mockEvents);
//     }, 500); // Simulate network delay
//   });
// };

const myConfig: Config = { startTime: "06:00", endTime: "11:00" };

const rows = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// function gqlToEvent(item: (typeof mockEvents)[0]): Event {
//   return {
//     row: parseDateTime(item.date).weekday - 1,
//     text: item.label || "Untitled Event",
//     start: parseDateTime(item.start).toFormat("H:mm"),
//     end: parseDateTime(item.end).toFormat("H:mm"),
//     data: {
//       entry: item.id,
//       likelihood: item.likelihood,
//       mode: item.passenger ? "passenger" : "driver",
//     },
//   };
// }

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
  // const data = mockEvents;
  // const isLoading = false;
  // const isError = false;
  // const error = null;

  const {
    data: dbEvents,
    isLoading,
    error,
    // isError, // Removed as useShape returns error directly
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

  // if (isError && error) {
  //   return <Failure error={error} />;
  // }

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
