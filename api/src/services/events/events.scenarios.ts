import type { Prisma, Event } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.EventCreateArgs>({
  event: {
    one: {
      data: {
        updatedAt: '2023-01-07T00:06:49.121Z',
        date: '2023-01-07T00:06:49.121Z',
        start: '2023-01-07T00:06:49.121Z',
        end: '2023-01-07T00:06:49.121Z',
        likelihood: 2562053,
        location: { create: { name: 'String' } },
      },
    },
    two: {
      data: {
        updatedAt: '2023-01-07T00:06:49.121Z',
        date: '2023-01-07T00:06:49.121Z',
        start: '2023-01-07T00:06:49.121Z',
        end: '2023-01-07T00:06:49.121Z',
        likelihood: 831498,
        location: { create: { name: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Event, 'event'>
