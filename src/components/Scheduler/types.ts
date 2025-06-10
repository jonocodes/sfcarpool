import type { Event as SchedulerEvent } from "~/utils/models";

export interface Geometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Computed {
  rowMap: number[][];
  geometries: Geometry[];
  rowHeights: number[];
  tableHeight: number;

  tableStartTime: number;
  tableEndTime: number;
  cellsWide: number;
  scrollWidth: number;
}

export interface ScheduleClickFunction {
  (colNum: number, rowNum: number): void;
}

export interface EventClickFunction {
  (event: SchedulerEvent, rowNum: number, eventIndex: number): void;
}

export interface EventChangeFunction {
  (event: SchedulerEvent, eventIndex: number): void;
}

export interface Config {
  className?: string;
  startTime: string;
  endTime: string;
  widthTimeX: number;
  widthTime: number; // cell timestamp example 10 minutes
  timeLineY: number; // timeline height(px)
  timeLineBorder: number; // timeline height border
  timeBorder: number; // border width
  timeLinePaddingTop: number;
  timeLinePaddingBottom: number;
  headTimeBorder: number; // time border width
  // dataWidth?: number // data width
  verticalScrollbar: number; // vertical scrollbar width
  bundleMoveWidth: number;
  // width to move all schedules to the right of the clicked time cell
  draggable: boolean;
  resizable: boolean;
  resizableLeft: boolean;
  onChange: EventChangeFunction;
  onClick: EventClickFunction;
  onScheduleClick: ScheduleClickFunction;
}

export interface SchedulerProps {
  // bears: number
  config: Config;
  events: SchedulerEvent[];
  rows: string[];
  computed: Computed;
  onClickEvent: SchedulerEvent | null;
  currentEvent: SchedulerEvent | null;
  currentEventIndex: number | null;
}

export interface SchedulerState extends SchedulerProps {
  // addBear: () => void
  addEvent: (event: SchedulerEvent) => void;
  updateEvent: (index: number, event: SchedulerEvent) => void;
  removeEvent: (index: number) => void;
  clearEvents: () => void;
  // mergeConfig: (config: Config) => void
  setup: (config: Config, rows: string[], events: SchedulerEvent[]) => void;
}
