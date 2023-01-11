export const schema = gql`
  type Event {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    label: String
    date: DateTime!
    start: DateTime!
    end: DateTime!
    passenger: Boolean!
    likelihood: Int!
    active: Boolean!
    location: Location!
    locationId: Int!
  }

  type Query {
    events: [Event!]! @requireAuth
    weekEvents(before: Date, after: Date, locationId: Int): [Event!]!
      @requireAuth
    event(id: Int!): Event @requireAuth
  }

  input CreateEventInput {
    label: String
    date: DateTime!
    start: DateTime!
    end: DateTime!
    passenger: Boolean!
    likelihood: Int!
    active: Boolean!
    locationId: Int!
  }

  input UpdateEventInput {
    label: String
    date: DateTime
    start: DateTime
    end: DateTime
    passenger: Boolean
    likelihood: Int
    active: Boolean
    locationId: Int
  }

  type Mutation {
    createEvent(input: CreateEventInput!): Event! @requireAuth
    updateEvent(id: Int!, input: UpdateEventInput!): Event! @requireAuth
    deleteEvent(id: Int!): Event! @requireAuth
  }
`
