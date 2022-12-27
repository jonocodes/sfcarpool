// import { number } from 'prop-types'
import { createContext, useContext } from 'react'

import { RowProps } from 'react-bootstrap'
import create, { createStore, StoreApi } from 'zustand'

import { calcStringTime, formatTime } from './helpers'
import {
  Computed,
  Config,
  SchedulerProps,
  SchedulerState,
  Event,
} from './types'

// interface EventData {
//   class?: string
//   likenyhood
// }

const configDefault: Config = {
  className: 'jq-schedule',
  startTime: '07:00',
  endTime: '19:30',
  widthTimeX: 25,
  widthTime: 600, // cell timestamp example 10 minutes
  timeLineY: 50, // timeline height(px)
  timeLineBorder: 1, // timeline height border
  timeBorder: 1, // border width
  timeLinePaddingTop: 0,
  timeLinePaddingBottom: 0,
  headTimeBorder: 1, // time border width
  dataWidth: 160, // data width
  verticalScrollbar: 0, // vertical scrollbar width
  bundleMoveWidth: 1,
  // width to move all schedules to the right of the clicked time cell
  draggable: true,
  resizable: true,
  resizableLeft: false,
  // event
  // onInitRow: null,
  // onChange: null,
  onClick: null,
  // onAppendRow: null,
  // onAppendSchedule: null,
  onScheduleClick: null,
}

// interface ScheduleClickFunction {
//   (time: number, colNum: number, rowNum: number): void
// }

// interface EventClickFunction {
//   (event: Event, rowNum: number): void
// }

// export interface Config {
//   className?: string
//   startTime?: string
//   endTime?: string
//   widthTimeX?: number
//   widthTime?: number // cell timestamp example 10 minutes
//   timeLineY?: number // timeline height(px)
//   timeLineBorder?: number // timeline height border
//   timeBorder?: number // border width
//   timeLinePaddingTop?: number
//   timeLinePaddingBottom?: number
//   headTimeBorder?: number // time border width
//   dataWidth?: number // data width
//   verticalScrollbar?: number // vertical scrollbar width
//   bundleMoveWidth?: number
//   // width to move all schedules to the right of the clicked time cell
//   draggable?: boolean
//   resizable?: boolean
//   resizableLeft?: boolean
//   // event
//   // onInitRow: null
//   // onChange: null
//   onClick?: EventClickFunction
//   // onAppendRow: null
//   // onAppendSchedule: null
//   onScheduleClick?: ScheduleClickFunction
// }

// interface Event {
//   row: number
//   start: string
//   end: string
//   text: string
//   data: Dictionary<string | number>
// }

// interface Geometry {
//   x: number
//   y: number
//   width: number
//   height: number
// }

// interface Computed {
//   rowMap: number[][]
//   geometries: Geometry[]
//   rowHeights: number[]
//   tableHeight: number

//   // setTableHeight: (height: number) => void
//   // setRowHeight: (height: number, index: number) => void
//   // setGeometry: (geometry: Geometry, index: number) => void

//   tableStartTime: number
//   tableEndTime: number
//   cellsWide: number
//   scrollWidth: number
// }

// interface zState {
//   bears?: number
//   increasePopulation: (by: number) => void

//   events: Event[]
//   rows: string[]
//   rowMap: number[][]
//   geometries: Geometry[]

//   rowHeights: number[]

//   tableHeight: number

//   config: Config

//   setTableHeight: (height: number) => void
//   setRowHeight: (height: number, index: number) => void
//   setGeometry: (geometry: Geometry, index: number) => void

//   // TODO: add subtitles to rows

//   tableStartTime: number
//   tableEndTime: number
//   cellsWide: number
//   scrollWidth: number

//   //rowHeights
//   init: (events: Event[], rows: string[], config: Config) => void
//   init2: () => void
//   init3: () => void
//   addEvent: (event: Event) => void
// }

function generateRowMap(rows, events) {
  const dataRowMap = []
  for (let j = 0; j < rows.length; j++) {
    // doing this since Array.fill([]) causes issues
    dataRowMap.push([])
  }
  for (let i = 0; i < events.length; i++) {
    dataRowMap[events[i].row].push(i)
  }

  return dataRowMap
}

