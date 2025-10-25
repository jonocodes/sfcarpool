import { Schema as S } from "@triplit/client";

// Using different ID formats
export const schema = S.Collections({
  // todos: {
  //   schema: S.Schema({
  //     id: S.Id({ format: "nanoid" }), // default
  //     text: S.String({}),
  //     // ... other fields
  //   }),
  // },
  // users: {
  //   schema: S.Schema({
  //     id: S.Id({ format: "uuidv4" }),
  //     // ... other fields
  //   }),
  // },
  // posts: {
  //   schema: S.Schema({
  //     id: S.Id({ format: "uuidv7" }),
  //     // ... other fields
  //   }),
  // },
  locations: {
    schema: S.Schema({
      id: S.Id(),
      //   id: S.Id({ format: "uuidv4" }),
      name: S.String({}),
      // ... other fields

      //   CREATE TABLE locations (
      //     id serial4 NOT NULL,
      //     "uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
      //     "name" text NOT NULL,
      //     constraint locations_pkey primary key (id)
      // );
    }),
  },
  events: {
    schema: S.Schema({
      id: S.Id(),
      created_at: S.Date({}),
      updated_at: S.Date({}),
      date: S.Date({}),
      passenger: S.Boolean({}),
      likelihood: S.Number({}),
      active: S.Boolean({}),
      location_id: S.Id(),
      label: S.Optional(S.String()),
      start: S.String(),
      end: S.String(),

      // S.RelationById("locations", "location_id"),

      // CREATE TABLE events (
      //     id serial4 NOT NULL,
      //     "uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
      //     created_at timestamptz DEFAULT now() NOT NULL,
      //     updated_at timestamptz DEFAULT now() NOT NULL,
      //     "date" DATE NOT NULL,
      //     passenger bool NOT NULL,
      //     likelihood int4 NOT NULL,
      //     active bool DEFAULT TRUE NOT NULL,
      //     location_id int4 NOT NULL,
      //     "label" text NULL,
      //     "start" TIME NOT NULL,
      //     "end" TIME NOT NULL,
      //     constraint events_pkey primary key (id)
      // );
    }),
  },
});
