import type { ComponentMeta } from '@storybook/react'

import Scheduler from './Scheduler'

export const basicWeek = () => {
  const config = {
    startTime: '06:00', // schedule start time(HH:ii)
    endTime: '10:00', // schedule end time(HH:ii)
    widthTimeX: 20,
    widthTime: 60 * 5, // 5 minutes
    timeLineY: 60, // height(px)
    dataWidth: 120,
    verticalScrollbar: 20, // scrollbar (px)
    timeLineBorder: 2, // border(top and bottom)
    bundleMoveWidth: 6, // width to move all schedules to the right of the clicked time line cell
    // draggable: isDraggable,
    // resizable: isResizable,
    resizableLeft: true,
  }

  const rows = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  const data = [
    {
      row: 0, // monday
      start: '8:00',
      end: '8:10',
      text: 'JK',
      data: {
        entry: 8,
        class: 'passenger',
        likelihood: 20,
      },
    },
    {
      row: 1, //tuesday
      start: '6:30',
      end: '7:10',
      text: 'Jono',
      data: {
        entry: 4,
        class: 'passenger',
        likelihood: 95,
      },
    },
    {
      row: 1, // tuesday
      start: '7:05',
      end: '7:30',
      text: 'Jodi',
      data: {
        entry: 5,
        class: 'driver',
        likelihood: 70,
      },
    },
    {
      row: 1, // tuesday
      start: '7:40',
      end: '8:50',
      text: 'Jono',
      data: {
        entry: 9,
        class: 'passenger',
        likelihood: 70,
      },
    },
    {
      row: 4, // friday
      start: '8:40',
      end: '8:50',
      text: 'Jono',
      data: {
        entry: 10,
        class: 'passenger',
        likelihood: 70,
      },
    },
  ]

  return <Scheduler config={config} rows={rows} data={data} />
}

export default {
  title: 'Components/Scheduler',
  component: Scheduler,
} as ComponentMeta<typeof Scheduler>
