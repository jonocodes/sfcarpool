import { describe, it, expect } from "vitest";
import { LocalDate, LocalTime } from "@js-joda/core";
import {
  eventToDb,
  formatTime,
  timeToSeconds,
  calcStringTime,
  getTimeSlots,
  formatDateSpan,
  getWeekStartStr,
  parseDateTime,
  rowsToDays,
  assertDefined,
} from "./helpers";

describe("Scheduler Helpers", () => {
  describe("assertDefined", () => {
    it("should not throw when value is defined", () => {
      expect(() => assertDefined("value", "Error message")).not.toThrow();
      expect(() => assertDefined(0, "Error message")).not.toThrow();
      expect(() => assertDefined(false, "Error message")).not.toThrow();
    });

    it("should throw when value is undefined", () => {
      expect(() => assertDefined(undefined, "Value is undefined")).toThrow(
        "Value is undefined"
      );
    });
  });

  describe("formatTime", () => {
    it("should format time as HH:mm", () => {
      const time = LocalTime.of(9, 30);
      expect(formatTime(time)).toBe("09:30");
    });

    it("should handle midnight", () => {
      const time = LocalTime.of(0, 0);
      expect(formatTime(time)).toBe("00:00");
    });

    it("should handle noon", () => {
      const time = LocalTime.of(12, 0);
      expect(formatTime(time)).toBe("12:00");
    });

    it("should handle end of day", () => {
      const time = LocalTime.of(23, 59);
      expect(formatTime(time)).toBe("23:59");
    });
  });

  describe("timeToSeconds", () => {
    it("should convert midnight to 0 seconds", () => {
      const time = LocalTime.of(0, 0);
      expect(timeToSeconds(time)).toBe(0);
    });

    it("should convert 1 hour to 3600 seconds", () => {
      const time = LocalTime.of(1, 0);
      expect(timeToSeconds(time)).toBe(3600);
    });

    it("should convert 1:30 to 5400 seconds", () => {
      const time = LocalTime.of(1, 30);
      expect(timeToSeconds(time)).toBe(5400);
    });

    it("should convert 8:00 to 28800 seconds", () => {
      const time = LocalTime.of(8, 0);
      expect(timeToSeconds(time)).toBe(8 * 60 * 60);
    });
  });

  describe("calcStringTime", () => {
    it("should calculate seconds from time string", () => {
      expect(calcStringTime("08:00")).toBe(8 * 60 * 60);
      expect(calcStringTime("08:30")).toBe(8 * 60 * 60 + 30 * 60);
      expect(calcStringTime("00:00")).toBe(0);
      expect(calcStringTime("12:45")).toBe(12 * 60 * 60 + 45 * 60);
    });
  });

  describe("getTimeSlots", () => {
    it("should generate time slots every 30 minutes", () => {
      const start = LocalTime.of(8, 0);
      const end = LocalTime.of(10, 0);
      const widthTime = 1800; // 30 minutes in seconds

      const slots = getTimeSlots(start, end, widthTime);

      expect(slots.length).toBeGreaterThan(0);
      expect(slots[0]).toEqual(start);
    });

    it("should generate time slots every 10 minutes", () => {
      const start = LocalTime.of(7, 0);
      const end = LocalTime.of(8, 0);
      const widthTime = 600; // 10 minutes in seconds

      const slots = getTimeSlots(start, end, widthTime);

      expect(slots.length).toBe(7); // 7:00, 7:10, 7:20, 7:30, 7:40, 7:50, 8:00
    });

    it("should maintain chronological order", () => {
      const start = LocalTime.of(6, 0);
      const end = LocalTime.of(9, 0);
      const widthTime = 900; // 15 minutes

      const slots = getTimeSlots(start, end, widthTime);

      for (let i = 0; i < slots.length - 1; i++) {
        expect(slots[i].isBefore(slots[i + 1])).toBe(true);
      }
    });
  });

  describe("formatDateSpan", () => {
    it("should format dates in same month", () => {
      const start = new Date(2023, 0, 9); // January 9, 2023 (month is 0-indexed)
      const end = new Date(2023, 0, 13);
      const result = formatDateSpan(start, end);
      expect(result).toMatch(/Jan 09 - 13, 2023/);
    });

    it("should format dates in different months", () => {
      const start = new Date(2023, 0, 25); // January 25, 2023
      const end = new Date(2023, 1, 3); // February 3, 2023
      const result = formatDateSpan(start, end);
      expect(result).toMatch(/Jan 25 - Feb 03, 2023/);
    });

    it("should format dates in different years", () => {
      const start = new Date(2022, 11, 25); // December 25, 2022
      const end = new Date(2023, 0, 5); // January 5, 2023
      const result = formatDateSpan(start, end);
      expect(result).toMatch(/Dec 25, 2022 - Jan 05, 2023/);
    });
  });

  describe("getWeekStartStr", () => {
    it("should return a valid date string", () => {
      const result = getWeekStartStr();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should return a valid LocalDate", () => {
      const result = getWeekStartStr();
      const date = LocalDate.parse(result);
      expect(date).toBeInstanceOf(LocalDate);
    });

    it("should return a Monday", () => {
      const result = getWeekStartStr();
      const date = LocalDate.parse(result);
      // Monday is day 1 in js-joda
      expect(date.dayOfWeek().value()).toBe(1);
    });
  });

  describe("parseDateTime", () => {
    it("should parse date string to Date object", () => {
      const dateStr = "2023-01-09";
      const result = parseDateTime(dateStr);
      expect(result).toBeInstanceOf(Date);
    });

    it("should parse correctly", () => {
      const dateStr = "2023-01-09";
      const result = parseDateTime(dateStr);
      expect(result.toISOString()).toMatch(/2023-01-09/);
    });
  });

  describe("rowsToDays", () => {
    it("should generate array of dates matching row count", () => {
      const rows = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      const start = LocalDate.of(2023, 1, 9); // Monday
      const end = LocalDate.of(2023, 1, 13); // Friday

      const dates = rowsToDays(rows, start, end);

      expect(dates).toHaveLength(5);
      expect(dates[0]).toEqual(start);
      expect(dates[4]).toEqual(end);
    });

    it("should throw error when row count doesn't match date span", () => {
      const rows = ["Monday", "Tuesday", "Wednesday"];
      const start = LocalDate.of(2023, 1, 9);
      const end = LocalDate.of(2023, 1, 13);

      expect(() => rowsToDays(rows, start, end)).toThrow(
        "Row count and day span do not match"
      );
    });

    it("should generate consecutive dates", () => {
      const rows = ["Mon", "Tue", "Wed"];
      const start = LocalDate.of(2023, 1, 9);
      const end = LocalDate.of(2023, 1, 11);

      const dates = rowsToDays(rows, start, end);

      expect(dates[1]).toEqual(start.plusDays(1));
      expect(dates[2]).toEqual(start.plusDays(2));
    });
  });

  describe("eventToDb", () => {
    it("should convert passenger event successfully", () => {
      const event = {
        row: 2,
        start: LocalTime.of(9, 10),
        end: LocalTime.of(12, 20),
        text: "words",
        data: {
          entry: 0,
          mode: "passenger" as const,
        },
      };

      const startDate = LocalDate.of(2020, 2, 20);
      const result = eventToDb(event, startDate, "1");

      expect(result).toMatchObject({
        label: "words",
        start: "09:10",
        end: "12:20",
        location_id: "1",
        passenger: true,
      });

      expect(result.date).toBeInstanceOf(Date);
      expect(result.date.toISOString()).toMatch(/2020-02-22/);
    });

    it("should convert driver event successfully", () => {
      const event = {
        row: 0,
        start: LocalTime.of(8, 0),
        end: LocalTime.of(9, 0),
        text: "Morning Drive",
        data: {
          entry: 1,
          mode: "driver" as const,
        },
      };

      const startDate = LocalDate.of(2023, 1, 9);
      const result = eventToDb(event, startDate, "loc-123");

      expect(result).toMatchObject({
        label: "Morning Drive",
        start: "08:00",
        end: "09:00",
        location_id: "loc-123",
        passenger: false,
      });
    });

    it("should add row days to start date", () => {
      const event = {
        row: 4, // Friday
        start: LocalTime.of(8, 0),
        end: LocalTime.of(9, 0),
        text: "Friday Event",
        data: {
          entry: 1,
          mode: "passenger" as const,
        },
      };

      const startDate = LocalDate.of(2023, 1, 9); // Monday
      const result = eventToDb(event, startDate, "loc-1");

      // Should be Friday (4 days after Monday)
      expect(result.date.toISOString()).toMatch(/2023-01-13/);
    });
  });
});

