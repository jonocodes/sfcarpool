import { Schema as S } from "@triplit/client";

export const schema = S.Collections({
  locations: {
    schema: S.Schema({
      id: S.Id(), // nanoid
      name: S.String({}),
    }),
    permissions: {
      anonymous: {
        read: {
          filter: [true],
        },
      },
    },
  },
  events: {
    schema: S.Schema({
      id: S.Id(),
      created_at: S.Date({}),
      updated_at: S.Date({}),
      date: S.Date({}),
      passenger: S.Boolean({}),
      location_id: S.Id(),
      label: S.Optional(S.String()),
      start: S.String(),
      end: S.String(),

      // S.RelationById("locations", "location_id"),
    }),

    permissions: {
      anonymous: {
        read: {
          filter: [true],
        },
        insert: {
          filter: [true],
        },
        update: {
          filter: [true],
        },
        delete: {
          filter: [true],
        },
      },
    },
  },
});
