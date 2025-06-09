

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getMonday,
  formatDateOnly,
  eventToDbRepresentation,
  getWeekStart,
  dbToEvent,
  formatDateSpan,
} from "./helpers";


describe("eventToDbRepresentation", () => {
  it("converts successfully", () => {
    const event = {
      row: 2,
      start: "09:10",
      end: "12:20",
      text: "words",
      data: {
        entry: 0,
        mode: "passenger",
        likelihood: 95,
        date: new Date("2020-02-20T00:00:00Z"),
      },
    };

    const gql_data = eventToDbRepresentation(event, 1);

    expect(gql_data).toEqual({
      id: 0,
      label: "words",
      active: true,
      date: new Date("2020-02-20T00:00:00Z"),
      start: "09:10",
      end: "12:20",
      likelihood: 95,
      location_id: 1,
      passenger: true,
    });
  });
});

describe("dbToEvent", () => {
  it("converts a passenger event correctly", () => {
    const dbEvent = {
      id: 123,
      label: "Morning Carpool",
      date: new Date("2024-03-11T00:00:00Z"), // A Monday
      start: "07:00",
      end: "08:00",
      active: true,
      passenger: true,
      likelihood: 75,
      location_id: 1,
    };

    const event = dbToEvent(dbEvent);

    expect(event).toEqual({
      row: 0, // Monday is day 1, so row should be 0
      text: "Morning Carpool",
      start: "07:00",
      end: "08:00",
      data: {
        entry: 123,
        likelihood: 75,
        mode: "passenger",
        date: new Date("2024-03-11T00:00:00Z"),
      },
    });
  });

  it("converts a driver event correctly", () => {
    const dbEvent = {
      id: 456,
      label: "Evening Drive",
      date: new Date("2024-03-13T00:00:00Z"), // A Wednesday
      start: "17:00",
      end: "18:00",
      active: true,
      passenger: false,
      likelihood: 90,
      location_id: 2,
    };

    const event = dbToEvent(dbEvent);

    expect(event).toEqual({
      row: 2, // Wednesday is day 3, so row should be 2
      text: "Evening Drive",
      start: "17:00",
      end: "18:00",
      data: {
        entry: 456,
        likelihood: 90,
        mode: "driver",
        date: new Date("2024-03-13T00:00:00Z"),
      },
    });
  });

  it("handles missing label by using default text", () => {
    const dbEvent = {
      id: 789,
      label: "",
      date: new Date("2024-03-15T00:00:00Z"), // A Friday
      start: "09:00",
      end: "10:00",
      active: true,
      passenger: true,
      likelihood: 60,
      location_id: 3,
    };

    const event = dbToEvent(dbEvent);

    expect(event.text).toBe("Untitled Event");
  });
});

describe("getWeekStart", () => {
  it("calculates successfully", () => {
    const thisMonday = new Date("2023-01-09T00:00:00Z");
    const nextMonday = new Date("2023-01-16T00:00:00Z");

    expect(getWeekStart(new Date("2023-01-10T00:00:00Z"))).toEqual(thisMonday);
    expect(getWeekStart(new Date("2023-01-14T00:00:00Z"))).toEqual(nextMonday);
  });
});

