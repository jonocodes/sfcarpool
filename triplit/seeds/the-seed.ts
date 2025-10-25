import { BulkInsert } from "@triplit/client";
import { schema } from "../schema.js";
export default function seed(): BulkInsert<typeof schema> {
  const locations = [
    {
      id: "l5PQRRCiuSah4NFM_r6Ln",
      name: "North Berkeley BART -> SF Financial District",
    },
    {
      id: "_g-RF4nZs-agfoe9O-DEZ",
      name: "North Berkeley BART -> SF Civic Center",
    },
    {
      id: "Q9t-UiFjtp-ec1ynXvMSS",
      name: "Encinal Ave & Park Ave -> SF Financial District",
    },
    {
      id: "ay_ff6mCwTKN48uABCoxw",
      name: "Webster St & Santa Clara Ave -> SF Financial District",
    },
    {
      id: "KcXgyWEgR0KbdQjDo697D",
      name: "Buchanan & I-80 -> SF Financial District",
    },
    {
      id: "O8vMaKB-CzUoM7MqEVdPf",
      name: "Del Norte BART -> SF Financial District",
    },
    {
      id: "vnUaW_Mr7ST0-eGBx_Fei",
      name: "Marina -> SF Financial District",
    },
    {
      id: "9Lhi00SnIZAPXSTmEpYu3",
      name: "Fairfield Transportation Center -> SF Financial District",
    },
    {
      id: "-ZBWadXqhQUjM9f2m1dnC",
      name: "Hercules Transit Center -> SF Financial District",
    },
    {
      id: "mwXTxSxHrPP4K_cfBEtnh",
      name: "Lafayette BART -> SF Financial District",
    },
    // {
    //   id: "loc_11",
    //   name: "Moraga -> SF Financial District",
    // },
    // {
    //   id: "loc_12",
    //   name: "Grand Ave & Perkins St -> SF Financial District",
    // },
    // {
    //   id: "loc_13",
    //   name: "Park Blvd & Hollywood Ave -> SF Financial District",
    // },
    // {
    //   id: "loc_14",
    //   name: "Park Blvd at Hampel St -> SF Financial District",
    // },
    // {
    //   id: "loc_15",
    //   name: "Grand Ave & Lakeshore Ave -> SF Financial District",
    // },
    // {
    //   id: "loc_16",
    //   name: "MacArthur Blvd & High St -> SF Financial District",
    // },
    // {
    //   id: "loc_17",
    //   name: "Fruitvale Ave & Montana St -> SF Financial District",
    // },
    // {
    //   id: "loc_18",
    //   name: "Oakland Ave & Monte Vista Ave -> SF Financial District",
    // },
  ];

  return {
    locations: locations,

    events: [
      // {
      //   date: new Date("2025-10-08"), // Wednesday
      //   passenger: true,
      //   likelihood: 90,
      //   created_at: new Date("2025-01-01"),
      //   updated_at: new Date("2025-01-01"),
      //   active: true,
      //   start: "08:30",
      //   end: "09:45",
      //   location_id: "l5PQRRCiuSah4NFM_r6Ln", // North Berkeley BART
      //   label: "Wednesday Carpool",
      // },
    ],
  };
}
