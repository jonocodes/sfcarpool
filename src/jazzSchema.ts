import { co, z } from "jazz-tools";

// Location entity
export const Location = co.map({
  name: z.string(),
});

// Event entity
export const Event = co.map({
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  date: z.iso.date(),
  passenger: z.boolean(),
  likelihood: z.number(),
  active: z.boolean(),
  location_id: z.string(), // Reference to location ID
  label: z.string().optional(),
  start: z.string(), // TODO: use z.iso.time()
  end: z.string(), // Time as string
});

// Collections
export const Locations = co.list(Location);
export const Events = co.list(Event);

// Account root containing all collections
export const CarpoolAccountRoot = co.map({
  locations: Locations,
  events: Events,
});

// Main account with profile
export const CarpoolAccount = co
  .account({
    root: CarpoolAccountRoot,
    profile: co.profile(),
  })
  .withMigration((account) => {
    if (!account.$jazz.has("root")) {
      account.$jazz.set("root", {
        locations: [
          {
            // id: "Q9t-UiFjtp-ec1ynXvMSS",
            name: "Encinal Ave & Park Ave -> SF Financial District",
          },
          // {
          //   // id: "ay_ff6mCwTKN48uABCoxw",
          //   name: "Webster St & Santa Clara Ave -> SF Financial District",
          // },
        ],
        events: [],
      });
    }
  });
