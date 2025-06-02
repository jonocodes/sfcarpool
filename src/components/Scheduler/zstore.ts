import { createContext } from "react";

import { createStore, create } from "zustand";
// import create from 'zustand/react'

import { calcStringTime, formatTime } from "./helpers";
import { Computed, Config, SchedulerProps, SchedulerState, Event } from "./types";

const modes = ["passenger", "driver"];

export const configDefault: Config = {
  className: "r-schedule",
  startTime: "07:00",
  endTime: "19:30",
  widthTimeX: 25,
  widthTime: 600, // cell timestamp example 10 minutes
  timeLineY: 50, // timeline height(px)
  timeLineBorder: 1, // timeline height border
  timeBorder: 1, // border width
  timeLinePaddingTop: 0,
  timeLinePaddingBottom: 0,
  headTimeBorder: 1, // time border width
  // dataWidth: 160, // data width
  verticalScrollbar: 0, // vertical scrollbar width
  bundleMoveWidth: 1,
  // width to move all schedules to the right of the clicked time cell
  draggable: true,
  resizable: true,
  resizableLeft: false,
  // event
  // onInitRow: null,
  // onChange: null,
  onClick: undefined,
  // onAppendRow: null,
  // onAppendSchedule: null,
  onScheduleClick: undefined,
};

function generateRowMap(rows: string[], events: Event[]) {
  const dataRowMap = [];
  for (let j = 0; j < rows.length; j++) {
    // doing this since Array.fill([]) causes issues
    dataRowMap.push([]);
  }
  for (let i = 0; i < events.length; i++) {
    dataRowMap[events[i].row].push(i);
  }

  return dataRowMap;
}

function calculateGeometry(event, config, tableStartTime) {
  const startTime = calcStringTime(event.start);
  const endTime = calcStringTime(event.end);

  // const tableStartTime = computed.tableStartTime

  const st = Math.ceil((startTime - tableStartTime) / config.widthTime);
  const et = Math.floor((endTime - tableStartTime) / config.widthTime);

  return {
    x: config.widthTimeX * st,
    y: 0, // NOTE: this is set outside this function
    width: config.widthTimeX * (et - st),
    height: config.timeLineY,
  };
}

function randInt(x: number, y: number) {
  return x + Math.floor(Math.random() * y);
}

export function _generateEvent(times: number[], rowCount: number) {
  const randStartIndex = Math.floor(Math.random() * (times.length - 8));
  const randEndIndex = randStartIndex + 2 + Math.floor(Math.random() * 8);

  // const modes = ['passenger', 'driver']

  const randModeIndex = Math.floor(Math.random() * modes.length);

  const event = {
    row: randInt(0, rowCount),
    start: formatTime(times[randStartIndex]),
    end: formatTime(times[randEndIndex]),
    text: "random " + modes[randModeIndex],
    data: {
      entry: randInt(0, 1000),
      mode: modes[randModeIndex],
      likelihood: randInt(50, 100),
    },
  };

  console.log("generated", event);

  return event;
}

type SchedulerStore = ReturnType<typeof createSchedulerStore>;

export const SchedulerContext = createContext<SchedulerStore | null>(null);

