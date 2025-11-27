import { ConnectionStatus, TriplitClient } from "@triplit/client";
import { schema } from "./schema";

export const triplit = new TriplitClient({
  schema,
  storage: {
    type: "indexeddb",
    name: "carpool",
  },

  serverUrl: import.meta.env.VITE_TRIPLIT_SERVER,
  token: import.meta.env.VITE_TRIPLIT_ANON_KEY,
});

console.log("import.meta.env", import.meta.env);

triplit.onConnectionStatusChange((status: ConnectionStatus) => {
  console.log("Triplit connection status:", status);
  // update some global store / React state here
});
