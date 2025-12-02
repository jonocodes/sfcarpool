import { Event, EventInDb } from "~/utils/models";
import {
  LocalDate,
  DayOfWeek,
  TemporalAdjusters,
  DateTimeFormatter,
  LocalTime,
  convert,
} from "@js-joda/core";
import { format, getYear, getMonth } from "date-fns";

export function assertDefined<T>(value: T | undefined, message: string): asserts value is T {
  if (value === undefined) throw new Error(message);
}

export function formatTime(time: LocalTime) {
  const formatter = DateTimeFormatter.ofPattern("HH:mm");

  const formatted = time.format(formatter);
  return formatted;
}

export function timeToSeconds(time: LocalTime) {
  return time.toSecondOfDay();
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

export function getWeekStartStr() {
  // Get the start of the week (Monday) and format as YYYY-MM-DD

  const today = LocalDate.now();
  const firstDayOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));

  return firstDayOfWeek.toString();
}

// export function getWeekSpan() {
//   const today = new Date();
//   const startLocal = getWeekStart(today);
//   const endLocal = startLocal.plusDays(4);
//   console.log("getWeekSpan", startLocal, endLocal);
//   // Convert LocalDate back to Date for compatibility
//   return [new Date(startLocal.toString()), new Date(endLocal.toString())];
// }

export function eventToDb(evnt: Event, startDate: LocalDate, locationId: string): EventInDb {
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
    // id: null,
    // created_at: new Date(),
    // updated_at: new Date(),
    label: evnt.text,
    passenger,
    location_id: locationId,
    start: startLocalStr,
    end: endLocalStr,
    // start, // TODO: chop off the :00 ?
    // end,
    date: convert(LocalDate.parse(dateStr)).toDate(),
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
