import { useRef } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import SchedulerComponent from "../components/Scheduler/Scheduler";
import { Config } from "../components/Scheduler/types";
import { createSchedulerStore, SchedulerContext } from "../components/Scheduler/zstore";

const meta = {
  title: "Components/Scheduler",
  component: SchedulerComponent,
} satisfies Meta<typeof SchedulerComponent>;

export default meta;

const BasicWeekComponent = () => {
  const config = {
    startTime: "06:00", // schedule start time(HH:ii)
    endTime: "10:00", // schedule end time(HH:ii)
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
      start: "8:00",
      end: "8:10",
      text: "JK",
      data: {},
    },
    {
      row: 1, //tuesday
      start: "6:30",
      end: "7:10",
      text: "Jono",
      data: {},
    },
    {
      row: 1, // tuesday
      start: "7:05",
      end: "7:30",
      text: "Jodi",
      data: {},
    },
    {
      row: 1, // tuesday
      start: "7:40",
      end: "8:50",
      text: "Jono",
      data: {},
    },
    {
      row: 4, // friday
      start: "8:40",
      end: "8:50",
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
      start: "09:00",
      end: "12:00",
      text: "Text Area",
      data: {},
    },
    {
      row: 0,
      start: "11:00",
      end: "14:00",
      text: "Text Area",
      data: {},
    },
    {
      row: 1,
      start: "16:00",
      end: "17:00",
      text: "Text Area",
      data: {},
    },
  ];

  const rows = ["Title Area1", "Title Area2"];

  const config: Config = {
    startTime: "07:00", // schedule start time(HH:ii)
    endTime: "21:00", // schedule end time(HH:ii)
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
