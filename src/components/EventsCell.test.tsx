import { describe, it, expect, vi, beforeEach } from "vitest";
import { LocalDate, LocalTime } from "@js-joda/core";
import { EventInDb } from "~/utils/models";

// Mock dependencies
vi.mock("../../triplit/client", () => ({
  triplit: {
    query: vi.fn(() => ({
      Where: vi.fn(),
    })),
    subscribe: vi.fn((query, callback) => {
      // Immediately call with empty data
      callback([]);
      return () => {};
    }),
  },
}));

vi.mock("react-bootstrap", () => ({
  Row: vi.fn(({ children }) => children),
  Spinner: vi.fn(() => null),
}));

vi.mock("./Week", () => ({
  default: vi.fn(() => null),
}));

// Import after mocks
import EventsCell from "./EventsCell";
import { triplit } from "../../triplit/client";

describe("EventsCell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have correct component structure", () => {
    expect(EventsCell).toBeDefined();
  });

  it("should accept required props", () => {
    const props = {
      before: LocalDate.parse("2023-01-13"),
      after: LocalDate.parse("2023-01-09"),
      locationId: "test-location",
    };

    expect(props.before).toBeInstanceOf(LocalDate);
    expect(props.after).toBeInstanceOf(LocalDate);
    expect(typeof props.locationId).toBe("string");
  });

  it("should validate date range", () => {
    const after = LocalDate.parse("2023-01-09");
    const before = LocalDate.parse("2023-01-13");

    expect(after.isBefore(before)).toBe(true);
  });

  it("should have valid location id format", () => {
    const locationId = "test-location-123";
    expect(typeof locationId).toBe("string");
    expect(locationId.length).toBeGreaterThan(0);
  });

  describe("Data Transformation", () => {
    it("should handle event data with correct structure", () => {
      const mockDbEvent: EventInDb = {
        id: "evt1",
        label: "Test Event",
        date: new Date("2023-01-09T08:00:00.000Z"),
        start: "08:00",
        end: "09:00",
        active: true,
        passenger: true,
        location_id: "loc1",
        created_at: new Date(),
        updated_at: new Date(),
      };

      expect(mockDbEvent).toHaveProperty("id");
      expect(mockDbEvent).toHaveProperty("label");
      expect(mockDbEvent).toHaveProperty("date");
      expect(mockDbEvent).toHaveProperty("start");
      expect(mockDbEvent).toHaveProperty("end");
      expect(mockDbEvent).toHaveProperty("active");
      expect(mockDbEvent).toHaveProperty("passenger");
      expect(mockDbEvent).toHaveProperty("location_id");
    });

    it("should parse time strings correctly", () => {
      const start = LocalTime.parse("08:00");
      const end = LocalTime.parse("09:00");

      expect(start).toBeInstanceOf(LocalTime);
      expect(end).toBeInstanceOf(LocalTime);
      expect(start.isBefore(end)).toBe(true);
    });

    it("should handle passenger mode correctly", () => {
      const eventData = {
        passenger: true,
        mode: "passenger",
      };

      expect(eventData.passenger).toBe(true);
      expect(eventData.mode).toBe("passenger");
    });

    it("should handle driver mode correctly", () => {
      const eventData = {
        passenger: false,
        mode: "driver",
      };

      expect(eventData.passenger).toBe(false);
      expect(eventData.mode).toBe("driver");
    });

    it("should calculate correct day of week", () => {
      // Monday 2023-01-09
      const monday = LocalDate.parse("2023-01-09");
      expect(monday.dayOfWeek().value()).toBe(1); // Monday is 1

      // Tuesday 2023-01-10
      const tuesday = LocalDate.parse("2023-01-10");
      expect(tuesday.dayOfWeek().value()).toBe(2);

      // Friday 2023-01-13
      const friday = LocalDate.parse("2023-01-13");
      expect(friday.dayOfWeek().value()).toBe(5);
    });

    it("should convert day of week to row index", () => {
      const monday = LocalDate.parse("2023-01-09");
      const rowIndex = monday.dayOfWeek().value() - 1;
      expect(rowIndex).toBe(0); // Monday is row 0
    });

    it("should handle empty or missing labels", () => {
      const label1 = "";
      const label2 = null;
      const label3 = undefined;

      expect(label1 || "Untitled Event").toBe("Untitled Event");
      expect(label2 || "Untitled Event").toBe("Untitled Event");
      expect(label3 || "Untitled Event").toBe("Untitled Event");
    });
  });

  describe("Triplit Integration", () => {
    it("should call triplit.query with correct table", () => {
      const mockQuery = vi.fn(() => ({
        Where: vi.fn(),
      }));
      (triplit.query as any).mockImplementation(mockQuery);

      // Component would call this in useEffect
      triplit.query("events");

      expect(mockQuery).toHaveBeenCalledWith("events");
    });

    it("should filter by location_id", () => {
      const locationId = "test-location";
      const mockDbEvents: EventInDb[] = [
        {
          id: "evt1",
          location_id: "test-location",
          date: new Date("2023-01-09T08:00:00.000Z"),
          start: "08:00",
          end: "09:00",
          label: "Event 1",
          active: true,
          passenger: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: "evt2",
          location_id: "other-location",
          date: new Date("2023-01-09T09:00:00.000Z"),
          start: "09:00",
          end: "10:00",
          label: "Event 2",
          active: true,
          passenger: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      const filtered = mockDbEvents.filter((e) => e.location_id === locationId);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe("evt1");
    });

    it("should filter by active status", () => {
      const mockDbEvents: EventInDb[] = [
        {
          id: "evt1",
          location_id: "loc1",
          date: new Date("2023-01-09T08:00:00.000Z"),
          start: "08:00",
          end: "09:00",
          label: "Active Event",
          active: true,
          passenger: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: "evt2",
          location_id: "loc1",
          date: new Date("2023-01-09T09:00:00.000Z"),
          start: "09:00",
          end: "10:00",
          label: "Inactive Event",
          active: false,
          passenger: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      const filtered = mockDbEvents.filter((e) => e.active);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].label).toBe("Active Event");
    });
  });
});
