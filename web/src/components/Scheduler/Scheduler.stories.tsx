import type { ComponentMeta } from '@storybook/react'
// import { observer } from 'mobx'
import { observer } from 'mobx-react-lite'
import create from 'zustand'

import Scheduler from './Scheduler'
import SchedulerStore from './scheduleStore'
import { generateEvent } from './zstore'
import { zStore } from './zstore'

// export const basicWeek = () => {
//   const config = {
//     startTime: '06:00', // schedule start time(HH:ii)
//     endTime: '10:00', // schedule end time(HH:ii)
//     widthTimeX: 20,
//     widthTime: 60 * 5, // 5 minutes
//     timeLineY: 60, // height(px)
//     dataWidth: 120,
//     verticalScrollbar: 20, // scrollbar (px)
//     timeLineBorder: 2, // border(top and bottom)
//     bundleMoveWidth: 6, // width to move all schedules to the right of the clicked time line cell
//     // draggable: isDraggable,
//     // resizable: isResizable,
//     resizableLeft: true,
//   }

//   const rows = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

//   const data = [
//     {
//       row: 0, // monday
//       start: '8:00',
//       end: '8:10',
//       text: 'JK',
//       data: {
//         entry: 8,
//         class: 'passenger',
//         likelihood: 20,
//       },
//     },
//     {
//       row: 1, //tuesday
//       start: '6:30',
//       end: '7:10',
//       text: 'Jono',
//       data: {
//         entry: 4,
//         class: 'passenger',
//         likelihood: 95,
//       },
//     },
//     {
//       row: 1, // tuesday
//       start: '7:05',
//       end: '7:30',
//       text: 'Jodi',
//       data: {
//         entry: 5,
//         class: 'driver',
//         likelihood: 70,
//       },
//     },
//     {
//       row: 1, // tuesday
//       start: '7:40',
//       end: '8:50',
//       text: 'Jono',
//       data: {
//         entry: 9,
//         class: 'passenger',
//         likelihood: 70,
//       },
//     },
//     {
//       row: 4, // friday
//       start: '8:40',
//       end: '8:50',
//       text: 'Jono',
//       data: {
//         entry: 10,
//         class: 'passenger',
//         likelihood: 70,
//       },
//     },
//   ]

//   return <Scheduler config={config} rows={rows} data={data} />
// }

export const demo = () => {
  const data = [
    {
      row: 0,
      start: '09:00',
      end: '12:00',
      text: 'Text Area',
      data: {},
    },
    {
      row: 0,
      start: '11:00',
      end: '14:00',
      text: 'Text Area',
      data: {},
    },
    // {  // updateGeometries does not visit this?
    //   row: 1,
    //   start: '16:00',
    //   end: '17:00',
    //   text: 'Text Area',
    //   data: {},
    // },
  ]

  // const myStore = new SchedulerStore()
  // myStore.events = observer(data)

  const rows = ['Title Area1', 'Title Area2']

  // const useStore = create((set) => ({
  //   bears: 0,
  //   events: data,
  //   rows: rows,
  //   rowMap: [],

  //   addEvent: (event) =>
  //     set((state) => ({
  //       events: state.events.push(event),
  //     })),
  //   // bears: 0,
  //   // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  //   // removeAllBears: () => set({ bears: 0 }),
  // }))

  // const bears = zStore((state) => state.bears)
  // const increasePopulation = zStore((state) => state.increasePopulation)

  const addEvent = zStore((state) => state.addEvent)

  // const events = zStore((state) => state.events)

  // const something = zStore((state) => state.something)

  // const ScheduleContext = React.createContext('light')

  const config = {
    startTime: '07:00', // schedule start time(HH:ii)
    endTime: '21:00', // schedule end time(HH:ii)
    widthTime: 60 * 10, // cell timestamp example 10 minutes
    timeLineY: 60, // height(px)
    verticalScrollbar: 20, // scrollbar (px)
    timeLineBorder: 2, // border(top and bottom)
    bundleMoveWidth: 6, // width to move all schedules to the right of the clicked time line cell
    // draggable: isDraggable,
    // resizable: isResizable,s
    resizableLeft: true,

    onScheduleClick: function (time, colNum, rowNum) {
      console.log('onScheduleClick', time, colNum, rowNum)

      const randEvent = generateEvent()
      // myStore.addEvent(randEvent)
      addEvent(randEvent)

      // console.log(events.length)

      // store.state.data.push(randEvent)
    },
  }

  setupStore(data, rows, config)

  return <Scheduler />
}

function setupStore(data, rows, config) {
  const initStore = zStore((state) => state.init)
  initStore(data, rows, config)

  // const init2 = zStore((state) => state.init2)
  const init3 = zStore((state) => state.init3)

  // init2()
  init3()
}

export default {
  title: 'Components/Scheduler',
  component: Scheduler,
} as ComponentMeta<typeof Scheduler>
