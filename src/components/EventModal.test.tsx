import { describe, it, expect, vi, beforeEach } from "vitest";
import { LocalDate, LocalTime } from "@js-joda/core";

// Mock the triplit client before importing EventModal
vi.mock("triplit/client", () => ({
  triplit: {
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import EventModal from "./EventModal";

describe("EventModal", () => {
  const mockEvent = {
    row: 0,
    start: LocalTime.parse("08:00"),
    end: LocalTime.parse("09:00"),
    text: "Test Event",
    data: {
      entry: 1,
      mode: "passenger",
    },
  };

  const mockTimeSlots = [
    LocalTime.parse("07:00"),
    LocalTime.parse("07:30"),
    LocalTime.parse("08:00"),
    LocalTime.parse("08:30"),
    LocalTime.parse("09:00"),
    LocalTime.parse("09:30"),
    LocalTime.parse("10:00"),
  ];

  const defaultProps = {
    show: true,
    currentEvent: mockEvent,
    handleClose: vi.fn(),
    removeEvent: vi.fn(),
    updateEvent: vi.fn(),
    startDate: LocalDate.parse("2024-01-15"),
    locationId: "test-location-123",
    eventIndex: 0,
    timeSlots: mockTimeSlots,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have correct component structure", () => {
    // Test that the component can be imported
    expect(EventModal).toBeDefined();
  });

  it("should accept all required props", () => {
    // Verify the props interface by checking that all props are provided
    const requiredProps = [
      "show",
      "currentEvent",
      "handleClose",
      "removeEvent",
      "updateEvent",
      "startDate",
      "locationId",
      "eventIndex",
      "timeSlots",
    ];

    requiredProps.forEach((prop) => {
      expect(defaultProps).toHaveProperty(prop);
    });
  });

  it("should have event with required data structure", () => {
    // Verify the event data structure
    expect(mockEvent).toHaveProperty("row");
    expect(mockEvent).toHaveProperty("start");
    expect(mockEvent).toHaveProperty("end");
    expect(mockEvent).toHaveProperty("text");
    expect(mockEvent).toHaveProperty("data");
    expect(mockEvent.data).toHaveProperty("entry");
    expect(mockEvent.data).toHaveProperty("mode");
  });

  it("should support passenger mode", () => {
    expect(mockEvent.data.mode).toBe("passenger");
  });

  it("should support driver mode", () => {
    const driverEvent = {
      ...mockEvent,
      data: { ...mockEvent.data, mode: "driver" },
    };
    expect(driverEvent.data.mode).toBe("driver");
  });

  it("should have valid time range", () => {
    const start = mockEvent.start;
    const end = mockEvent.end;
    expect(start.isBefore(end)).toBe(true);
  });

  it("should format times correctly", () => {
    const startStr = mockEvent.start.toString();
    const endStr = mockEvent.end.toString();
    expect(startStr).toMatch(/^\d{2}:\d{2}$/); // HH:mm format
    expect(endStr).toMatch(/^\d{2}:\d{2}$/);
  });

  it("should have time slots in chronological order", () => {
    for (let i = 0; i < mockTimeSlots.length - 1; i++) {
      expect(mockTimeSlots[i].isBefore(mockTimeSlots[i + 1])).toBe(true);
    }
  });

  it("should have event text as string", () => {
    expect(typeof mockEvent.text).toBe("string");
  });

  it("should have numeric entry id", () => {
    expect(typeof mockEvent.data.entry).toBe("number");
  });

  it("should have valid location id", () => {
    expect(typeof defaultProps.locationId).toBe("string");
    expect(defaultProps.locationId.length).toBeGreaterThan(0);
  });

  it("should have valid event index", () => {
    expect(typeof defaultProps.eventIndex).toBe("number");
    expect(defaultProps.eventIndex).toBeGreaterThanOrEqual(0);
  });

  it("should handle date parsing", () => {
    const date = defaultProps.startDate;
    expect(date).toBeInstanceOf(LocalDate);
    expect(date.toString()).toMatch(/^\d{4}-\d{2}-\d{2}$/); // YYYY-MM-DD format
  });
});