// update row heights, and manage overlapping events in a row
export function calculateGeometries(config, events, rows, rowMap, tableStartTime) {
  let tableHeight = 0;
  const geometries = [];
  const rowHeights = [];

  for (let rowNum = 0; rowNum < rows.length; rowNum++) {
    const items_map = rowMap[rowNum];

    const items = [];
    for (let i = 0; i < items_map.length; i++) {
      items.push(events[items_map[i]]);
    }

    const codes = [],
      check = [];
    let h = 0;
    let c1, c2, s1, s2, e1, e2;
    let i;

    for (i = 0; i < items.length; i++) {
      const eventIndex = rowMap[rowNum][i];

      const geometry = calculateGeometry(items[i], config, tableStartTime); // TODO: cache this for later use, or precompute

      // const geometry = getOrSetGeometry(eventIndex, config)

      // setGeometry(geometry, eventIndex)
      geometries[eventIndex] = items[i];

      codes[i] = {
        code: i,
        x: geometry.x,
      };
    }

    codes.sort(function (a, b) {
      if (a.x < b.x) {
        return -1;
      }

      if (a.x > b.x) {
        return 1;
      }

      return 0;
    });

    for (i = 0; i < codes.length; i++) {
      c1 = codes[i].code;

      const geometry1 = calculateGeometry(items[c1], config, tableStartTime); // items[c1].geometry

      for (h = 0; h < check.length; h++) {
        let next = false;

        for (let j = 0; j < check[h].length; j++) {
          c2 = check[h][j];
          const geometry2 = calculateGeometry(items[c2], config, tableStartTime);
          s1 = geometry1.x;
          e1 = geometry1.x + geometry1.width;
          s2 = geometry2.x;
          e2 = geometry2.x + geometry2.width;

          if (s1 < e2 && e1 > s2) {
            next = true;
            continue;
          }
        }

        if (!next) {
          break;
        }
      }

      if (!check[h]) {
        check[h] = [];
      }

      const geometry = calculateGeometry(items[c1], config, tableStartTime);
      geometry.y = h * config.timeLineY + config.timeLinePaddingTop;

      const eventIndex = rowMap[rowNum][c1];

      // console.log('setGeometryB', eventIndex, geometry)

      // setGeometry(geometry, eventIndex)
      geometries[eventIndex] = geometry;

      // items[c1].geometry.y = h * config.timeLineY + config.timeLinePaddingTop

      check[h][check[h].length] = c1;
    }

    const height =
      Math.max(check.length, 1) * config.timeLineY +
      config.timeLineBorder +
      config.timeLinePaddingTop +
      config.timeLinePaddingBottom;

    // store.state.rowHeights[rowNum] = height
    // setRowHeight(height, rowNum)
    rowHeights[rowNum] = height;

    // store.state.tableHeight += height
    tableHeight += height;
  }
  // setTableHeight(tableHeight)

  // console.log('updateGeometries finished', tableHeight, geometries, rowHeights)

  return {
    tableHeight: tableHeight,
    geometries: geometries,
    rowHeights: rowHeights,
  };
}

export function refreshComputed(userConf, rows, events): Computed {
  const config = { ...configDefault, ...userConf };
  let tableStartTime = calcStringTime(config.startTime);
  tableStartTime -= tableStartTime % config.widthTime;
  // tableStartTime = 0

  let tableEndTime = calcStringTime(config.endTime);
  tableEndTime -= tableEndTime % config.widthTime;
  // tableEndTime = 0

  const cellsWide = Math.floor((tableEndTime - tableStartTime) / config.widthTime);

  const rowMap = generateRowMap(rows, events);

  const geos = calculateGeometries(config, events, rows, rowMap, tableStartTime);

  return {
    tableEndTime: tableEndTime,
    tableStartTime: tableStartTime,
    cellsWide,
    rowMap: rowMap,
    geometries: geos.geometries,
    rowHeights: geos.rowHeights,
    tableHeight: geos.tableHeight,
    scrollWidth: config.widthTimeX * cellsWide,
  };
}

// const DELETE_EVENT = gql`
//   mutation DeleteEventMutation($id: Int!) {
//     deleteEvent(id: $id) {
//       id
//     }
//   }
// `

// const [_delete2] = useMutation<
//   DeleteEventMutation,
//   DeleteEventMutationVariables
// >(DELETE_EVENT, {
//   // onCompleted: (a) => {
//   //   console.log(a)
//   //   toast.success('Thank you for your submission!')
//   // },
// })

// async function _removeEvent(state, eventIndex, config, initProps) {
//   const resp = _delete2({
//     variables: { id: Number(state.events[eventIndex].data.entry) },
//   }).then(function () {
//     // debugger
//     return 8
//   })

//   ;(async function () {
//     const result = await resp
//     console.log('Woo done!', result)

