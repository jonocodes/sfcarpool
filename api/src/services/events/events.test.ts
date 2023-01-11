import type { Event } from '@prisma/client'

import { events, event, createEvent, updateEvent, deleteEvent } from './events'
import type { StandardScenario } from './events.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('events', () => {
  scenario('returns all events', async (scenario: StandardScenario) => {
    const result = await events()

    expect(result.length).toEqual(Object.keys(scenario.event).length)
  })

  scenario('returns a single event', async (scenario: StandardScenario) => {
    const result = await event({ id: scenario.event.one.id })

    expect(result).toEqual(scenario.event.one)
  })

  scenario('creates a event', async (scenario: StandardScenario) => {
    const result = await createEvent({
      input: {
        updatedAt: '2023-01-07T00:06:49.089Z',
        date: '2023-01-07T00:06:49.089Z',
        start: '2023-01-07T00:06:49.089Z',
        end: '2023-01-07T00:06:49.089Z',
        likelihood: 2672848,
        locationId: scenario.event.two.locationId,
      },
    })

    expect(result.updatedAt).toEqual(new Date('2023-01-07T00:06:49.089Z'))
    expect(result.date).toEqual(new Date('2023-01-07T00:06:49.089Z'))
    expect(result.start).toEqual(new Date('2023-01-07T00:06:49.089Z'))
    expect(result.end).toEqual(new Date('2023-01-07T00:06:49.089Z'))
    expect(result.likelihood).toEqual(2672848)
    expect(result.locationId).toEqual(scenario.event.two.locationId)
  })

  scenario('updates a event', async (scenario: StandardScenario) => {
    const original = (await event({ id: scenario.event.one.id })) as Event
    const result = await updateEvent({
      id: original.id,
      input: { updatedAt: '2023-01-08T00:06:49.089Z' },
    })

    expect(result.updatedAt).toEqual(new Date('2023-01-08T00:06:49.089Z'))
  })

  scenario('deletes a event', async (scenario: StandardScenario) => {
    const original = (await deleteEvent({ id: scenario.event.one.id })) as Event
    const result = await event({ id: original.id })

    expect(result).toEqual(null)
  })
})