function calculateGeometry(event, config, tableStartTime) {
  const startTime = calcStringTime(event.start)
  const endTime = calcStringTime(event.end)

  // const tableStartTime = computed.tableStartTime

  const st = Math.ceil((startTime - tableStartTime) / config.widthTime)
  const et = Math.floor((endTime - tableStartTime) / config.widthTime)

  return {
    x: config.widthTimeX * st,
    y: 0, // NOTE: this is set outside this function
    width: config.widthTimeX * (et - st),
    height: config.timeLineY,
  }
}

function randInt(x, y) {
  return x + Math.floor(Math.random() * y)
}

export function getTimeSlots(tableStartTime, tableEndTime, widthTime) {
  let time = tableStartTime
  // const times = [formatTime(time)]
  const times = [time]
  while (time < tableEndTime) {
    time = time + widthTime
    // times.push(formatTime(time))
    times.push(time)
  }

  return times
}

export function _generateEvent(times, rowCount) {
  const randStartIndex = Math.floor(Math.random() * times.length)
  const randEndIndex = randStartIndex + 2 + Math.floor(Math.random() * 8)

  const event = {
    row: randInt(0, rowCount),
    start: formatTime(times[randStartIndex]),
    end: formatTime(times[randEndIndex]),
    text: 'random',
    data: {
      entry: randInt(0, 1000),
      class: 'passenger',
      likelihood: randInt(50, 100),
    },
  }

  console.log('generated', event)

  return event
}

type SchedulerStore = ReturnType<typeof createSchedulerStore>

export const SchedulerContext = createContext<SchedulerStore | null>(null)

// export function generateEvent() {
//   const rows = zStore.getState().rows
//   const tableStartTime = zStore.getState().tableStartTime
//   const tableEndTime = zStore.getState().tableEndTime
//   const config = zStore.getState().config
//   // const rows = zStore((state) => state.rows)
//   // const tableStartTime = zStore((state) => state.tableStartTime)
//   // const tableEndTime = zStore((state) => state.tableEndTime)
//   // const config = zStore((state) => state.config)

//   const times = getTimeSlots(tableStartTime, tableEndTime, config.widthTime)

//   return _generateEvent(times, rows.length)
// }

// export function setup(events: Event[], rows: string[], userConf: Config) {
//   const config = { ...configDefault, ...userConf }
//   let tableStartTime = calcStringTime(config.startTime)
//   tableStartTime -= tableStartTime % config.widthTime
//   // tableStartTime = 0

//   let tableEndTime = calcStringTime(config.endTime)
//   tableEndTime -= tableEndTime % config.widthTime
//   // tableEndTime = 0

//   const cellsWide = Math.floor(
//     (tableEndTime - tableStartTime) / config.widthTime
//   )

//   console.log('init cellswide ', cellsWide)

//   // debugger

//   return {
//     events: events,
//     rows: rows,
//     rowMap: generateRowMap(rows, events), // TODO: update this better?
//     tableStartTime: tableStartTime,
//     tableEndTime: tableEndTime,
//     cellsWide: cellsWide,
//     scrollWidth: config.widthTimeX * cellsWide,
//     config: config,
//   }
// }

