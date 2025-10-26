import { Schema as S } from "@triplit/client";

export const schema = S.Collections({
  locations: {
    schema: S.Schema({
      id: S.Id(), // nanoid
      name: S.String({}),

      //   CREATE TABLE locations (
      //     id serial4 NOT NULL,
      //     "uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
      //     "name" text NOT NULL,
      //     constraint locations_pkey primary key (id)
      // );
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
      likelihood: S.Number({}), // TODO: remove this
      active: S.Boolean({}),
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
