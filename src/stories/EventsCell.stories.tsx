import type { Meta, StoryObj } from "@storybook/react-vite";
import EventsCell from "../components/EventsCell";
import { Config } from "../components/Scheduler/types";
import { LocalDate, LocalTime } from "@js-joda/core";

const meta = {
  title: "Cells/EventsCell",
  component: EventsCell,
} satisfies Meta<typeof EventsCell>;

export default meta;

const EventsComponent = () => {
  const after = LocalDate.parse("2023-01-09");
  const before = LocalDate.parse("2023-01-13");

  const myConfig: Config = {
    startTime: LocalTime.parse("6:00"),
    endTime: LocalTime.parse("9:00"),
  };

  return <EventsCell before={before} after={after} locationId={"2"} />;
};

export const Events: StoryObj = {
  render: () => <EventsComponent />,
};
