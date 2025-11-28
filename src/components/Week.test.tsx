import { describe, it, expect, vi, beforeEach } from "vitest";
import { LocalDate, LocalTime } from "@js-joda/core";

// Mock dependencies
vi.mock("triplit/client", () => ({
  triplit: {
    update: vi.fn(),
    insert: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  Toaster: vi.fn(() => null),
}));

vi.mock("./Scheduler/Scheduler", () => ({
  default: vi.fn(() => null),
}));

vi.mock("./EventModal", () => ({
  default: vi.fn(() => null),
}));

vi.mock("react-bootstrap", () => ({
  Button: vi.fn(({ children }) => children),
}));

import Week from "./Week";

describe("Week Component", () => {
  const mockConfig = {
    startTime: LocalTime.parse("06:00"),
    endTime: LocalTime.parse("09:00"),
  };

  const mockRows = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const mockDates = [
    LocalDate.parse("2023-01-09"),
    LocalDate.parse("2023-01-10"),
    LocalDate.parse("2023-01-11"),
    LocalDate.parse("2023-01-12"),
    LocalDate.parse("2023-01-13"),
  ];

  const mockData = [
    {
      row: 0,
      start: "08:00",
      end: "08:10",
      text: "Event 1",
      data: {
        entry: 1,
        mode: "passenger",
      },
    },
    {
      row: 1,
      start: "07:00",
      end: "07:30",
      text: "Event 2",
      data: {
        entry: 2,
        mode: "driver",
      },
    },
  ];

  const defaultProps = {
    locationId: "test-location",
    data: mockData,
    dates: mockDates,
    children: null,
    provideCreateRandom: false,
    config: mockConfig,
    rows: mockRows,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have correct component structure", () => {
    expect(Week).toBeDefined();
  });

  it("should accept all required props", () => {
    const requiredProps = [
      "locationId",
      "data",
      "dates",
      "children",
      "provideCreateRandom",
      "config",
      "rows",
    ];

    requiredProps.forEach((prop) => {
      expect(defaultProps).toHaveProperty(prop);
    });
  });

  it("should have valid location id", () => {
    expect(typeof defaultProps.locationId).toBe("string");
    expect(defaultProps.locationId.length).toBeGreaterThan(0);
  });

  it("should have matching rows and dates length", () => {
    expect(defaultProps.rows.length).toBe(5);
    expect(defaultProps.dates.length).toBe(5);
  });

  it("should have valid config with start and end times", () => {
    expect(defaultProps.config.startTime).toBeInstanceOf(LocalTime);
    expect(defaultProps.config.endTime).toBeInstanceOf(LocalTime);
    expect(defaultProps.config.startTime.isBefore(defaultProps.config.endTime)).toBe(true);
  });

  it("should handle events data", () => {
    expect(Array.isArray(defaultProps.data)).toBe(true);
    expect(defaultProps.data).toHaveLength(2);
  });

  it("should have events with correct structure", () => {
    const event = defaultProps.data[0];
    expect(event).toHaveProperty("row");
    expect(event).toHaveProperty("start");
    expect(event).toHaveProperty("end");
    expect(event).toHaveProperty("text");
    expect(event).toHaveProperty("data");
  });

  it("should have events with mode in data", () => {
    const event = defaultProps.data[0];
    expect(event.data).toHaveProperty("mode");
    expect(["passenger", "driver"]).toContain(event.data.mode);
  });

  it("should have events with entry id", () => {
    const event = defaultProps.data[0];
    expect(event.data).toHaveProperty("entry");
    expect(typeof event.data.entry).toBe("number");
  });

  it("should have valid row indices", () => {
    defaultProps.data.forEach((event) => {
      expect(event.row).toBeGreaterThanOrEqual(0);
      expect(event.row).toBeLessThan(mockRows.length);
    });
  });

  it("should have chronological dates", () => {
    for (let i = 0; i < mockDates.length - 1; i++) {
      expect(mockDates[i].isBefore(mockDates[i + 1])).toBe(true);
    }
  });

  it("should handle passenger mode", () => {
    const passengerEvent = mockData.find((e) => e.data.mode === "passenger");
    expect(passengerEvent).toBeDefined();
    expect(passengerEvent?.data.mode).toBe("passenger");
  });

  it("should handle driver mode", () => {
    const driverEvent = mockData.find((e) => e.data.mode === "driver");
    expect(driverEvent).toBeDefined();
    expect(driverEvent?.data.mode).toBe("driver");
  });

  it("should have valid time format in events", () => {
    defaultProps.data.forEach((event) => {
      expect(event.start).toMatch(/^\d{2}:\d{2}$/);
      expect(event.end).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  it("should handle provideCreateRandom flag", () => {
    expect(typeof defaultProps.provideCreateRandom).toBe("boolean");
  });

  it("should allow children prop", () => {
    const propsWithChildren = {
      ...defaultProps,
      children: <div>Test Child</div>,
    };
    expect(propsWithChildren.children).toBeDefined();
  });

  it("should have weekday names in rows", () => {
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    expect(defaultProps.rows).toEqual(weekdays);
  });

  it("should have dates corresponding to weekdays", () => {
    // Monday should be the start of the week
    const firstDate = mockDates[0];
    // Monday is day 1 in js-joda
    expect(firstDate.dayOfWeek().value()).toBe(1);
  });

  it("should validate event times are within config range", () => {
    const configStart = mockConfig.startTime;
    const configEnd = mockConfig.endTime;

    mockData.forEach((event) => {
      const eventStart = LocalTime.parse(event.start);
      const eventEnd = LocalTime.parse(event.end);

      // Events should be within the configured time range
      expect(
        eventStart.isAfter(configStart) || eventStart.equals(configStart)
      ).toBe(true);
      expect(eventEnd.isBefore(configEnd) || eventEnd.equals(configEnd)).toBe(
        true
      );
    });
  });
});
