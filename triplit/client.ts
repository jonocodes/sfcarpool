import { TriplitClient } from "@triplit/client";
import { schema } from "./schema";

export const triplit = new TriplitClient({
  schema,
  storage: {
    type: "indexeddb",
    name: "carpool",
  },
  serverUrl: "http://localhost:6544",
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ4LXRyaXBsaXQtdG9rZW4tdHlwZSI6InNlY3JldCIsImlhdCI6MTc2MjU2MzA0NH0.g2mADRJY9-hH-kImzDFAbsLatX6cEuptdEg4KCFrVT0",
});
