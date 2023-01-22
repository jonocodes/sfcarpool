// export const standard = (variables) => {
//   return {
//     userProfile: {
//       id: 42,
//       name: 'peterp',
//       profileImage: `https://example.com/profile.png?size=${variables.size}`,
//     },
//   }
// }

mockGraphQLMutation('CreateEventMutation', () => {
  return {
    // createEvent: {
    //   id: 1000 + Math.floor(Math.random() * 1000),
    // },
    insert_events: {
      returning: [{ id: 1000 + Math.floor(Math.random() * 1000) }],
    },
  }
})

mockGraphQLMutation('DeleteEventMutation', () => {
  return {
    delete_events_by_pk: {
      id: 1,
    },
  }
})

mockGraphQLMutation('UpdateEventMutation', () => {
  return {
    update_events: {
      returning: {
        id: 1,
      },
    },
  }
})
