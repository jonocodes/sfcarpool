import { ConnectionStatus, TriplitClient } from "@triplit/client";
import { schema } from "./schema";
import { useConnectionStatusStore } from "../src/stores/connectionStatusStore";

export const triplit = new TriplitClient({
  schema,
  storage: {
    type: "indexeddb",
    name: "carpool",
  },
  serverUrl: import.meta.env.VITE_TRIPLIT_SERVER,
  token: import.meta.env.VITE_TRIPLIT_ANON_KEY,
  autoConnect: true,
  syncSchema: true,
});

console.log("import.meta.env", import.meta.env);

// Load persisted timestamp on initialization
useConnectionStatusStore.getState().loadFromStorage();

triplit.onConnectionStatusChange((status: ConnectionStatus) => {
  console.log("Triplit connection status:", status);

  const store = useConnectionStatusStore.getState();
  store.setConnectionStatus(status);

  // Record timestamp when connection is established
  if (status === "OPEN") {
    store.setLastConnectionTime(Date.now());
  }
});
