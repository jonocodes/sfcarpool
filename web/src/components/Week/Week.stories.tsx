import type { ComponentMeta } from '@storybook/react'

import { Config } from 'src/components/Scheduler/types'

import Week from './Week'

export const carpool = () => {
  const myConfig: Config = {
    startTime: '06:00',
    endTime: '9:00',
  }

  const rows = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  const data = [
    // {
    //   row: 0, // monday
    //   start: '8:00',
    //   end: '8:10',
    //   text: 'JK',
    //   data: {
    //     entry: 8,
    //     class: 'passenger',
    //     likelihood: 20,
    //   },
    // },
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
    // {
    //   row: 1, // tuesday
    //   start: '7:05',
    //   end: '7:30',
    //   text: 'Jodi',
    //   data: {
    //     entry: 5,
    //     class: 'driver',
    //     likelihood: 70,
    //   },
    // },
    // {
    //   row: 1, // tuesday
    //   start: '7:40',
    //   end: '8:50',
    //   text: 'Jono',
    //   data: {
    //     entry: 9,
    //     class: 'passenger',
    //     likelihood: 70,
    //   },
    // },
    // {
    //   row: 4, // friday
    //   start: '8:40',
    //   end: '8:50',
    //   text: 'Jono',
    //   data: {
    //     entry: 10,
    //     class: 'passenger',
    //     likelihood: 70,
    //   },
    // },
  ]

  return (
    <Week
      rows={rows}
      data={data}
      config={myConfig}
      provideCreateRandom={true}
    />
  )
}

export default {
  title: 'Components/Week',
  component: Week,
} as ComponentMeta<typeof Week>