// update row heights, and manage overlapping events in a row
export function calculateGeometries(
  config,
  events,
  rows,
  rowMap,
  tableStartTime
) {
  let tableHeight = 0
  const geometries = []
  const rowHeights = []

  for (let rowNum = 0; rowNum < rows.length; rowNum++) {
    const items_map = rowMap[rowNum]

    const items = []
    for (let i = 0; i < items_map.length; i++) {
      items.push(events[items_map[i]])
    }

    const codes = [],
      check = []
    let h = 0
    let c1, c2, s1, s2, e1, e2
    let i

    for (i = 0; i < items.length; i++) {
      const eventIndex = rowMap[rowNum][i]

      const geometry = calculateGeometry(items[i], config, tableStartTime) // TODO: cache this for later use, or precompute

      // const geometry = getOrSetGeometry(eventIndex, config)

      // setGeometry(geometry, eventIndex)
      geometries[eventIndex] = items[i]

      codes[i] = {
        code: i,
        x: geometry.x,
      }
    }

    codes.sort(function (a, b) {
      if (a.x < b.x) {
        return -1
      }

      if (a.x > b.x) {
        return 1
      }

      return 0
    })

    for (i = 0; i < codes.length; i++) {
      c1 = codes[i].code

      const geometry1 = calculateGeometry(items[c1], config, tableStartTime) // items[c1].geometry

      for (h = 0; h < check.length; h++) {
        let next = false

        for (let j = 0; j < check[h].length; j++) {
          c2 = check[h][j]
          const geometry2 = calculateGeometry(items[c2], config, tableStartTime)
          s1 = geometry1.x
          e1 = geometry1.x + geometry1.width
          s2 = geometry2.x
          e2 = geometry2.x + geometry2.width

          if (s1 < e2 && e1 > s2) {
            next = true
            continue
          }
        }

        if (!next) {
          break
        }
      }

      if (!check[h]) {
        check[h] = []
      }

      const geometry = calculateGeometry(items[c1], config, tableStartTime)
      geometry.y = h * config.timeLineY + config.timeLinePaddingTop

      const eventIndex = rowMap[rowNum][c1]

      // console.log('setGeometryB', eventIndex, geometry)

      // setGeometry(geometry, eventIndex)
      geometries[eventIndex] = geometry

      // items[c1].geometry.y = h * config.timeLineY + config.timeLinePaddingTop

      check[h][check[h].length] = c1
    }

    const height =
      Math.max(check.length, 1) * config.timeLineY +
      config.timeLineBorder +
      config.timeLinePaddingTop +
      config.timeLinePaddingBottom

    // store.state.rowHeights[rowNum] = height
    // setRowHeight(height, rowNum)
    rowHeights[rowNum] = height

    // store.state.tableHeight += height
    tableHeight += height
  }
  // setTableHeight(tableHeight)

  return {
    tableHeight: tableHeight,
    geometries: geometries,
    rowHeights: rowHeights,
  }
}

// interface SchedulerProps {
//   // bears: number
//   config: Config
//   events: Event[]
//   rows: string[]
//   computed: Computed
// }

// interface SchedulerState extends SchedulerProps {
//   // addBear: () => void
//   addEvent: (event: Event) => void
// }

// type SchedulerStore = ReturnType<typeof createSchedulerStore>

// export function getStore(context): StoreApi<SchedulerState> {

//   const store = useContext(context)
//   if (!store) throw new Error('Missing SchedulerContext.Provider in the tree')
//   return store;
// }

function initComputed(userConf, rows, events): Computed {
  const config = { ...configDefault, ...userConf }
  let tableStartTime = calcStringTime(config.startTime)
  tableStartTime -= tableStartTime % config.widthTime
  // tableStartTime = 0

  let tableEndTime = calcStringTime(config.endTime)
  tableEndTime -= tableEndTime % config.widthTime
  // tableEndTime = 0

  const cellsWide = Math.floor(
    (tableEndTime - tableStartTime) / config.widthTime
  )

  const rowMap = generateRowMap(rows, events)

  const geos = calculateGeometries(config, events, rows, rowMap, tableStartTime)

  return {
    // config: config,
    tableEndTime: tableEndTime,
    tableStartTime: tableStartTime,
    cellsWide,
    rowMap: rowMap,
    geometries: geos.geometries,
    rowHeights: geos.rowHeights,
    tableHeight: geos.tableHeight,
    scrollWidth: config.widthTimeX * cellsWide,
  }
}

