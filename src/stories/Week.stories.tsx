import type { Meta, StoryObj } from "@storybook/react-vite";

import { Config } from "src/components/Scheduler/types";

import { parseDateTime, rowsToDays as rowsToDates } from "../components/Scheduler/helpers";

import Week from "../components/Week";
import { LocalDate, LocalTime } from "@js-joda/core";
// Import the mocked triplit client (aliased in .storybook/main.ts)
import { triplit } from "../../triplit/client";

const meta = {
  title: "Components/Week",
  component: Week,
} satisfies Meta<typeof Week>;

export default meta;

const CarpoolComponent = () => {
  const after = LocalDate.parse("2023-01-09");
  const before = LocalDate.parse("2023-01-13");

  const myConfig: Config = {
    startTime: LocalTime.parse("06:00"),
    endTime: LocalTime.parse("09:00"),
  };

  const rows = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const dates = rowsToDates(rows, after, before);

  const data = [
    {
      row: 0, // monday
      start: LocalTime.parse("08:00"),
      end: LocalTime.parse("08:10"),
      text: "JK",
      data: {
        entry: 8,
        mode: "passenger",
      },
    },
    {
      row: 1, //tuesday
      start: LocalTime.parse("06:30"),
      end: LocalTime.parse("07:10"),
      text: "Jono",
      data: {
        entry: 4,
        mode: "passenger",
      },
    },
    {
      row: 1, // tuesday
      start: LocalTime.parse("07:05"),
      end: LocalTime.parse("07:30"),
      text: "Jodi",
      data: {
        entry: 5,
        mode: "driver",
      },
    },
    {
      row: 1, // tuesday
      start: LocalTime.parse("07:40"),
      end: LocalTime.parse("08:50"),
      text: "Jono",
      data: {
        entry: 9,
        mode: "passenger",
      },
    },
    {
      row: 4, // friday
      start: LocalTime.parse("08:40"),
      end: LocalTime.parse("08:50"),
      text: "Jono",
      data: {
        entry: 10,
        mode: "passenger",
      },
    },
  ];

  return (
    <Week
      rows={rows}
      dates={dates}
      data={data}
      config={myConfig}
      provideCreateRandom={true}
      locationId={1}
      children={<></>}
    />
  );
};

export const Carpool: StoryObj = {
  render: () => <CarpoolComponent />,
};
