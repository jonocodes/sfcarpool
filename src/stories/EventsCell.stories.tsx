import type { Meta, StoryObj } from "@storybook/react-vite";
import EventsCell from "../components/EventsCell";
import { Config } from "../components/Scheduler/types";
import { LocalDate, LocalTime } from "@js-joda/core";
// Import the mocked triplit client (aliased in .storybook/main.ts)
import { triplit } from "../../triplit/client";

const meta = {
  title: "Cells/EventsCell",
  component: EventsCell,
} satisfies Meta<typeof EventsCell>;

export default meta;

// Mock event data
const mockEventsData = [
  {
    id: "evt1",
    location_id: "2",
    date: new Date("2023-01-09T08:00:00.000Z"),
    start: "08:00",
    end: "09:00",
    label: "Morning Carpool",
    passenger: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "evt2",
    location_id: "2",
    date: new Date("2023-01-10T08:30:00.000Z"),
    start: "08:30",
    end: "09:30",
    label: "Tuesday Ride",
    passenger: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "evt3",
    location_id: "2",
    date: new Date("2023-01-13T07:00:00.000Z"),
    start: "07:00",
    end: "08:00",
    label: "Friday Drive",
    passenger: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const EventsComponent = () => {
  const after = LocalDate.parse("2023-01-09");
  const before = LocalDate.parse("2023-01-13");

  const myConfig: Config = {
    startTime: LocalTime.parse("06:00"),
    endTime: LocalTime.parse("09:00"),
  };

  return <EventsCell before={before} after={after} locationId={"2"} />;
};

export const Events: StoryObj = {
  beforeEach: async () => {
    // Set mock event data using the triplit mock's helper method
    (triplit as any).__setMockData(mockEventsData);
  },
  render: () => <EventsComponent />,
};
