import type { Meta, StoryObj } from "@storybook/react-vite";

import { Config } from "src/components/Scheduler/types";

import { parseDateTime, rowsToDays as rowsToDates } from "../components/Scheduler/helpers";

import Week from "../components/Week";
import { LocalDate, LocalTime } from "@js-joda/core";

const meta = {
  title: "Components/Week",
  component: Week,
} satisfies Meta<typeof Week>;

export default meta;

const CarpoolComponent = () => {
  const after = LocalDate.parse("2023-01-09");
  const before = LocalDate.parse("2023-01-13");

  const myConfig: Config = {
    startTime: LocalTime.parse("6:00"),
    endTime: LocalTime.parse("9:00"),
  };

  const rows = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const dates = rowsToDates(rows, after, before);

  const data = [
    {
      row: 0, // monday
      start: "8:00",
      end: "8:10",
      text: "JK",
      data: {
        entry: 8,
        mode: "passenger",
        likelihood: 20,
      },
    },
    {
      row: 1, //tuesday
      start: "6:30",
      end: "7:10",
      text: "Jono",
      data: {
        entry: 4,
        mode: "passenger",
        likelihood: 95,
      },
    },
    {
      row: 1, // tuesday
      start: "7:05",
      end: "7:30",
      text: "Jodi",
      data: {
        entry: 5,
        mode: "driver",
        likelihood: 70,
      },
    },
    {
      row: 1, // tuesday
      start: "7:40",
      end: "8:50",
      text: "Jono",
      data: {
        entry: 9,
        mode: "passenger",
        likelihood: 70,
      },
    },
    {
      row: 4, // friday
      start: "8:40",
      end: "8:50",
      text: "Jono",
      data: {
        entry: 10,
        mode: "passenger",
        likelihood: 70,
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
