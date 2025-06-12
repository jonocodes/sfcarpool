import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getMonday,
  formatDateOnly,
  eventToDbRepresentation,
  dbToEvent,
  formatDateSpan,
} from "./helpers";

describe("eventToDbRepresentation", () => {
  it("converts successfully with no ID", () => {
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

    const dbData = eventToDbRepresentation(event, 1);

    expect(dbData).toEqual({
      // id: 0,
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

  it("converts successfully with ID", () => {
    const event = {
      id: 1,
      row: 2,
      start: "09:10",
      end: "12:20",
      text: "words",
      data: {
        entry: 5,
        mode: "passenger",
        likelihood: 95,
        date: new Date("2020-02-20T00:00:00Z"),
      },
    };

    const dbData = eventToDbRepresentation(event, 1);

    expect(dbData).toEqual({
      id: 5,
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

    expect(event.text).toBe("");
  });
});

describe("date helper functions", () => {
  describe("getMonday", () => {
    it("calculates successfully", () => {
      const thisMonday = new Date("2025-06-09T00:00:00Z");
      const nextMonday = new Date("2025-06-16T00:00:00Z");

      expect(getMonday(new Date("2025-06-10T00:00:00Z"))).toEqual(thisMonday);
      expect(getMonday(new Date("2025-06-14T00:00:00Z"))).toEqual(nextMonday);

      // test offsets/time zons

      expect(getMonday(new Date("2025-06-08T22:00:00-07:00"))).toEqual(thisMonday);

      expect(getMonday(new Date("2025-06-13T22:00:00-07:00"))).toEqual(nextMonday);
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

// TODO: bring these back
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
