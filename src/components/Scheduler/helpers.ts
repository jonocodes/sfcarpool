// import { DateTime } from "luxon";
// import { entries } from 'mobx'

import { Event } from "~/utils/models";
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
  if (getYear(start) !== getYear(end)) {
    return `${format(start, "LLL dd, yyyy")} - ${format(end, "LLL dd, yyyy")}`;
  }

  if (getMonth(start) !== getMonth(end)) {
    return `${format(start, "LLL dd")} - ${format(end, "LLL dd, yyyy")}`;
  }

  return `${format(start, "LLL dd")} - ${format(end, "dd, yyyy")}`;
}

export function getWeekStart(today: Date) {
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Adjust Sunday to be 6 days back
  return new Date(today.getTime() + diff * 24 * 60 * 60 * 1000);
}

export function getWeekSpan() {
  const today = new Date();
  const start = getWeekStart(today);
  const end = new Date(start.getTime() + 4 * 24 * 60 * 60 * 1000);
  return [start, end];
}

export function eventToGql(evnt: Event, startDate: Date, locationId: number) {
  const passenger = evnt.data.mode == "passenger";
  const date = new Date(startDate.getTime() + evnt.row * 24 * 60 * 60 * 1000);
  const dateStr = date.toISOString();

  let start = evnt.start;
  if (start.length == 4) start = "0" + start;

  let end = evnt.end;
  if (end.length == 4) end = "0" + end;

  const result = {
    label: evnt.text,
    passenger,
    locationId,
    start, // TODO: chop off the :00 ?
    end,
    date: dateStr,
    likelihood: Number(evnt.data.likelihood),
    active: true,
  };

  console.log("eventToGql", result);
  return result;
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
