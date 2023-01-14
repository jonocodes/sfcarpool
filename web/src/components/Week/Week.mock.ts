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
    createEvent: {
      id: 1000 + Math.floor(Math.random() * 1000),
    },
  }
})

mockGraphQLMutation('DeleteEventMutation', () => {
  return {
    deleteEvent: {
      id: 1,
    },
  }
})

mockGraphQLMutation('UpdateEventMutation', () => {
  return {
    updateEvent: {
      id: 1,
    },
  }
})
