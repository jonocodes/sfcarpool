import { Event, EventInDb } from "~/utils/models";
import { format, getYear, getMonth } from "date-fns";

export function formatTime(val: number) {
  const i1 = val % 3600;

  const h = "" + (Math.floor(val / 36000) || "") + Math.floor((val / 3600) % 10);
  const i = "" + Math.floor(i1 / 600) + Math.floor((i1 / 60) % 10);
  return h + ":" + i;
}

export function calcStringTime(str: string) {
  const slice = str.split(":");
  const h = Number(slice[0]) * 60 * 60;
  const i = Number(slice[1]) * 60;
  return h + i;
}

export function getTimeSlots(tableStartTime: number, tableEndTime: number, widthTime: number) {
  let time = tableStartTime;
  const times = [time];
  while (time < tableEndTime) {
    time = time + widthTime;
    times.push(time);
  }

  return times;
}

export function formatDateSpan(start: Date, end: Date) {
  // Create new dates and ensure they're in UTC, adding a day to account for timezone differences
  const startLocal = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + 1)
  );
  const endLocal = new Date(
    Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1)
  );

  if (getYear(startLocal) !== getYear(endLocal)) {
    return `${format(startLocal, "LLL dd, yyyy")} - ${format(endLocal, "LLL dd, yyyy")}`;
  }

  if (getMonth(startLocal) !== getMonth(endLocal)) {
    return `${format(startLocal, "LLL dd")} - ${format(endLocal, "LLL dd, yyyy")}`;
  }

  return `${format(startLocal, "LLL dd")} - ${format(endLocal, "dd, yyyy")}`;
}

export function getWeekSpan() {
  const today = new Date();
  const start = getMonday(today);
  const end = new Date(start.getTime() + 4 * 24 * 60 * 60 * 1000);
  return [start, end];
}

export function getMonday(fromDate: Date) {
  const today = new Date(fromDate);
  today.setUTCHours(0, 0, 0, 0); // Set to start of day in UTC
  const day = today.getUTCDay(); // 0 is Sunday, 1 is Monday, etc.

  const monday = new Date(today);

  if (day === 0 || day === 6) {
    // If it's Saturday or Sunday, get next Monday
    const daysUntilMonday = day === 0 ? 1 : 2;
    monday.setUTCDate(monday.getUTCDate() + daysUntilMonday);
  } else {
    // For weekdays, get the Monday of current week
    const daysToSubtract = day - 1;
    monday.setUTCDate(monday.getUTCDate() - daysToSubtract);
  }

  return monday;
}

export function formatDateOnly(date: Date) {
  return date.toLocaleDateString("en-CA"); // Returns YYYY-MM-DD format
}

export function eventToDbRepresentation(
  evnt: Event,
  locationId: number
): Omit<EventInDb, "id"> | EventInDb {
  const passenger = evnt.data.mode == "passenger";

  let start = evnt.start;
  if (start.length == 4) start = "0" + start;

  let end = evnt.end;
  if (end.length == 4) end = "0" + end;

  const baseResult = {
    label: evnt.text,
    passenger,
    location_id: locationId,
    start,
    end,
    date: evnt.data.date,
    likelihood: Number(evnt.data.likelihood),
    active: true,
  };

  // For new events (entry is 0), omit the id field
  if (evnt.data.entry === 0) {
    return baseResult;
  }

  // For existing events, include the id
  return {
    ...baseResult,
    id: Number(evnt.data.entry),
  };
}

export function dbToEvent(item: EventInDb): Event {
  const dte = new Date(item.date);
  const day = dte.getUTCDay(); // 0 (Sunday) to 6 (Saturday)

  // Convert to row number (Monday=0 to Sunday=6)
  // For UTC dates, we need to handle the day-to-row mapping differently
  const row = day === 0 ? 6 : day - 1;

  return {
    row,
    text: item.label || "Untitled Event",
    start: item.start,
    end: item.end,
    data: {
      entry: item.id,
      likelihood: item.likelihood,
      mode: item.passenger ? "passenger" : "driver",
      date: dte,
    },
  };
}

export function parseDateTime(dateStr: string) {
  return new Date(dateStr);
}

export function rowsToDays(rows: string[], startDate: Date, endDate: Date) {
  let currentDate = new Date(startDate);
  const dates = [];

  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  }

  console.log("dates", dates);

  if (rows.length != dates.length) throw new Error("Row count and day span do not match");

  return dates;
}

// export const CREATE_EVENT = gql`
//   mutation CreateEventMutation(
//     $locationId: Int!
//     $date: date!
//     $start: time!
//     $end: time!
//     $likelihood: Int!
//     $passenger: Boolean!
//   ) {
//     insert_events(
//       objects: {
//         date: $date
//         end: $end
//         likelihood: $likelihood
//         start: $start
//         passenger: $passenger
//         location_id: $locationId
//       }
//     ) {
//       returning {
//         id
//       }
//     }
//   }
// `

// export const UPDATE_EVENT = gql`
//   mutation UpdateEventMutation(
//     $id: Int!
//     $locationId: Int
//     $date: date
//     $start: time!
//     $end: time!
//     $likelihood: Int!
//     $passenger: Boolean!
//     $label: String
//   ) {
//     # updateEvent(id: $id, input: $input) {
//     #   id
//     # }

//     update_events(
//       where: { id: { _eq: $id } }
//       _set: {
//         date: $date
//         end: $end
//         likelihood: $likelihood
//         start: $start
//         passenger: $passenger
//         location_id: $locationId
//         label: $label
//       }
//     ) {
//       returning {
//         id
//       }
//     }
//   }
// `

// // soft delete
// export const DELETE_EVENT = gql`
//   mutation DeleteEventMutation($id: Int!) {
//     update_events(where: { id: { _eq: $id } }, _set: { active: false }) {
//       returning {
//         id
//       }
//     }

//     # delete_events_by_pk(id: $id) {
//     #   id
//     # }
//   }
// `
