import { Event } from "~/utils/models";
import {
  LocalDate,
  DayOfWeek,
  TemporalAdjusters,
  DateTimeFormatter,
  LocalTime,
} from "@js-joda/core";
import { format, getYear, getMonth } from "date-fns";

// export function formatTime(val: number | Date) {
//   let seconds;

//   if (val instanceof Date) {
//     // If it's a Date object, extract hours and minutes
//     const hours = val.getUTCHours();
//     const minutes = val.getUTCMinutes();
//     return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
//   } else {
//     // Original logic for number values
//     const i1 = val % 3600;
//     const h = "" + (Math.floor(val / 36000) || "") + Math.floor((val / 3600) % 10);
//     const i = "" + Math.floor(i1 / 600) + Math.floor((i1 / 60) % 10);
//     return h + ":" + i;
//   }
// }

export function formatTime(time: LocalTime) {
  const formatter = DateTimeFormatter.ofPattern("HH:mm");

  const formatted = time.format(formatter);
  return formatted;
}

export function timeToSeconds(time: LocalTime) {
  // get the seconds from the start of the day

  const secondsSinceMidnight = time.toSecondOfDay();
  return secondsSinceMidnight;

  // const slice = str.split(":");
  // const h = Number(slice[0]) * 60 * 60;
  // const i = Number(slice[1]) * 60;
  // return h + i;
}

export function calcStringTime(str: string) {
  // get the seconds from the start of the day
  const slice = str.split(":");
  const h = Number(slice[0]) * 60 * 60;
  const i = Number(slice[1]) * 60;
  return h + i;
}

export function getTimeSlots(
  tableStartTime: LocalTime,
  tableEndTime: LocalTime,
  widthTime: number
): LocalTime[] {
  let endTimeSeconds = tableEndTime.toSecondOfDay();
  let startTimeSeconds = tableStartTime.toSecondOfDay();

  let timeSeconds = startTimeSeconds;

  const times: LocalTime[] = [LocalTime.ofSecondOfDay(timeSeconds)];
  while (timeSeconds < endTimeSeconds) {
    timeSeconds = timeSeconds + widthTime;
    times.push(LocalTime.ofSecondOfDay(timeSeconds));
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

// export function getWeekStart(today: Date) {
//   // Convert Date to LocalDate and get the start of the week (Sunday)
//   debugger;
//   const localDate = LocalDate.parse(today.toISOString().split("T")[0]);
//   // js-joda's dayOfWeek: Monday=1, Sunday=7
//   const dayOfWeek = localDate.dayOfWeek().value();
//   const daysToSubtract = dayOfWeek === 7 ? 0 : dayOfWeek; // If Sunday (7), subtract 0; otherwise subtract day number
//   return localDate.minusDays(daysToSubtract);
// }

export function getWeekStartStr() {
  // // Use date-fns to get the start of the week (Sunday)
  // const now = new Date();
  // // Get the start of the week (Sunday) and format as YYYY-MM-DD
  // const weekStart = dateFnsStartOfWeek(now, { weekStartsOn: 0 });
  // return format(weekStart, 'yyyy-MM-dd');

  const today = LocalDate.now();
  const firstDayOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));

  // console.log(firstDayOfWeek.toString());

  // debugger;
  return firstDayOfWeek.toString();
}

// export function getWeekSpan() {
//   const today = new Date();
//   const startLocal = getWeekStart(today);
//   const endLocal = startLocal.plusDays(4);
//   debugger;
//   console.log("getWeekSpan", startLocal, endLocal);
//   // Convert LocalDate back to Date for compatibility
//   return [new Date(startLocal.toString()), new Date(endLocal.toString())];
// }

export function eventToDb(evnt: Event, startDate: LocalDate, locationId: string) {
  const passenger = evnt.data.mode == "passenger";
  // Use js-joda to avoid timezone issues
  const startLocal = startDate; //LocalDate.parse(startDate.toISOString().split("T")[0]);
  const _dateLocal = startLocal.plusDays(evnt.row);
  // Format date as YYYY-MM-DD string for database storage
  const dateStr = _dateLocal.toString();

  // let start = evnt.start;
  // if (start.length == 4) start = "0" + start;

  // let end = evnt.end;
  // if (end.length == 4) end = "0" + end;

  let startLocalStr = evnt.start.toString();
  let endLocalStr = evnt.end.toString();

  const result = {
    label: evnt.text,
    passenger,
    location_id: locationId,
    start: startLocalStr,
    end: endLocalStr,
    // start, // TODO: chop off the :00 ?
    // end,
    date: dateStr,
    likelihood: Number(evnt.data.likelihood),
    active: true,
  };

  console.log("eventToDb", result);
  return result;
}

export function parseDateTime(dateStr: string) {
  const localDate = LocalDate.parse(dateStr);
  return new Date(localDate.toString());
}

export function rowsToDays(rows: string[], startDate: LocalDate, endDate: LocalDate) {
  // Use js-joda to handle dates without timezone issues
  const startLocal = startDate; // LocalDate.parse(startDate.toISOString().split("T")[0]);
  const endLocal = endDate; //LocalDate.parse(endDate.toISOString().split("T")[0]);
  let currentDate = startLocal;
  const dates: LocalDate[] = [];

  while (!currentDate.isAfter(endLocal)) {
    // Convert LocalDate back to Date for compatibility
    dates.push(currentDate);
    currentDate = currentDate.plusDays(1);
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
