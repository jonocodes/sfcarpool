import { describe, it, expect, vi } from "vitest";
import { LocalTime } from "@js-joda/core";
import { createSchedulerStore } from "./zstore";
import {
  formatTime,
  calcStringTime,
  timeToSeconds,
  getTimeSlots,
} from "./helpers";

// Mock react-rnd
vi.mock("react-rnd", () => ({
  Rnd: vi.fn(() => null),
}));

describe("Scheduler Component", () => {
  describe("Helper Functions", () => {
    it("should format time correctly", () => {
      const time = LocalTime.parse("08:30");
      const formatted = formatTime(time);
      expect(formatted).toBe("08:30");
    });

    it("should calculate string time to seconds", () => {
      const seconds = calcStringTime("08:00");
      expect(seconds).toBe(8 * 60 * 60); // 8 hours in seconds
    });

    it("should convert LocalTime to seconds", () => {
      const time = LocalTime.parse("08:00");
      const seconds = timeToSeconds(time);
      expect(seconds).toBe(8 * 60 * 60);
    });

    it("should generate time slots correctly", () => {
      const startTime = LocalTime.parse("08:00");
      const endTime = LocalTime.parse("10:00");
      const widthTime = 1800; // 30 minutes

      const slots = getTimeSlots(startTime, endTime, widthTime);

      expect(slots.length).toBeGreaterThan(0);
      expect(slots[0]).toEqual(startTime);
      // Verify slots are in order
      for (let i = 0; i < slots.length - 1; i++) {
        expect(slots[i].isBefore(slots[i + 1])).toBe(true);
      }
    });
  });

  describe("Scheduler Store", () => {
    const mockConfig = {
      startTime: LocalTime.parse("07:00"),
      endTime: LocalTime.parse("21:00"),
      widthTime: 600, // 10 minutes
      timeLineY: 60,
      verticalScrollbar: 20,
      timeLineBorder: 2,
      bundleMoveWidth: 6,
      resizableLeft: true,
      widthTimeX: 20,
    };

    const mockRows = ["Monday", "Tuesday", "Wednesday"];

    // Function to create fresh mock events for each test to avoid shared state
    const createMockEvents = () => [
      {
        row: 0,
        start: LocalTime.parse("08:00"),
        end: LocalTime.parse("09:00"),
        text: "Test Event",
        data: {
          entry: 1,
          mode: "passenger",
        },
      },
    ];

    it("should create scheduler store with initial data", () => {
      const store = createSchedulerStore({
        rows: mockRows,
        events: createMockEvents(),
        config: mockConfig,
      });

      expect(store).toBeDefined();
      const state = store.getState();
      expect(state.rows).toEqual(mockRows);
      expect(state.events).toHaveLength(1);
    });

    it("should have computed properties", () => {
      const store = createSchedulerStore({
        rows: mockRows,
        events: createMockEvents(),
        config: mockConfig,
      });

      const state = store.getState();
      expect(state.computed).toBeDefined();
      expect(state.computed.rowMap).toBeDefined();
      expect(state.computed.geometries).toBeDefined();
      expect(state.computed.tableHeight).toBeGreaterThan(0);
    });

    it("should add event to store", () => {
      const store = createSchedulerStore({
        rows: mockRows,
        events: [],
        config: mockConfig,
      });

      const newEvent = {
        row: 1,
        start: LocalTime.parse("10:00"),
        end: LocalTime.parse("11:00"),
        text: "New Event",
        data: { entry: 2, mode: "driver" },
      };

      store.getState().addEvent(newEvent);

      const state = store.getState();
      expect(state.events).toHaveLength(1);
      expect(state.events[0].text).toBe("New Event");
    });

    it("should remove event from store", () => {
      const store = createSchedulerStore({
        rows: mockRows,
        events: createMockEvents(),
        config: mockConfig,
      });

      store.getState().removeEvent(0);

      const state = store.getState();
      expect(state.events).toHaveLength(0);
    });

    it("should update event in store", () => {
      const mockEvents = createMockEvents();
      const store = createSchedulerStore({
        rows: mockRows,
        events: mockEvents,
        config: mockConfig,
      });

      const updatedEvent = {
        ...mockEvents[0],
        text: "Updated Event",
      };

      store.getState().updateEvent(0, updatedEvent);

      const state = store.getState();
      expect(state.events[0].text).toBe("Updated Event");
    });

    it("should clear all events", () => {
      const store = createSchedulerStore({
        rows: mockRows,
        events: createMockEvents(),
        config: mockConfig,
      });

      store.getState().clearEvents();

      const state = store.getState();
      expect(state.events).toHaveLength(0);
    });

    it("should handle passenger mode events", () => {
      const passengerEvent = {
        row: 0,
        start: LocalTime.parse("08:00"),
        end: LocalTime.parse("09:00"),
        text: "Passenger",
        data: { entry: 1, mode: "passenger" },
      };

      const store = createSchedulerStore({
        rows: mockRows,
        events: [passengerEvent],
        config: mockConfig,
      });

      const state = store.getState();
      expect(state.events[0].data.mode).toBe("passenger");
    });

    it("should handle driver mode events", () => {
      const driverEvent = {
        row: 0,
        start: LocalTime.parse("08:00"),
        end: LocalTime.parse("09:00"),
        text: "Driver",
        data: { entry: 1, mode: "driver" },
      };

      const store = createSchedulerStore({
        rows: mockRows,
        events: [driverEvent],
        config: mockConfig,
      });

      const state = store.getState();
      expect(state.events[0].data.mode).toBe("driver");
    });

    it("should calculate geometries for events", () => {
      const store = createSchedulerStore({
        rows: mockRows,
        events: createMockEvents(),
        config: mockConfig,
      });

      const state = store.getState();
      expect(state.computed.geometries).toHaveLength(1);
      expect(state.computed.geometries[0]).toHaveProperty("x");
      expect(state.computed.geometries[0]).toHaveProperty("y");
      expect(state.computed.geometries[0]).toHaveProperty("width");
    });

    it("should have valid row map", () => {
      const store = createSchedulerStore({
        rows: mockRows,
        events: createMockEvents(),
        config: mockConfig,
      });

      const state = store.getState();
      expect(state.computed.rowMap).toHaveLength(mockRows.length);
    });
  });
});
