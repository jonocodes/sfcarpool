import { describe, it, expect } from "vitest";
import { formatRelativeTime } from "./timeFormatting";

describe("formatRelativeTime", () => {
  const SECOND = 1000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  const MONTH = 30 * DAY;
  const YEAR = 365 * DAY;

  describe("accepts timestamp as number or Date", () => {
    it("should accept timestamp as number", () => {
      const timestamp = Date.now() - 2 * MINUTE;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("2 mins ago");
    });

    it("should accept timestamp as Date object", () => {
      const timestamp = new Date(Date.now() - 3 * MINUTE);
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("3 mins ago");
    });
  });

  describe("less than 1 minute", () => {
    it("should show 'just now' for 0 seconds", () => {
      const timestamp = Date.now();
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("just now");
      expect(result.updateIntervalMs).toBe(MINUTE);
    });

    it("should show 'just now' for 30 seconds ago", () => {
      const timestamp = Date.now() - 30 * SECOND;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("just now");
      expect(result.updateIntervalMs).toBe(MINUTE);
    });

    it("should show 'just now' for 59 seconds ago", () => {
      const timestamp = Date.now() - 59 * SECOND;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("just now");
      expect(result.updateIntervalMs).toBe(MINUTE);
    });
  });

  describe("1-5 minutes range", () => {
    it("should show '1 min ago' (singular) for 1 minute", () => {
      const timestamp = Date.now() - 1 * MINUTE;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("1 min ago");
      expect(result.updateIntervalMs).toBe(MINUTE);
    });

    it("should show '2 mins ago' (plural) for 2 minutes", () => {
      const timestamp = Date.now() - 2 * MINUTE;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("2 mins ago");
      expect(result.updateIntervalMs).toBe(MINUTE);
    });

    it("should show '4 mins ago' for 4 minutes 30 seconds", () => {
      const timestamp = Date.now() - (4 * MINUTE + 30 * SECOND);
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("4 mins ago");
      expect(result.updateIntervalMs).toBe(MINUTE);
    });

    it("should update every minute in this range", () => {
      const timestamp = Date.now() - 3 * MINUTE;
      const result = formatRelativeTime(timestamp);
      expect(result.updateIntervalMs).toBe(MINUTE);
    });
  });

  describe("5-60 minutes range", () => {
    it("should show '5 mins ago' at boundary", () => {
      const timestamp = Date.now() - 5 * MINUTE;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("5 mins ago");
      expect(result.updateIntervalMs).toBe(5 * MINUTE);
    });

    it("should show '10 mins ago' for 10 minutes", () => {
      const timestamp = Date.now() - 10 * MINUTE;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("10 mins ago");
      expect(result.updateIntervalMs).toBe(5 * MINUTE);
    });

    it("should show '30 mins ago' for 30 minutes", () => {
      const timestamp = Date.now() - 30 * MINUTE;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("30 mins ago");
      expect(result.updateIntervalMs).toBe(5 * MINUTE);
    });

    it("should show '59 mins ago' for 59 minutes", () => {
      const timestamp = Date.now() - 59 * MINUTE;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("59 mins ago");
      expect(result.updateIntervalMs).toBe(5 * MINUTE);
    });

    it("should update every 5 minutes in this range", () => {
      const timestamp = Date.now() - 45 * MINUTE;
      const result = formatRelativeTime(timestamp);
      expect(result.updateIntervalMs).toBe(5 * MINUTE);
    });

    it("should use 'mins' plural form", () => {
      const timestamp = Date.now() - 15 * MINUTE;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toMatch(/mins ago$/);
    });
  });

  describe("1-24 hours range", () => {
    it("should show '1 hour ago' (singular) at 1 hour", () => {
      const timestamp = Date.now() - 1 * HOUR;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("1 hour ago");
      expect(result.updateIntervalMs).toBe(HOUR);
    });

    it("should show '2 hours ago' (plural) for 2 hours", () => {
      const timestamp = Date.now() - 2 * HOUR;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("2 hours ago");
      expect(result.updateIntervalMs).toBe(HOUR);
    });

    it("should show '12 hours ago' for 12 hours", () => {
      const timestamp = Date.now() - 12 * HOUR;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("12 hours ago");
      expect(result.updateIntervalMs).toBe(HOUR);
    });

    it("should show '23 hours ago' for 23 hours", () => {
      const timestamp = Date.now() - 23 * HOUR;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("23 hours ago");
      expect(result.updateIntervalMs).toBe(HOUR);
    });

    it("should update every hour in this range", () => {
      const timestamp = Date.now() - 5 * HOUR;
      const result = formatRelativeTime(timestamp);
      expect(result.updateIntervalMs).toBe(HOUR);
    });
  });

  describe("1-7 days range", () => {
    it("should show '1 day ago' (singular) at 1 day", () => {
      const timestamp = Date.now() - 1 * DAY;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("1 day ago");
      expect(result.updateIntervalMs).toBe(HOUR);
    });

    it("should show '2 days ago' (plural) for 2 days", () => {
      const timestamp = Date.now() - 2 * DAY;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("2 days ago");
      expect(result.updateIntervalMs).toBe(HOUR);
    });

    it("should show '6 days ago' for 6 days", () => {
      const timestamp = Date.now() - 6 * DAY;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("6 days ago");
      expect(result.updateIntervalMs).toBe(HOUR);
    });

    it("should update every hour in this range", () => {
      const timestamp = Date.now() - 3 * DAY;
      const result = formatRelativeTime(timestamp);
      expect(result.updateIntervalMs).toBe(HOUR);
    });
  });

  describe("1-4 weeks range", () => {
    it("should show '1 week ago' (singular) at 1 week", () => {
      const timestamp = Date.now() - 1 * WEEK;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("1 week ago");
      expect(result.updateIntervalMs).toBe(DAY);
    });

    it("should show '2 weeks ago' (plural) for 2 weeks", () => {
      const timestamp = Date.now() - 2 * WEEK;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("2 weeks ago");
      expect(result.updateIntervalMs).toBe(DAY);
    });

    it("should show '3 weeks ago' for 3 weeks", () => {
      const timestamp = Date.now() - 3 * WEEK;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("3 weeks ago");
      expect(result.updateIntervalMs).toBe(DAY);
    });

    it("should update daily in this range", () => {
      const timestamp = Date.now() - 2.5 * WEEK;
      const result = formatRelativeTime(timestamp);
      expect(result.updateIntervalMs).toBe(DAY);
    });
  });

  describe("1-12 months range", () => {
    it("should show '1 month ago' (singular) at 1 month", () => {
      const timestamp = Date.now() - 1 * MONTH;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("1 month ago");
      expect(result.updateIntervalMs).toBe(DAY);
    });

    it("should show '2 months ago' (plural) for 2 months", () => {
      const timestamp = Date.now() - 2 * MONTH;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("2 months ago");
      expect(result.updateIntervalMs).toBe(DAY);
    });

    it("should show '6 months ago' for 6 months", () => {
      const timestamp = Date.now() - 6 * MONTH;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("6 months ago");
      expect(result.updateIntervalMs).toBe(DAY);
    });

    it("should show '11 months ago' for 11 months", () => {
      const timestamp = Date.now() - 11 * MONTH;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("11 months ago");
      expect(result.updateIntervalMs).toBe(DAY);
    });

    it("should update daily in this range", () => {
      const timestamp = Date.now() - 8 * MONTH;
      const result = formatRelativeTime(timestamp);
      expect(result.updateIntervalMs).toBe(DAY);
    });
  });

  describe("1+ years range", () => {
    it("should show '1 year ago' (singular) at 1 year", () => {
      const timestamp = Date.now() - 1 * YEAR;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("1 year ago");
      expect(result.updateIntervalMs).toBe(WEEK);
    });

    it("should show '2 years ago' (plural) for 2 years", () => {
      const timestamp = Date.now() - 2 * YEAR;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("2 years ago");
      expect(result.updateIntervalMs).toBe(WEEK);
    });

    it("should show '5 years ago' for 5 years", () => {
      const timestamp = Date.now() - 5 * YEAR;
      const result = formatRelativeTime(timestamp);
      expect(result.text).toBe("5 years ago");
      expect(result.updateIntervalMs).toBe(WEEK);
    });

    it("should update weekly in this range", () => {
      const timestamp = Date.now() - 3 * YEAR;
      const result = formatRelativeTime(timestamp);
      expect(result.updateIntervalMs).toBe(WEEK);
    });
  });

  describe("boundary conditions", () => {
    it("should transition from 'just now' to '1 min ago' at 60 seconds", () => {
      const justBefore = Date.now() - 59 * SECOND;
      const justAfter = Date.now() - 61 * SECOND;

      expect(formatRelativeTime(justBefore).text).toBe("just now");
      expect(formatRelativeTime(justAfter).text).toBe("1 min ago");
    });

    it("should transition from minutes to hours at 60 minutes", () => {
      const justBefore = Date.now() - 59 * MINUTE;
      const justAfter = Date.now() - 61 * MINUTE;

      expect(formatRelativeTime(justBefore).text).toMatch(/mins ago$/);
      expect(formatRelativeTime(justAfter).text).toMatch(/hour ago$/);
    });

    it("should transition from hours to days at 24 hours", () => {
      const justBefore = Date.now() - (24 * HOUR - MINUTE);
      const justAfter = Date.now() - (24 * HOUR + MINUTE);

      expect(formatRelativeTime(justBefore).text).toMatch(/hours ago$/);
      expect(formatRelativeTime(justAfter).text).toMatch(/day ago$/);
    });

    it("should transition from days to weeks at 7 days", () => {
      const justBefore = Date.now() - (7 * DAY - HOUR);
      const justAfter = Date.now() - (7 * DAY + HOUR);

      expect(formatRelativeTime(justBefore).text).toMatch(/days ago$/);
      expect(formatRelativeTime(justAfter).text).toMatch(/week ago$/);
    });

    it("should transition from weeks to months at 4 weeks", () => {
      const justBefore = Date.now() - (4 * WEEK - DAY);
      const justAfter = Date.now() - (4 * WEEK + 2 * DAY);

      expect(formatRelativeTime(justBefore).text).toMatch(/weeks ago$/);
      expect(formatRelativeTime(justAfter).text).toMatch(/months? ago$/);
    });

    it("should transition from months to years at 12 months", () => {
      const justBefore = Date.now() - (12 * MONTH - DAY);
      const justAfter = Date.now() - (13 * MONTH);

      expect(formatRelativeTime(justBefore).text).toMatch(/months ago$/);
      expect(formatRelativeTime(justAfter).text).toMatch(/years? ago$/);
    });
  });

  describe("update interval transitions", () => {
    it("should change from 1 minute to 5 minutes at 5 minute mark", () => {
      const before = Date.now() - 4 * MINUTE;
      const after = Date.now() - 6 * MINUTE;

      expect(formatRelativeTime(before).updateIntervalMs).toBe(MINUTE);
      expect(formatRelativeTime(after).updateIntervalMs).toBe(5 * MINUTE);
    });

    it("should change from 5 minutes to 1 hour at 1 hour mark", () => {
      const before = Date.now() - 59 * MINUTE;
      const after = Date.now() - 61 * MINUTE;

      expect(formatRelativeTime(before).updateIntervalMs).toBe(5 * MINUTE);
      expect(formatRelativeTime(after).updateIntervalMs).toBe(HOUR);
    });

    it("should change from 1 hour to 1 day at 1 week mark", () => {
      const before = Date.now() - 6 * DAY;
      const after = Date.now() - 8 * DAY;

      expect(formatRelativeTime(before).updateIntervalMs).toBe(HOUR);
      expect(formatRelativeTime(after).updateIntervalMs).toBe(DAY);
    });

    it("should change from 1 day to 1 week at 1 year mark", () => {
      const before = Date.now() - 11 * MONTH;
      const after = Date.now() - 13 * MONTH;

      expect(formatRelativeTime(before).updateIntervalMs).toBe(DAY);
      expect(formatRelativeTime(after).updateIntervalMs).toBe(WEEK);
    });
  });

  describe("singular vs plural forms", () => {
    it("should use singular 'min' for 1 minute", () => {
      const timestamp = Date.now() - 1 * MINUTE;
      expect(formatRelativeTime(timestamp).text).toBe("1 min ago");
    });

    it("should use plural 'mins' for multiple minutes", () => {
      const timestamp = Date.now() - 2 * MINUTE;
      expect(formatRelativeTime(timestamp).text).toBe("2 mins ago");
    });

    it("should use singular 'hour' for 1 hour", () => {
      const timestamp = Date.now() - 1 * HOUR;
      expect(formatRelativeTime(timestamp).text).toBe("1 hour ago");
    });

    it("should use plural 'hours' for multiple hours", () => {
      const timestamp = Date.now() - 2 * HOUR;
      expect(formatRelativeTime(timestamp).text).toBe("2 hours ago");
    });

    it("should use singular 'day' for 1 day", () => {
      const timestamp = Date.now() - 1 * DAY;
      expect(formatRelativeTime(timestamp).text).toBe("1 day ago");
    });

    it("should use plural 'days' for multiple days", () => {
      const timestamp = Date.now() - 2 * DAY;
      expect(formatRelativeTime(timestamp).text).toBe("2 days ago");
    });

    it("should use singular 'week' for 1 week", () => {
      const timestamp = Date.now() - 1 * WEEK;
      expect(formatRelativeTime(timestamp).text).toBe("1 week ago");
    });

    it("should use plural 'weeks' for multiple weeks", () => {
      const timestamp = Date.now() - 2 * WEEK;
      expect(formatRelativeTime(timestamp).text).toBe("2 weeks ago");
    });

    it("should use singular 'month' for 1 month", () => {
      const timestamp = Date.now() - 1 * MONTH;
      expect(formatRelativeTime(timestamp).text).toBe("1 month ago");
    });

    it("should use plural 'months' for multiple months", () => {
      const timestamp = Date.now() - 2 * MONTH;
      expect(formatRelativeTime(timestamp).text).toBe("2 months ago");
    });

    it("should use singular 'year' for 1 year", () => {
      const timestamp = Date.now() - 1 * YEAR;
      expect(formatRelativeTime(timestamp).text).toBe("1 year ago");
    });

    it("should use plural 'years' for multiple years", () => {
      const timestamp = Date.now() - 2 * YEAR;
      expect(formatRelativeTime(timestamp).text).toBe("2 years ago");
    });
  });

  describe("return value structure", () => {
    it("should return object with text and updateIntervalMs properties", () => {
      const timestamp = Date.now() - 5 * MINUTE;
      const result = formatRelativeTime(timestamp);

      expect(result).toHaveProperty("text");
      expect(result).toHaveProperty("updateIntervalMs");
      expect(typeof result.text).toBe("string");
      expect(typeof result.updateIntervalMs).toBe("number");
    });

    it("should always return positive update intervals", () => {
      const testCases = [
        Date.now(),
        Date.now() - 1 * MINUTE,
        Date.now() - 1 * HOUR,
        Date.now() - 1 * DAY,
        Date.now() - 1 * WEEK,
        Date.now() - 1 * MONTH,
        Date.now() - 1 * YEAR,
      ];

      testCases.forEach((timestamp) => {
        const result = formatRelativeTime(timestamp);
        expect(result.updateIntervalMs).toBeGreaterThan(0);
      });
    });
  });
});