export const createSchedulerStore = (initProps?: Partial<SchedulerProps>) => {
  const config = { ...configDefault, ...initProps.config }
  // initComputed(config, initProps.rows, initProps.events)

  // const DEFAULT_PROPS = {
  //   // bears: 0,

  //   config: config,
  //   events: initProps.events,
  //   rows: initProps.rows,

  //   computed: initComputed(config, initProps.rows, initProps.events),

  //   onClickEvent: null,
  // }

  // console.log(DEFAULT_PROPS.computed)

  return createStore<SchedulerState>()((set) => ({
    // DEFAULT_PROPS,
    // ...DEFAULT_PROPS,
    // ...initProps,
    // addBear: () => set((state) => ({ bears: ++state.bears })),

    events: initProps.events,
    rows: initProps.rows,
    config: config,
    computed: initComputed(config, initProps.rows, initProps.events),
    onClickEvent: null,
    currentEvent: null,

    mergeConfig: (moreConfig: Config) =>
      // TODO: this is causing an infiniate loop!

      set((state) => {
        const newConfig = {
          ...moreConfig,
          ...config,
        }

        const computed = initComputed(newConfig, initProps.rows, state.events)

        return {
          config: newConfig,
          computed: computed,
        }
      }),

    addEvent: (event: Event) =>
      set((state) => {
        state.events.push(event)
        const computed = initComputed(config, initProps.rows, state.events)

        return {
          currentEvent: event,
          events: state.events,
          computed: computed,
        }
      }),

    updateEvent: (eventIndex: number, event: Event) =>
      set((state) => {
        state.events[eventIndex] = event
        const computed = initComputed(config, initProps.rows, state.events)

        console.log('updateEvent', eventIndex, event)

        return {
          currentEvent: event,
          events: state.events,
          computed: computed,
        }
      }),
  }))
}

// export const zStore = create<zState>((set) => ({
//   bears: 0,

//   config: {},
//   events: <Event[]>[],
//   rows: [],

//   computed: <Computed>{},

//   rowMap: [],
//   geometries: [],

//   rowHeights: [],
//   tableHeight: 0,
//   tableStartTime: 0,
//   tableEndTime: 0,
//   cellsWide: 0,
//   scrollWidth: 0,

//   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
//   removeAllBears: () => set({ bears: 0 }),

//   // setGeometry: (index: number) =>
//   // set((state) => {
//   //   state.geometries[index] = geometry
//   //   return { geometries: state.geometries }
//   // }),

//   // setEvents: (events: Event[])=>
//   //   set((state: )=>({state.events})
//   // ),

//   setGeometry: (geometry: Geometry, index: number) =>
//     set((state) => {
//       state.geometries[index] = geometry
//       return { geometries: state.geometries }
//     }),

//   setRowHeight: (height: number, index: number) =>
//     set((state) => {
//       state.rowHeights[index] = height
//       return { rowHeights: state.rowHeights }
//     }),

//   setTableHeight: (height: number) => set(() => ({ tableHeight: height })),

//   init: (events: Event[], rows: string[], userConf: Config) =>
//     set(() => {
//       const config = { ...configDefault, ...userConf }
//       let tableStartTime = calcStringTime(config.startTime)
//       tableStartTime -= tableStartTime % config.widthTime
//       tableStartTime = 0

//       let tableEndTime = calcStringTime(config.endTime)
//       tableEndTime -= tableEndTime % config.widthTime
//       tableEndTime = 0

//       const cellsWide = Math.floor(
//         (tableEndTime - tableStartTime) / config.widthTime
//       )

//       console.log('init cellswide ', cellsWide)

//       // debugger

//       return {
//         events: events,
//         rows: rows,
//         rowMap: generateRowMap(rows, events), // TODO: update this better?
//         tableStartTime: tableStartTime,
//         tableEndTime: tableEndTime,
//         cellsWide: cellsWide,
//         scrollWidth: config.widthTimeX * cellsWide,
//         config: config,
//       }
//     }),

//   init2: () =>
//     set((state) => {
//       return {
//         rowMap: generateRowMap(state.rows, state.events),
//       }
//     }),

//   init3: () =>
//     set((state) => {
//       updateGeometries()
//       return { geometries: state.geometries }
//     }),

//   addEvent: (event: Event) =>
//     // TODO: update geometries and row map
//     set((state) => {
//       console.log(state.events.length)
//       return {
//         events: state.events.concat([event]),
//       }
//     }),

//   // updateGeometry: (index: number, event: Event) => set((stats) => {}),
//   // updateGeometries: (config: Config) => set((stats) => {}),
// }))