//     // But the best part is, we can just keep awaiting different stuff, without ugly .then()s
//     // const somethingElse = await getSomethingElse()
//     // const moreThings = await getMoreThings()
//   })()

//   debugger

//   // toast.success('removing event')

//   // _delete({
//   //   variables: { id: Number(state.events[eventIndex].data.entry) },
//   // })

//   state.events.splice(eventIndex, 1)
//   // state.events.push(event)
//   const computed = refreshComputed(config, initProps.rows, state.events)

//   console.log('removeEvent', eventIndex, state.events, computed)

//   return {
//     // currentEvent: event,
//     events: state.events,
//     computed: computed,
//   }
// }

// export const useStore3 = create((set) => ({
//   rows: [],
//   events: [],
//   config: {},
//   computed: [],
//   onClickEvent: null,
//   currentEvent: null,
//   currentEventIndex: null,
// }))

export const createSchedulerStore = (initProps?: Partial<SchedulerProps>) => {
  const config = { ...configDefault, ...initProps.config };

  // const [_delete] = useMutation<
  //   DeleteEventMutation,
  //   DeleteEventMutationVariables
  // >(DELETE_EVENT, {
  //   // onCompleted: (a) => {
  //   //   console.log(a)
  //   //   toast.success('Thank you for your submission!')
  //   // },
  // })

  console.log("createStore initProps.events", initProps.events);

  // return createStore<SchedulerState>()((set) => ({
  return create<SchedulerState>()((set) => ({
    events: initProps.events,
    rows: initProps.rows,
    config: config,
    computed: refreshComputed(config, initProps.rows, initProps.events),
    onClickEvent: null,
    currentEvent: null,
    currentEventIndex: null,

    setup: (config, rows, events) =>
      set((state) => {
        state.config = config;
        state.rows = rows;
        state.events = events;

        console.log("setup events", state.events.length);

        const computed = refreshComputed(config, rows, events);

        return {
          rows: state.rows,
          config: state.config,
          events: state.events,
          computed: computed,
        };
      }),

    clearEvents: () =>
      // this is a helper function for dev and testing only
      set((state) => {
        state.events = [];

        console.log("clearing events");

        const computed = refreshComputed(config, initProps.rows, []);

        return {
          events: [],
          computed: computed,
        };
      }),

    addEvent: (event: Event) =>
      set((state) => {
        state.events.push(event);
        const computed = refreshComputed(config, initProps.rows, state.events);

        return {
          currentEvent: event,
          events: state.events,
          computed: computed,
        };
      }),

    removeEvent: (eventIndex: number) =>
      set((state) => {
        // return _removeEvent(state, eventIndex, config, initProps)

        // const resp = _delete({
        //   variables: { id: Number(state.events[eventIndex].data.entry) },
        // }).then(function () {
        //   // debugger
        //   return 8
        // })

        // ;(async function () {
        //   const result = await resp
        //   console.log('Woo done!', result)

        //   // But the best part is, we can just keep awaiting different stuff, without ugly .then()s
        //   // const somethingElse = await getSomethingElse()
        //   // const moreThings = await getMoreThings()
        // })()

        // debugger

        // toast.success('removing event')

        // _delete({
        //   variables: { id: Number(state.events[eventIndex].data.entry) },
        // })

        state.events.splice(eventIndex, 1);

        const computed = refreshComputed(config, initProps.rows, state.events);

        console.log("removeEvent", eventIndex, state.events, computed);

        return {
          // currentEvent: event,
          events: state.events,
          computed: computed,
        };
      }),

    updateEvent: (eventIndex: number, event: Event) =>
      set((state) => {
        console.log("updateEvent", eventIndex, event);

        state.events[eventIndex] = event;
        const computed = refreshComputed(config, initProps.rows, state.events);

        console.log(
          "updateEvent finished",
          eventIndex,
          event,
          state.events[eventIndex],
          computed.geometries[eventIndex]
        );

        return {
          currentEvent: event,
          events: state.events,
          computed: computed,
        };
      }),
  }));
};
