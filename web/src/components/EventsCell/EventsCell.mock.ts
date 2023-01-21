// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  events: [{ id: 42 }, { id: 43 }, { id: 44 }],
})

// TODO: left off here

mockGraphQLMutation('FindEvents', () => {
  return {
    events: [
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
      {
        row: 1,
        start: '16:00',
        end: '17:00',
        text: 'Text Area',
        data: {},
      },
    ],
  }
})
