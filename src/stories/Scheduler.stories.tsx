import { useRef } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import SchedulerComponent from "../components/Scheduler/Scheduler";
import { Config } from "../components/Scheduler/types";
import { createSchedulerStore, SchedulerContext } from "../components/Scheduler/zstore";
import { LocalTime } from "@js-joda/core";

const meta = {
  title: "Components/Scheduler",
  component: SchedulerComponent,
} satisfies Meta<typeof SchedulerComponent>;

export default meta;

const BasicWeekComponent = () => {
  const config = {
    startTime: LocalTime.parse("06:00"), // schedule start time(HH:ii)
    endTime: LocalTime.parse("10:00"), // schedule end time(HH:ii)
    widthTimeX: 20,
    widthTime: 60 * 5, // 5 minutes
    timeLineY: 60, // height(px)
    // dataWidth: 120,
    verticalScrollbar: 20, // scrollbar (px)
    timeLineBorder: 2, // border(top and bottom)
    bundleMoveWidth: 6, // width to move all schedules to the right of the clicked time line cell
    // draggable: isDraggable,
    // resizable: isResizable,
    resizableLeft: true,
  };

  const rows = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const data = [
    {
      row: 0, // monday
      start: LocalTime.parse("08:00"),
      end: LocalTime.parse("08:10"),
      text: "JK",
      data: {},
    },
    {
      row: 1, //tuesday
      start: LocalTime.parse("06:30"),
      end: LocalTime.parse("07:10"),
      text: "Jono",
      data: {},
    },
    {
      row: 1, // tuesday
      start: LocalTime.parse("07:05"),
      end: LocalTime.parse("07:30"),
      text: "Jodi",
      data: {},
    },
    {
      row: 1, // tuesday
      start: LocalTime.parse("07:40"),
      end: LocalTime.parse("08:50"),
      text: "Jono",
      data: {},
    },
    {
      row: 4, // friday
      start: LocalTime.parse("08:40"),
      end: LocalTime.parse("08:50"),
      text: "Jono",
      data: {},
    },
  ];

  const store = useRef(
    createSchedulerStore({
      rows: rows,
      events: data,
      config: config,
    })
  ).current;

  return (
    <SchedulerContext.Provider value={store}>
      <SchedulerComponent />
    </SchedulerContext.Provider>
  );
};

export const BasicWeek: StoryObj = {
  render: () => <BasicWeekComponent />,
};

const DemoComponent = () => {
  const data = [
    {
      row: 0,
      start: LocalTime.parse("09:00"),
      end: LocalTime.parse("12:00"),
      text: "Text Area",
      data: {},
    },
    {
      row: 0,
      start: LocalTime.parse("11:00"),
      end: LocalTime.parse("14:00"),
      text: "Text Area",
      data: {},
    },
    {
      row: 1,
      start: LocalTime.parse("16:00"),
      end: LocalTime.parse("17:00"),
      text: "Text Area",
      data: {},
    },
  ];

  const rows = ["Title Area1", "Title Area2"];

  const config: Config = {
    startTime: LocalTime.parse("07:00"), // schedule start time(HH:ii)
    endTime: LocalTime.parse("21:00"), // schedule end time(HH:ii)
    widthTime: 60 * 10, // cell timestamp example 10 minutes
    timeLineY: 60, // height(px)
    verticalScrollbar: 20, // scrollbar (px)
    timeLineBorder: 2, // border(top and bottom)
    bundleMoveWidth: 6, // width to move all schedules to the right of the clicked time line cell
    draggable: false,
    // resizable: isResizable,
    resizableLeft: true,

    onScheduleClick: function (colNum, rowNum) {
      console.log("onScheduleClick external method", colNum, rowNum);
    },
    onClick: function (event, rowNum) {
      console.log("onScheduleClick external method", event, rowNum);
    },
  };

  const store = useRef(
    createSchedulerStore({
      rows: rows,
      events: data,
      config: config,
    })
  ).current;

  return (
    <SchedulerContext.Provider value={store}>
      <SchedulerComponent />
    </SchedulerContext.Provider>
  );
};

export const Demo: StoryObj = {
  render: () => <DemoComponent />,
};