describe("date helper functions", () => {
  beforeEach(() => {
    // Set a fixed system time
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const testTimezones = [
    { name: "UTC", offset: 0 },
    { name: "America/New_York", offset: -4 },
    { name: "Asia/Tokyo", offset: 9 },
    { name: "Pacific/Auckland", offset: 12 },
  ];

  describe("getMonday", () => {
    testTimezones.forEach((tz) => {
      describe(`in ${tz.name} (UTC${tz.offset >= 0 ? "+" : ""}${tz.offset})`, () => {
        it("returns next day (Monday) when today is Sunday", () => {
          // Set the system time to Sunday in the target timezone
          const baseDate = new Date("2024-03-10T15:00:00Z");
          const tzOffsetHours = tz.offset;
          baseDate.setHours(baseDate.getHours() + tzOffsetHours);
          vi.setSystemTime(baseDate);

          const monday = getMonday();
          expect(formatDateOnly(monday)).toBe("2024-03-11"); // Should always be Monday
        });

        it("returns current day when today is Monday", () => {
          // Set the system time to Monday in the target timezone
          const baseDate = new Date("2024-03-11T15:00:00Z");
          const tzOffsetHours = tz.offset;
          baseDate.setHours(baseDate.getHours() + tzOffsetHours);
          vi.setSystemTime(baseDate);

          const monday = getMonday();
          expect(formatDateOnly(monday)).toBe("2024-03-11"); // Should be the same Monday
        });

        it("returns next Monday when today is mid-week", () => {
          // Set the system time to Wednesday in the target timezone
          const baseDate = new Date("2024-03-13T15:00:00Z");
          const tzOffsetHours = tz.offset;
          baseDate.setHours(baseDate.getHours() + tzOffsetHours);
          vi.setSystemTime(baseDate);

          const monday = getMonday();
          expect(formatDateOnly(monday)).toBe("2024-03-18"); // Should be next Monday
        });

        it("handles date boundary cases correctly", () => {
          // Test near midnight
          const baseDate = new Date("2024-03-10T23:59:59Z");
          const tzOffsetHours = tz.offset;
          baseDate.setHours(baseDate.getHours() + tzOffsetHours);
          vi.setSystemTime(baseDate);

          const monday = getMonday();
          expect(formatDateOnly(monday)).toBe("2024-03-11"); // Should be Monday
        });
      });
    });

    it("accepts a specific date parameter", () => {
      const result = getMonday(new Date("2024-03-12")); // A Tuesday
      expect(formatDateOnly(result)).toBe("2024-03-18"); // Should be next Monday
    });

    it("handles the case when passed date is a Monday", () => {
      const result = getMonday(new Date("2024-03-11")); // A Monday
      expect(formatDateOnly(result)).toBe("2024-03-18"); // Should be next Monday since we passed a specific date
    });
  });

  describe("formatDateOnly", () => {
    it("formats dates in YYYY-MM-DD format", () => {
      const date = new Date("2024-03-11T15:00:00Z");
      expect(formatDateOnly(date)).toBe("2024-03-11");
    });

    it("handles single-digit months and days", () => {
      const date = new Date("2024-01-05T15:00:00Z");
      expect(formatDateOnly(date)).toBe("2024-01-05");
    });
  });
});

describe("formatDateSpan", () => {
  it("formats dates in same month and year", () => {
    const start = new Date("2024-03-11T00:00:00Z"); // March 11
    const end = new Date("2024-03-15T00:00:00Z"); // March 15
    expect(formatDateSpan(start, end)).toBe("Mar 11 - 15, 2024");
  });

  it("formats dates in different months, same year", () => {
    const start = new Date("2024-03-29T00:00:00Z"); // March 29
    const end = new Date("2024-04-02T00:00:00Z"); // April 2
    expect(formatDateSpan(start, end)).toBe("Mar 29 - Apr 02, 2024");
  });

  it("formats dates in different years", () => {
    const start = new Date("2024-12-30T00:00:00Z"); // December 30, 2024
    const end = new Date("2025-01-03T00:00:00Z"); // January 3, 2025
    expect(formatDateSpan(start, end)).toBe("Dec 30, 2024 - Jan 03, 2025");
  });

  it("handles single-digit days", () => {
    const start = new Date("2024-03-04T00:00:00Z"); // March 4
    const end = new Date("2024-03-08T00:00:00Z"); // March 8
    expect(formatDateSpan(start, end)).toBe("Mar 04 - 08, 2024");
  });

  it("preserves input dates", () => {
    const start = new Date("2024-03-11T00:00:00Z");
    const end = new Date("2024-03-15T00:00:00Z");
    const startClone = new Date(start);
    const endClone = new Date(end);

    formatDateSpan(start, end);

    expect(start.getTime()).toBe(startClone.getTime());
    expect(end.getTime()).toBe(endClone.getTime());
  });

  it("handles timezone differences", () => {
    // Create dates with specific timezone offsets
    const start = new Date("2024-03-11T05:00:00Z"); // March 11, midnight EST
    const end = new Date("2024-03-15T05:00:00Z"); // March 15, midnight EST
    expect(formatDateSpan(start, end)).toBe("Mar 11 - 15, 2024");
  });
});
