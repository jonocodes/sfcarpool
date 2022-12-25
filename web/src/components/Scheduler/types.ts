export interface Dictionary<T> {
  [Key: string | number]: T
}

export interface Event {
  row: number
  start: string
  end: string
  text: string
  data: Dictionary<string | number>
}

export interface Geometry {
  x: number
  y: number
  width: number
  height: number
}

export interface Computed {
  rowMap: number[][]
  geometries: Geometry[]
  rowHeights: number[]
  tableHeight: number

  // setTableHeight: (height: number) => void
  // setRowHeight: (height: number, index: number) => void
  // setGeometry: (geometry: Geometry, index: number) => void

  tableStartTime: number
  tableEndTime: number
  cellsWide: number
  scrollWidth: number
}

export interface ScheduleClickFunction {
  (time: number, colNum: number, rowNum: number): void
}

export interface EventClickFunction {
  (event: Event, rowNum: number): void
}


export interface Config {
  className?: string
  startTime?: string
  endTime?: string
  widthTimeX?: number
  widthTime?: number // cell timestamp example 10 minutes
  timeLineY?: number // timeline height(px)
  timeLineBorder?: number // timeline height border
  timeBorder?: number // border width
  timeLinePaddingTop?: number
  timeLinePaddingBottom?: number
  headTimeBorder?: number // time border width
  dataWidth?: number // data width
  verticalScrollbar?: number // vertical scrollbar width
  bundleMoveWidth?: number
  // width to move all schedules to the right of the clicked time cell
  draggable?: boolean
  resizable?: boolean
  resizableLeft?: boolean
  // event
  // onInitRow: null
  // onChange: null
  onClick?: EventClickFunction
  // onAppendRow: null
  // onAppendSchedule: null
  onScheduleClick?: ScheduleClickFunction
}

export interface SchedulerProps {
  // bears: number
  config: Config
  events: Event[]
  rows: string[]
  computed: Computed
  onClickEvent: Event | null
}

export interface SchedulerState extends SchedulerProps {
  // addBear: () => void
  addEvent: (event: Event) => void
}
